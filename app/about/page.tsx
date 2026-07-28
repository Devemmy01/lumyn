import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";
import InteriorHero from "@/components/InteriorHero";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Our Product Studio",
  description:
    "Meet Lumyn, an independent product and software development studio building calm, intelligent digital products, custom software, and learning experiences.",
  path: "/about",
  keywords: ["about Lumyn", "independent product studio", "software development studio"],
});

const jsonLd = buildWebPageJsonLd({
  path: "/about",
  name: "About Lumyn",
  description:
    "Lumyn is an independent product studio building thoughtful software, learning products, and reflection tools with a small craft-led team.",
  pageType: "AboutPage",
  keywords: ["about Lumyn", "independent product studio", "software product studio"],
});

const teamValues = [
  {
    title: "Independence",
    description:
      "We are independent by intention. No venture metrics. No growth-at-all-costs mandate. Just the freedom to build exactly what we believe in.",
  },
  {
    title: "Long-term thinking",
    description:
      "We build for durability. The best tools are the ones you use for years. We design for that relationship.",
  },
  {
    title: "Small by choice",
    description:
      "We are deliberately small. Small teams make better products. They stay closer to the work, make faster decisions, and argue about fewer things.",
  },
  {
    title: "Craft over scale",
    description:
      "We think about quality of output more than quantity. A small number of excellent products beats a large number of mediocre ones every time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="About Lumyn"
        title="Small studio."
        accent="Serious intent."
        description="Lumyn is an independent product studio building thoughtful software that helps people navigate a noisy world with more clarity."
        primaryAction={{ label: "Work with Lumyn", href: "/contact" }}
        secondaryAction={{ label: "See our products", href: "/products" }}
        signals={["Independent", "Long-term", "Craft-led"]}
        note="Studio profile"
      />

      {/* Mission */}
      <SectionWrapper background="secondary" container="narrow">
        <p className="label-sm mb-6">Mission</p>
        <div className="space-y-5 text-charcoal-muted leading-relaxed text-base md:text-lg">
          <p>
            The goal is simple: create tools that help people think clearly in a noisy digital world.
          </p>
          <p>
            We started Lumyn because we were frustrated. Frustrated with software that interrupted
            constantly. Frustrated with dashboards that showed everything and explained nothing.
            Frustrated with apps designed to maximise engagement rather than value.
          </p>
          <p>
            We thought: what would software look like if it was built for the person using it,
            rather than for the company that built it?
          </p>
          <p>
            That question became Lumyn.
          </p>
        </div>
      </SectionWrapper>

      {/* Who we are */}
      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[2rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-6 md:p-8">
            <p className="label-sm mb-5">Who We Are</p>
            <h2 className="heading-md text-charcoal mb-6 max-w-xl">
              Independent by design.
            </h2>
            <div className="space-y-5 text-charcoal-muted leading-relaxed">
              <p>
                Lumyn is a small, independent digital product studio. We don't have investors
                pushing for scale. We don't have a mandate to grow user counts above all else.
              </p>
              <p>
                We have a philosophy we believe in and a set of problems we want to solve.
                The rest follows from that.
              </p>
              <p>
                Our team is small by design. We believe small teams build better products — they
                stay closer to the work, communicate faster, and hold quality to a higher standard
                because they can't hide behind process.
              </p>
              <p>
                Everything we build is designed to earn its place in someone's life. Not to
                demand it.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[color:var(--border-primary)] pt-6">
              {[
                ["Small", "team"],
                ["Long", "view"],
                ["High", "craft"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-medium tracking-tight text-[color:var(--text-primary)] md:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:var(--text-tertiary)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {teamValues.map((value, index) => (
              <article
                key={value.title}
                className="group grid gap-5 rounded-[1.5rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-5 transition duration-300 hover:border-[#7c6cf6]/45 sm:grid-cols-[72px_1fr]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border-primary)] bg-[color:var(--bg-primary)] text-sm font-semibold text-[color:var(--text-tertiary)] transition group-hover:text-[#7c6cf6]">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-medium tracking-tight text-[color:var(--text-primary)]">
                    {value.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">
                    {value.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Approach */}
      <SectionWrapper background="secondary" container="narrow">
        <p className="label-sm mb-6">Our Approach</p>
        <h2 className="heading-md text-charcoal mb-8">
          How We Work
        </h2>
        <div className="space-y-8">
          {[
            {
              step: "Start with the problem",
              detail:
                "Every product begins with a problem worth solving. Not an opportunity worth capitalising on. There's a difference. Problems have a human at the center. Opportunities often don't.",
            },
            {
              step: "Design by subtraction",
              detail:
                "We design by asking what we can remove, not what we can add. The right product is often the one that finds the most direct path between the person and the thing they're trying to do.",
            },
            {
              step: "Build with care",
              detail:
                "Craftsmanship matters. The details that users notice consciously and the ones they don't — both matter. We take time on both.",
            },
            {
              step: "Ship and refine",
              detail:
                "We ship when something is good enough to be genuinely useful. Then we listen. Then we refine. Slowly, carefully, permanently.",
            },
          ].map(({ step, detail }, i) => (
            <div key={step} className="grid gap-4 border-t border-[color:var(--border-primary)] py-7 sm:grid-cols-[64px_1fr]">
              <div className="text-xs font-semibold text-[#7c6cf6]">
                0{i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-2">{step}</h3>
                <p className="text-charcoal-muted leading-relaxed text-sm md:text-base">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper background="default" size="sm">
        <CTA
          headline="Follow our journey"
          subtext="We share thinking through our journal as we build and ship impactful digital products."
          primaryCTA={{ label: "Get in Touch", href: "/contact" }}
          secondaryCTA={{ label: "Read the Journal", href: "/journal" }}
        />
      </SectionWrapper>
    </>
  );
}
