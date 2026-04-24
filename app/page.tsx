import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import BlogCard from "@/components/BlogCard";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { IPost } from "@/models/Post";

export const metadata: Metadata = {
  title: "Lumyn — Impactful Products, Engineered for Results.",
  description:
    "Lumyn is an independent product studio building high-performance digital tools and custom web applications that solve real-world problems with precision and impact.",
  openGraph: {
    title: "Lumyn — Impactful Products, Engineered for Results.",
    description:
      "Lumyn is an independent product studio building high-performance digital tools and custom web applications that solve real-world problems with precision and impact.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lumyn | Modern Product Studio",
      },
    ],
  },
};

const products = [
  {
    name: "MindFuel",
    tagline: "A Full Stack Social Platform – Thoughtful connection for the modern age.",
    description:
      "A social space built for meaningful interaction and curation. Share ideas that matter and connect with others in a high-signal environment.",
    href: "/products#mindfuel",
    status: "live" as const,
    accentColor: "#7C6CF6",
  },
  {
    name: "Summai",
    tagline: "Efficiently extract insights from any piece of content.",
    description:
      "Paste any article, report, or document. Summai identifies key takeaways and delivers actionable insights in seconds.",
    href: "/products#summai",
    status: "beta" as const,
    accentColor: "#5B7FA6",
  },
  {
    name: "EdTurbo",
    tagline: "Accelerate learning through targeted, high-impact lessons.",
    description:
      "A modern learning platform designed for speed and retention. Short lessons and adaptive testing help you master topics faster.",
    href: "/products#edturbo",
    status: "beta" as const,
    accentColor: "#2A9D8F",
  },
];

