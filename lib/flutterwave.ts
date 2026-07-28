import { ACADEMY_POINT_PRICE_CENTS, MAX_POINT_PURCHASE, MIN_POINT_PURCHASE } from "@/lib/academy";

const FLUTTERWAVE_URL = "https://api.flutterwave.com/v3";

export function isFlutterwaveConfigured() {
  return Boolean(process.env.FLUTTERWAVE_SECRET_KEY);
}

function secretKey() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new Error("Payments are temporarily unavailable.");
  return key;
}

export function pointPriceCents() {
  const configured = Number(process.env.ACADEMY_POINT_PRICE_CENTS ?? ACADEMY_POINT_PRICE_CENTS);
  return Number.isInteger(configured) && configured > 0 ? configured : ACADEMY_POINT_PRICE_CENTS;
}

export function calculatePointPurchase(points: number) {
  if (!Number.isInteger(points) || points < MIN_POINT_PURCHASE || points > MAX_POINT_PURCHASE) {
    throw new Error(`Choose between ${MIN_POINT_PURCHASE} and ${MAX_POINT_PURCHASE} points.`);
  }
  const amountCents = points * pointPriceCents();
  return {
    points,
    amountCents,
    amount: amountCents / 100,
    currency: process.env.ACADEMY_PAYMENT_CURRENCY ?? "USD",
  };
}

export async function flutterwaveRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${FLUTTERWAVE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = await response.json() as { status: string; message: string; data: T };
  if (!response.ok || payload.status === "error") {
    throw new Error(payload.message || "Flutterwave request failed.");
  }
  return payload.data;
}

export function verifyFlutterwaveWebhook(signature: string | null) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  if (!secretHash) return true;
  return signature === secretHash;
}
