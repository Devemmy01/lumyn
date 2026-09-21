import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Payment Policy",
    description: "Payment, delivery, and refund terms for Lumyn field guides.",
    path: "/guides/payment-policy",
  });
}

// Placeholder copy — replace with the real policy text.
const sections = [
  {
    title: "How payment works",
    paragraphs: [
      "Field guides are sold as one-time purchases in Nigerian naira, processed securely through Paystack. We never see or store your card details.",
    ],
  },
  {
    title: "Delivery",
    paragraphs: [
      "Guides are delivered as PDF downloads immediately after payment is confirmed, on the order success page and by email to the address you paid with.",
    ],
  },
  {
    title: "Refunds",
    paragraphs: [
      "Because guides are delivered instantly as digital files, all sales are final once a guide has been downloaded. If you haven't downloaded your guide and believe you were charged in error, contact us and we'll make it right.",
    ],
  },
  {
    title: "Trouble with a download",
    paragraphs: [
      "Download links expire after a period and are capped per file. If yours has expired or you've lost the email, use the resend page to get a fresh link — it never reveals whether an email has an order on file, it just sends new links if one does.",
    ],
  },
];

export default function PaymentPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Store"
      title="Payment Policy"
      summary="How payment, delivery, and refunds work for Lumyn field guides."
      updated="2026"
      sections={sections}
    />
  );
}
