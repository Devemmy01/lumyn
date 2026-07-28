"use client";

import Link from "next/link";
import LumynLogo from "@/components/LumynLogo";
import AcademyAuthForm from "@/components/academy/AcademyAuthForm";
import AstraMascot from "@/components/academy/AstraMascot";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";
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
    <main className="academy-app-font academy-auth-shell relative min-h-screen overflow-hidden bg-[#f6f3ff] text-[#15131f] dark:bg-[#06060d] dark:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#fbfaff_0%,#ede9ff_52%,#f5f1ff_100%)] dark:bg-[linear-gradient(135deg,#080711_0%,#10101a_48%,#090713_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(124,108,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(124,108,246,0.18)_1px,transparent_1px)] [background-size:88px_88px] dark:opacity-[0.1]" />

      <header className="relative z-10 mx-auto flex h-20 max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link href="/academy" aria-label="Academy home" className="inline-flex items-center gap-3">
          <LumynLogo compact />
        </Link>
        <Link href="/academy" className="rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-bold text-[#5d5670] shadow-sm backdrop-blur transition hover:border-[#7c6cf6]/35 hover:text-[#6757df] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 dark:hover:text-white">
          Web home
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1120px] items-center px-5 pb-10 pt-2 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-[2.25rem] border border-black/[0.08] bg-white/76 shadow-[0_34px_120px_rgba(55,44,112,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#10101a]/90 dark:shadow-[0_42px_150px_rgba(0,0,0,0.48)] lg:grid-cols-[0.92fr_0.82fr]">
          <section className="relative overflow-hidden p-6 sm:p-8 lg:p-10">

            <div className="relative flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6757df] dark:text-[#b9b1ff]">Lumyn Academy</p>
                <h1 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-[#15131f] dark:text-white sm:text-5xl">
                  Sign in and continue your path.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-[#625b72] dark:text-white/58">
                  Build a course around your goal, ask {ACADEMY_TUTOR_NAME} for help,
                  and keep your progress in one installable dashboard.
                </p>
              </div>
              <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-white to-[#ded9ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_20px_60px_rgba(76,61,158,0.2)] dark:from-white/[0.08] dark:to-[#7c6cf6]/[0.16] sm:flex">
                <AstraMascot expression="happy" className="h-32 w-32 translate-y-1" />
              </div>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.07] p-4 dark:border-white/10 dark:bg-white/[0.045] sm:p-5">
              <div className="relative flex gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.55rem] bg-gradient-to-br from-white to-[#dcd7ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_16px_42px_rgba(76,61,158,0.2)] dark:from-white/[0.14] dark:to-[#7c6cf6]/[0.22] sm:hidden">
                  <AstraMascot expression="happy" className="h-28 w-28 translate-y-1" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6757df] dark:text-[#b9b1ff]">Astra is ready</p>
                  <p className="mt-2 text-sm leading-6 text-[#625b72] dark:text-white/58">
                    Use your 10 starter points to generate the first path. A complete path costs 10 points.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["10", "starter points"],
                ["10", "points per path"],
                ["PWA", "installable"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-black/[0.08] bg-white/64 p-4 dark:border-white/10 dark:bg-black/20">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-[#6757df] dark:text-[#b9b1ff]">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#6f687f] dark:text-white/45">{label}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-5 grid gap-2 text-sm text-[#625b72] dark:text-white/58 sm:grid-cols-2">
              {["Interactive lessons", "Astra support", "XP progress", "Certificates"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/52 px-3 py-2.5 dark:bg-white/[0.045]">
                  <span className="h-2 w-2 rounded-full bg-[#7c6cf6]" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-black/[0.08] bg-[#131220]/[0.04] p-4 dark:border-white/10 dark:bg-black/20 sm:p-6 lg:border-l lg:border-t-0">
            <div className="mx-auto w-full max-w-[460px]">
              <AcademyAuthForm />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export function OverviewMetricRail({ progress, completedModules, moduleCount, quizAverage, pendingAssignments }: { progress: number; completedModules: number; moduleCount: number; quizAverage: number | null; pendingAssignments: number }) {
  const metrics = [
    { label: "Path progress", value: `${progress}%`, detail: "overall" },
    { label: "Modules", value: `${completedModules}/${moduleCount}`, detail: "completed" },
    { label: "Quiz signal", value: quizAverage === null ? "—" : `${quizAverage}%`, detail: "average" },
    { label: "Open work", value: String(pendingAssignments), detail: "assignments" },
  ];

  return (
    <section className="mt-6 overflow-hidden border-y border-black/[0.08] dark:border-white/[0.08]" aria-label="Learning metrics">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => <div key={metric.label} className={`relative px-4 py-5 sm:px-6 ${index % 2 === 0 ? "border-r border-black/[0.08] dark:border-white/[0.08]" : ""} ${index < 2 ? "border-b border-black/[0.08] lg:border-b-0 dark:border-white/[0.08]" : ""} ${index === 1 ? "lg:border-r" : ""} ${index === 2 ? "lg:border-r" : ""}`}><span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[#7c6cf6] opacity-0 transition group-hover:opacity-100" /><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">{metric.label}</p><div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{metric.value}</span><span className="text-[10px] text-neutral-400">{metric.detail}</span></div></div>)}
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
