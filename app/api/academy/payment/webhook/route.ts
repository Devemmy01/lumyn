import { NextRequest, NextResponse } from "next/server";
import { activateAcademyPayment } from "@/lib/academy-payments";
import { verifyPaystackWebhook } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import AcademyStudent from "@/models/AcademyStudent";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  try {
    if (!verifyPaystackWebhook(rawBody, request.headers.get("x-paystack-signature"))) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
    const event = JSON.parse(rawBody) as {
      event: string;
      data: Parameters<typeof activateAcademyPayment>[0] & {
        subscription_code?: string;
        email_token?: string;
        next_payment_date?: string;
        subscription?: { subscription_code?: string; email_token?: string; next_payment_date?: string };
      };
    };
    if (event.event === "charge.success") {
      await activateAcademyPayment(event.data as Parameters<typeof activateAcademyPayment>[0]);
    } else if (event.event === "subscription.create") {
      await connectDB();
      await AcademyStudent.findOneAndUpdate(
        { email: event.data.customer?.email?.toLowerCase() },
        { $set: {
          "subscription.subscriptionCode": event.data.subscription_code,
          "subscription.emailToken": event.data.email_token,
          "subscription.currentPeriodEnd": event.data.next_payment_date,
          "subscription.status": "active",
        } }
      );
    } else if (event.event === "subscription.disable") {
      await connectDB();
      await AcademyStudent.findOneAndUpdate(
        { "subscription.subscriptionCode": event.data.subscription_code },
        { $set: { "subscription.status": "cancelled", "subscription.cancelAtPeriodEnd": true } }
      );
    } else if (event.event === "invoice.payment_failed") {
      await connectDB();
      await AcademyStudent.findOneAndUpdate(
        { "subscription.subscriptionCode": event.data.subscription?.subscription_code },
        { $set: { "subscription.status": "past_due" } }
      );
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[paystack webhook]", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }
}
