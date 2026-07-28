import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import InteriorHero from "@/components/InteriorHero";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Our Software Studio",
  description:
    "Contact Lumyn about a custom software project, MVP, web application, product partnership, Lumyn Academy, or general support.",
  path: "/contact",
  keywords: ["contact software development studio", "hire software development team", "Lumyn contact"],
});

const jsonLd = buildWebPageJsonLd({
  path: "/contact",
  name: "Contact Lumyn",
  description:
    "Contact Lumyn about product work, partnerships, Lumyn Academy, MindFuel, or general support.",
  pageType: "ContactPage",
  keywords: ["contact Lumyn", "Lumyn product studio", "Lumyn support"],
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="Contact"
        title="Bring us the"
        accent="complicated part."
        description="Tell us what you’re building, where it feels stuck, or what needs to become clearer. We’ll respond thoughtfully."
        signals={["Product projects", "Partnerships", "General inquiries"]}
        note="Open for conversation"
      />

      <ContactForm />
    </>
  );
}
