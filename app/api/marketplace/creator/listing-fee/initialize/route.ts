import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import {
  isPaystackConfigured,
  initializeListingFeeCharge,
  listingFeeCents,
  marketplaceCurrency,
} from "@/lib/paystack";
import { encryptField, isFieldEncryptionConfigured } from "@/lib/crypto";
import connectDB from "@/lib/mongodb";
import MarketplacePayment from "@/models/MarketplacePayment";
import AcademyStudent from "@/models/AcademyStudent";

function getValidOrigin(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}

function getCheckoutBaseUrl(request: NextRequest) {
  const requestOrigin =
    getValidOrigin(request.headers.get("origin")) ??
    getValidOrigin(request.headers.get("referer")) ??
    getValidOrigin(request.nextUrl.origin);
  const configuredOrigin = getValidOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (process.env.NODE_ENV !== "production") {
    return requestOrigin ?? configuredOrigin ?? request.nextUrl.origin;
  }
  return configuredOrigin ?? requestOrigin ?? request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
        { status: 503 },
      );
    }
    if (!isFieldEncryptionConfigured()) {
      return NextResponse.json(
        { error: "Identity verification is temporarily unavailable. Please contact Lumyn support." },
        { status: 503 },
      );
    }

    const { decoded, student } = await getVerifiedAcademyStudent(request);
    if (student.creatorProfile?.listingFee?.status === "paid") {
      return NextResponse.json({ error: "The creator listing fee is already paid." }, { status: 400 });
    }

    const body = (await request.json().catch(() => null)) as {
      businessName?: string;
      bankCode?: string;
      accountNumber?: string;
      legalName?: string;
      idType?: string;
      idNumber?: string;
      acceptedGuidelines?: boolean;
    } | null;
    const businessName = body?.businessName?.trim();
    const bankCode = body?.bankCode?.trim();
    const accountNumber = body?.accountNumber?.trim();
    const legalName = body?.legalName?.trim();
    const idType = body?.idType?.trim();
    const idNumber = body?.idNumber?.trim();
    const ID_TYPES = ["nin", "bvn", "passport", "drivers_license", "voters_card"];

    if (!businessName || !bankCode || !accountNumber) {
      return NextResponse.json({ error: "Business name, bank, and account number are required." }, { status: 400 });
    }
    if (!legalName || !idType || !idNumber) {
      return NextResponse.json({ error: "Your legal name and a government ID are required for verification." }, { status: 400 });
    }
    if (!ID_TYPES.includes(idType)) {
      return NextResponse.json({ error: "Choose a valid ID type." }, { status: 400 });
    }
    if (!body?.acceptedGuidelines) {
      return NextResponse.json({ error: "You must accept the content guidelines to continue." }, { status: 400 });
    }

    await connectDB();
    await AcademyStudent.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          "creatorProfile.bankDetails": {
            businessName,
            bankCode,
            accountNumber: encryptField(accountNumber),
          },
          "creatorProfile.identity": {
            legalName: encryptField(legalName),
            idType,
            idNumber: encryptField(idNumber),
          },
          "creatorProfile.guidelinesAcceptedAt": new Date(),
        },
      },
    );

    const amountCents = listingFeeCents();
    if (amountCents <= 0) {
      return NextResponse.json({ error: "The creator listing fee hasn't been configured yet." }, { status: 503 });
    }
    const currency = marketplaceCurrency();
    const reference = `marketplace-listing-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const redirectUrl = new URL("/academy/marketplace/payment/callback", getCheckoutBaseUrl(request)).toString();

    const data = await initializeListingFeeCharge({
      email: student.email,
      amountCents,
      currency,
      reference,
      callbackUrl: redirectUrl,
      metadata: { studentUid: decoded.uid, kind: "listing_fee" },
    });

    await MarketplacePayment.create({
      reference,
      studentUid: decoded.uid,
      studentEmail: student.email,
      kind: "listing_fee",
      amount: amountCents,
      currency,
      status: "pending",
      provider: "paystack",
    });

    return NextResponse.json({ success: true, authorizationUrl: data.authorization_url, reference });
  } catch (error) {
    console.error("[marketplace listing-fee initialize]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 },
    );
  }
}
