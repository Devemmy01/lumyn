import type { Metadata } from "next";
import { Suspense } from "react";
import EmployerCostClient from "@/components/tools/employer-cost/EmployerCostClient";
import { buildMetadata, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Employer Cost Calculator — Nigeria Tax Act 2025",
    description:
      "See what a hire actually costs in Nigeria — PAYE under the 2026 tax bands, employer pension, NSITF, and NHIA — not just the employee's take-home pay.",
    path: "/tools/employer-cost-calculator",
    keywords: [
      "Nigeria employer cost calculator",
      "cost of hiring Nigeria",
      "Nigeria Tax Act 2025 PAYE calculator",
      "employer pension NSITF Nigeria",
    ],
  });
}

const faq = [
  {
    q: "Is NHF included automatically?",
    a: "No — since 1 January 2026, NHF is voluntary for private-sector employees, so it's off by default here. Turn it on if the employee opts in.",
  },
  {
    q: "What changed under the Nigeria Tax Act 2025?",
    a: "The old Consolidated Relief Allowance is gone, replaced by a ₦800,000 zero-rate band and targeted deductions like rent relief (20% of annual rent, capped at ₦500,000). The remaining bands run 15% through 25% as income rises.",
  },
  {
    q: "Does NSITF or NHIA come out of the employee's pay?",
    a: "No — both are employer-paid on top of gross salary, not deducted from the employee.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Lumyn Employer Cost Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
    },
    buildFaqJsonLd(faq),
  ],
};

export default function EmployerCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Suspense>
        <EmployerCostClient />
      </Suspense>
    </>
  );
}
