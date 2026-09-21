import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import GuideCover from "@/components/store/GuideCover";
import { PRODUCT_SLUGS, getProduct } from "@/lib/store/products";
import { getProductContent } from "@/lib/store/content";
import { formatNaira } from "@/lib/store/format";
import { TOOLS } from "@/lib/tools/registry";
import { buildMetadata, buildWebPageJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const content = getProductContent(product.slug);

  return buildMetadata({
    title: product.title,
    description: content.tagline,
    path: `/guides/${product.slug}`,
  });
}

export default async function GuideProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const content = getProductContent(product.slug);
  const relatedTools = TOOLS.filter((tool) => tool.fieldGuideSlug === product.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: `/guides/${product.slug}`,
        name: product.title,
        description: content.tagline,
      }),
      buildFaqJsonLd(content.faq),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <SectionWrapper background="default" size="sm">
        <Link href="/guides" className="text-sage mb-6 inline-block font-medium hover:underline">
          ← All field guides
        </Link>
        <p className="label-sm mb-3">Field Guide</p>
        <h1 className="heading-md mb-4 max-w-3xl">{product.title}</h1>
        <p className="body-md max-w-2xl">{content.tagline}</p>
      </SectionWrapper>

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <GuideCover src={content.coverImage} title={product.title} className="mb-6" />
            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
            >
              <p className="text-2xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                {formatNaira(product.priceKobo)}
              </p>
              <Link href={`/guides/checkout?product=${product.slug}`} className="btn-primary w-full">
                Buy now
              </Link>
            </div>

            {relatedTools.length > 0 && (
              <div
                className="mt-4 rounded-2xl border p-5"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
              >
                <p className="label-sm mb-3">Free tool to try first</p>
                <div className="space-y-3">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center justify-between gap-3"
                    >
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {tool.name}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: "#7c6cf6" }}
                      >
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="heading-sm mb-5">What&apos;s inside</h2>
              <ul className="space-y-3">
                {content.whatsInside.map((item) => (
                  <li key={item} className="flex gap-3 body-sm">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "#7c6cf6" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="heading-sm mb-5">Who this is for</h2>
              <p className="body-md">{content.whoFor}</p>
            </div>

            <div>
              <h2 className="heading-sm mb-5">Frequently asked questions</h2>
              <div className="divide-y" style={{ borderColor: "var(--border-primary)" }}>
                {content.faq.map((item) => (
                  <div key={item.q} className="py-5" style={{ borderColor: "var(--border-primary)" }}>
                    <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      {item.q}
                    </p>
                    <p className="body-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
