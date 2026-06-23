import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import { mindFuelPositioning } from "@/lib/ecosystem";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description:
    "Explore Lumyn products including MindFuel, a social reflection app, and Lumyn Academy, an AI-powered practical learning platform.",
  path: "/products",
  keywords: ["Lumyn products", "MindFuel app", "AI learning platform", "digital products"],
});

const ownedProducts = [
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
  {
    status: "Education product",
    title: "Lumyn Academy",
    href: "/academy",
    description:
      "A paid software engineering academy with AI-generated learning paths, guided mentorship, practical projects, progress tracking, and certificates.",
    primaryAction: "Explore Academy",
    secondaryAction: "View pricing",
    secondaryHref: "/academy#learning-options",
    visual: "academy",
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
          src="/mindfuel1.png"
          alt="MindFuel product preview"
          width={1279}
          height={924}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="relative h-full min-h-72 w-full object-cover object-left-top opacity-85 transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div className="dark-visual relative min-h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070707] p-5">
      <div className="lumyn-grid lumyn-soft-glow absolute inset-0" />
      <div className="relative grid h-full gap-4">
        <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Lumyn Academy</p>
            <span className="rounded-full bg-[#7c6cf6]/15 px-3 py-1 text-xs text-[#c9c1ff]">
              Paid
            </span>
          </div>
          <div className="space-y-3">
            {["AI Learning Path", "Guided Mentorship", "Certificate Progress"].map(
              (item, index) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="mb-2 flex items-center justify-between text-xs text-white/40">
                    <span>0{index + 1}</span>
                    <span>{64 + index * 12}%</span>
                  </div>
                  <p className="text-sm font-medium text-white">{item}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Hero
        badge="Lumyn Products"
        headline="Lumyn-owned products."
        subheadline="A focused portfolio of thoughtful software and learning products designed to feel calm, useful, and human."
        primaryCTA={{ label: "Explore Products", href: "#owned-products" }}
        secondaryCTA={{ label: "Explore Academy", href: "/academy" }}
        size="compact"
      />

      <SectionWrapper id="owned-products" background="default" size="lg" separator>
        <Reveal className="mb-12 max-w-3xl">
          <p className="label-sm mb-5">Owned Products</p>
            <h2 className="heading-md mb-5">Products in the Lumyn portfolio.</h2>
          <p className="body-lg">
            This page is reserved for products Lumyn owns, operates, and builds
            intentionally. MindFuel is live now. Lumyn Academy is the learning
            product layer of the same ecosystem.
          </p>
        </Reveal>

        <div className="space-y-6">
          {ownedProducts.map((product, index) => (
            <Reveal key={product.title} delay={index * 90} variant="scale">
              <article className="grid gap-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[0.9fr_1.1fr] md:p-6">
                <Link href={product.href} className="group block">
                  <ProductVisual type={product.visual} />
                </Link>
                <div className="flex flex-col justify-center p-2 md:p-6">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    {product.status}
                  </p>
                  <h3 className="mb-5 text-4xl font-medium tracking-tight text-white md:text-6xl">
                    {product.title}
                  </h3>
                  <p className="max-w-xl text-lg leading-8 text-white/60">
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
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 text-white/70"
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
          headline="Start with the live product."
          subtext="MindFuel is the current public expression of Lumyn's product philosophy."
          primaryCTA={{ label: "Open MindFuel", href: "/mindfuel" }}
          secondaryCTA={{ label: "Explore Academy", href: "/academy" }}
        />
      </SectionWrapper>
    </>
  );
}
