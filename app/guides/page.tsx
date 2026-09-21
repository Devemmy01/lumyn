import type { Metadata } from "next";
import Link from "next/link";
import IndexHero from "@/components/store/IndexHero";
import SectionWrapper from "@/components/SectionWrapper";
import GuideCover from "@/components/store/GuideCover";
import { PRODUCTS, SINGLE_PRODUCT_SLUGS } from "@/lib/store/products";
import { getProductContent } from "@/lib/store/content";
import { formatNaira } from "@/lib/store/format";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Field Guides — Practical Guides for Running a Business in Nigeria",
    description:
      "Short, practical field guides on what a website costs, getting found on Google, and getting paid — written for business owners in Nigeria.",
    path: "/guides",
    keywords: [
      "Nigeria business guide",
      "website cost Nigeria",
      "getting paid Nigeria",
      "SEO Nigeria small business",
    ],
  });
}

const jsonLd = buildWebPageJsonLd({
  path: "/guides",
  name: "Lumyn Field Guides",
  description: "Practical field guides for running a business in Nigeria.",
  pageType: "CollectionPage",
});

export default function GuidesIndexPage() {
  const bundle = PRODUCTS["bundle-all"];
  const bundleContent = getProductContent("bundle-all");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <IndexHero
        eyebrow="Field Guides"
        title="Practical guides for"
        accent="running a business in Nigeria."
        description="Short, direct guides on the things that actually trip up Nigerian business owners — pricing a website, getting found, and getting paid. No fluff, no theory."
        stats={[
          { value: "3", label: "Field Guides" },
          { value: "₦15k", label: "Starting At" },
          { value: "Instant", label: "Download" },
        ]}
      />

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SINGLE_PRODUCT_SLUGS.map((slug) => {
            const product = PRODUCTS[slug];
            const content = getProductContent(slug);
            return (
              <Link
                key={slug}
                href={`/guides/${slug}`}
                className="group flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
              >
                <GuideCover src={content.coverImage} title={product.title} />
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="heading-sm">{product.title}</h2>
                  <p className="body-sm flex-1">{content.tagline}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                      {formatNaira(product.priceKobo)}
                    </span>
                    <span
                      className="flex items-center gap-1 text-sm font-medium transition-all duration-200 group-hover:translate-x-1"
                      style={{ color: "#7c6cf6" }}
                    >
                      View guide
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary">
        <div
          className="flex flex-col items-start gap-6 rounded-3xl border p-8 md:flex-row md:items-center md:justify-between md:p-12"
          style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-w-xl">
            <p className="label-sm mb-3">Bundle offer</p>
            <h2 className="heading-sm mb-3">{bundle.title}</h2>
            <p className="body-sm">{bundleContent.tagline}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <span className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatNaira(bundle.priceKobo)}
            </span>
            <Link href="/guides/bundle-all" className="btn-primary">
              Get the bundle
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
