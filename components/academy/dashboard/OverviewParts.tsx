"use client";

import Link from "next/link";
import AcademyHomeLink from "@/components/academy/AcademyHomeLink";
import AcademyLogo from "@/components/academy/AcademyLogo";
import AcademyAuthForm from "@/components/academy/AcademyAuthForm";
import AcademyThemeToggle from "@/components/academy/AcademyThemeToggle";
import AstraMascot from "@/components/academy/AstraMascot";
import { ACADEMY_TUTOR_NAME, type LearningCursor } from "@/lib/academy";
import { ArrowIcon } from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import type { DashboardCourse } from "@/components/academy/dashboard/types";

export function OverviewHero({
  name,
  course,
  hasGenerationAccess,
  checkoutPending,
  onCheckout,
}: {
  name: string;
  course?: DashboardCourse;
  hasGenerationAccess: boolean;
  checkoutPending: boolean;
  onCheckout: () => void;
}) {
  const progress = course?.progressPercent ?? 0;

  return (
    <section id="overview" className="dark-visual relative isolate overflow-hidden rounded-[1.8rem] bg-[#0e0f15] px-5 py-7 text-white shadow-[0_28px_90px_rgba(38,29,75,0.22)] sm:rounded-[2.2rem] sm:px-9 sm:py-10 lg:min-h-[360px] lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(124,108,246,0.12),transparent_48%)]" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-[#8f82ff]/25" />
      <div className="relative grid items-center gap-8 pb-3 sm:gap-10 sm:pb-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/55 sm:hidden">
            <span className="h-2 w-2 rounded-full bg-[#8f82ff]" />
            {progress}% through this path
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:mt-6 sm:text-5xl lg:text-6xl">Make today count<br /><span className="text-[#9e93ff] hidden md:block">{name.split(" ")[0]}.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">One focused lesson, one honest attempt, one step closer to the work you want to do.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {course ? <Link href="/academy/dashboard/learning" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(124,108,246,0.3)] transition hover:-translate-y-0.5 hover:bg-[#897af8]">Resume my path <ArrowIcon /></Link> : hasGenerationAccess ? <Link href="/academy/dashboard/generate" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white">Build my first path <ArrowIcon /></Link> : <button type="button" onClick={onCheckout} disabled={checkoutPending} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white disabled:opacity-60">{checkoutPending && <LoadingSpinner />}{checkoutPending ? "Opening checkout…" : "Buy points"}</button>}
            {course && <Link href="/academy/dashboard/generate" className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-6 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white">Build a new path</Link>}
          </div>
        </div>
        <div className="relative mx-auto hidden h-56 w-56 items-center justify-center sm:flex lg:h-64 lg:w-64">
          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-5 rounded-full opacity-90" style={{ background: `conic-gradient(#8f82ff ${progress * 3.6}deg, rgba(255,255,255,0.075) 0deg)` }} />
          <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-[#111218]">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-white">{progress}%</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">course progress</span>
          </div>
        </div>
      </div>
      <div className="relative mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5 text-xs text-white/40 sm:mt-9 lg:absolute lg:bottom-8 lg:left-12 lg:mt-5 lg:max-w-[52%] lg:pt-0"><span className="h-px w-8 bg-[#8f82ff]" />{course ? course.course.courseTitle : "Your next learning path starts with a clear goal."}</div>
    </section>
  );
}

export function DashboardAuthScreen() {
  return (
    <main className="academy-app-font academy-auth-shell relative min-h-[100dvh] overflow-hidden bg-[#f6f3ff] text-[#15131f] dark:bg-[#06060d] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#fbfaff_0%,#ede9ff_52%,#f5f1ff_100%)] dark:bg-[linear-gradient(135deg,#080711_0%,#10101a_48%,#090713_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(124,108,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(124,108,246,0.18)_1px,transparent_1px)] [background-size:88px_88px] dark:opacity-[0.1]" />

      <header className="relative z-10 mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:h-20 sm:px-8">
        <AcademyHomeLink label="Open Lumyn Academy in browser" className="inline-flex items-center gap-3">
          <AcademyLogo compact />
        </AcademyHomeLink>
        <AcademyThemeToggle />
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1120px] items-start px-4 pb-8 pt-2 sm:min-h-[calc(100vh-5rem)] sm:items-center sm:px-8 sm:pb-10">
        <div className="grid w-full gap-4 sm:overflow-hidden sm:rounded-[2.25rem] sm:border sm:border-black/[0.08] sm:bg-white/76  sm:backdrop-blur-2xl sm:dark:border-white/10 sm:dark:bg-[#10101a]/90  lg:grid-cols-[0.92fr_0.82fr] lg:gap-0">
          <section className="relative order-2 hidden min-h-[520px] overflow-hidden rounded-[1.7rem] border border-black/[0.08] bg-white/60 p-8 shadow-[0_24px_80px_rgba(55,44,112,0.12)] dark:border-white/10 dark:bg-white/[0.035] md:flex md:flex-col md:justify-between sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none lg:order-1 lg:p-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6757df] dark:text-[#b9b1ff]">
                Lumyn Academy
              </p>
              <h1 className="mt-4 max-w-sm text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#15131f] dark:text-white">
                Meet {ACADEMY_TUTOR_NAME}.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#625b72] dark:text-white/58">
                Your AI learning assistant for lessons, projects, feedback, and
                steady progress.
              </p>
            </div>

            <div className="relative mx-auto my-6 flex h-72 w-72 items-center justify-center">
              <div className="absolute inset-8 rounded-full bg-[#7c6cf6]/15 blur-3xl" />
              <AstraMascot
                expression="happy"
                className="relative h-72 w-72 translate-y-2"
                priority
              />
            </div>

            <div className="relative rounded-[1.6rem] border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.07] p-5 dark:border-white/10 dark:bg-white/[0.045]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6757df] dark:text-[#b9b1ff]">
                Starter access included
              </p>
              <p className="mt-2 text-sm leading-6 text-[#625b72] dark:text-white/58">
                New students get 10 starter points, enough to generate the first
                complete learning path.
              </p>
            </div>
          </section>

          <section className="order-1 rounded-[1.7rem] lg:border border-black/[0.08] bg-white/76 md:p-3 md:shadow-[0_24px_90px_rgba(55,44,112,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#10101a]/92 dark:shadow-[0_30px_110px_rgba(0,0,0,0.45)] sm:rounded-none sm:border-0 sm:border-t sm:bg-[#131220]/[0.04] sm:p-6 sm:shadow-none sm:dark:bg-black/20 lg:order-2 lg:border-l lg:border-t-0 mt-12 sm:mt-0 flex items-center justify-center">
            <div className="mx-auto w-full max-w-[460px]">
              <AcademyAuthForm />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export function OverviewMetricRail({ progress, completedModules, moduleCount, quizAverage, xp, streak }: { progress: number; completedModules: number; moduleCount: number; quizAverage: number | null; xp: number; streak: number }) {
  const metrics = [
    { label: "Path progress", value: `${progress}%`, detail: "overall" },
    { label: "Learning streak", value: `${streak}`, detail: streak === 1 ? "day" : "days" },
    { label: "Total XP", value: String(xp), detail: "earned" },
    { label: "Mastery", value: quizAverage === null ? `${completedModules}/${moduleCount}` : `${quizAverage}%`, detail: quizAverage === null ? "modules" : "quiz avg" },
  ];

  return (
    <section className="mt-6 overflow-hidden border-y border-black/[0.08] dark:border-white/[0.08]" aria-label="Learning metrics">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => <div key={metric.label} className={`relative px-4 py-5 sm:px-6 ${index % 2 === 0 ? "border-r border-black/[0.08] dark:border-white/[0.08]" : ""} ${index < 2 ? "border-b border-black/[0.08] lg:border-b-0 dark:border-white/[0.08]" : ""} ${index === 1 ? "lg:border-r" : ""} ${index === 2 ? "lg:border-r" : ""}`}><span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[#7c6cf6] opacity-0 transition group-hover:opacity-100" /><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">{metric.label}</p><div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{metric.value}</span><span className="text-[10px] text-neutral-400">{metric.detail}</span></div></div>)}
      </div>
    </section>
  );
}

export function DailyQuest({
  course,
  cursor,
  complete,
  streak,
}: {
  course?: DashboardCourse;
  cursor?: LearningCursor;
  complete: boolean;
  streak: number;
}) {
  if (!course) return null;

  const moduleIndex = cursor?.moduleIndex ?? 0;
  const learningModule = course.course.modules[moduleIndex];
  const lesson = learningModule?.lessons[cursor?.lessonIndex ?? 0];
  const mission = cursor?.step === "quiz"
    ? `Pass the ${learningModule?.title ?? "module"} quiz`
    : cursor?.step === "assignment"
      ? `Build the ${learningModule?.title ?? "module"} practice task`
      : cursor?.step === "final_project"
        ? "Make progress on your final project"
        : `Finish ${lesson?.title ?? "your next lesson"}`;

  return (
    <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 gap-4">
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ${complete ? "bg-emerald-500/12" : "bg-orange-500/12"}`} aria-hidden="true">
            {complete ? "✓" : "🔥"}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#6c5ce7] dark:text-[#b9b1ff]">Today&apos;s quest</p>
              <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-300">{streak} {streak === 1 ? "day" : "days"} streak</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold sm:text-xl">{complete ? "Daily goal complete—nice work." : mission}</h2>
            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/45">{complete ? "Come back tomorrow to keep the streak alive." : "One focused activity · about 10–15 min · earns XP"}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[180px_auto] sm:items-center">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400"><span>Daily goal</span><span>{complete ? "1/1" : "0/1"}</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]"><span className="block h-full rounded-full bg-gradient-to-r from-orange-400 to-[#7c6cf6] transition-all" style={{ width: complete ? "100%" : "8%" }} /></div>
          </div>
          <Link href="/academy/dashboard/learning" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#6b5bdd]">
            {complete ? "Keep learning" : "Start quest"} <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OverviewJourney({ course }: { course?: DashboardCourse }) {
  if (!course) {
    return <section className="relative overflow-hidden py-4 sm:py-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7565e8] dark:text-[#a99eff]">Your learning journey</p><h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em]">Turn a goal into a path you can actually finish.</h2><div className="mt-8 flex items-center gap-2 overflow-hidden">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="flex flex-1 items-center gap-2"><span className={`h-3 w-3 shrink-0 rounded-full ${item === 0 ? "bg-[#7c6cf6]" : "border border-black/15 dark:border-white/15"}`} />{item < 4 && <span className="h-px flex-1 border-t border-dashed border-black/15 dark:border-white/15" />}</div>)}</div><Link href="/academy/dashboard/generate" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#6b5bdd] dark:text-[#b9b1ff]">Describe what you want to learn <ArrowIcon /></Link></section>;
  }

  const availableModuleIndex = course.course.modules.findIndex((module) => module.completionStatus !== "completed" && module.completionStatus !== "locked");
  const courseModulesComplete = availableModuleIndex === -1;
  const nextModuleIndex = courseModulesComplete ? Math.max(0, course.course.modules.length - 1) : availableModuleIndex;
  const nextModule = course.course.modules[nextModuleIndex] ?? course.course.modules[0];

  return (
    <section className="relative overflow-hidden py-2 sm:py-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7565e8] dark:text-[#a99eff]">Current journey</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{course.course.courseTitle}</h2><p className="mt-3 text-sm text-neutral-500 dark:text-white/45">{courseModulesComplete ? "All modules complete" : <>Up next: <span className="font-semibold text-neutral-800 dark:text-white/75">{nextModule?.title}</span></>}</p></div>
        <Link href="/academy/dashboard/learning" className="inline-flex h-11 items-center justify-center gap-2 rounded-full w-fit border border-[#7c6cf6] px-5 text-sm font-semibold transition hover:border-[#7c6cf6] hover:text-[#6b5bdd] dark:border-white/12 dark:hover:text-[#b9b1ff] whitespace-nowrap">Open course <ArrowIcon /></Link>
      </div>
      <div className="mt-7 pb-1 lg:hidden">
        <ol className="grid gap-3">
          {course.course.modules.map((module, index) => {
            const complete = module.completionStatus === "completed";
            const current = index === nextModuleIndex;
            return (
              <li key={`${module.title}-${index}`} className="relative">
                {index < course.course.modules.length - 1 && <span className={`absolute left-4 top-9 h-[calc(100%+0.75rem)] w-px ${complete ? "bg-emerald-500/45" : "bg-white/10"}`} />}
                <div className={`relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 rounded-2xl border p-3 ${current ? "border-[#7c6cf6]/45 bg-[#7c6cf6]/10" : "border-white/10 bg-white/[0.025]"}`}>
                  <div className="flex items-center">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${complete ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-[#7c6cf6] bg-[#7c6cf6] text-white" : "border-black/10 bg-white text-neutral-400 dark:border-white/10 dark:bg-white/[0.04]"}`}>{complete ? "✓" : index + 1}</span>
                  </div>
                  <p className={`min-w-0 text-sm font-semibold leading-5 ${current ? "text-[#b9b1ff]" : "text-neutral-500 dark:text-white/45"}`}>{module.title}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-9 hidden overflow-x-auto pb-3 lg:block">
        <ol className="flex min-w-max items-start">
          {course.course.modules.map((module, index) => {
            const complete = module.completionStatus === "completed";
            const current = index === nextModuleIndex;
            return <li key={`${module.title}-${index}`} className="flex w-44 items-start">
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${complete ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-[#7c6cf6] bg-[#7c6cf6] text-white" : "border-black/10 bg-white text-neutral-400 dark:border-white/10 dark:bg-white/[0.04]"}`}>{complete ? "✓" : index + 1}</span>
                  {index < course.course.modules.length - 1 && <span className={`h-px flex-1 ${complete ? "bg-emerald-500/60" : "bg-black/10 dark:bg-white/10"}`} />}
                </div>
                <p className={`mt-3 max-w-36 text-xs font-semibold leading-5 ${current ? "text-[#6655dc] dark:text-[#b9b1ff]" : "text-neutral-500 dark:text-white/40"}`}>{module.title}</p>
              </div>
            </li>;
          })}
        </ol>
      </div>
    </section>
  );
}
