import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { fulfillOrder } from "@/lib/store/payments";
import { getProduct } from "@/lib/store/products";
import { formatNaira } from "@/lib/store/format";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Order confirmed",
    description: "Your Lumyn field guide purchase is confirmed.",
    path: "/guides/success",
    noIndex: true,
  });
}

function ErrorState({ message }: { message: string }) {
  return (
    <SectionWrapper background="default" size="lg">
      <div className="mx-auto max-w-md text-center">
        <h1 className="heading-sm mb-4">We couldn&apos;t confirm that payment</h1>
        <p className="body-sm mb-8">{message}</p>
        <Link href="/guides/resend" className="btn-primary">
          Look up my downloads
        </Link>
      </div>
    </SectionWrapper>
  );
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  if (!reference) {
    return <ErrorState message="No payment reference was provided." />;
  }

  let result;
  try {
    // The redirect back here is a hint, not proof — verify server-side with
    // Paystack before showing anything.
    const data = await verifyPaystackTransaction(reference);
    result = await fulfillOrder(data);
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : "We couldn't verify this payment. If you were charged, use the link below to find your downloads."
        }
      />
    );
  }

  const { order, entitlements } = result;

  return (
    <SectionWrapper background="default" size="lg">
      <div className="mx-auto max-w-lg">
        <p className="label-sm mb-3">Order confirmed</p>
        <h1 className="heading-sm mb-4">Thanks — your guide is ready</h1>
        <p className="body-sm mb-8">
          Order <strong>{order.reference}</strong> · {formatNaira(order.amountKobo)} paid. We&apos;ve also
          emailed these links to <strong>{order.email}</strong>.
        </p>

        <div className="space-y-3">
          {entitlements.map((entitlement) => {
            const product = getProduct(entitlement.productSlug);
            return (
              <a
                key={entitlement.downloadToken}
                href={`/api/store/download/${entitlement.downloadToken}`}
                className="flex items-center justify-between rounded-2xl border p-5 transition-colors hover:border-[#7c6cf6]"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
              >
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {product?.title ?? entitlement.productSlug}
                </span>
                <span className="btn-secondary px-4 py-2 text-xs">Download PDF</span>
              </a>
            );
          })}
        </div>

        <p className="mt-8 text-xs" style={{ color: "var(--text-tertiary)" }}>
          Keep this page or the email — you can always come back to{" "}
          <Link href={`/guides/download/${order.reference}`} className="underline" style={{ color: "#7c6cf6" }}>
            your download page
          </Link>{" "}
          later.
        </p>
      </div>
    </SectionWrapper>
  );
}
