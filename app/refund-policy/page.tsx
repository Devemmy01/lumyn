import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { ACADEMY_CERTIFICATE_PRICE_CENTS, ACADEMY_TUTOR_NAME } from "@/lib/academy";

export const metadata: Metadata = buildMetadata({ title: "Refund Policy", description: "Refund terms for Lumyn Academy subscription and certificate payments.", path: "/refund-policy" });

const academyCertificatePriceLabel = `$${(ACADEMY_CERTIFICATE_PRICE_CENTS / 100).toFixed(2)}`;

const sections: PolicySection[] = [
  { title: "Overview", paragraphs: [<>This policy applies to payments made directly to Lumyn for Lumyn Academy subscriptions and certificate unlocks. Every course, lesson, quiz, and project is free to learn; these payments only cover the optional {ACADEMY_TUTOR_NAME} subscription and paid certificate unlocks. We want payment outcomes to be predictable and will review genuine billing problems fairly.</>] },
  { title: "Academy subscriptions and certificates", bullets: [<>You may request a refund of a monthly {ACADEMY_TUTOR_NAME} subscription charge within 7 calendar days of payment, provided the subscription has not already renewed for a further period.</>, <>Certificate unlock payments ({academyCertificatePriceLabel}) are refundable within 7 calendar days of payment as long as the certificate has not yet been issued or downloaded.</>, <>Diamonds earned through referrals have no cash value, are never purchased, and are not refundable or exchangeable for cash.</>] },
  { title: "Duplicate, incorrect, or unauthorized charges", paragraphs: [<>Duplicate or incorrect charges will be refunded after verification. If you believe a payment was unauthorized, contact us and your bank immediately. We may request information needed to investigate and may restrict the affected account while the review is ongoing.</>] },
  { title: "How to request a refund", paragraphs: [<>Submit a request through our <a href="/contact" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">contact page</a> or email <a href="mailto:hello@lumynhq.studio" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">hello@lumynhq.studio</a>.</>], bullets: [<>Include the account email, Flutterwave payment reference, whether the payment was for a subscription or a certificate unlock, payment date, and reason for the request.</>, <>Do not send complete card details, PINs, passwords, or one-time codes.</>] },
  { title: "Review and processing time", paragraphs: [<>We aim to acknowledge refund requests within 2 business days. Approved refunds are submitted to the original payment method through Flutterwave. They commonly appear within 5 to 10 business days after approval, but the final timing depends on Flutterwave, your bank, card network, and location.</>] },
  { title: "Chargebacks and contact", paragraphs: [<>Please contact us first so we can investigate quickly. This does not remove any right you have to contact your bank or payment provider. Questions may be sent to <a href="mailto:hello@lumynhq.studio" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">hello@lumynhq.studio</a>.</>] },
];

export default function RefundPolicyPage() { return <PolicyPage eyebrow="Payments" title="Refund Policy" summary="When a Lumyn payment may be refunded, how to submit a request, and what happens after approval." updated="22 June 2026" sections={sections} />; }
