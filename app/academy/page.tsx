import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import AstraMascot from "@/components/academy/AstraMascot";
import {
  ArrowIcon,
  CheckIcon,
  CourseStudioPreview,
  FeatureCard,
} from "@/components/academy/AcademyLandingParts";
import {
  ACADEMY_POINT_PRICE_CENTS,
  ACADEMY_TUTOR_NAME,
  academyFaqs,
  academyPlans,
  academyTestimonials,
  howAcademyWorks,
  learningPathModules,
  POINTS_PER_GENERATION,
  STARTER_ACADEMY_POINTS,
} from "@/lib/academy";
import {
  buildMetadata,
  buildProductJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
  SITE_URL,
} from "@/lib/seo";

const academyMetadataDescription = `Turn your goals into guided courses across technology, business, design, creative skills, and more—with lessons, practice, assessments, projects, and support from ${ACADEMY_TUTOR_NAME}.`;

const academyMetadataKeywords = [
  "AI learning platform",
  "personalized learning paths",
  "learn new skills with AI",
  "guided online courses",
  "project-based learning",
];

interface AcademyPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: AcademyPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasReferral =
    typeof resolvedSearchParams.ref === "string" &&
    resolvedSearchParams.ref.trim().length > 0;

  return buildMetadata({
    title: hasReferral
      ? "You’re Invited to Lumyn Academy"
      : "Personalized AI Learning Paths",
    description: hasReferral
      ? `You’ve been invited to Lumyn Academy. Build a personalized path for the skills you want to learn—from technology and business to design, creative work, and more—with ${ACADEMY_TUTOR_NAME} by your side.`
      : academyMetadataDescription,
    path: "/academy",
    keywords: academyMetadataKeywords,
    ogImage: "/academy/opengraph-image",
    imageAlt:
      "Lumyn Academy personalized learning paths across technology, business, design, and creative skills",
  });
}
export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    buildWebPageJsonLd({
      path: "/academy",
      name: "Lumyn Academy - Personalized AI Learning Paths",
      description: academyMetadataDescription,
      keywords: academyMetadataKeywords,
    }),
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/academy#educationalorganization`,
      name: "Lumyn Academy",
      url: `${SITE_URL}/academy`,
      description:
        "An AI-powered academy for personalized learning paths across technology, business, design, creative skills, and more.",
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      offers: academyPlans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price.replace(/[^0-9.]/g, "") || "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/academy#learning-options`,
      })),
    },
    buildProductJsonLd({
      name: "Lumyn Academy",
      path: "/academy",
      description: academyMetadataDescription,
      image: "/academy/opengraph-image",
      applicationCategory: "EducationalApplication",
      offers: academyPlans.map((plan) => ({
        name: plan.name,
        price: plan.price.replace(/[^0-9.]/g, "") || "0",
        priceCurrency: "USD",
        url: "/academy#learning-options",
      })),
    }),
  ],
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

function describeGeneratedPathCapacity(points: number) {
  const pathCount = Math.floor(points / POINTS_PER_GENERATION);
  const remainingPoints = points % POINTS_PER_GENERATION;
  const pathLabel = `${pathCount} generated ${pathCount === 1 ? "path" : "paths"}`;

  return remainingPoints > 0
    ? `${pathLabel} + ${remainingPoints} points remaining`
    : pathLabel;
}

function buildAcademyStartHref(referralCode?: string) {
  const params = new URLSearchParams({ plan: "ai-learning-path" });
  if (referralCode) params.set("ref", referralCode);
  return `/academy/dashboard?${params.toString()}`;
}

