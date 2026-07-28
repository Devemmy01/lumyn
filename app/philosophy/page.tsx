import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";
import InteriorHero from "@/components/InteriorHero";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Product Development Method",
  description:
    "We build products that solve problems. The method behind every Lumyn product — efficiency, impact, and excellence by design.",
  path: "/philosophy",
  keywords: [
    "product studio method",
    "problem solving",
    "software excellence",
    "user-centric design",
    "impactful products",
  ],
});

const jsonLd = buildWebPageJsonLd({
  path: "/philosophy",
  name: "Lumyn Product Development Method",
  description:
    "The Lumyn method for building focused products that solve real problems, respect people's time, and remain useful after launch.",
  keywords: ["product development method", "product strategy", "software excellence"],
});

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="Our method"
        title="Less noise."
        accent="Better outcomes."
        description="We build focused products that solve real problems, respect people’s time, and remain useful long after launch."
        primaryAction={{ label: "See what we build", href: "/products" }}
        secondaryAction={{ label: "Read our thinking", href: "/journal" }}
        signals={["Focus", "Validation", "Ownership"]}
        note="Product principles"
      />

      {/* Full philosophy statement */}
      <SectionWrapper background="secondary" container="narrow">
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
          <blockquote className="my-10 border-l-2 border-[#7c6cf6] pl-6 font-[Georgia] text-2xl italic leading-9 text-[color:var(--text-primary)]">
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
        <div className="mb-14 max-w-3xl">
          <p className="label-sm mb-4">How We Work</p>
          <h2 className="heading-lg text-charcoal">Five Principles</h2>
        </div>

        <div className="border-b border-[color:var(--border-primary)]">
          {principles.map((principle) => (
            <article
              key={principle.number}
              className="group grid grid-cols-1 gap-4 border-t border-[color:var(--border-primary)] py-9 transition-colors duration-300 md:grid-cols-[100px_1fr] md:gap-10 md:px-5"
            >
              <div className="text-4xl font-medium text-[color:var(--text-tertiary)] group-hover:text-[#7c6cf6]
                              transition-colors duration-300 tabular-nums tracking-tight">
                {principle.number}
              </div>
              <div>
                <h3 className="heading-sm mb-3 group-hover:text-[#7c6cf6]
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
      <SectionWrapper background="secondary" container="narrow">
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
        />
      </SectionWrapper>
    </>
  );
}
