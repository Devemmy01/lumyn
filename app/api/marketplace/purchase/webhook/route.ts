import { NextRequest, NextResponse } from "next/server";
import { activateMarketplacePayment } from "@/lib/marketplace-payments";
import { verifyPaystackWebhookSignature, type PaystackChargeData } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  try {
    if (!verifyPaystackWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as { event?: string; data?: PaystackChargeData };
    if (event.event === "charge.success" && event.data) {
      await activateMarketplacePayment(event.data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[paystack webhook]", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
