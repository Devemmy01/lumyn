import { NextRequest, NextResponse } from "next/server";
import { activateAcademyPayment, type FlutterwaveCharge } from "@/lib/academy-payments";
import { verifyFlutterwaveWebhook } from "@/lib/flutterwave";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  try {
    if (!verifyFlutterwaveWebhook(request.headers.get("verif-hash"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: FlutterwaveCharge;
    };

    if (event.event === "charge.completed" && event.data) {
      await activateAcademyPayment(event.data);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[flutterwave webhook]", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
