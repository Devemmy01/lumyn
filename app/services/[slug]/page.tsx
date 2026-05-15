import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import { services, servicesBySlug } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesBySlug[slug];

  if (!service) {
    return { title: "Service Not Found" };
  }

  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio";

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesBySlug[slug];

  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Lumyn",
      url: siteUrl,
    },
    areaServed: "Worldwide",
    serviceType: service.name,
    url: `${siteUrl}/services/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden mt-5 py-28 md:py-36" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-5">Service</p>
          <h1 className="heading-display mb-6 text-balance max-w-5xl" style={{ color: "var(--text-primary)" }}>
            {service.hero}
          </h1>
          <p className="body-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            {service.subhero}
          </p>
        </div>
      </section>

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-elevated">
            <h2 className="heading-sm mb-4">Best Fit For</h2>
            <ul className="space-y-3 body-md">
              {service.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-elevated">
            <h2 className="heading-sm mb-4">Outcomes You Can Expect</h2>
            <ul className="space-y-3 body-md">
              {service.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary" container="narrow">
        <p className="label-sm mb-6">How We Deliver</p>
        <div className="space-y-5">
          {service.process.map((step, idx) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 bg-sage/15 text-sage-dark flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="body-md">{step}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper background="default" container="narrow" size="sm">
        <p className="label-sm mb-6">Frequently Asked Questions</p>
        <div className="space-y-4">
          {service.faq.map((item) => (
            <div key={item.question} className="card-elevated">
              <h3 className="heading-sm mb-2">{item.question}</h3>
              <p className="body-md">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">Start Your Project</Link>
          <Link href="/services" className="btn-secondary">All Services</Link>
        </div>
      </SectionWrapper>
    </>
  );
}
