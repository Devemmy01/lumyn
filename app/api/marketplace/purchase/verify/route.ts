import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { activateMarketplacePayment } from "@/lib/marketplace-payments";
import { verifyPaystackTransaction } from "@/lib/paystack";
import MarketplacePayment from "@/models/MarketplacePayment";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("trxref");
    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    }

    const { decoded } = await getVerifiedAcademyStudent(request);
    const owned = await MarketplacePayment.exists({ reference, studentUid: decoded.uid });
    if (!owned) {
      return NextResponse.json({ error: "Payment was not found." }, { status: 404 });
    }

    const data = await verifyPaystackTransaction(reference);
    const { payment, alreadyProcessed } = await activateMarketplacePayment(data);

    return NextResponse.json({ success: true, kind: payment.kind, alreadyProcessed });
  } catch (error) {
    console.error("[marketplace purchase verify]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed." },
      { status: 400 },
    );
  }
}
