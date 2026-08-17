import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import InteriorHero from "@/components/InteriorHero";
import { academyPositioning, mindFuelPositioning } from "@/lib/ecosystem";
import { SITE_URL, buildMetadata, buildProductJsonLd, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description:
    "Explore Lumyn products including Lumyn Academy, the flagship learning platform, and MindFuel, a social reflection app.",
  path: "/products",
  keywords: ["Lumyn products", "Lumyn Academy", "MindFuel app", "AI learning platform", "digital products"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    buildWebPageJsonLd({
      path: "/products",
      name: "Lumyn Products",
      description:
        "Explore Lumyn Academy and MindFuel, the focused product portfolio built and operated by Lumyn.",
      pageType: "CollectionPage",
      keywords: ["Lumyn products", "Lumyn Academy", "MindFuel"],
    }),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/products#product-list`,
      name: "Lumyn product portfolio",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: { "@id": `${SITE_URL}/academy#softwareapplication` },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: { "@id": `${SITE_URL}/mindfuel#softwareapplication` },
        },
      ],
    },
    buildProductJsonLd({
      name: "Lumyn Academy",
      path: "/academy",
      description: academyPositioning,
      image: "/og-image.png",
      applicationCategory: "EducationalApplication",
    }),
    buildProductJsonLd({
      name: "MindFuel",
      path: "/mindfuel",
      description: mindFuelPositioning,
      image: "/mindfuel2.png",
      applicationCategory: "LifestyleApplication",
      sameAs: "https://www.mind-fuel.app",
    }),
  ],
};

const ownedProducts = [
  {
    status: "Education product",
    title: "Lumyn Academy",
    href: "/academy",
    description: academyPositioning,
    primaryAction: "Explore Academy",
    secondaryAction: "View pricing",
    secondaryHref: "/academy#learning-options",
    visual: "academy",
  },
  {
    status: "Live",
    title: "MindFuel",
    href: "/mindfuel",
    description: mindFuelPositioning,
    primaryAction: "Explore MindFuel",
    secondaryAction: "Visit app",
    secondaryHref: "https://www.mind-fuel.app",
    visual: "mindfuel",
  },
];

const productPrinciples = [
  "Owned by Lumyn",
  "Built around real user value",
  "Designed for calmer digital behavior",
  "Supported by modern engineering systems",
];

function ProductVisual({ type }: { type: string }) {
  if (type === "mindfuel") {
    return (
      <div className="dark-visual relative min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070707]">
        <div className="lumyn-soft-glow absolute inset-0" />
        <Image
          src="/mindfuel.png"
          alt="MindFuel product preview"
          width={1279}
          height={924}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="relative h-full min-h-72 w-full object-contain object-center p-5 opacity-95 drop-shadow-[0_24px_35px_rgba(0,0,0,0.5)] transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="dark-visual relative min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070707] p-5">
      <div className="lumyn-grid lumyn-soft-glow absolute inset-0" />
      
      <Image
        src="/aca.png"
        alt="Lumyn Academy product preview"
        width={1279}
        height={924}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="relative h-full min-h-72 w-full object-contain object-center opacity-95 drop-shadow-[0_24px_35px_rgba(0,0,0,0.5)] transition duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="Lumyn products"
        title="Small portfolio."
        accent="Distinct purpose."
        description="A focused portfolio of learning and reflection products designed to feel calm, useful, and unmistakably human."
        primaryAction={{ label: "Explore products", href: "#owned-products" }}
        secondaryAction={{ label: "Open Academy", href: "/academy" }}
        signals={["Lumyn Academy", "MindFuel", "More in progress"]}
        note="Owned products"
      />

      <SectionWrapper id="owned-products" background="default" size="lg" separator>
        <Reveal className="mb-12 max-w-3xl">
          <p className="label-sm mb-5">Owned Products</p>
          <h2 className="heading-md mb-5">Products in the Lumyn portfolio.</h2>
          <p className="body-lg">
            This page is reserved for products Lumyn owns, operates, and builds
            intentionally. Lumyn Academy is the flagship learning product, and
            MindFuel remains part of the wider ecosystem.
          </p>
        </Reveal>

        <div className="space-y-6">
          {ownedProducts.map((product, index) => (
            <Reveal key={product.title} delay={index * 90} variant="scale">
              <article className="grid gap-0 overflow-hidden rounded-[2rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-2 sm:p-4 md:grid-cols-[0.9fr_1.1fr] md:gap-6 md:p-6">
                <Link href={product.href} className="group block">
                  <ProductVisual type={product.visual} />
                </Link>
                <div className="flex flex-col justify-center p-5 sm:p-6 md:p-6">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                    {product.status}
                  </p>
                  <h3 className="mb-5 text-4xl font-medium tracking-[-0.05em] text-[color:var(--text-primary)] md:text-6xl">
                    {product.title}
                  </h3>
                  <p className="max-w-xl text-lg leading-8 text-[color:var(--text-secondary)]">
                    {product.description}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href={product.href} className="btn-primary">
                      {product.primaryAction}
                    </Link>
                    <Link href={product.secondaryHref} className="btn-secondary">
                      {product.secondaryAction}
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary" size="lg" separator>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="label-sm mb-5">Product Standard</p>
            <h2 className="heading-md mb-6">Small portfolio. High intention.</h2>
            <p className="body-lg">
              Lumyn does not list client projects or loose experiments here.
              Products earn this page when they are owned by Lumyn and shaped by
              the studio's long-term product philosophy.
            </p>
          </Reveal>

          <Reveal delay={120} variant="fade">
            <div className="grid gap-4 sm:grid-cols-2">
              {productPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="rounded-3xl border border-[color:var(--border-primary)] bg-[color:var(--bg-primary)] p-6 text-[color:var(--text-secondary)]"
                >
                  {principle}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper background="default" size="sm">
        <CTA
          headline="Start with the flagship product."
          subtext="Lumyn Academy is the clearest expression of the studio's product philosophy, while MindFuel expands the ecosystem."
          primaryCTA={{ label: "Open Academy", href: "/academy" }}
          secondaryCTA={{ label: "Explore MindFuel", href: "/mindfuel" }}
        />
      </SectionWrapper>
    </>
  );
}
