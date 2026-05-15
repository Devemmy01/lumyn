import { promises as fs } from "fs";
import path from "path";

interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  content: string;
}

const drafts: Draft[] = [
  {
    title: "How Much Does Custom Software Development Cost in 2026?",
    slug: "custom-software-development-cost-2026",
    excerpt:
      "A practical breakdown of custom software development costs, what drives pricing, and how business owners can avoid expensive mistakes.",
    tags: ["custom-software-development", "software-cost", "business-growth"],
    content: `## Why Cost Questions Matter

Most business owners ask the wrong first question: "How much will this cost?".

The better question is: "What outcome do I need, and what is the fastest path to it?".

When scoped properly, custom software is not just a cost center. It is a growth and efficiency engine.

## Typical Cost Ranges

Pricing depends on complexity, integrations, and delivery timeline.

- **Starter MVP**: $15,000 - $45,000
- **Mid-complexity web platform**: $45,000 - $120,000
- **Enterprise-grade systems**: $120,000+

## What Drives Cost Up

- Unclear requirements and changing scope
- Multiple third-party integrations
- Complex user roles and permissions
- Performance and security requirements
- Missing product strategy before development

## How to Reduce Waste

1. Start with an MVP roadmap.
2. Prioritize core workflows.
3. Validate assumptions with users early.
4. Ship in milestones and iterate.

## Final Thought

The cheapest quote is often the most expensive outcome.

The right software partner helps you spend less by building only what drives business results.
`,
  },
  {
    title: "MVP Development Checklist for Founders: Launch in 12 Weeks",
    slug: "mvp-development-checklist-founders",
    excerpt:
      "A founder-friendly MVP checklist to help you validate your software idea quickly and launch with confidence.",
    tags: ["mvp-development", "startup", "product-strategy"],
    content: `## Build an MVP That Learns Fast

An MVP is not a smaller product. It is a validation system.

Your goal is to prove demand with minimal risk, not to ship every feature idea.

## 12-Week MVP Framework

### Weeks 1-2: Discovery
- Define target users
- Clarify one painful problem
- Map success metrics

### Weeks 3-4: Scope
- Select must-have features only
- Draft user journeys
- Prioritize by business impact

### Weeks 5-10: Build
- Develop in weekly milestones
- Demo and collect feedback continuously
- Keep architecture scalable but lean

### Weeks 11-12: Launch
- Set up analytics and conversion tracking
- Onboard pilot users
- Measure adoption and drop-off points

## Common MVP Mistakes

- Building too many features
- Ignoring analytics setup
- Delaying user testing until after launch
- Optimizing polish over learning speed

## Final Thought

A strong MVP is designed for speed of learning.

The faster you learn, the faster you grow.
`,
  },
  {
    title: "Web App vs PWA: Which Is Better for Your Business?",
    slug: "web-app-vs-pwa-business-guide",
    excerpt:
      "Compare traditional web apps and progressive web apps to choose the right approach for performance, cost, and user experience.",
    tags: ["web-application-development", "pwa-development", "digital-strategy"],
    content: `## The Decision Most Teams Get Wrong

Many teams choose technology based on trend, not business context.

The web app vs PWA choice should be made based on audience behavior, growth goals, and delivery speed.

## Traditional Web Apps

Best for:
- Complex dashboards
- Internal operations tools
- Multi-role SaaS products

Strengths:
- Full flexibility
- Easier complex integrations
- Mature tooling ecosystem

## Progressive Web Apps

Best for:
- Mobile-first products
- Customer engagement platforms
- Products that need offline support

Strengths:
- Installable experiences
- Faster repeat visits with caching
- Better performance on weaker networks

## How to Decide

Choose a **web app** if complexity and workflows are your top priority.

Choose a **PWA** if mobile experience, speed, and retention are your top priority.

In many cases, the best route is a web app architecture with PWA capabilities layered on top.

## Final Thought

Technology is a business decision.

Choose the option that improves revenue, retention, and user experience fastest.
`,
  },
];

async function run() {
  const baseDir = path.join(process.cwd(), "scratch", "seo-drafts");
  await fs.mkdir(baseDir, { recursive: true });

  for (const draft of drafts) {
    const markdown = `---\ntitle: ${draft.title}\nslug: ${draft.slug}\nexcerpt: ${draft.excerpt}\ntags: ${draft.tags.join(", ")}\n---\n\n${draft.content}\n`;

    await fs.writeFile(path.join(baseDir, `${draft.slug}.md`), markdown, "utf8");
    await fs.writeFile(path.join(baseDir, `${draft.slug}.json`), JSON.stringify(draft, null, 2), "utf8");
  }

  const index = {
    generatedAt: new Date().toISOString(),
    count: drafts.length,
    slugs: drafts.map((d) => d.slug),
  };

  await fs.writeFile(path.join(baseDir, "index.json"), JSON.stringify(index, null, 2), "utf8");

  console.log(`Generated ${drafts.length} SEO drafts in ${baseDir}`);
}

run().catch((error) => {
  console.error("Failed to generate SEO drafts:", error);
  process.exit(1);
});
