import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { unlockCertificateWithDiamonds } from "@/lib/academy-certificates";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { calculateCertificateCharge, flutterwaveRequest, isFlutterwaveConfigured } from "@/lib/flutterwave";
import connectDB from "@/lib/mongodb";
import AcademyPayment from "@/models/AcademyPayment";

type RouteContext = { params: Promise<{ id: string }> };

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

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as { method?: "diamonds" | "payment" } | null;

    if (body?.method === "diamonds") {
      const enrollment = await unlockCertificateWithDiamonds(id, student);
      sendAcademyEmail({
        event: "certificate_issued",
        to: student.email,
        details: "Your certificate has been unlocked using diamonds from your referrals.",
      }).catch((error) => console.error("[academy certificate email]", error));

      return NextResponse.json({ success: true, method: "diamonds", certificate: enrollment.certificate });
    }

    if (body?.method === "payment") {
      if (!isFlutterwaveConfigured()) {
        return NextResponse.json(
          { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
          { status: 503 },
        );
      }

      const charge = calculateCertificateCharge();
      const reference = `academy-cert-${Date.now()}-${randomUUID().slice(0, 8)}`;
      const redirectUrl = new URL("/academy/payment/callback", getCheckoutBaseUrl(request)).toString();

      const data = await flutterwaveRequest<{ link: string }>("/payments", {
        method: "POST",
        body: JSON.stringify({
          tx_ref: reference,
          amount: charge.amount,
          currency: charge.currency,
          redirect_url: redirectUrl,
          customer: { email: student.email, name: student.name ?? student.email },
          meta: { studentUid: decoded.uid, enrollmentId: id },
          customizations: {
            title: "Lumyn Academy Certificate",
            description: "Unlock your course completion certificate",
          },
        }),
      });

      await connectDB();
      await AcademyPayment.create({
        reference,
        studentUid: decoded.uid,
        studentEmail: student.email,
        kind: "certificate_unlock",
        enrollmentId: id,
        amount: charge.amountCents,
        currency: charge.currency,
        status: "pending",
        provider: "flutterwave",
      });

      return NextResponse.json({ success: true, method: "payment", authorizationUrl: data.link, reference });
    }

    return NextResponse.json({ error: "Choose a valid unlock method." }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/academy/enrollments/:id/unlock-certificate]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not unlock this certificate." },
      { status: 400 },
    );
  }
}
