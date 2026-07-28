import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { calculatePointPurchase, flutterwaveRequest, isFlutterwaveConfigured } from "@/lib/flutterwave";
import AcademyPayment from "@/models/AcademyPayment";

function getValidOrigin(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.origin;
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
    const { points } = await request.json() as { points?: number };
    if (!isFlutterwaveConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
        { status: 503 }
      );
    }

    const purchase = calculatePointPurchase(Number(points));
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const reference = `academy-points-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const siteUrl = getCheckoutBaseUrl(request);
    const redirectUrl = new URL("/academy/payment/callback", siteUrl).toString();

    const data = await flutterwaveRequest<{ link: string }>("/payments", {
      method: "POST",
      body: JSON.stringify({
        tx_ref: reference,
        amount: purchase.amount,
        currency: purchase.currency,
        redirect_url: redirectUrl,
        customer: {
          email: student.email,
          name: student.name ?? student.email,
        },
        meta: {
          studentUid: decoded.uid,
          points: purchase.points,
        },
        customizations: {
          title: "Lumyn Academy Points",
          description: `${purchase.points} Academy points`,
        },
      }),
    });

    await AcademyPayment.create({
      reference,
      studentUid: decoded.uid,
      studentEmail: student.email,
      kind: "point_purchase",
      points: purchase.points,
      amount: purchase.amountCents,
      currency: purchase.currency,
      status: "pending",
      provider: "flutterwave",
    });

    return NextResponse.json({
      success: true,
      authorizationUrl: data.link,
      reference,
      points: purchase.points,
      amount: purchase.amount,
    });
  } catch (error) {
    console.error("[academy payment initialize]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not start checkout." }, { status: 500 });
  }
}
