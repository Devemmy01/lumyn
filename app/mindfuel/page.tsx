import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import InteriorHero from "@/components/InteriorHero";
import { mindFuelPositioning } from "@/lib/ecosystem";
import { buildMetadata, buildProductJsonLd, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "MindFuel",
  description: `${mindFuelPositioning} Explore its reflection feed, thought cards, profiles, and calm reading experience.`,
  path: "/mindfuel",
  keywords: ["MindFuel", "reflection app", "personal growth community", "thought sharing app"],
  imageAlt: "MindFuel reflection and personal growth app",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    buildWebPageJsonLd({
      path: "/mindfuel",
      name: "MindFuel",
      description: `${mindFuelPositioning} Explore its reflection feed, thought cards, profiles, and calm reading experience.`,
      keywords: ["MindFuel", "reflection app", "personal growth network"],
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

const features = [
  {
    title: "Reflection Feed",
    description:
      "A quieter stream for lessons, ideas, notes, and thoughtful posts that deserve attention.",
  },
  {
    title: "Thought Cards",
    description:
      "Turn meaningful ideas into polished visual cards designed for sharing and saving.",
  },
  {
    title: "Personal Profiles",
    description:
      "A clean identity layer for people who want their words to feel considered.",
  },
  {
    title: "Real-Time Interactions",
    description:
      "Responsive product moments that keep conversation alive without overwhelming the experience.",
  },
  {
    title: "Premium Themes",
    description:
      "A visual system that gives reflection and reading a calmer, more expressive surface.",
  },
  {
    title: "Readable Interface",
    description:
      "Designed around clarity, pacing, and the simple pleasure of staying with a thought.",
  },
];

export default function MindFuelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="Live product"
        title="Life teaches."
        accent="MindFuel remembers."
        description="Document what life is teaching you, share useful reflections, and grow alongside people choosing intention over noise."
        primaryAction={{ label: "Visit MindFuel", href: "https://www.mind-fuel.app" }}
        secondaryAction={{ label: "Explore Academy", href: "/academy" }}
        signals={["Reflect", "Share perspective", "Grow together"]}
        note="MindFuel"
      />

      <SectionWrapper id="mindfuel" background="default" size="lg" separator>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Now live
            </div>
            <h2 className="heading-lg mb-6">Built for reflection, not noise.</h2>
            <p className="mb-8 max-w-xl text-lg leading-8 text-[color:var(--text-secondary)]">
              {mindFuelPositioning}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="https://www.mind-fuel.app" className="btn-primary">
                Visit Product
              </Link>
              <Link href="/journal" className="btn-secondary">
                Read the Journal
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} variant="scale">
            <div className="dark-visual relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:p-5">
              <div className="lumyn-soft-glow lumyn-grid absolute inset-0" />
              <div className="relative mx-auto h-[500px] w-full max-w-[780px] rounded-[1.6rem] border border-white/15 bg-[radial-gradient(circle_at_50%_35%,rgba(52,211,153,0.13),transparent_45%),#07100d] p-3 shadow-2xl">
                <Image
                  src="/mindfuel2.png"
                  alt="MindFuel mobile interface"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 780px"
                  className="object-contain object-center p-4 drop-shadow-[0_30px_45px_rgba(0,0,0,0.6)]"
                />
              </div>
              <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  Live product
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary" size="lg" separator>
        <Reveal className="mb-10 max-w-3xl">
          <p className="label-sm mb-4">Experience</p>
          <h2 className="heading-md mb-5">What MindFuel is built around.</h2>
          <p className="text-lg leading-8 text-[color:var(--text-secondary)]">
            The product is designed as a small but complete social surface:
            readable, expressive, and calmer by default.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 70} variant="scale">
              <div className="h-full rounded-3xl border border-[color:var(--border-primary)] bg-[color:var(--bg-primary)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7c6cf6]/45">
                <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                  0{index + 1}
                </p>
                <h3 className="mb-3 text-2xl font-medium tracking-tight text-[color:var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="leading-7 text-[color:var(--text-secondary)]">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
