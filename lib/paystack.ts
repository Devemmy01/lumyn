import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_URL = "https://api.paystack.co";

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Payments are temporarily unavailable.");
  return key;
}

export function marketplaceCurrency() {
  return process.env.MARKETPLACE_PAYMENT_CURRENCY ?? "USD";
}

/** The platform's cut of every course sale, as a whole percentage. */
export function platformSharePercent() {
  const configured = Number(process.env.MARKETPLACE_PLATFORM_SHARE_PERCENT ?? 20);
  return Number.isFinite(configured) && configured >= 0 && configured <= 100 ? configured : 20;
}

export function listingFeeCents() {
  const configured = Number(process.env.MARKETPLACE_LISTING_FEE_CENTS ?? 0);
  return Number.isInteger(configured) && configured >= 0 ? configured : 0;
}

function splitBearerType() {
  return process.env.MARKETPLACE_SPLIT_BEARER_TYPE ?? "account";
}

async function paystackRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as { status: boolean; message: string; data: T };
  if (!response.ok || !payload.status) {
    throw new Error(payload.message || "Paystack request failed.");
  }
  return payload.data;
}

export async function listNigerianBanks() {
  return paystackRequest<Array<{ name: string; code: string }>>("/bank?country=nigeria&currency=NGN&perPage=100");
}

export async function resolveBankAccount({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) {
  return paystackRequest<{ account_number: string; account_name: string }>(
    `/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
  );
}

/** percentage_charge here is the PLATFORM's cut — Paystack settles the remainder to this subaccount. */
export async function createPaystackSubaccount({
  businessName,
  bankCode,
  accountNumber,
}: {
  businessName: string;
  bankCode: string;
  accountNumber: string;
}) {
  const data = await paystackRequest<{ subaccount_code: string }>("/subaccount", {
    method: "POST",
    body: JSON.stringify({
      business_name: businessName,
      settlement_bank: bankCode,
      account_number: accountNumber,
      percentage_charge: platformSharePercent(),
    }),
  });
  return data.subaccount_code;
}

/** Reusable split reused across every future purchase of this creator's courses. */
export async function createPaystackSplit({
  name,
  creatorSubaccountCode,
}: {
  name: string;
  creatorSubaccountCode: string;
}) {
  const creatorSharePercent = 100 - platformSharePercent();
  const data = await paystackRequest<{ split_code: string }>("/split", {
    method: "POST",
    body: JSON.stringify({
      name,
      type: "percentage",
      currency: marketplaceCurrency(),
      subaccounts: [{ subaccount: creatorSubaccountCode, share: creatorSharePercent }],
      bearer_type: splitBearerType(),
    }),
  });
  return data.split_code;
}

export type PaystackChargeData = {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string;
  customer?: { email?: string };
};

export async function initializeCoursePurchase({
  email,
  amountCents,
  currency,
  reference,
  callbackUrl,
  splitCode,
  metadata,
}: {
  email: string;
  amountCents: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  splitCode: string;
  metadata?: Record<string, unknown>;
}) {
  return paystackRequest<{ authorization_url: string; access_code: string; reference: string }>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        amount: amountCents,
        currency,
        reference,
        callback_url: callbackUrl,
        split_code: splitCode,
        metadata,
      }),
    },
  );
}

export async function initializeListingFeeCharge({
  email,
  amountCents,
  currency,
  reference,
  callbackUrl,
  metadata,
}: {
  email: string;
  amountCents: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  return paystackRequest<{ authorization_url: string; access_code: string; reference: string }>(
    "/transaction/initialize",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        amount: amountCents,
        currency,
        reference,
        callback_url: callbackUrl,
        metadata,
      }),
    },
  );
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<PaystackChargeData>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Paystack signs the raw request body with HMAC-SHA512 using the secret key — no separate webhook secret needed. */
export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}
