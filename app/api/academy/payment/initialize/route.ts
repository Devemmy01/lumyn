import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAcademyStudent, hasPaidAcademyAccess } from "@/lib/academy-access";
import { getPaystackPlan, isPaystackConfigured, paystackRequest } from "@/lib/paystack";
import type { AcademyPlanId } from "@/lib/academy";
import AcademyPayment from "@/models/AcademyPayment";

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json() as { planId?: AcademyPlanId };
    if (planId !== "ai-learning-path" && planId !== "guided-mentorship") {
      return NextResponse.json({ error: "Choose a valid Academy plan." }, { status: 400 });
    }
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
        { status: 503 }
      );
    }
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    if (hasPaidAcademyAccess(student) && student.subscription.planId === planId) {
      return NextResponse.json({ success: true, alreadyActive: true, authorizationUrl: "/academy/dashboard" });
    }

    const plan = getPaystackPlan(planId);
    if (!Number.isInteger(plan.amount) || plan.amount < 100) throw new Error("The plan amount is invalid.");
    const reference = `academy-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
    const data = await paystackRequest<{ authorization_url: string; access_code: string; reference: string }>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email: student.email,
          amount: plan.amount,
          currency: plan.currency,
          reference,
          callback_url: `${siteUrl}/academy/payment/callback`,
          plan: plan.planCode,
          metadata: { studentUid: decoded.uid, planId },
        }),
      }
    );

    await AcademyPayment.create({
      reference,
      studentUid: decoded.uid,
      studentEmail: student.email,
      planId,
      amount: plan.amount,
      currency: plan.currency,
      status: "pending",
      provider: "paystack",
    });
    student.subscription.planId = planId;
    student.subscription.status = "pending";
    student.subscription.provider = "paystack";
    await student.save();

    return NextResponse.json({ success: true, authorizationUrl: data.authorization_url, reference });
  } catch (error) {
    console.error("[academy payment initialize]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not start checkout." }, { status: 500 });
  }
}
