import type { Metadata } from "next";
import { Suspense } from "react";
import SendMoneyClient from "@/components/tools/send-money/SendMoneyClient";
import { fetchAllMidMarketRates } from "@/lib/tools/send-money/fx";
import { buildMetadata, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Send Money to Nigeria — Compare What You Actually Receive",
    description:
      "Compare GBP, USD, EUR, and CAD transfers to Nigeria by what you actually receive in naira after fees and exchange rate margin — not the advertised rate.",
    path: "/tools/send-money-to-nigeria",
    keywords: [
      "send money to Nigeria",
      "best way to send money to Nigeria",
      "Nigeria remittance comparison",
      "naira exchange rate transfer",
    ],
  });
}

const faq = [
  {
    q: "Why is the amount received different from the advertised exchange rate?",
    a: "Providers apply their own exchange rate, which usually runs a bit below the true mid-market rate — that gap is their margin, and it's often larger than any fee they charge. The amount you actually receive reflects both the fee and that margin, not just the headline rate.",
  },
  {
    q: "Can I still receive dollars instead of naira?",
    a: "No. Since 1 May 2026, Central Bank of Nigeria rules require every licensed International Money Transfer Operator to pay recipients in naira only, settled through a designated account at an Authorised Dealer Bank.",
  },
  {
    q: "How current are the provider numbers?",
    a: "Each provider shows a last-verified date. Fees and rate margins change, so treat these as estimates and confirm the exact figure on the provider's own site before sending.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Lumyn Send Money to Nigeria Comparison",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
    },
    buildFaqJsonLd(faq),
  ],
};

export default async function SendMoneyPage() {
  const rates = await fetchAllMidMarketRates();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <Suspense>
        <SendMoneyClient initialRates={rates} />
      </Suspense>
    </>
  );
}
