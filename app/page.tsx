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
  title: "Lumyn — Calm Intelligent Digital Tools",
  description:
    "Lumyn is a modern product studio building calm intelligent software designed to remove noise and restore clarity.",
  openGraph: {
    title: "Lumyn — Calm Intelligent Digital Tools",
    description:
      "Lumyn is a modern product studio building calm intelligent software designed to remove noise and restore clarity.",
  },
};

const products = [
  {
    name: "Mindfuel",
    tagline: "A calm environment for focus, reflection, and intentional thinking.",
    description:
      "Step into a distraction-free space designed to help you think clearly, journal deeply, and stay grounded in what matters.",
    href: "/products#mindfuel",
    status: "development" as const,
    accentColor: "#7C6CF6",
  },
  {
    name: "Summai",
    tagline: "Turn information overload into clear, concise insights.",
    description:
      "Paste any article, report, or document. Summai extracts the signal and removes the noise — delivering understanding in minutes.",
    href: "/products#summai",
    status: "beta" as const,
    accentColor: "#5B7FA6",
  },
  {
    name: "EdTurbo",
    tagline: "Master any topic faster through short lessons and smart quizzes.",
    description:
      "A microlearning platform for secondary and tertiary students. Short lessons, visual summaries, and adaptive quizzes help you learn more in less time.",
    href: "/products#edturbo",
    status: "beta" as const,
    accentColor: "#2A9D8F",
  },
];

const values = [
  {
    title: "Restraint",
    description: "We remove before we add. Every element on screen costs attention. We spend it wisely.",
  },
  {
    title: "Clarity",
    description: "Information that confuses serves no one. We design for understanding, not completeness.",
  },
  {
    title: "Depth",
    description: "We build tools for deep work, not shallow engagement. Quality of thought over quantity of time.",
  },
  {
    title: "Calm",
    description: "Software should reduce your cognitive load, not add to it. We design experiences that breathe.",
  },
];


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lumyn",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
  description:
    "Lumyn is a modern product studio building calm intelligent software designed to remove noise and restore clarity.",
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

      {/* ── Hero ───────────────────────────────────── */}
      <Hero
        badge="A calm digital studio"
        headline="Software That Respects Your Attention"
        subheadline="Lumyn is a calm product studio building intelligent digital tools designed to restore clarity."
        primaryCTA={{ label: "Explore Products", href: "/products" }}
        secondaryCTA={{ label: "Read Our Philosophy", href: "/philosophy" }}
      />

      {/* ── Products ───────────────────────────────── */}
      <SectionWrapper id="products" background="tinted" glow="top-right" separator>
        <Reveal className="text-center mb-14">
          <p className="label-sm mb-4">What We Build</p>
          <h2 className="heading-lg text-charcoal mb-4">
            Tools Designed for Clarity
          </h2>
          <p className="body-md max-w-xl mx-auto">
            Each product starts with a single question: what can we remove?
            The result is software that helps you think better.
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
            <p className="label-sm mb-5">Our Philosophy</p>
            <h2 className="heading-lg text-charcoal mb-6 text-balance">
              Designed to Help You Think.
            </h2>
            <div className="space-y-4 mb-8">
              <p className="body-md">
                Most software competes for your attention. We build tools that protect it.
              </p>
              <p className="body-md">
                Lumyn products are shaped by restraint, guided by intelligence,
                and refined through simplicity.
              </p>
              <p className="body-md italic text-charcoal-muted/70">
                We remove before we add.<br />
                We clarify before we scale.
              </p>
            </div>
            <Link href="/philosophy" className="btn-primary">
              Our Philosophy
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
                  We win when you close the app.
                </h2>
              </Reveal>

              <Reveal delay={160} variant="fade">
                <div className="space-y-4 mb-10">
                  <p className="text-ivory/55 leading-relaxed"
                     style={{ fontSize: "clamp(0.975rem, 1.4vw, 1.1rem)" }}>
                    Most software is engineered to keep you inside it. Every notification,
                    every infinite scroll, every subtle nudge — all designed to hold your attention
                    a little longer. We think that&apos;s the wrong goal.
                  </p>
                  
                  <p className="text-ivory/30 leading-relaxed italic"
                     style={{ fontSize: "clamp(0.875rem, 1.2vw, 0.95rem)" }}>
                    We don&apos;t optimise for time-on-screen.<br />We optimise for time freed.
                  </p>
                </div>
              </Reveal>

              
            </div>

            {/* Right — contrast stats */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {[
                {
                  label: "What we track",
                  value: "Time you get back",
                  sub: "Not time spent in-app",
                },
                {
                  label: "How we define retention",
                  value: "You come back because it works",
                  sub: "Not because we made it hard to leave",
                },
                {
                  label: "What a good session looks like",
                  value: "Short and decisive",
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
            headline="Stay curious. Stay calm."
            subtext="Get occasional essays on thoughtful technology, focus, and what we're building at Lumyn."
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
            headline="Ready to build something calm?"
            subtext="We work with a small number of partners on thoughtful digital products. Let's see if it's a fit."
            primaryCTA={{ label: "Get in Touch", href: "/contact" }}
            secondaryCTA={{ label: "Learn About Us", href: "/about" }}
            variant="dark"
          />
        </Reveal>
      </SectionWrapper>
    </>
  );
}
