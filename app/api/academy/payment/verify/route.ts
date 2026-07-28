import { NextRequest, NextResponse } from "next/server";
import { activateAcademyPayment, type FlutterwaveCharge } from "@/lib/academy-payments";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { flutterwaveRequest } from "@/lib/flutterwave";
import { sendAcademyEmail } from "@/lib/academy-emails";
import AcademyPayment from "@/models/AcademyPayment";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("tx_ref");
    const transactionId = request.nextUrl.searchParams.get("transaction_id");
    if (!reference && !transactionId) {
      return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    }

    const { decoded } = await getVerifiedAcademyStudent(request);
    const query = reference ? { reference, studentUid: decoded.uid } : { providerTransactionId: transactionId!, studentUid: decoded.uid };
    const owned = await AcademyPayment.exists(query);
    if (!owned && reference) {
      return NextResponse.json({ error: "Payment was not found." }, { status: 404 });
    }

    const data = transactionId
      ? await flutterwaveRequest<FlutterwaveCharge>(`/transactions/${encodeURIComponent(transactionId)}/verify`)
      : await flutterwaveRequest<FlutterwaveCharge>(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference!)}`);

    const { payment, student, alreadyProcessed } = await activateAcademyPayment(data);
    if (student && !alreadyProcessed) {
      sendAcademyEmail({
        event: "points_purchased",
        to: student.email,
        details: `${payment.points} Academy points have been added to your balance.`,
      }).catch((error) => console.error("[academy payment email]", error));
    }

    return NextResponse.json({
      success: true,
      points: payment.points,
      balance: student?.pointsBalance,
      alreadyProcessed,
    });
  } catch (error) {
    console.error("[academy payment verify]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment verification failed." }, { status: 400 });
  }
}
