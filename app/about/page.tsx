import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lumyn is an independent digital studio building calm, intelligent software. We help people think clearly in a noisy world.",
  openGraph: {
    title: "About — Lumyn",
    description:
      "An independent digital studio building tools for clarity and focus.",
  },
};

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory py-32 md:py-44">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-6 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>About Lumyn</p>
          <h1
            className="heading-display text-charcoal mb-8 text-balance animate-fade-up opacity-0 max-w-3xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            We Build Tools That Help People Think.
          </h1>
          <p
            className="body-lg text-charcoal-muted max-w-xl animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Lumyn is an independent digital studio focused on thoughtful software —
            tools that help people navigate a noisy world with clarity.
          </p>
        </div>
      </section>

      {/* Mission */}
      <SectionWrapper background="tinted" container="narrow">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="label-sm mb-5">Who We Are</p>
            <h2 className="heading-lg text-charcoal mb-6">
              An Independent Studio
            </h2>
            <div className="space-y-4 text-charcoal-muted leading-relaxed">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            {teamValues.map((value) => (
              <div key={value.title} className="card-flat">
                <h3 className="font-semibold text-charcoal mb-2 tracking-tight text-sm">
                  {value.title}
                </h3>
                <p className="text-charcoal-muted text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Approach */}
      <SectionWrapper background="tinted" container="narrow">
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
            <div key={step} className="flex gap-6">
              <div className="w-8 h-8 rounded-full bg-sage/15 text-sage-dark flex items-center
                              justify-center text-sm font-semibold shrink-0 mt-0.5">
                {i + 1}
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
          headline="Want to work with us or follow along?"
          subtext="We share thinking through our journal and occasionally take on collaborative work with people building thoughtful products."
          primaryCTA={{ label: "Get in Touch", href: "/contact" }}
          secondaryCTA={{ label: "Read the Journal", href: "/journal" }}
          variant="dark"
        />
      </SectionWrapper>
    </>
  );
}
