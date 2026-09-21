import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

process.env.PAYSTACK_SECRET_KEY = "test_secret_for_webhook_signature_tests";

// Imported after the env var is set, since lib/paystack.ts reads the secret
// lazily on each call — this ordering isn't actually required, but keeps
// intent obvious.
import { verifyPaystackWebhookSignature } from "@/lib/paystack";

const body = JSON.stringify({ event: "charge.success", data: { reference: "store-123" } });

function sign(payload: string, secret: string) {
  return createHmac("sha512", secret).update(payload).digest("hex");
}

test("webhook signature: valid signature passes", () => {
  const signature = sign(body, "test_secret_for_webhook_signature_tests");
  assert.equal(verifyPaystackWebhookSignature(body, signature), true);
});

test("webhook signature: tampered body fails", () => {
  const signature = sign(body, "test_secret_for_webhook_signature_tests");
  const tamperedBody = JSON.stringify({ event: "charge.success", data: { reference: "store-999" } });
  assert.equal(verifyPaystackWebhookSignature(tamperedBody, signature), false);
});

test("webhook signature: signed with the wrong secret fails", () => {
  const signature = sign(body, "some_other_secret");
  assert.equal(verifyPaystackWebhookSignature(body, signature), false);
});

test("webhook signature: missing signature fails", () => {
  assert.equal(verifyPaystackWebhookSignature(body, null), false);
});
