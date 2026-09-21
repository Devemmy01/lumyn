import type { Metadata } from "next";
import Link from "next/link";
import InteriorHero from "@/components/InteriorHero";
import SectionWrapper from "@/components/SectionWrapper";
import AdSlot from "@/components/ads/AdSlot";
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

export default function ToolsIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

      <InteriorHero
        eyebrow="Free Tools"
        title="Practical tools for"
        accent="running a business in Nigeria."
        description="No login, no email wall, no catch. Calculations run in your browser and results are shareable by link. Built for the things that actually trip up Nigerian business owners — pricing, invoicing, and hiring."
        signals={["No login required", "Instant results", "Free forever"]}
        note="Lumyn free tools"
      />

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
            >
              <h2 className="heading-sm transition-colors group-hover:text-sage-dark">{tool.name}</h2>
              <p className="body-sm flex-1">{tool.description}</p>
              <span
                className="flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group-hover:translate-x-1"
                style={{ color: "#7c6cf6" }}
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
