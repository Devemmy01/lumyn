import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Entitlement from "@/models/Entitlement";
import { getProduct, isProductSlug } from "@/lib/store/products";
import { generateDownloadToken, freshTokenExpiry } from "@/lib/store/download-tokens";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** Lists recent store orders and lets support manually re-issue an
 * entitlement — the "admin" surface the brief asked for instead of a full
 * dashboard. Protected the same way as every other /api/admin/* route. */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!rateLimit(`admin-store-orders:${getClientIp(request)}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  await connectDB();

  const limit = Math.min(100, Number(request.nextUrl.searchParams.get("limit") ?? 50));
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  const orderIds = orders.map((order) => order._id);
  const entitlements = await Entitlement.find({ orderId: { $in: orderIds } }).lean();

  const entitlementsByOrder = new Map<string, typeof entitlements>();
  for (const entitlement of entitlements) {
    const key = entitlement.orderId.toString();
    entitlementsByOrder.set(key, [...(entitlementsByOrder.get(key) ?? []), entitlement]);
  }

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order._id.toString(),
      reference: order.reference,
      email: order.email,
      productSlug: order.productSlug,
      productTitle: getProduct(order.productSlug)?.title,
      amountKobo: order.amountKobo,
      currency: order.currency,
      status: order.status,
      paystackReference: order.paystackReference,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
      entitlements: (entitlementsByOrder.get(order._id.toString()) ?? []).map((entitlement) => ({
        productSlug: entitlement.productSlug,
        downloadCount: entitlement.downloadCount,
        tokenExpiresAt: entitlement.tokenExpiresAt,
        lastDownloadedAt: entitlement.lastDownloadedAt,
      })),
    })),
  });
}

/** Body: { action: "reissue", orderId: string, productSlug?: string }
 * Re-issues (or creates, for an order missing one) an entitlement's download
 * token with a fresh expiry and a reset download count. */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!rateLimit(`admin-store-orders-write:${getClientIp(request)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { action?: string; orderId?: string; productSlug?: string }
    | null;

  if (body?.action !== "reissue" || !body.orderId) {
    return NextResponse.json({ error: "Expected { action: 'reissue', orderId }." }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findById(body.orderId);
  if (!order || order.status !== "paid") {
    return NextResponse.json({ error: "No paid order with that id." }, { status: 404 });
  }

  const productSlug = body.productSlug ?? order.productSlug;
  if (!isProductSlug(productSlug)) {
    return NextResponse.json({ error: "Unknown product slug." }, { status: 400 });
  }

  const entitlement = await Entitlement.findOneAndUpdate(
    { orderId: order._id, productSlug },
    {
      $set: {
        email: order.email,
        downloadToken: generateDownloadToken(),
        tokenExpiresAt: freshTokenExpiry(),
        downloadCount: 0,
      },
    },
    { upsert: true, new: true },
  );

  return NextResponse.json({
    success: true,
    entitlement: {
      productSlug: entitlement.productSlug,
      downloadUrl: `/api/store/download/${entitlement.downloadToken}`,
      tokenExpiresAt: entitlement.tokenExpiresAt,
    },
  });
}
