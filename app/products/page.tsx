import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import SectionWrapper from "@/components/SectionWrapper";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Lumyn's suite of calm, intelligent tools — Mindfuel, Summai, and EdTurbo. Built to help you think, learn, and focus deeply.",
  openGraph: {
    title: "Products — Lumyn",
    description:
      "Calm, intelligent tools designed to remove noise and restore clarity.",
  },
};

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "beta" | "development";
  accentColor: string;
  features: string[];
  availability: string;
  image?: string;
  url?: string;
  techStack?: string;
  motive?: {
    title: string;
    desc: string;
  }[];
};

const products: Product[] = [
  {
    id: "mindfuel",
    name: "MindFuel",
    tagline: "A Full Stack Social PWA – Reclaiming social media for the human soul.",
    description:
      "MindFuel is a quiet corner of the internet built for thinkers, reflectors, and curators. Instead of chasing likes or stressing you out, it uses a Calm Decay system to surface content that stands the test of time. You can turn your ideas into beautiful Thought Cards to share something that actually matters.",
    status: "live",
    accentColor: "#7C6CF6",
    features: [
      "Smart Feed algorithm with Calm Decay",
      "Thought Card Creator with fluid micro-animations",
      "Web Push API for real-time notifications",
      "Performance-optimised backend infrastructure",
      "Scalable, accessible design system",
    ],
    availability: "Now live — visit the platform",
    image: "/mindfuel.png",
    url: "https://www.mind-fuel.app",
    techStack: "Next.js 15, React 19, TypeScript, Tailwind CSS 4, MongoDB, Next-PWA, Resend, Radix UI, Framer Motion",
    motive: [
      {
        title: "Connection Over Metrics",
        desc: "We believe your value isn't a number on a post. We care more about what you're saying than how many people clicked a heart button."
      },
      {
        title: "Calm Over Chaos",
        desc: "Our feed doesn't try to stress you out. It uses a Calm Decay system, prioritizing quality and thoughtful reflections."
      },
      {
        title: "Mental Clarity",
        desc: "Leave the app feeling better than when you opened it. More inspired, more thoughtful, and maybe a little more at peace."
      }
    ]
  },
  {
    id: "summai",
    name: "Summai",
    tagline: "Turn long articles and information overload into clear, concise insights.",
    description:
      "Paste any article, PDF, or long-form text. Summai uses intelligent summarisation to extract the key ideas and deliver them clearly — so you spend time understanding, not reading.",
    status: "beta",
    accentColor: "#5B7FA6",
    features: [
      "Intelligent article summarisation",
      "Key point extraction",
      "Reading time reduction",
      "Multi-format support (URL, PDF, text)",
      "Save and revisit summaries",
    ],
    availability: "Now in beta — request early access",
  },
  {
    id: "edturbo",
    name: "EdTurbo",
    tagline: "Master any topic faster through microlearning.",
    description:
      "EdTurbo is a microlearning platform for secondary and tertiary students. Short lessons, visual summaries, and adaptive smart quizzes help you build real understanding — not just memorise answers.",
    status: "beta",
    accentColor: "#2A9D8F",
    features: [
      "Turbo Lessons — bite-sized, high-impact lessons",
      "Smart Quizzes — adaptive questions that target weak spots",
      "Progress Tracker — see exactly how far you've come",
      "Study Groups — learn together, stay accountable",
      "Leaderboard — friendly competition that motivates",
      "AI Study Assistant — get help any time, on any topic",
    ],
    availability: "Now in beta — request early access",
  },
];

const statusConfig = {
  live: { label: "Live", dotClass: "bg-green-500", textClass: "text-green-700" },
  beta: { label: "Beta", dotClass: "bg-amber-500", textClass: "text-amber-700" },
  development: { label: "In Development", dotClass: "bg-sage", textClass: "text-sage-dark" },
};

