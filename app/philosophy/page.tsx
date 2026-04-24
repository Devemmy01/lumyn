import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Method",
  description:
    "We build products that solve problems. The method behind every Lumyn product — efficiency, impact, and excellence by design.",
  keywords: [
    "product studio method",
    "problem solving",
    "software excellence",
    "user-centric design",
    "impactful products",
  ],
  openGraph: {
    title: "Our Method — Lumyn",
    description:
      "We build products that solve problems. Efficiency, impact, and excellence by design.",
  },
};

const principles = [
  {
    number: "01",
    title: "We prioritize what matters.",
    body: "Every feature, every button, every line of code must serve a clear purpose. We focus on the core functionality that delivers the most value to the user. We don't build fluff.",
  },
  {
    number: "02",
    title: "We validate before we scale.",
    body: "We believe in building the right thing before building it big. We test our assumptions, gather feedback, and iterate until we've found the most effective solution. Growth is a result of excellence, not a goal in itself.",
  },
  {
    number: "03",
    title: "We respect the user's time.",
    body: "The best product interaction is the one that gets the job done fastest. We design for efficiency and clarity, ensuring users can achieve their goals with minimal friction. We don't optimize for engagement; we optimize for utility.",
  },
  {
    number: "04",
    title: "We build for performance and durability.",
    body: "Software should be fast, reliable, and built to last. we use modern technologies and best practices to ensure our products perform under pressure and stand the test of time.",
  },
  {
    number: "05",
    title: "We take ownership of the outcome.",
    body: "We don't just ship code; we ship solutions. We take responsibility for the impact our products have and are committed to delivering results that exceed expectations.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory py-32 md:py-44">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-6 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>Our Method</p>
          <h1 className="heading-display text-charcoal mb-8 text-balance animate-fade-up opacity-0 max-w-4xl"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            Engineered for Results.
          </h1>
          <div className="max-w-2xl space-y-5 animate-fade-up opacity-0"
               style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <p className="body-lg text-charcoal-muted">
              We build products that solve problems.
            </p>
            <p className="body-lg text-charcoal-muted">
              Impact-driven, user-centric, and built to last.
            </p>
          </div>
        </div>
      </section>

      {/* Full philosophy statement */}
      <SectionWrapper background="tinted" container="narrow">
        <div className="space-y-6 text-lg text-charcoal-muted leading-loose">
          <p>
            Lumyn products are shaped by <strong className="text-charcoal font-medium">efficiency</strong>,
            guided by <strong className="text-charcoal font-medium">intelligence</strong>,
            and refined through <strong className="text-charcoal font-medium">rigorous testing</strong>.
          </p>
          <p>
            We live in an age where technology is everywhere, but truly effective solutions are rare.
            We believe that the best products are those that solve a specific problem exceptionally well.
          </p>
          <p>
            The bottleneck is no longer capability; it is focus and execution.
          </p>
          <p>
            That is what Lumyn is trying to deliver.
          </p>
          <blockquote className="border-l-2 border-sage pl-6 my-8 text-charcoal italic text-xl">
            We validate before we scale.<br />
            We optimize for impact.
          </blockquote>
          <p>
            These are not slogans. They are the filter through which every product decision passes.
            If a feature doesn't add value, it doesn't ship. If a flow creates friction, we redesign until
            it's seamless. If a product does too many things, we focus it until it does one thing exceptionally.
          </p>
          <p>
            The test we use is simple: does this solve the problem effectively and efficiently?
          </p>
          <p>
            That question defines everything we build.
          </p>
        </div>
      </SectionWrapper>

      {/* Principles */}
      <SectionWrapper background="default">
        <div className="text-center mb-14">
          <p className="label-sm mb-4">How We Work</p>
          <h2 className="heading-lg text-charcoal">Five Principles</h2>
        </div>

        <div className="space-y-px">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="group grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 md:gap-10
                         py-10 border-t border-stone/60 hover:bg-ivory-200/50
                         transition-colors duration-300 px-0 md:px-4 rounded-xl"
            >
              <div className="text-4xl font-semibold text-stone group-hover:text-sage
                              transition-colors duration-300 tabular-nums tracking-tight">
                {principle.number}
              </div>
              <div>
                <h3 className="heading-sm text-charcoal mb-3 group-hover:text-sage-dark
                               transition-colors duration-200">
                  {principle.title}
                </h3>
                <p className="text-charcoal-muted leading-relaxed text-base md:text-lg">
                  {principle.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      {/* On building */}
      <SectionWrapper background="tinted" container="narrow">
        <p className="label-sm mb-6">On Building</p>
        <h2 className="heading-md text-charcoal mb-6">
          Why We Build Software at All
        </h2>
        <div className="space-y-5 text-charcoal-muted leading-relaxed text-base md:text-lg">
          <p>
            The world does not need more software. It needs better solutions.
          </p>
          <p>
            Products that integrate seamlessly into workflows. Software that delivers value without complexity.
            Tools that empower users rather than distracting them.
          </p>
          <p>
            We believe the next important frontier in product design is execution and impact.
            And we're spending our time perfecting it.
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="btn-primary">
            See What We Build
          </Link>
          <Link href="/journal" className="btn-secondary">
            Read the Journal
          </Link>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper background="default" size="sm">
        <CTA
          headline="Ready to build something that works?"
          subtext="We occasionally take on partnerships and collaborations with people building high-impact products."
          primaryCTA={{ label: "Start a Conversation", href: "/contact" }}
          variant="dark"
        />
      </SectionWrapper>
    </>
  );
}
