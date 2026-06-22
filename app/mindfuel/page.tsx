import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import { mindFuelPositioning } from "@/lib/ecosystem";

export const metadata: Metadata = {
  title: "MindFuel",
  description: mindFuelPositioning,
  openGraph: {
    title: "MindFuel — Lumyn",
    description: mindFuelPositioning,
  },
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
      <Hero
        badge="Live Product"
        headline="MindFuel"
        subheadline="Document what life is teaching you, share reflections, and grow together with people who are choosing intention over noise."
        primaryCTA={{ label: "Visit Product", href: "https://www.mind-fuel.app" }}
        secondaryCTA={{ label: "Explore Academy", href: "/academy" }}
        size="compact"
      />

      <SectionWrapper id="mindfuel" background="default" size="lg" separator>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Now live
            </div>
            <h2 className="heading-lg mb-6">Built for reflection, not noise.</h2>
            <p className="mb-8 max-w-xl text-lg leading-8 text-white/60">
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
            <div className="dark-visual relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              <div className="lumyn-soft-glow lumyn-grid absolute inset-0" />
              <div className="relative mx-auto mt-8 w-full max-w-[780px] rounded-[2rem] border border-white/15 bg-black/40 p-3 shadow-2xl">
                <img
                  src="/mindfuel3.png"
                  alt="MindFuel interface"
                  className="aspect-[1599/918] w-full rounded-[1.45rem] object-contain object-center"
                />
              </div>
              <div className="absolute bottom-8 left-6 right-6 rounded-3xl border border-white/10 bg-black/70 p-5 backdrop-blur-xl">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/35">
                  Product principle
                </p>
                <p className="text-2xl font-medium leading-tight text-white">
                  Less performative posting. More useful reflection.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      <SectionWrapper background="secondary" size="lg" separator>
        <Reveal className="mb-10 max-w-3xl">
          <p className="label-sm mb-4 text-white/45">Experience</p>
          <h2 className="heading-md mb-5">What MindFuel is built around.</h2>
          <p className="text-lg leading-8 text-white/60">
            The product is designed as a small but complete social surface:
            readable, expressive, and calmer by default.
          </p>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 70} variant="scale">
              <div className="h-full rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
                <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/35">
                  0{index + 1}
                </p>
                <h3 className="mb-3 text-2xl font-medium tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="leading-7 text-white/60">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