export default function ProductsPage() {
  return (
    <>
      <Hero
        badge="Products"
        headline="Tools That Protect Your Attention."
        subheadline="Each Lumyn product starts with the same constraint: what can we remove? The result is software that helps you think, not just do."
        size="compact"
      />

      {/* Product list */}
      <SectionWrapper background="default">
        <div className="space-y-24 md:space-y-36">
          {products.map((product, i) => {
            const status = statusConfig[product.status];
            const isEven = i % 2 === 0;

            return (
              <div
                key={product.id}
                id={product.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text */}
                <div className={!isEven ? "lg:order-2" : ""}>
                  {/* Status */}
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className={`w-2 h-2 rounded-full ${status.dotClass} inline-block`}
                      aria-hidden="true"
                    />
                    <span className={`text-xs font-medium tracking-wide ${status.textClass}`}>
                      {status.label}
                    </span>
                  </div>

                  <h2 className="heading-lg text-charcoal mb-3">{product.name}</h2>
                  <p className="text-lg text-charcoal-muted font-medium mb-4 leading-snug">
                    {product.tagline}
                  </p>
                  <p className="body-md mb-8">{product.description}</p>

                  {/* Architecture & Motive Sections for MindFuel */}
                  {product.techStack && (
                    <div className="mb-8">
                      <p className="text-sm font-semibold text-charcoal mb-2 uppercase tracking-wide">Tech Stack</p>
                      <p className="text-sm text-charcoal-muted mb-6">{product.techStack}</p>
                      
                      <div className="space-y-4">
                        {product.motive?.map((m) => (
                          <div key={m.title}>
                            <p className="text-sm font-semibold text-charcoal">{m.title}</p>
                            <p className="text-sm text-charcoal-muted">{m.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {!product.techStack && (
                    <ul className="space-y-3 mb-10" aria-label={`${product.name} features`}>
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-charcoal-muted">
                          <svg
                            width="16" height="16" viewBox="0 0 16 16" fill="none"
                            className="mt-0.5 shrink-0 text-sage"
                            aria-hidden="true"
                          >
                            <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="text-sm text-charcoal-muted/70 italic mb-6">
                    {product.availability}
                  </p>

                  <Link href={product.status === "live" ? (product.url || `https://${product.id}.com`) : "/contact"} className={product.status === "live" ? "btn-primary" : "btn-primary"}>
                    {product.status === "live" ? "Visit App" : "Express Interest"}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                {/* Visual card */}
                <div
                  className={`${!isEven ? "lg:order-1" : ""}`}
                  aria-hidden="true"
                >
                  <div
                    className="rounded-3xl aspect-[4/3] flex items-center justify-center
                               shadow-soft-lg relative overflow-hidden"
                    style={{ backgroundColor: `${product.accentColor}12` }}
                  >
                    {product.image ? (
                      <div className="absolute inset-0 w-full h-full">
                        {/* Use img for simplicity here or next/image if imported, but img is safe */}
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-left-top shadow-xl rounded-tr-xl border border-white/10"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Decorative background */}
                        <div
                          className="absolute inset-0 bg-dots opacity-50"
                          style={{ color: product.accentColor }}
                        />

                        {/* Product icon */}
                        <div className="relative text-center">
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center
                                       text-white font-bold text-3xl mx-auto mb-4 shadow-soft-md"
                            style={{ backgroundColor: product.accentColor }}
                          >
                            {product.name.charAt(0)}
                          </div>
                          <p className="font-semibold text-charcoal text-lg tracking-tight">
                            {product.name}
                          </p>
                          <p className="text-sm text-charcoal-muted mt-1">
                            {product.tagline.split(".")[0]}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper background="tinted" size="sm">
        <CTA
          headline="Something missing? We'd love to hear from you."
          subtext="If there's a problem you're facing that fits the Lumyn philosophy, reach out. We're always thinking about what to build next."
          primaryCTA={{ label: "Start a Conversation", href: "/contact" }}
          secondaryCTA={{ label: "Read our Philosophy", href: "/philosophy" }}
        />
      </SectionWrapper>
    </>
  );
}
