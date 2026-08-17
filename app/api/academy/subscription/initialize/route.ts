import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { calculateSubscriptionCharge, flutterwaveRequest, isFlutterwaveConfigured } from "@/lib/flutterwave";
import connectDB from "@/lib/mongodb";
import AcademyPayment from "@/models/AcademyPayment";

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
    if (!isFlutterwaveConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
        { status: 503 },
      );
    }

    const charge = calculateSubscriptionCharge();
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const reference = `academy-sub-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const redirectUrl = new URL("/academy/payment/callback", getCheckoutBaseUrl(request)).toString();

    const data = await flutterwaveRequest<{ link: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        tx_ref: reference,
        amount: charge.amount,
        currency: charge.currency,
        redirect_url: redirectUrl,
        customer: { email: student.email, name: student.name ?? student.email },
        meta: { studentUid: decoded.uid },
        customizations: {
          title: "Lumyn Academy AI Tutor",
          description: "Monthly subscription for Astra, your AI tutor",
        },
      }),
    });

    await connectDB();
    await AcademyPayment.create({
      reference,
      studentUid: decoded.uid,
      studentEmail: student.email,
      kind: "subscription",
      amount: charge.amountCents,
      currency: charge.currency,
      status: "pending",
      provider: "flutterwave",
    });

    return NextResponse.json({ success: true, authorizationUrl: data.link, reference });
  } catch (error) {
    console.error("[academy subscription initialize]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 },
    );
  }
}
