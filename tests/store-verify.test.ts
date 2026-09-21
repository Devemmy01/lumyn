/**
 * Requires a real MongoDB connection: export MONGODB_URI before running
 * `npm test` (same as `npm run migrate:tags`). Creates and cleans up its own
 * test-prefixed documents; doesn't touch real order data.
 */
import test, { after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Entitlement from "@/models/Entitlement";
import { fulfillOrder } from "@/lib/store/payments";
import type { PaystackChargeData } from "@/lib/paystack";

const TEST_EMAIL = "test-store-verify@lumyn-test.invalid";
const createdReferences: string[] = [];

async function makePendingOrder(overrides: Partial<{ amountKobo: number; currency: string }> = {}) {
  await connectDB();
  const reference = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  createdReferences.push(reference);
  const order = await Order.create({
    reference,
    email: TEST_EMAIL,
    productSlug: "getting-paid",
    amountKobo: overrides.amountKobo ?? 2_000_000,
    currency: overrides.currency ?? "NGN",
    status: "pending",
  });
  return order;
}

function chargeData(overrides: Partial<PaystackChargeData> & { reference: string }): PaystackChargeData {
  return {
    id: Math.floor(Math.random() * 1_000_000),
    reference: overrides.reference,
    amount: overrides.amount ?? 2_000_000,
    currency: overrides.currency ?? "NGN",
    status: overrides.status ?? "success",
    paid_at: overrides.paid_at ?? new Date().toISOString(),
  };
}

test("fulfillOrder: success marks the order paid and creates an entitlement", async () => {
  await connectDB();
  const order = await makePendingOrder();

  const result = await fulfillOrder(chargeData({ reference: order.reference }));

  assert.equal(result.alreadyProcessed, false);
  assert.equal(result.order.status, "paid");
  assert.equal(result.entitlements.length, 1);
  assert.equal(result.entitlements[0].productSlug, "getting-paid");
});

test("fulfillOrder: wrong amount fails and marks the order failed", async () => {
  const order = await makePendingOrder({ amountKobo: 2_000_000 });

  await assert.rejects(() => fulfillOrder(chargeData({ reference: order.reference, amount: 1_000 })));

  const refreshed = await Order.findById(order._id);
  assert.equal(refreshed?.status, "failed");
});

test("fulfillOrder: wrong currency fails and marks the order failed", async () => {
  const order = await makePendingOrder({ currency: "NGN" });

  await assert.rejects(() =>
    fulfillOrder(chargeData({ reference: order.reference, currency: "USD" })),
  );

  const refreshed = await Order.findById(order._id);
  assert.equal(refreshed?.status, "failed");
});

test("fulfillOrder: already-fulfilled orders are idempotent, no duplicate entitlement", async () => {
  const order = await makePendingOrder();
  const data = chargeData({ reference: order.reference });

  const first = await fulfillOrder(data);
  const second = await fulfillOrder(data);

  assert.equal(first.alreadyProcessed, false);
  assert.equal(second.alreadyProcessed, true);
  assert.equal(second.entitlements.length, 1);

  const allEntitlements = await Entitlement.find({ orderId: order._id });
  assert.equal(allEntitlements.length, 1);
});

test("fulfillOrder: concurrent callback + webhook race doesn't duplicate entitlements", async () => {
  const order = await makePendingOrder();
  const data = chargeData({ reference: order.reference });

  const [a, b] = await Promise.all([fulfillOrder(data), fulfillOrder(data)]);
  const processedCount = [a.alreadyProcessed, b.alreadyProcessed].filter((v) => v === false).length;
  assert.equal(processedCount, 1);

  const allEntitlements = await Entitlement.find({ orderId: order._id });
  assert.equal(allEntitlements.length, 1);
});

test("fulfillOrder: unknown reference is rejected", async () => {
  await assert.rejects(
    () => fulfillOrder(chargeData({ reference: "test-does-not-exist-anywhere" })),
    /wasn't issued/,
  );
});

after(async () => {
  await Entitlement.deleteMany({ email: TEST_EMAIL });
  await Order.deleteMany({ reference: { $in: createdReferences } });
  await mongoose.disconnect();
});
