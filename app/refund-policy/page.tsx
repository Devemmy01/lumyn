import type { Metadata } from "next";
import PolicyPage, { type PolicySection } from "@/components/PolicyPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Refund Policy", description: "Refund terms for Lumyn Academy point purchases.", path: "/refund-policy" });

const sections: PolicySection[] = [
  { title: "Overview", paragraphs: [<>This policy applies to payments made directly to Lumyn for Lumyn Academy point purchases. We want payment outcomes to be predictable and will review genuine billing problems fairly.</>] },
  { title: "Academy points", bullets: [<>You may request a refund of an unused point purchase within 7 calendar days of payment.</>, <>Eligibility may be reduced or declined where purchased points have already been spent on AI-generated courses, tutor usage, assessments, or certificate-related activity.</>, <>Starter points, admin-granted points, and promotional points have no cash value and are not refundable.</>] },
  { title: "Duplicate, incorrect, or unauthorized charges", paragraphs: [<>Duplicate or incorrect charges will be refunded after verification. If you believe a payment was unauthorized, contact us and your bank immediately. We may request information needed to investigate and may restrict the affected account while the review is ongoing.</>] },
  { title: "How to request a refund", paragraphs: [<>Submit a request through our <a href="/contact" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">contact page</a> or email <a href="mailto:hello@lumynhq.studio" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">hello@lumynhq.studio</a>.</>], bullets: [<>Include the account email, Flutterwave payment reference, points purchased, payment date, and reason for the request.</>, <>Do not send complete card details, PINs, passwords, or one-time codes.</>] },
  { title: "Review and processing time", paragraphs: [<>We aim to acknowledge refund requests within 2 business days. Approved refunds are submitted to the original payment method through Flutterwave. They commonly appear within 5–10 business days after approval, but the final timing depends on Flutterwave, your bank, card network, and location.</>] },
  { title: "Chargebacks and contact", paragraphs: [<>Please contact us first so we can investigate quickly. This does not remove any right you have to contact your bank or payment provider. Questions may be sent to <a href="mailto:hello@lumynhq.studio" className="font-semibold text-[#6c5ce7] underline underline-offset-4 dark:text-[#b9b1ff]">hello@lumynhq.studio</a>.</>] },
];

export default function RefundPolicyPage() { return <PolicyPage eyebrow="Payments" title="Refund Policy" summary="When a Lumyn payment may be refunded, how to submit a request, and what happens after approval." updated="22 June 2026" sections={sections} />; }
