import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import { services, servicesBySlug } from "@/lib/services";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  SITE_URL,
  serializeJsonLd,
} from "@/lib/seo";

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

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicesBySlug[slug];

  if (!service) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ]);
  const breadcrumbNode = {
    "@type": breadcrumbJsonLd["@type"],
    itemListElement: breadcrumbJsonLd.itemListElement,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.name,
        description: service.description,
        provider: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Lumyn",
          url: SITE_URL,
        },
        areaServed: "Worldwide",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${SITE_URL}/contact`,
        },
        serviceType: service.name,
        url: `${SITE_URL}/services/${service.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      breadcrumbNode,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <p className="label-sm mb-5">What We Build</p>
            <h2 className="heading-md mb-6">
              {service.name} shaped around a real business outcome.
            </h2>
            <div className="space-y-5 body-md">
              {service.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="card-elevated">
            <h2 className="heading-sm mb-5">Typical Deliverables</h2>
            <ul className="space-y-4 body-md">
              {service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary">
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

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="label-sm mb-5">Delivery Process</p>
            <h2 className="heading-md mb-8">From a clear problem to a reliable release.</h2>
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
          </div>

          <div className="card-elevated self-start">
            <h2 className="heading-sm mb-4">Technology Capabilities</h2>
            <p className="body-md mb-5">
              We choose the stack around the product, team, and long-term maintenance needs—not a fixed template.
            </p>
            <ul className="space-y-3 body-md">
              {service.technologies.map((technology) => (
                <li key={technology} className="flex items-center gap-3">
                  <span className="h-px w-4 bg-sage" aria-hidden="true" />
                  {technology}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary" container="narrow" size="sm">
        <h2 className="heading-md mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {service.faq.map((item) => (
            <div key={item.question} className="card-elevated">
              <h3 className="heading-sm mb-2">{item.question}</h3>
              <p className="body-md">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">Discuss Your Project</Link>
          <Link href="/services" className="btn-secondary">All Services</Link>
        </div>
      </SectionWrapper>

      <SectionWrapper background="default" size="sm">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="label-sm mb-3">Related Capabilities</p>
            <h2 className="heading-sm">Explore other ways we can help.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {services
            .filter((item) => item.slug !== service.slug)
            .map((item) => (
              <Link key={item.slug} href={`/services/${item.slug}`} className="card-elevated group block">
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{item.description}</p>
                <span className="mt-4 inline-block text-xs uppercase tracking-[0.12em] text-sage">Explore service</span>
              </Link>
            ))}
        </div>
      </SectionWrapper>
    </>
  );
}
