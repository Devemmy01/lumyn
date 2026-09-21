import type { Metadata } from "next";
import InvoiceGeneratorClient from "@/components/tools/invoice/InvoiceGeneratorClient";
import { buildMetadata, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Free Invoice Generator for Nigerian Businesses",
    description:
      "Create a clean, professional invoice with Nigerian bank details, VAT, and withholding tax built in. Free, no signup, nothing leaves your browser.",
    path: "/tools/invoice-generator",
    keywords: ["invoice generator Nigeria", "free invoice template Nigeria", "Nigerian invoice maker"],
  });
}

const faq = [
  {
    q: "Is my invoice data stored anywhere?",
    a: "No. Everything you type stays in your browser's memory and local storage for the invoice number counter — nothing is sent to a server.",
  },
  {
    q: "Does this handle Nigerian VAT?",
    a: "Yes — toggle VAT on and it applies the standard 7.5% rate to your discounted subtotal.",
  },
  {
    q: "What withholding tax rate should I use?",
    a: "It depends on the type of service and your client — this tool lets you enter any percentage, but confirm the correct rate with your accountant or current FIRS guidance rather than assuming a default.",
  },
  {
    q: "Can I use a currency other than naira?",
    a: "Yes — NGN, USD, GBP, and EUR are all available. Switching currency only changes the symbol shown; it doesn't convert amounts.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Lumyn Invoice Generator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
    },
    buildFaqJsonLd(faq),
  ],
};

export default function InvoiceGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <InvoiceGeneratorClient />
    </>
  );
}
