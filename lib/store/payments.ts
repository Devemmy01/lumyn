import { randomUUID } from "crypto";
import connectDB from "@/lib/mongodb";
import { initializeListingFeeCharge, type PaystackChargeData } from "@/lib/paystack";
import { getProduct, resolveEntitlementSlugs, type ProductSlug } from "@/lib/store/products";
import { generateDownloadToken, freshTokenExpiry } from "@/lib/store/download-tokens";
import { sendStoreReceiptEmail } from "@/lib/store/emails";
import Order, { type IOrderDocument } from "@/models/Order";
import Entitlement, { type IEntitlementDocument } from "@/models/Entitlement";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(
    error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000,
  );
}

export class InvalidProductError extends Error {
  constructor() {
    super("That product isn't available.");
    this.name = "InvalidProductError";
  }
}

/** Starts a checkout: creates our own pending order record before ever
 * calling Paystack, then initializes the transaction. The price is looked up
 * from lib/store/products.ts server-side — the amount passed to Paystack
 * never comes from the client. */
export async function startCheckout({
  email,
  productSlug,
  callbackUrl,
}: {
  email: string;
  productSlug: string;
  callbackUrl: string;
}) {
  const product = getProduct(productSlug);
  if (!product) throw new InvalidProductError();

  await connectDB();

  const reference = `store-${Date.now()}-${randomUUID().slice(0, 8)}`;

  await Order.create({
    reference,
    email,
    productSlug: product.slug,
    amountKobo: product.priceKobo,
    currency: product.currency,
    status: "pending",
  });

  const data = await initializeListingFeeCharge({
    email,
    amountCents: product.priceKobo,
    currency: product.currency,
    reference,
    callbackUrl,
    metadata: { orderReference: reference, productSlug: product.slug },
  });

  return { reference, authorizationUrl: data.authorization_url };
}

export type FulfillResult = {
  order: IOrderDocument;
  entitlements: IEntitlementDocument[];
  alreadyProcessed: boolean;
};

/** The one place an order becomes entitlements. Called from both the
 * callback (fast path) and the webhook (source of truth) — safe to call
 * twice for the same reference, or concurrently from both at once. */
export async function fulfillOrder(data: PaystackChargeData): Promise<FulfillResult> {
  await connectDB();

  const existing = await Order.findOne({ reference: data.reference });
  if (!existing) {
    throw new Error("This payment reference wasn't issued by the Lumyn store.");
  }

  if (existing.status === "paid") {
    const entitlements = await Entitlement.find({ orderId: existing._id });
    return { order: existing, entitlements, alreadyProcessed: true };
  }

  const amountMatches = Number(data.amount) === existing.amountKobo;
  const currencyMatches = data.currency?.toUpperCase() === existing.currency.toUpperCase();

  if (data.status !== "success" || !amountMatches || !currencyMatches) {
    await Order.updateOne({ _id: existing._id, status: "pending" }, { $set: { status: "failed" } });
    throw new Error("Payment verification did not match the order on record.");
  }

  // Atomic claim on the pending -> paid transition: the callback and the
  // webhook can both reach this function for the same order at almost the
  // same instant. A plain read-then-write would let both pass the "already
  // paid?" check above and both send a receipt email. findOneAndUpdate's
  // filter on status: "pending" is a single atomic document operation, so
  // only the first caller gets a non-null result back; the loser falls
  // through to the already-fulfilled path below instead of redoing work.
  const claimed = await Order.findOneAndUpdate(
    { _id: existing._id, status: "pending" },
    {
      $set: {
        status: "paid",
        paystackReference: data.id?.toString(),
        paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
      },
    },
    { new: true },
  );

  if (!claimed) {
    const order = await Order.findById(existing._id);
    const entitlements = await Entitlement.find({ orderId: existing._id });
    return { order: order ?? existing, entitlements, alreadyProcessed: true };
  }

  const slugs = resolveEntitlementSlugs(claimed.productSlug as ProductSlug);
  const entitlements: IEntitlementDocument[] = [];

  for (const slug of slugs) {
    try {
      const entitlement = await Entitlement.create({
        orderId: claimed._id,
        email: claimed.email,
        productSlug: slug,
        downloadToken: generateDownloadToken(),
        tokenExpiresAt: freshTokenExpiry(),
      });
      entitlements.push(entitlement);
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
      const existingEntitlement = await Entitlement.findOne({ orderId: claimed._id, productSlug: slug });
      if (existingEntitlement) entitlements.push(existingEntitlement);
    }
  }

  await sendStoreReceiptEmail({ order: claimed, entitlements }).catch((error) => {
    console.error("[store] Failed to send receipt email", error);
  });

  return { order: claimed, entitlements, alreadyProcessed: false };
}
