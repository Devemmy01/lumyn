import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendStoreResendEmail } from "@/lib/store/emails";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_MESSAGE = "If we have orders on file for that email, we've sent fresh links.";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(`store-resend:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  // Always the same response, whether or not the email exists — never reveal
  // account existence through this endpoint.
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  }

  try {
    await connectDB();
    const orders = await Order.find({ email, status: "paid" }).select("reference");

    if (orders.length > 0) {
      await sendStoreResendEmail({
        email,
        references: orders.map((order) => order.reference),
      });
    }
  } catch (error) {
    console.error("[store resend]", error);
    // Still return the generic success response — don't leak state through errors either.
  }

  return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
}
