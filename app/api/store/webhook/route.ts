import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { verifyPaystackWebhookSignature, type PaystackChargeData } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/store/payments";

/** No auth middleware, no CSRF — Paystack calls this directly. The raw body
 * is what gets HMAC-verified; re-serialized JSON would hash differently and
 * every webhook would fail signature verification. This is the source of
 * truth for fulfilment; the checkout callback is just the fast path. */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifyPaystackWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: string; data?: PaystackChargeData };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  // Respond 200 immediately — Paystack retries on anything else — then do
  // the fulfilment work. Events we don't handle still get a 200 so Paystack
  // doesn't keep retrying them.
  if (event.event === "charge.success" && event.data) {
    const data = event.data;
    after(async () => {
      try {
        await fulfillOrder(data);
      } catch (error) {
        console.error("[store webhook] fulfilment failed", error);
      }
    });
  }

  return NextResponse.json({ received: true });
}
