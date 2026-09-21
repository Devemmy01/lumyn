import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/store/payments";
import { downloadCap } from "@/lib/store/download-tokens";

/** The browser redirect back here is a hint, not proof of payment — we still
 * call Paystack's verify endpoint server-side and only fulfil if it reports
 * success and the amount/currency match what we recorded at initialize. */
export async function GET(request: NextRequest) {
  try {
    const reference =
      request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("trxref");

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    }

    const data = await verifyPaystackTransaction(reference);
    const { order, entitlements, alreadyProcessed } = await fulfillOrder(data);

    return NextResponse.json({
      success: true,
      alreadyProcessed,
      order: {
        reference: order.reference,
        email: order.email,
        productSlug: order.productSlug,
        amountKobo: order.amountKobo,
        currency: order.currency,
      },
      entitlements: entitlements.map((entitlement) => ({
        productSlug: entitlement.productSlug,
        downloadToken: entitlement.downloadToken,
        remainingDownloads: Math.max(0, downloadCap() - entitlement.downloadCount),
      })),
    });
  } catch (error) {
    console.error("[store checkout verify]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed." },
      { status: 400 },
    );
  }
}
