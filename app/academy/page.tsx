import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MentorshipApplicationForm from "@/components/academy/MentorshipApplicationForm";
import {
  academyFaqs,
  academyPlans,
  academyTestimonials,
  howAcademyWorks,
  learningPathModules,
  mentorshipBenefits,
  mentorshipSteps,
} from "@/lib/academy";
import { buildMetadata, serializeJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI-Powered Software Engineering Courses",
  description:
    "Create a personalized software engineering course, build real projects, take assessments, track progress, and learn with an AI tutor or guided mentorship.",
  path: "/academy",
  keywords: [
    "AI software engineering courses",
    "personalized coding course",
    "software engineering mentorship",
    "learn programming with AI",
  ],
});
export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Lumyn Academy",
  url: `${SITE_URL}/academy`,
  description: "A software engineering academy with AI-powered learning paths and guided mentorship.",
  offers: academyPlans.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: plan.price.replace(/[^\d]/g, ""),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: academyFaqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function AcademyPage() {
  return (
    <div className="overflow-hidden mt-5 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }} />

      <section className="relative border-b border-[var(--border-primary)] px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24">
        <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
        <div className="pointer-events-none absolute left-[8%] top-0 h-[32rem] w-[32rem] rounded-full bg-[#7767f5]/15 blur-[130px]" />
        <div className="pointer-events-none absolute right-[-8rem] top-[15%] h-[32rem] w-[32rem] rounded-full bg-sky-400/[0.07] blur-[140px]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#7c6cf6]/20 bg-[#7c6cf6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6a5adc] dark:text-[#bbb3ff]">
                <span className="h-2 w-2 rounded-full bg-[#7c6cf6] shadow-[0_0_18px_rgba(124,108,246,0.75)]" />
                Lumyn Academy
              </div>
              <h1 className="max-w-3xl text-[clamp(3.4rem,6.5vw,7.3rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                Stop collecting tutorials.
                <span className="mt-2 block bg-gradient-to-r from-[#7665ed] via-[#9b74ee] to-[#479fdf] bg-clip-text text-transparent dark:from-[#c4bcff] dark:via-[#9588ff] dark:to-[#75c8ff]">Start building skill.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--text-secondary)] md:text-xl">
                Tell us where you want to go. Lumyn builds the course, projects,
                assessments, and momentum to help you get there.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/academy/sign-in?plan=ai-learning-path" className="btn-primary gap-2">
                  Generate my free course
                  <ArrowIcon />
                </Link>
                <Link href="#mentorship" className="btn-secondary">Explore mentorship</Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--text-tertiary)]">
                {['No fixed curriculum', 'Learn at your level', 'Build portfolio proof'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><CheckIcon />{item}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} variant="scale">
            <CourseStudioPreview />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-8 md:px-12">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["AI-built", "Curriculum"],
            ["Project-first", "Practice"],
            ["Live", "Progress"],
            ["Earned", "Certificates"],
          ].map(([value, label]) => (
            <div key={label} className="border-l border-[#7c6cf6]/35 pl-4 md:pl-6"><p className="text-lg font-semibold md:text-xl">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--text-tertiary)]">{label}</p></div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="relative px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div><p className="label-sm">A better way to learn</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">From curious to capable.</h2></div>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)] lg:justify-self-end">One connected learning loop replaces scattered bookmarks, random videos, and courses that never quite fit.</p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howAcademyWorks.map((step, index) => (
              <Reveal key={step} delay={index * 45} variant="scale">
                <article className={`group relative h-full min-h-60 overflow-hidden rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1 md:p-7 ${index === 0 ? "border-[#7c6cf6]/35 bg-[#7c6cf6]/10" : "border-[var(--border-primary)] bg-[color-mix(in_srgb,var(--text-primary)_3%,transparent)]"}`}>
                  <div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7c6cf6] text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,108,246,0.28)]">{String(index + 1).padStart(2, "0")}</span><span className="text-5xl font-medium text-[color-mix(in_srgb,var(--text-primary)_7%,transparent)]">↗</span></div>
                  <h3 className="mt-14 max-w-xs text-2xl font-medium leading-tight tracking-[-0.025em]">{step}</h3>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="label-sm">Everything stays connected</p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">One workspace. Your whole learning story.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">Generate the path, study the material, ask for help, submit real work, and watch progress become proof.</p>
          </Reveal>
          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <FeatureCard className="lg:col-span-7" eyebrow="Curriculum engine" title="A real course—not a list of links." body="Structured modules, detailed lessons, practical exercises, graded quizzes, assignments, and a final project generated around one outcome." accent>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">{learningPathModules.slice(0, 6).map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3 text-sm"><span className="text-xs font-bold text-[#7c6cf6]">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></div>)}</div>
            </FeatureCard>
            <FeatureCard className="lg:col-span-5" eyebrow="AI tutor" title="Help that knows the lesson." body="Ask for another explanation, a compact example, or a useful hint without leaving the module you are working through.">
              <div className="mt-8 space-y-3"><div className="ml-12 rounded-2xl bg-[#7c6cf6] p-4 text-sm leading-6 text-white">Can you explain state using a real app example?</div><div className="mr-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">Think of a shopping cart: state is the current list of items, and the UI updates whenever that list changes.</div></div>
            </FeatureCard>
            <FeatureCard className="lg:col-span-4" eyebrow="Assessments" title="Know what actually stuck." body="Every module combines checks for understanding with work you can demonstrate." />
            <FeatureCard className="lg:col-span-4" eyebrow="Momentum" title="Progress you can see." body="Completed lessons, quiz scores, submissions, and activity update from real learning events." />
            <FeatureCard className="lg:col-span-4" eyebrow="Proof" title="Finish with something earned." body="Complete the path and final project to unlock a verifiable Lumyn Academy certificate." />
          </div>
        </div>
      </section>

      <section id="learning-options" className="px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="max-w-3xl"><p className="label-sm">Choose your pace</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">Learn independently—or with someone in your corner.</h2></Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {academyPlans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 80} variant="scale">
                <article className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] border p-7 md:p-9 ${index === 0 ? "border-[#7c6cf6]/40 bg-[#7c6cf6]/[0.08] shadow-[0_30px_100px_rgba(124,108,246,0.09)]" : "border-[var(--border-primary)] bg-[color-mix(in_srgb,var(--text-primary)_3%,transparent)]"}`}>
                  {index === 0 && <span className="absolute right-6 top-6 rounded-full bg-[#7c6cf6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Best place to start</span>}
                  <p className="text-sm font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]">{plan.name}</p>
                  <div className="mt-7 flex items-end gap-2"><p className="text-6xl font-medium tracking-[-0.055em]">{plan.price}</p><p className="pb-2 text-sm text-[var(--text-tertiary)]">/{plan.cadence}</p></div>
                  <p className="mt-5 max-w-xl leading-7 text-[var(--text-secondary)]">{plan.description}</p>
                  <div className="my-8 h-px bg-[var(--border-primary)]" />
                  <div className="grid gap-3 sm:grid-cols-2">{plan.includes.map((item) => <p key={item} className="flex items-center gap-2.5 text-sm"><CheckIcon />{item}</p>)}</div>
                  <Link href={plan.href} className={`${index === 0 ? "btn-primary" : "btn-secondary"} mt-9 w-full`}>{plan.cta}<ArrowIcon /></Link>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-7 flex flex-col justify-between gap-4 border-y border-[var(--border-primary)] py-5 text-sm text-[var(--text-secondary)] md:flex-row md:items-center">
            <p><strong className="text-[var(--text-primary)]">Clear monthly pricing:</strong> AI Learning Path is US$5/month after one free course. Guided Mentorship is US$25/month. Subscriptions renew monthly until cancelled.</p>
            <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-2 font-semibold"><Link href="/terms" className="hover:text-[#6c5ce7]">Terms</Link><Link href="/privacy" className="hover:text-[#6c5ce7]">Privacy</Link><Link href="/refund-policy" className="hover:text-[#6c5ce7]">Refunds</Link></div>
          </div>
        </div>
      </section>

      <section id="mentorship" className="px-6 pb-24 md:px-12 md:pb-36">
        <div className="dark-visual relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-[#0b0b10] p-6 text-white shadow-[0_50px_150px_rgba(0,0,0,0.25)] md:p-10 lg:p-14">
          <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-25" /><div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#7c6cf6]/20 blur-[120px]" />
          <div className="relative grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a89eff]">Guided Mentorship</p>
              <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.04em] text-white md:text-6xl">Structure helps. Feedback changes everything.</h2>
              <p className="mt-6 text-lg leading-8 text-white/55">Add weekly human guidance, thoughtful project and code reviews, portfolio direction, and someone who keeps the goal in view.</p>
              <div className="mt-9 grid grid-cols-2 gap-3">{mentorshipBenefits.slice(0, 8).map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/65">{item}</div>)}</div>
              <div className="mt-10 space-y-5">{mentorshipSteps.map((step, index) => <div key={step.title} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#8f82ff]/35 text-xs text-[#b9b1ff]">{index + 1}</span><div><h3 className="font-semibold text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-white/45">{step.description}</p></div></div>)}</div>
            </Reveal>
            <Reveal delay={100} variant="scale"><MentorshipApplicationForm /></Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="label-sm">Student perspective</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">What momentum feels like.</h2></div><p className="max-w-md text-[var(--text-secondary)]">Less guessing. More building, feedback, and visible proof that you are getting better.</p></Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">{academyTestimonials.map((item, index) => <Reveal key={item.name} delay={index * 60} variant="scale"><figure className="h-full rounded-[1.75rem] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-7"><div className="text-3xl text-[#7c6cf6]">“</div><blockquote className="mt-5 text-lg leading-8">{item.quote}</blockquote><figcaption className="mt-8 border-t border-[var(--border-primary)] pt-5"><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-[var(--text-tertiary)]">{item.role}</p></figcaption></figure></Reveal>)}</div>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal><p className="label-sm">Questions, answered</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">Before you begin.</h2></Reveal>
          <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">{academyFaqs.map((faq, index) => <Reveal key={faq.question} delay={index * 35}><details className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold"><span>{faq.question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] text-xl font-light transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 leading-7 text-[var(--text-secondary)]">{faq.answer}</p></details></Reveal>)}</div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <Reveal className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] border border-[#7c6cf6]/25 bg-[#7c6cf6]/10 px-7 py-16 text-center md:px-12 md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[60%] -translate-x-1/2 bg-[#7c6cf6]/20 blur-[100px]" />
          <div className="relative"><p className="label-sm text-[#6c5ce7] dark:text-[#b9b1ff]">Your next chapter</p><h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] md:text-7xl">A clear path is one decision away.</h2><p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">Your first AI-generated course is free. Subscribe only when you are ready to generate more paths.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/academy/sign-in?plan=ai-learning-path" className="btn-primary">Generate my free course <ArrowIcon /></Link><Link href="#mentorship-application" className="btn-secondary">Apply for mentorship</Link></div></div>
        </Reveal>
      </section>
    </div>
  );
}

function CourseStudioPreview() {
  return (
    <div className="relative rounded-[2.25rem] border border-black/10 bg-white/70 p-3 shadow-[0_45px_140px_rgba(51,35,79,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_45px_140px_rgba(0,0,0,0.45)] md:p-5">
      <div className="overflow-hidden rounded-[1.65rem] border border-black/10 bg-[#faf9f7] dark:border-white/10 dark:bg-[#0b0b0f]">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6cf6] text-xs font-bold text-white">LA</div><div><p className="text-sm font-semibold">Learning workspace</p><p className="text-[10px] text-[var(--text-tertiary)]">Frontend engineering path</p></div></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">IN PROGRESS</span></div>
        <div className="grid md:grid-cols-[0.38fr_0.62fr]">
          <div className="border-b border-black/10 p-4 dark:border-white/10 md:border-b-0 md:border-r"><p className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">Course map</p><div className="mt-3 space-y-1">{learningPathModules.slice(0, 5).map((item, index) => <div key={item} className={`rounded-xl px-3 py-3 text-xs ${index === 1 ? "bg-[#7c6cf6] font-semibold text-white" : "text-[var(--text-secondary)]"}`}><span className="mr-2 opacity-50">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div></div>
          <div className="p-5 md:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7c6cf6]">Current module</p><h3 className="mt-2 text-xl font-semibold">JavaScript Basics</h3></div><div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#7c6cf6] text-xs font-bold">42%</div></div><div className="mt-6 space-y-3">{["Variables, values & types", "Functions and scope", "Arrays and objects"].map((lesson, index) => <div key={lesson} className="flex items-center justify-between rounded-xl border border-black/10 p-3 dark:border-white/10"><div className="flex items-center gap-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${index === 0 ? "bg-emerald-500 text-white" : "bg-black/5 text-[var(--text-tertiary)] dark:bg-white/10"}`}>{index === 0 ? "✓" : index + 1}</span><span className="text-xs font-medium">{lesson}</span></div><span className="text-[10px] text-[var(--text-tertiary)]">{index === 0 ? "Done" : "12 min"}</span></div>)}</div><div className="mt-5 rounded-xl bg-[#7c6cf6]/10 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">AI tutor</p><p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">Ask anything about this lesson. I’ll explain it using the course context.</p></div></div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#15151b] sm:block"><p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Quiz average</p><p className="mt-1 text-2xl font-semibold">86%</p></div>
    </div>
  );
}

function FeatureCard({ eyebrow, title, body, className = "", accent = false, children }: { eyebrow: string; title: string; body: string; className?: string; accent?: boolean; children?: React.ReactNode }) {
  return <Reveal variant="scale" className={className}><article className={`h-full rounded-[1.75rem] border p-7 md:p-8 ${accent ? "border-[#7c6cf6]/30 bg-[#7c6cf6]/[0.08]" : "border-[var(--border-primary)] bg-[var(--bg-primary)]"}`}><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">{eyebrow}</p><h3 className="mt-4 text-3xl font-medium tracking-[-0.035em]">{title}</h3><p className="mt-4 leading-7 text-[var(--text-secondary)]">{body}</p>{children}</article></Reveal>;
}

function CheckIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7" stroke="#7c6cf6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ArrowIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
