import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAcademyStudent } from "@/lib/academy-access";
import { paystackRequest } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  try {
    const { student } = await getVerifiedAcademyStudent(request);
    const code = student.subscription.subscriptionCode;
    const token = student.subscription.emailToken;
    if (!code || !token) {
      return NextResponse.json({ error: "No renewable subscription was found." }, { status: 400 });
    }
    await paystackRequest("/subscription/disable", {
      method: "POST",
      body: JSON.stringify({ code, token }),
    });
    student.subscription.status = "cancelled";
    student.subscription.cancelAtPeriodEnd = true;
    await student.save();
    return NextResponse.json({ success: true, subscription: student.subscription });
  } catch (error) {
    console.error("[academy payment cancel]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not cancel subscription." }, { status: 500 });
  }
}
