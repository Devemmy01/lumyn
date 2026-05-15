export interface ServicePage {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
  hero: string;
  subhero: string;
  idealFor: string[];
  outcomes: string[];
  process: string[];
  faq: Array<{ question: string; answer: string }>;
}

export const services: ServicePage[] = [
  {
    slug: "custom-software-development",
    name: "Custom Software Development",
    title: "Custom Software Development Services",
    description:
      "Build scalable custom software products that automate operations, improve efficiency, and unlock growth for your business.",
    keywords: [
      "custom software development",
      "software development agency",
      "business software solutions",
      "enterprise web application development",
      "hire software developers",
    ],
    hero: "Custom Software Built for Your Business Goals",
    subhero:
      "We design and build tailored software systems for companies that need reliability, speed, and measurable business impact.",
    idealFor: [
      "Founders launching a software product",
      "Teams replacing spreadsheets and manual workflows",
      "Businesses modernizing legacy systems",
      "Companies integrating multiple tools into one product",
    ],
    outcomes: [
      "Operational efficiency through automation",
      "Faster internal workflows and reduced overhead",
      "Scalable architecture for long-term growth",
      "Better customer experience with streamlined product journeys",
    ],
    process: [
      "Discovery and business requirement mapping",
      "Architecture and UX planning",
      "Iterative development and testing",
      "Launch, optimization, and ongoing improvements",
    ],
    faq: [
      {
        question: "How long does a custom software project take?",
        answer:
          "Most projects launch in phases. MVPs typically take 6-12 weeks depending on complexity.",
      },
      {
        question: "Do you provide post-launch support?",
        answer:
          "Yes. We provide iterative support, optimization, and roadmap execution after launch.",
      },
    ],
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    title: "MVP Development for Startups and Founders",
    description:
      "Launch your MVP fast with a focused product strategy, modern engineering, and a roadmap designed for traction and validation.",
    keywords: [
      "MVP development",
      "startup MVP",
      "build MVP product",
      "startup product development",
      "minimum viable product agency",
    ],
    hero: "Launch Your MVP Without Wasting Months",
    subhero:
      "We help founders and teams ship investor-ready and user-ready MVPs quickly, with the right scope and architecture.",
    idealFor: [
      "Early-stage startups validating demand",
      "Founders preparing for fundraising",
      "Teams needing a working product for pilot customers",
      "Businesses testing a new digital product line",
    ],
    outcomes: [
      "Shorter time-to-market",
      "Validated product assumptions",
      "Lean architecture that supports future scaling",
      "Clear metrics and next-step roadmap after launch",
    ],
    process: [
      "MVP scoping and feature prioritization",
      "Rapid design and prototype validation",
      "Lean full-stack product development",
      "Launch, analytics setup, and iteration",
    ],
    faq: [
      {
        question: "What should be included in an MVP?",
        answer:
          "Only the features required to solve a core user problem and validate demand quickly.",
      },
      {
        question: "Can the MVP evolve into a full product?",
        answer:
          "Yes. We build MVPs with production-grade foundations so expansion is straightforward.",
      },
    ],
  },
  {
    slug: "web-application-development",
    name: "Web Application Development",
    title: "Web Application Development Services",
    description:
      "Build high-performance web applications with modern UX, secure backend architecture, and scalable infrastructure.",
    keywords: [
      "web application development",
      "full stack web app development",
      "next.js development agency",
      "react development services",
      "build web app for business",
    ],
    hero: "High-Performance Web Apps That Drive Growth",
    subhero:
      "From customer portals to internal platforms, we build web apps that are fast, intuitive, and built for scale.",
    idealFor: [
      "SaaS businesses launching new products",
      "Teams building customer dashboards",
      "Companies with internal operations platforms",
      "Businesses upgrading slow or outdated web systems",
    ],
    outcomes: [
      "Fast and reliable product performance",
      "Improved conversion through cleaner UX",
      "Secure and maintainable full-stack architecture",
      "Reduced engineering debt through modern best practices",
    ],
    process: [
      "Product and UX discovery",
      "Front-end and back-end architecture setup",
      "Feature development and QA",
      "Deployment, monitoring, and optimization",
    ],
    faq: [
      {
        question: "Which stack do you use?",
        answer:
          "We commonly use Next.js, React, TypeScript, Node.js, and MongoDB based on the product's needs.",
      },
      {
        question: "Do you handle design too?",
        answer:
          "Yes. We provide UX and UI design as part of end-to-end web application delivery.",
      },
    ],
  },
  {
    slug: "pwa-development",
    name: "PWA Development",
    title: "Progressive Web App (PWA) Development",
    description:
      "Build installable, offline-capable progressive web apps that deliver app-like performance across devices.",
    keywords: [
      "PWA development",
      "progressive web app agency",
      "installable web app",
      "offline web app",
      "mobile web app development",
    ],
    hero: "App-Like Experiences on the Web",
    subhero:
      "We build progressive web apps that load fast, work offline, and improve user retention without app-store friction.",
    idealFor: [
      "Businesses serving mobile-first audiences",
      "Teams wanting native-like UX without native costs",
      "Products needing offline or low-connectivity support",
      "Companies optimizing performance and engagement",
    ],
    outcomes: [
      "Faster load times and stronger Core Web Vitals",
      "Higher retention through install prompts",
      "Offline support and resilient user experience",
      "Lower maintenance costs versus separate native apps",
    ],
    process: [
      "PWA capability audit and requirements",
      "Service worker and caching strategy",
      "App shell development and optimization",
      "Installability tuning and performance monitoring",
    ],
    faq: [
      {
        question: "Can a PWA replace a native app?",
        answer:
          "For many use cases, yes. PWAs provide excellent performance and installability with faster delivery cycles.",
      },
      {
        question: "Will it work offline?",
        answer:
          "Yes. We configure caching and offline behavior based on your product's core user flows.",
      },
    ],
  },
];

export const servicesBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service])
) as Record<string, ServicePage>;
