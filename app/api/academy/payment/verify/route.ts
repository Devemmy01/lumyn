import { NextRequest, NextResponse } from "next/server";
import { activateAcademyPayment } from "@/lib/academy-payments";
import { getVerifiedAcademyStudent } from "@/lib/academy-access";
import { paystackRequest } from "@/lib/paystack";
import { sendAcademyEmail } from "@/lib/academy-emails";
import AcademyPayment from "@/models/AcademyPayment";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    const { decoded } = await getVerifiedAcademyStudent(request);
    const owned = await AcademyPayment.exists({ reference, studentUid: decoded.uid });
    if (!owned) return NextResponse.json({ error: "Payment was not found." }, { status: 404 });

    const data = await paystackRequest<Parameters<typeof activateAcademyPayment>[0]>(
      `/transaction/verify/${encodeURIComponent(reference)}`
    );
    const { payment, student } = await activateAcademyPayment(data);
    sendAcademyEmail({
      event: payment.planId === "guided-mentorship" ? "mentorship_payment_confirmation" : "welcome",
      to: student.email,
      details: `Your ${payment.planId === "guided-mentorship" ? "Guided Mentorship" : "AI Learning Path"} subscription is active.`,
    }).catch((error) => console.error("[academy payment email]", error));

    return NextResponse.json({ success: true, subscription: student.subscription });
  } catch (error) {
    console.error("[academy payment verify]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment verification failed." }, { status: 400 });
  }
}
