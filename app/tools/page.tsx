import type { Metadata } from "next";
import Link from "next/link";
import IndexHero from "@/components/store/IndexHero";
import SectionWrapper from "@/components/SectionWrapper";
import AdSlot from "@/components/ads/AdSlot";
import ToolIcon from "@/components/tools/ToolIcon";
import { TOOLS } from "@/lib/tools/registry";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Free Nigerian Business Tools",
    description:
      "Free, no-signup tools for running a business in Nigeria — invoicing, comparing money transfer rates, and working out what a hire actually costs.",
    path: "/tools",
    keywords: [
      "free Nigerian business tools",
      "Nigeria invoice generator",
      "send money to Nigeria calculator",
      "Nigeria employer cost calculator",
    ],
  });
}

const jsonLd = buildWebPageJsonLd({
  path: "/tools",
  name: "Free Nigerian Business Tools",
  description: "Free, no-signup tools for running a business in Nigeria.",
  pageType: "CollectionPage",
});

const STATS = [
  { value: "3", label: "Free Tools" },
  { value: "0", label: "Signups" },
  { value: "100%", label: "Nigeria-specific" },
];

export default function ToolsIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <IndexHero
        eyebrow="Free Tools"
        title="Practical tools for"
        accent="running a business in Nigeria."
        description="No login, no email wall, no catch. Calculations run in your browser and results are shareable by link. Built for the things that actually trip up Nigerian business owners — pricing, invoicing, and hiring."
        stats={STATS}
      />

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="card group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: "#7c6cf6", color: "#ffffff", boxShadow: "0 6px 18px rgba(124,108,246,0.35)" }}
              >
                <ToolIcon slug={tool.slug} />
              </div>

              <div className="flex-1">
                <h2 className="heading-sm mb-2 transition-colors group-hover:text-sage-dark">{tool.name}</h2>
                <p className="body-sm">{tool.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tool.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]"
                    style={{ borderColor: "var(--border-primary)", color: "var(--text-tertiary)" }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <span
                className="flex items-center gap-1.5 border-t pt-4 text-sm font-medium transition-all duration-200 group-hover:translate-x-1"
                style={{ borderColor: "var(--border-primary)", color: "#7c6cf6" }}
              >
                Use tool
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <AdSlot placement="tools-index" />
        </div>
      </SectionWrapper>
    </>
  );
}
