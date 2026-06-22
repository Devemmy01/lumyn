import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import HeroVisual from "@/components/HeroVisual";
import SectionWrapper from "@/components/SectionWrapper";
import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { IPost } from "@/models/Post";
import { mindFuelPositioning } from "@/lib/ecosystem";
import { academySkillExamples } from "@/lib/academy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lumyn - Thoughtful Digital Experiences for a Noisy Internet.",
  description:
    "Lumyn is an independent product studio creating software and educational experiences designed to feel calm, useful, and human.",
  openGraph: {
    title: "Lumyn - Thoughtful Digital Experiences for a Noisy Internet.",
    description:
      "An independent product studio building MindFuel, Lumyn Academy, and thoughtful digital experiences for the modern internet.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lumyn | Thoughtful Product Studio",
      },
    ],
  },
};

const mindFuelFeatures = [
  "Reflection feed",
  "Beautiful quote cards",
  "Profile customization",
  "Real-time interactions",
  "Premium themes",
  "Clean reading experience",
];

const partnershipAreas = [
  "Product engineering",
  "Design systems",
  "Modern web applications",
  "Scalable platforms",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lumyn",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
  description:
    "Lumyn is an independent product studio building thoughtful digital products and educational experiences for a calmer, more intentional internet.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/journal?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

function MindFuelShowcase() {
  return (
    <div className="dark-visual relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:p-8">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[90px]" />
      <div className="absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="lumyn-grid absolute inset-0 opacity-30" />

      <div className="relative grid h-full gap-5 lg:grid-cols-[0.9fr_1.15fr]">
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/mindlogo.png"
                  alt=""
                  className="h-10 w-10 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">MindFuel</p>
                  <p className="text-xs text-white/45">Reflection space</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Live
              </span>
            </div>

            <div className="space-y-4">
              {[
                "What made you pause today?",
                "A thought worth returning to.",
                "The best ideas arrive quietly.",
              ].map((thought, index) => (
                <div
                  key={thought}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full bg-[#7c6cf6]"
                      aria-hidden="true"
                    />
                    <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Reflection {index + 1}
                    </span>
                  </div>
                  <p className="text-lg leading-snug text-white/90">
                    {thought}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {["Calm", "Signal", "Human"].map((label) => (
              <div key={label} className="rounded-2xl bg-white/[0.04] p-3">
                <p className="text-xs text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <div className="absolute left-0 top-8 w-[82%] max-w-[540px] rotate-[-3deg] rounded-[2rem] border border-white/10 bg-[#0d0d10] p-3 shadow-2xl md:left-6">
            <img
              src="/mindfuel1.png"
              alt="MindFuel product interface"
              className="aspect-[1279/924] w-full rounded-[1.45rem] object-cover object-left-top"
            />
          </div>

          <div className="absolute bottom-10 right-0 w-[68%] rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl md:right-6">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
              Thought card
            </p>
            <p className="text-2xl font-medium leading-tight tracking-tight text-white">
              "Software can invite people to breathe."
            </p>
            <div className="mt-5 flex items-center justify-between text-xs text-white/45">
              <span>Theme: Midnight</span>
              <span>24 reflections</span>
            </div>
          </div>

          <div className="absolute right-4 top-8 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
              Live now
            </p>
            <p className="text-sm font-semibold text-white">mind-fuel.app</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademyVisual() {
  return (
    <div className="dark-visual relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.45)] md:p-6">
      <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-sky-400/10 blur-[80px]" />
      <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#7c6cf6]/15 blur-[90px]" />

      <div className="relative rounded-3xl border border-white/10 bg-black/45 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-sm font-semibold">Lumyn Academy</p>
            <p className="text-xs text-white/45">Adaptive learning dashboard</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/60">
            Active ecosystem
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 font-mono text-xs leading-6 text-white/70">
            <div className="mb-4 flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <p>
              <span className="text-[#7c6cf6]">const</span> product ={" "}
              <span className="text-emerald-300">build</span>
              (idea)
            </p>
            <p className="pl-4 text-white/40">.shipWithCare()</p>
            <p className="pl-4 text-white/40">.learnByDoing()</p>
            <p className="pl-4 text-white/40">.iterateInPublic();</p>
          </div>

          <div className="space-y-3">
            {["Course map", "Build log", "Mentor notes"].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">{item}</p>
                  <span className="text-xs text-white/35">0{index + 1}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#7c6cf6]"
                    style={{ width: `${44 + index * 18}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {academySkillExamples.map((skill) => (
            <div
              key={skill}
              className="rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 text-sm text-white/70"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  let latestPosts: IPost[] = [];

  try {
    await dbConnect();
    latestPosts = (await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()) as unknown as IPost[];
  } catch (error) {
    console.warn("Homepage rendered without latest journal posts.", error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        badge="Independent Product Studio"
        headline="Building thoughtful digital experiences"
        subheadline="Lumyn creates intentional software, intelligent learning experiences, and modern digital products designed to feel calm, useful, and human."
        primaryCTA={{ label: "Explore MindFuel", href: "/mindfuel" }}
        secondaryCTA={{ label: "Explore Academy", href: "/academy" }}
      >
        <HeroVisual />
      </Hero>

      <SectionWrapper id="philosophy" background="default" size="lg" separator>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <div>
                <p className="label-sm mb-6 text-white/45">Philosophy</p>
                <h2 className="heading-md max-w-2xl text-balance">
                  The internet got louder. We build in the opposite direction.
                </h2>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-3">
                {["Calm", "Useful", "Human"].map((value) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-medium text-white/60"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} variant="fade">
            <div className="grid h-full gap-4">
              {[
                "Everything fights for attention.",
                "Everything competes for engagement.",
                "Everything moves too fast.",
              ].map((line, index) => (
                <div
                  key={line}
                  className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-[#7c6cf6]/50 hover:bg-white/[0.05]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/40">
                    0{index + 1}
                  </span>
                  <p className="text-lg font-medium leading-snug text-white/65 md:text-2xl">
                    {line}
                  </p>
                </div>
              ))}

              <div className="dark-visual relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07070a] p-6 md:p-8">
                <div className="lumyn-soft-glow absolute inset-0" />
                <div className="relative">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    Our counter-position
                  </p>
                  <h3 className="mb-5 text-2xl font-medium tracking-tight text-white md:text-4xl">
                    Software should feel quieter, clearer, and more respectful.
                  </h3>
                  <p className="max-w-2xl text-base leading-8 text-white/60 md:text-lg">
                    Lumyn creates products and learning experiences that feel
                    intentional, calm, and meaningful. The work is digital, but
                    the goal is deeply human.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper id="mindfuel" background="secondary" size="lg" separator>
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="label-sm mb-5 text-white/45">Featured Product</p>
            <h2 className="heading-lg mb-6">MindFuel</h2>
            <p className="max-w-xl text-xl leading-relaxed text-white/60">
              {mindFuelPositioning}
            </p>
          </Reveal>

          <Reveal delay={120} variant="fade">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {mindFuelFeatures.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/70 transition duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  {feature}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="scale">
          <MindFuelShowcase />
        </Reveal>

        <Reveal
          delay={140}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link href="https://www.mind-fuel.app" className="btn-primary">
            Visit Product
          </Link>
          <Link href="/mindfuel" className="btn-secondary">
            Learn More
          </Link>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper id="academy" background="default" size="lg" separator>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div className="mb-6 inline-flex rounded-full border border-[#7c6cf6]/25 bg-[#7c6cf6]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9c1ff]">
              AI learning system
            </div>
            <p className="label-sm mb-5 text-white/45">Lumyn Academy</p>
            <h2 className="heading-lg mb-6">Learn anything with a generated path.</h2>
            <p className="mb-8 text-lg leading-8 text-white/60">
              Lumyn Academy lets students choose what they want to learn, then
              generates courses, modules, assignments, quizzes, exams,
              progress, and certificates around them.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/academy" className="btn-primary">
                Explore Academy
              </Link>
              <Link href="/academy#mentorship" className="btn-secondary hover:text-white">
                Apply for Mentorship
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} variant="scale">
            <AcademyVisual />
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper id="journal" background="secondary" size="lg" separator>
        <Reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-sm mb-4 text-white/45">Journal</p>
            <h2 className="heading-md">Notes from the Studio</h2>
          </div>
          <Link href="/journal" className="btn-secondary shrink-0">
            All Notes
          </Link>
        </Reveal>

        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Reveal
                key={post.slug}
                delay={i * 90}
                variant="scale"
                className="flex h-full flex-col"
              >
                <BlogCard
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  tags={post.tags}
                  readingTime={post.readingTime}
                  createdAt={post.createdAt}
                  index={i}
                  variant={i === 0 ? "featured" : "default"}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-white/60">
              Studio notes are being prepared.
            </div>
          </Reveal>
        )}
      </SectionWrapper>

      <SectionWrapper
        id="partnerships"
        background="default"
        size="md"
        separator
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="label-sm mb-5 text-white/45">Partnerships</p>
            <h2 className="heading-md mb-5">
              Selective partnerships for ambitious digital products.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-white/60">
              Lumyn occasionally partners with founders and teams who care about
              product quality, thoughtful systems, and durable software.
            </p>
          </Reveal>

          <Reveal delay={100} variant="fade">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {partnershipAreas.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-white/70"
                >
                  {area}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper id="manifesto" background="secondary" size="lg" separator>
        <Reveal className="mx-auto max-w-5xl text-center">
          <p className="label-sm mb-6 text-white/45">Manifesto</p>
          <h2 className="heading-lg mb-8 text-balance">
            Technology should respect the people who use it.
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-9 text-white/60">
            Lumyn exists to build calmer digital spaces, meaningful software
            experiences, and practical education for people who want to create
            with intention. We are not trying to make the internet louder. We
            are building places that help it feel more alive.
          </p>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