const values = [
  {
    title: "Efficiency",
    description: "We optimize for the most direct path to value. No fluff, just results.",
  },
  {
    title: "Impact",
    description: "We build features that move the needle. Every line of code serves a purpose.",
  },
  {
    title: "Scale",
    description: "We engineer for growth and durability. Built to perform under pressure.",
  },
  {
    title: "Execution",
    description: "We ship high-quality products swiftly and consistently. Excellence in motion.",
  },
];


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lumyn",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
  description:
    "Lumyn is a modern product studio building high-performance PWAs, web applications, and digital tools designed to solve real-world problems and deliver measurable results.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/journal?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  await dbConnect();
  
  const latestPosts = (await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean()) as unknown as IPost[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        badge="Modern Product Studio"
        headline="Building Impactful Products That Deliver Results."
        subheadline="Lumyn is an independent product studio building high-performance digital tools and custom web applications designed to solve real-world problems."
        primaryCTA={{ label: "Explore Products", href: "/products" }}
        secondaryCTA={{ label: "Our Method", href: "/philosophy" }}
      />

      {/* ── Products ───────────────────────────────── */}
      <SectionWrapper id="products" background="tinted" glow="top-right" separator>
        <Reveal className="text-center mb-14">
          <p className="label-sm mb-4">What We Build</p>
          <h2 className="heading-lg text-charcoal mb-4">
            Impactful Products
          </h2>
          <p className="body-md max-w-xl mx-auto">
            We build software that addresses real-world challenges with precision and purpose.
            The result is products that deliver measurable value.
          </p>
        </Reveal>

        {/* Cards — individually revealed with stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <Reveal key={product.name} delay={i * 120} variant="scale" className="flex flex-col h-full">
              <ProductCard {...product} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={400} className="text-center mt-10">
          <Link href="/products" className="btn-ghost group">
            View all products
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </Reveal>
      </SectionWrapper>

      {/* ── Philosophy teaser ─────────────────────── */}
      <SectionWrapper background="default" glow="top-left" separator>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="label-sm mb-5">Our Method</p>
            <h2 className="heading-lg text-charcoal mb-6 text-balance">
              Engineered for Results.
            </h2>
            <div className="space-y-4 mb-8">
              <p className="body-md">
                We don't just build features; we build solutions. Our process is focused on execution and impact.
              </p>
              <p className="body-md">
                Lumyn products are shaped by efficiency, guided by intelligence,
                and refined through rigorous testing.
              </p>
              <p className="body-md italic text-charcoal-muted/70">
                We validate before we scale.<br />
                We optimize for impact.
              </p>
            </div>
            <Link href="/philosophy" className="btn-primary">
              Our Method
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </Reveal>

          {/* Values grid — staggered */}
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80} variant="scale">
                <div className="card-flat h-full">
                  <h3 className="font-semibold text-charcoal mb-2 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-charcoal-muted text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Anti-engagement section ─────────────── */}
      <div className="relative bg-charcoal overflow-hidden py-20 md:py-28">
        {/* ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 30% 60%, rgba(124,108,246,0.10) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <div className="container-mid relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — headline + copy */}
            <div>
              <Reveal variant="fade">
                <p className="label-sm text-ivory/40 mb-6">A Different Measure</p>
              </Reveal>

              <Reveal delay={80}>
                <h2
                  className="font-semibold text-ivory text-balance mb-8"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.1, letterSpacing: "-0.026em" }}
                >
                  We win when you solve the problem.
                </h2>
              </Reveal>

              <Reveal delay={160} variant="fade">
                <div className="space-y-4 mb-10">
                  <p className="text-ivory/55 leading-relaxed"
                     style={{ fontSize: "clamp(0.975rem, 1.4vw, 1.1rem)" }}>
                    Most software is engineered to keep you inside it. We think that&apos;s the wrong goal.
                    We build tools that help you get the job done efficiently, so you can focus on what matters most.
                  </p>
                  
                  <p className="text-ivory/30 leading-relaxed italic"
                     style={{ fontSize: "clamp(0.875rem, 1.2vw, 0.95rem)" }}>
                    We don&apos;t optimize for time-on-screen.<br />We optimize for value delivered.
                  </p>
                </div>
              </Reveal>

              
            </div>

            {/* Right — contrast stats */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {[
                {
                  label: "What we track",
                  value: "Value delivered",
                  sub: "Not time spent in-app",
                },
                {
                  label: "How we define success",
                  value: "The problem is solved",
                  sub: "Not because we made it hard to leave",
                },
                {
                  label: "What a good session looks like",
                  value: "Efficient and decisive",
                  sub: "Not long and habitual",
                },
              ].map((item, i) => (
                <Reveal key={item.label} delay={i * 100} variant="scale">
                  <div className="rounded-2xl border border-ivory/8 bg-ivory/4 px-6 py-5">
                    <p className="text-xs font-medium text-ivory/30 uppercase tracking-widest mb-2">
                      {item.label}
                    </p>
                    <p className="text-ivory font-semibold tracking-tight mb-1"
                       style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}>
                      {item.value}
                    </p>
                    <p className="text-ivory/35 text-sm">{item.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* ── Journal ───────────────────────────────── */}
      <SectionWrapper background="default" glow="bottom-center" separator>
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="label-sm mb-3">From the Journal</p>
            <h2 className="heading-md text-charcoal">Thinking Out Loud</h2>
          </div>
          <Link href="/journal" className="btn-ghost group shrink-0">
            All articles
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 90} variant="scale" className="flex flex-col h-full">
              <BlogCard
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                tags={post.tags}
                readingTime={post.readingTime}
                createdAt={post.createdAt}
                index={i}
              />
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Newsletter CTA ────────────────────────── */}
      <SectionWrapper className="p-0" background="tinted" size="sm" separator>
        <Reveal>
          <CTA
            headline="Stay updated."
            subtext="Get occasional updates on our latest products, case studies, and what we're building at Lumyn."
            primaryCTA={{ label: "Subscribe to Journal", href: "/journal" }}
            secondaryCTA={{ label: "Read Latest", href: "/journal" }}
            variant="default"
          />
        </Reveal>
      </SectionWrapper>

      {/* ── Final CTA ─────────────────────────────── */}
      <SectionWrapper background="default" size="sm">
        <Reveal>
          <CTA
            headline="Ready to build something impactful?"
            subtext="We partner with organizations to build high-performance digital products. Let's see if it's a fit."
            primaryCTA={{ label: "Get in Touch", href: "/contact" }}
            secondaryCTA={{ label: "Learn About Us", href: "/about" }}
            variant="dark"
          />
        </Reveal>
      </SectionWrapper>
    </>
  );
}
