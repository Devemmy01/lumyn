import type { ProductSlug } from "@/lib/store/products";

export interface ToolSummary {
  slug: string;
  name: string;
  description: string;
  fieldGuideSlug: ProductSlug;
}

/** One entry per tool. A fourth tool is a new route plus a calculation
 * module — this list is what makes it show up on /tools without touching
 * the index page itself. */
export const TOOLS: ToolSummary[] = [
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create a clean, professional invoice with Nigerian bank details — everything stays in your browser.",
    fieldGuideSlug: "getting-paid",
  },
  {
    slug: "send-money-to-nigeria",
    name: "Send Money to Nigeria",
    description: "Compare what you'd actually receive in naira across providers, not just their advertised rate.",
    fieldGuideSlug: "getting-paid",
  },
  {
    slug: "employer-cost-calculator",
    name: "Employer Cost Calculator",
    description: "See what a hire actually costs — PAYE, pension, NSITF, NHF — under the 2026 tax bands.",
    fieldGuideSlug: "website-costs",
  },
];