export default async function AcademyPage({ searchParams }: AcademyPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const referralCode =
    typeof resolvedSearchParams.ref === "string"
      ? resolvedSearchParams.ref.trim()
      : "";
  const academyStartHref = buildAcademyStartHref(referralCode);

  return (
    <div className="academy-app-font overflow-hidden mt-5 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <section className="relative border-b border-[var(--border-primary)] px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-24">
        <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#7c6cf6]/20 bg-[#7c6cf6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#6a5adc] dark:text-[#bbb3ff]">
                <span className="h-2 w-2 rounded-full bg-[#7c6cf6]" />
                Lumyn Academy
              </div>
              <h1 className="max-w-[760px] text-balance text-[clamp(2.85rem,5vw,5.75rem)] font-medium leading-[0.98] tracking-[-0.045em]">
                Learn by building the path
                <span className="bg-gradient-to-r from-[#7665ed] via-[#9b74ee] to-[#479fdf] bg-clip-text text-transparent dark:from-[#c4bcff] dark:via-[#9588ff] dark:to-[#75c8ff]">
                  {" "}
                  made for you.
                </span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-secondary)] md:text-xl">
                Tell Lumyn your goal. We shape it into interactive lessons,
                projects, quizzes, {ACADEMY_TUTOR_NAME} support, and visible
                progress.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={academyStartHref}
                  className="btn-primary gap-2"
                >
                  Start with 10 free points
                  <ArrowIcon />
                </Link>
                <Link href="#learning-options" className="btn-secondary">
                  See point pricing
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--text-tertiary)]">
                {[
                  "No fixed curriculum",
                  "Learn at your level",
                  "Build portfolio proof",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckIcon />
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} variant="scale">
            <div className="relative">
              <CourseStudioPreview />
              <div className="pointer-events-none absolute -bottom-8 -left-5 hidden w-44 rounded-[1.7rem] border border-[#7c6cf6]/20 bg-white/85 p-3 shadow-[0_24px_70px_rgba(53,42,110,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111018]/88 sm:block lg:-bottom-10 lg:-left-8 lg:w-52">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#7c6cf6]/10">
                    <AstraMascot expression="happy" className="h-20 w-20 translate-y-1" priority />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                      Astra
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-secondary)]">
                      Your AI learning assistant
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
            <div
              key={label}
              className="border-l border-[#7c6cf6]/35 pl-4 md:pl-6"
            >
              <p className="text-lg font-semibold md:text-xl">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative px-6 py-24 md:px-12 md:py-36"
      >
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="label-sm">A better way to learn</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                From curious to capable.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[var(--text-secondary)] lg:justify-self-end">
              One connected learning loop replaces scattered bookmarks, random
              videos, and courses that never quite fit.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howAcademyWorks.map((step, index) => (
              <Reveal key={step} delay={index * 45} variant="scale">
                <article
                  className={`group relative h-full min-h-60 overflow-hidden rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1 md:p-7 ${index === 0 ? "border-[#7c6cf6]/35 bg-[#7c6cf6]/10" : "border-[var(--border-primary)] bg-[color-mix(in_srgb,var(--text-primary)_3%,transparent)]"}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7c6cf6] text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,108,246,0.28)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-5xl font-medium text-[color-mix(in_srgb,var(--text-primary)_7%,transparent)]">
                      ↗
                    </span>
                  </div>
                  <h3 className="mt-14 max-w-xs text-2xl font-medium leading-tight tracking-[-0.025em]">
                    {step}
                  </h3>
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
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
              One workspace. Your whole learning story.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              Generate the path, study the material, ask for help, submit real
              work, and watch progress become proof.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <FeatureCard
              className="lg:col-span-7"
              eyebrow="Curriculum engine"
              title="A real course—not a list of links."
              body="Structured modules, detailed lessons, practical exercises, graded quizzes, assignments, and a final project generated around one outcome."
              accent
            >
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {learningPathModules.slice(0, 6).map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3 text-sm"
                  >
                    <span className="text-xs font-bold text-[#7c6cf6]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </FeatureCard>
            <FeatureCard
              className="lg:col-span-5"
              eyebrow={ACADEMY_TUTOR_NAME}
              title="Help that knows the lesson."
              body="Ask for another explanation, a compact example, or a useful hint without leaving the module you are working through."
            >
              <div className="mt-8 space-y-3">
                <div className="ml-12 rounded-2xl bg-[#7c6cf6] p-4 text-sm leading-6 text-white">
                  Can you explain state using a real app example?
                </div>
                <div className="mr-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                  Think of a shopping cart: state is the current list of items,
                  and the UI updates whenever that list changes.
                </div>
              </div>
            </FeatureCard>
            <FeatureCard
              className="lg:col-span-4"
              eyebrow="Assessments"
              title="Know what actually stuck."
              body="Every module combines checks for understanding with work you can demonstrate."
            />
            <FeatureCard
              className="lg:col-span-4"
              eyebrow="Momentum"
              title="Progress you can see."
              body="Completed lessons, quiz scores, submissions, and activity update from real learning events."
            />
            <FeatureCard
              className="lg:col-span-4"
              eyebrow="Proof"
              title="Finish with something earned."
              body="Complete the path and final project to unlock a verifiable Lumyn Academy certificate."
            />
          </div>
        </div>
      </section>

      <section
        id="learning-options"
        className="relative overflow-hidden border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-24 md:px-12 md:py-32"
      >
        <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <Reveal>
            <p className="label-sm">Point-based access</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] md:text-6xl">
              Buy points. Generate when you are ready.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
              No monthly lock-in. New students start with enough points to
              generate their first complete learning path.
            </p>
          </Reveal>
          <Reveal delay={80} variant="scale">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [`${STARTER_ACADEMY_POINTS}`, "free starter points"],
                [`${POINTS_PER_GENERATION}`, "points per path"],
                [
                  `$${((POINTS_PER_GENERATION * ACADEMY_POINT_PRICE_CENTS) / 100).toFixed(2)}`,
                  "per generated course",
                ],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5 shadow-sm"
                >
                  <p className="text-4xl font-semibold tracking-[-0.03em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                    {value}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-[1400px] gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal variant="scale">
            <article className="relative overflow-hidden rounded-[2rem] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6 shadow-[0_28px_90px_rgba(40,36,70,0.09)] dark:shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-8">
              <div className="relative grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                    Lumyn points
                  </p>
                  <div className="mt-6 flex items-end gap-2">
                    <p className="text-7xl font-semibold tracking-[-0.05em]">
                      ${(ACADEMY_POINT_PRICE_CENTS / 100).toFixed(2)}
                    </p>
                    <p className="pb-3 text-sm font-semibold text-[var(--text-tertiary)]">
                      per point
                    </p>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">
                    Choose any point amount inside the dashboard. The checkout
                    total updates instantly before Flutterwave opens.
                  </p>
                  <Link
                    href={academyStartHref}
                    className="btn-primary mt-7 w-full justify-center md:w-auto"
                  >
                    Open Academy app <ArrowIcon />
                  </Link>
                </div>
                <div className="grid gap-3">
                  {[10, 25, 50].map((points) => (
                    <div
                      key={points}
                      className="flex items-center justify-between rounded-2xl border border-[var(--border-primary)] bg-[color-mix(in_srgb,var(--text-primary)_3%,transparent)] p-4"
                    >
                      <div>
                        <p className="font-semibold">{points} points</p>
                        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                          {describeGeneratedPathCapacity(points)}
                        </p>
                      </div>
                      <p className="text-xl font-semibold">
                        $
                        {(
                          (Number(points) * ACADEMY_POINT_PRICE_CENTS) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
          <Reveal delay={100} variant="scale">
            <aside className="dark-visual h-full rounded-[2rem] border border-white/10 bg-[#111018] p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)] md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9b1ff]">
                What points unlock
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "AI-generated courses",
                  "Module quizzes",
                  "Project assignments",
                  "Progress tracking",
                  `${ACADEMY_TUTOR_NAME} context`,
                  "Certificates",
                ].map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold text-white"
                  >
                    <CheckIcon />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
              <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-7 text-white/60">
                <strong className="text-white">Starter math:</strong>{" "}
                {STARTER_ACADEMY_POINTS} free points means the first{" "}
                {POINTS_PER_GENERATION}-point course is covered immediately.
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="label-sm">Student perspective</p>
              <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                What momentum feels like.
              </h2>
            </div>
            <p className="max-w-md text-[var(--text-secondary)]">
              Less guessing. More building, feedback, and visible proof that you
              are getting better.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {academyTestimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 60} variant="scale">
                <figure className="h-full rounded-[1.75rem] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-7">
                  <div className="text-3xl text-[#7c6cf6]">“</div>
                  <blockquote className="mt-5 text-lg leading-8">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-8 border-t border-[var(--border-primary)] pt-5">
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                      {item.role}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <p className="label-sm">Questions, answered</p>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">
              Before you begin.
            </h2>
          </Reveal>
          <div className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
            {academyFaqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 35}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                    <span>{faq.question}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-primary)] text-xl font-light transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pt-4 leading-7 text-[var(--text-secondary)]">
                    {faq.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <Reveal className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] border border-[#7c6cf6]/25 bg-[#7c6cf6]/10 px-7 py-16 text-center md:px-12 md:py-24">
          <div className="relative">
            <p className="label-sm text-[#6c5ce7] dark:text-[#b9b1ff]">
              Your next chapter
            </p>
            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium leading-[1.02] tracking-[-0.045em] md:text-7xl">
              A clear path is one decision away.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
              Start with 10 free points. Generate a full AI learning path for 10
              points.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={academyStartHref}
                className="btn-primary"
              >
                Start learning <ArrowIcon />
              </Link>
              <Link href="#learning-options" className="btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
