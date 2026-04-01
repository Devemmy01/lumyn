import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Philosophy",
  description:
    "We build tools that protect your attention, not compete for it. The philosophy behind every Lumyn product — restraint, clarity, and calm by design.",
  keywords: [
    "digital minimalism",
    "calm technology",
    "intentional design",
    "focus software philosophy",
    "attention economy alternative",
  ],
  openGraph: {
    title: "Philosophy — Lumyn",
    description:
      "We build tools that protect your attention. Restraint, clarity, and calm by design.",
  },
};

const principles = [
  {
    number: "01",
    title: "We remove before we add.",
    body: "Every element on a screen costs something. It costs attention, it costs cognitive load, it costs the clarity that makes good thinking possible. Before we add a feature, we ask what we can take away. Subtraction is our primary tool.",
  },
  {
    number: "02",
    title: "We clarify before we scale.",
    body: "A confused product with millions of users is not success. We would rather have a small number of people who genuinely understand and benefit from what we build than a large number who use it out of habit they can't name. Clarity first. Growth follows, or it doesn't.",
  },
  {
    number: "03",
    title: "We respect the person, not the metric.",
    body: "Engagement time is not a proxy for value. The best product interaction is often the shortest one — you came, you found what you needed, you left. We design for that. We would rather you spend ten focused minutes with our product than three distracted hours.",
  },
  {
    number: "04",
    title: "We design for depth, not breadth.",
    body: "There is a version of every product that does everything for everyone. We don't build that. We identify the one thing our products should do better than anything else, and we make it exceptional. Everything else falls away.",
  },
  {
    number: "05",
    title: "We think about what we're doing.",
    body: "Software is not neutral. The tools we build shape how people spend their time, what they notice, and what they ignore. We take that seriously. Every design decision is a values decision. Ours are: protect attention, reduce noise, support good thinking.",
  },
];

export default function PhilosophyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory py-32 md:py-44">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-6 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>Our Philosophy</p>
          <h1 className="heading-display text-charcoal mb-8 text-balance animate-fade-up opacity-0 max-w-4xl"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            Designed to Help You Think.
          </h1>
          <div className="max-w-2xl space-y-5 animate-fade-up opacity-0"
               style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <p className="body-lg text-charcoal-muted">
              Most software competes for your attention.
            </p>
            <p className="body-lg text-charcoal-muted">
              We build tools that protect it.
            </p>
          </div>
        </div>
      </section>

      {/* Full philosophy statement */}
      <SectionWrapper background="tinted" container="narrow">
        <div className="space-y-6 text-lg text-charcoal-muted leading-loose">
          <p>
            Lumyn products are shaped by <strong className="text-charcoal font-medium">restraint</strong>,
            guided by <strong className="text-charcoal font-medium">intelligence</strong>,
            and refined through <strong className="text-charcoal font-medium">simplicity</strong>.
          </p>
          <p>
            We live in an age of extraordinary abundance — of information, of tools, of options.
            That abundance has a shadow side. More information does not mean more understanding.
            More features do not mean more capability. More time on an app does not mean more value received.
          </p>
          <p>
            The bottleneck is no longer access to information. It is the quality of thinking we bring to it.
          </p>
          <p>
            That is what Lumyn is trying to support.
          </p>
          <blockquote className="border-l-2 border-sage pl-6 my-8 text-charcoal italic text-xl">
            We remove before we add.<br />
            We clarify before we scale.
          </blockquote>
          <p>
            These are not slogans. They are the filter through which every product decision passes.
            If a feature adds noise, it doesn't ship. If a flow creates confusion, we redesign until
            it doesn't. If a product does too many things, we cut until it does one thing well.
          </p>
          <p>
            The test we use is simple: does this help the person think, or does it interrupt
            the person thinking?
          </p>
          <p>
            That question eliminates more than half of what would otherwise ship. The rest
            becomes something we're proud of.
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
            The world does not need more software. It needs better software.
          </p>
          <p>
            Software that fits into life without taking it over. Software that completes a job
            and then gets out of the way. Software that makes you more capable without making
            you more dependent.
          </p>
          <p>
            We believe the next important frontier in product design is not capability.
            It is restraint. And we're spending our time exploring it.
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
          headline="If this resonates, we'd like to hear from you."
          subtext="We occasionally take on advisory partnerships and collaborations with people building thoughtful products."
          primaryCTA={{ label: "Start a Conversation", href: "/contact" }}
          variant="dark"
        />
      </SectionWrapper>
    </>
  );
}
