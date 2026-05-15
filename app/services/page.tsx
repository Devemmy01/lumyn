import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Software Development Services",
  description:
    "Explore Lumyn software development services: custom software development, MVP development, web application development, and PWA development.",
  keywords: [
    "software development services",
    "custom software development company",
    "MVP development agency",
    "web application development services",
    "PWA development company",
  ],
  openGraph: {
    title: "Software Development Services — Lumyn",
    description:
      "Custom software, MVP, web app, and PWA development services for founders and growing businesses.",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Lumyn Services",
  url: `${siteUrl}/services`,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}/services/${service.slug}`,
    name: service.name,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden mt-5 py-28 md:py-36" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-5">Services</p>
          <h1 className="heading-display mb-6 text-balance max-w-5xl" style={{ color: "var(--text-primary)" }}>
            Build Better Software, Faster.
          </h1>
          <p className="body-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            We partner with founders and business teams to design, build, and scale software products that solve real problems.
          </p>
        </div>
      </section>

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="card-elevated group block">
              <h2 className="heading-sm mb-3">{service.name}</h2>
              <p className="body-md mb-5">{service.description}</p>
              <span className="text-xs uppercase tracking-[0.12em] text-sage group-hover:text-sage-light transition-colors">
                View Service Details
              </span>
            </Link>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
