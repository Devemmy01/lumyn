import type { ReactNode } from "react";
import Link from "next/link";
import AdSlot from "@/components/ads/AdSlot";
import SectionWrapper from "@/components/SectionWrapper";
import { getProduct } from "@/lib/store/products";
import { getProductContent } from "@/lib/store/content";
import type { ProductSlug } from "@/lib/store/products";

interface ToolLayoutProps {
  eyebrow?: string;
  title: string;
  description: string;
  /** Rendered from a constant in the tool's own calculation module — shown
   * on any tool whose numbers (rates, tax bands, fees) can go stale. */
  updatedOn?: string;
  inputPanel: ReactNode;
  resultPanel: ReactNode;
  explainer: ReactNode;
  fieldGuideSlug?: ProductSlug;
}

export default function ToolLayout({
  eyebrow = "Free Tool",
  title,
  description,
  updatedOn,
  inputPanel,
  resultPanel,
  explainer,
  fieldGuideSlug,
}: ToolLayoutProps) {
  const fieldGuide = fieldGuideSlug ? getProduct(fieldGuideSlug) : undefined;
  const fieldGuideContent = fieldGuideSlug ? getProductContent(fieldGuideSlug) : undefined;

  return (
    <>
      {/* No marketing hero here — the tool is the product. A returning,
          task-focused visitor should land straight on the input. */}
      <SectionWrapper background="default" size="sm">
        <div className="no-print mb-10 max-w-3xl">
          <p className="label-sm mb-3">{eyebrow}</p>
          <h1 className="heading-md mb-4">{title}</h1>
          <p className="body-md">{description}</p>
          {updatedOn && (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-tertiary)" }}>
              Updated {updatedOn}
            </p>
          )}
        </div>

        {/* Input, then output — never the other way around. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="no-print">{inputPanel}</div>
          <div>{resultPanel}</div>
        </div>

        {/* The ad, if any, only ever sits below the result — never above the
            fold, never between input and output. */}
        <div className="no-print mt-12 flex justify-center">
          <AdSlot placement="tool-below-result" />
        </div>

        {fieldGuide && fieldGuideContent && (
          <div
            className="no-print mt-12 flex flex-col items-start gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
          >
            <div>
              <p className="label-sm mb-2">Related field guide</p>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                {fieldGuide.title}
              </p>
              <p className="body-sm">{fieldGuideContent.tagline}</p>
            </div>
            <Link href={`/guides/${fieldGuide.slug}`} className="btn-secondary shrink-0">
              View guide
            </Link>
          </div>
        )}

        <div className="no-print prose prose-lumyn mt-16 max-w-none" style={{ color: "var(--text-secondary)" }}>
          <h2 className="heading-sm mb-6" style={{ color: "var(--text-primary)" }}>
            How this is calculated
          </h2>
          {explainer}
        </div>
      </SectionWrapper>
    </>
  );
}
