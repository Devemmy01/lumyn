import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Entitlement from "@/models/Entitlement";
import { getProduct } from "@/lib/store/products";
import { downloadCap, generateDownloadToken, freshTokenExpiry } from "@/lib/store/download-tokens";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ reference: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Your downloads",
    description: "Access your purchased Lumyn field guides.",
    path: "/guides/download",
    noIndex: true,
  });
}

export default async function DownloadPage({ params }: PageProps) {
  const { reference } = await params;
  await connectDB();

  const order = await Order.findOne({ reference, status: "paid" });
  if (!order) notFound();

  const entitlements = await Entitlement.find({ orderId: order._id });
  const cap = downloadCap();

  // Visiting this page always shows a working link — an expired token is
  // refreshed here rather than making the buyer go through the resend flow
  // just to keep reading a guide they already paid for. The download count
  // is left untouched; only the token and its expiry roll forward.
  for (const entitlement of entitlements) {
    if (entitlement.tokenExpiresAt.getTime() < Date.now()) {
      entitlement.downloadToken = generateDownloadToken();
      entitlement.tokenExpiresAt = freshTokenExpiry();
      await entitlement.save();
    }
  }

  return (
    <SectionWrapper background="default" size="lg">
      <div className="mx-auto max-w-lg">
        <p className="label-sm mb-3">Your downloads</p>
        <h1 className="heading-sm mb-4">Order {order.reference}</h1>
        <p className="body-sm mb-8">
          Each link is valid and capped at {cap} downloads. If a link stops working, request a fresh one
          below.
        </p>

        <div className="space-y-3">
          {entitlements.map((entitlement) => {
            const product = getProduct(entitlement.productSlug);
            const remaining = Math.max(0, cap - entitlement.downloadCount);
            return (
              <a
                key={entitlement.id}
                href={`/api/store/download/${entitlement.downloadToken}`}
                className="flex items-center justify-between rounded-2xl border p-5 transition-colors hover:border-[#7c6cf6]"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {product?.title ?? entitlement.productSlug}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {remaining} of {cap} downloads remaining
                  </p>
                </div>
                <span className="btn-secondary px-4 py-2 text-xs">Download PDF</span>
              </a>
            );
          })}
        </div>

        <p className="mt-8 text-xs" style={{ color: "var(--text-tertiary)" }}>
          Lost this page? Use{" "}
          <Link href="/guides/resend" className="underline" style={{ color: "#7c6cf6" }}>
            resend links
          </Link>{" "}
          with the email you paid with.
        </p>
      </div>
    </SectionWrapper>
  );
}
