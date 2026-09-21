import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import CheckoutForm from "@/components/store/CheckoutForm";
import { getProduct } from "@/lib/store/products";
import { formatNaira } from "@/lib/store/format";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  searchParams: Promise<{ product?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Checkout",
    description: "Complete your purchase of a Lumyn field guide.",
    path: "/guides/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { product: productSlug } = await searchParams;
  const product = productSlug ? getProduct(productSlug) : undefined;
  if (!product) notFound();

  return (
    <SectionWrapper background="default" size="lg">
      <div className="mx-auto max-w-md">
        <p className="label-sm mb-3">Checkout</p>
        <h1 className="heading-sm mb-2">{product.title}</h1>
        <p className="mb-8 text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {formatNaira(product.priceKobo)}
        </p>
        <CheckoutForm productSlug={product.slug} />
      </div>
    </SectionWrapper>
  );
}
