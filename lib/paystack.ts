import { createHmac, timingSafeEqual } from "crypto";
import type { AcademyPlanId } from "@/lib/academy";

const PAYSTACK_URL = "https://api.paystack.co";

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Payments are temporarily unavailable.");
  return key;
}

export function getPaystackPlan(planId: AcademyPlanId) {
  const mentorship = planId === "guided-mentorship";
  return {
    amount: Number(mentorship ? process.env.ACADEMY_MENTORSHIP_AMOUNT ?? 2500 : process.env.ACADEMY_AI_AMOUNT ?? 500),
    currency: process.env.ACADEMY_PAYMENT_CURRENCY ?? "USD",
    planCode: mentorship ? process.env.PAYSTACK_MENTORSHIP_PLAN_CODE : process.env.PAYSTACK_AI_PLAN_CODE,
  };
}

export async function paystackRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${PAYSTACK_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = await response.json() as { status: boolean; message: string; data: T };
  if (!response.ok || !payload.status) throw new Error(payload.message || "Paystack request failed.");
  return payload.data;
}

export function verifyPaystackWebhook(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  const received = Buffer.from(signature, "utf8");
  const calculated = Buffer.from(expected, "utf8");
  return received.length === calculated.length && timingSafeEqual(received, calculated);
}
