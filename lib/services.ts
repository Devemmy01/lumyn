export interface ServicePage {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string[];
  hero: string;
  subhero: string;
  overview: string[];
  deliverables: string[];
  technologies: string[];
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
    overview: [
      "Off-the-shelf tools work until your process becomes the constraint. Custom software gives your team a system shaped around the way the business actually operates, instead of forcing important workflows into a collection of spreadsheets and disconnected subscriptions.",
      "Lumyn takes a product-led approach: we clarify the operational problem, identify the smallest valuable release, and build a maintainable foundation that can evolve with real usage. The result may be an internal operations platform, a customer portal, an automation system, or a complete software product.",
    ],
    deliverables: [
      "Product requirements and prioritized delivery roadmap",
      "User experience flows and responsive interface design",
      "Secure front-end, back-end, database, and API implementation",
      "Third-party service and business-system integrations",
      "Quality assurance, production deployment, and handover documentation",
      "Post-launch measurement, optimization, and roadmap support",
    ],
    technologies: ["Next.js and React", "TypeScript and Node.js", "MongoDB and modern data stores", "Secure APIs and third-party integrations", "Cloud deployment and analytics"],
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
      {
        question: "How do you estimate a custom software project?",
        answer:
          "We estimate after discovery, when the primary workflows, integrations, risks, and first-release scope are clear. Phased estimates keep cost tied to concrete outcomes instead of a vague feature list.",
      },
      {
        question: "Can you improve an existing software product?",
        answer:
          "Yes. We can assess an existing codebase, identify performance and usability constraints, and recommend whether to improve it incrementally or replace specific parts.",
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
    overview: [
      "A useful minimum viable product is not a rough version of every idea on the roadmap. It is the smallest credible product that lets a founder test a specific customer problem, observe real behavior, and decide what deserves further investment.",
      "Lumyn turns an early concept into a focused release plan, then designs and engineers the core journey needed for pilot users. We keep the architecture production-ready while protecting the schedule from low-value features, so the first launch produces evidence rather than months of hidden development.",
    ],
    deliverables: [
      "Problem definition, audience assumptions, and measurable success criteria",
      "Feature prioritization and a lean MVP product roadmap",
      "Clickable user flows and responsive product interface",
      "Production-ready full-stack MVP development",
      "Authentication, payments, analytics, or integrations where required",
      "Launch support and an evidence-based post-MVP roadmap",
    ],
    technologies: ["Next.js and React", "TypeScript and Node.js", "MongoDB and managed databases", "Authentication and payment platforms", "Product analytics and cloud deployment"],
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
      {
        question: "How quickly can an MVP launch?",
        answer:
          "A focused MVP commonly takes 6–12 weeks. The exact schedule depends on the number of core workflows, integrations, compliance needs, and how quickly product decisions are made.",
      },
      {
        question: "Do you work with non-technical founders?",
        answer:
          "Yes. We translate the product idea into clear user flows, technical decisions, milestones, and tradeoffs so a founder can make informed decisions without managing implementation details.",
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
    overview: [
      "Modern web applications can deliver complex, app-like workflows through any current browser. They are a strong fit for SaaS products, customer portals, marketplaces, dashboards, and internal systems that need one maintainable product across desktop and mobile devices.",
      "Lumyn handles the complete application layer—from interaction design and reusable interface systems to APIs, databases, authentication, and deployment. Performance, accessibility, security, and maintainability are considered from the first architecture decisions instead of added after launch.",
    ],
    deliverables: [
      "Application architecture and technical delivery plan",
      "Responsive UX and reusable interface components",
      "Front-end, API, database, and authentication development",
      "Role-based access and third-party integrations",
      "Automated and manual quality assurance",
      "Production deployment, monitoring, and performance optimization",
    ],
    technologies: ["Next.js, React, and TypeScript", "Node.js APIs", "MongoDB and suitable relational data stores", "Firebase and secure authentication", "Vercel and modern cloud infrastructure"],
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
      {
        question: "Can you integrate our existing business tools?",
        answer:
          "Yes. We can connect suitable CRMs, payment providers, analytics tools, email platforms, internal APIs, and other systems after reviewing their access and technical constraints.",
      },
      {
        question: "How do you make web applications fast?",
        answer:
          "We combine sensible rendering and caching strategies, optimized assets, efficient data access, performance budgets, and real-world monitoring. The exact approach depends on the application's content and interaction model.",
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
    overview: [
      "A progressive web app is a web application enhanced with capabilities such as installation, resilient caching, offline behavior, and device integration. Users can open it from a link and, on supported devices, add it to their home screen without an app-store download.",
      "Lumyn starts with the user journeys that must remain reliable, then designs an explicit caching and update strategy around them. That matters because a service worker is not a magic performance switch: poor cache rules can serve stale data or break critical actions. We build and test the experience for real connectivity conditions.",
    ],
    deliverables: [
      "PWA readiness and browser-capability assessment",
      "Web app manifest, icons, and installation experience",
      "Service worker with deliberate caching and update behavior",
      "Offline states for appropriate product journeys",
      "Responsive, accessible, mobile-first interface",
      "Installability, performance, and cross-browser testing",
    ],
    technologies: ["Next.js and React", "Web app manifests", "Service workers and Cache APIs", "Responsive web platform APIs", "Performance monitoring and analytics"],
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
      {
        question: "Can users install a PWA on iPhone and Android?",
        answer:
          "Supported installation flows differ by browser and operating system, but modern iPhone and Android devices can add suitable PWAs to the home screen. We design clear guidance for the supported experience.",
      },
      {
        question: "Does a PWA need an app store?",
        answer:
          "No. A PWA can be discovered and installed directly from the web. Store packaging can be considered separately when distribution requirements make it useful.",
      },
    ],
  },
];

export const servicesBySlug = Object.fromEntries(
  services.map((service) => [service.slug, service])
) as Record<string, ServicePage>;
