import type { ReactNode } from "react";
import type { GeneratedModule } from "@/lib/academy";
import { buildYouTubeLearningUrl } from "@/components/academy/dashboard/utils";

export type LearningStepId = "lessons" | "quiz" | "assignment" | "astra";

export type LearningStepItem = {
  id: LearningStepId;
  label: string;
  kicker: string;
  description: string;
  status: "active" | "done" | "locked" | "ready";
};

export function ModulePathPicker({
  courseTitle,
  modules,
  activeModule,
  onSelect,
}: {
  courseTitle: string;
  modules: GeneratedModule[];
  activeModule: number;
  onSelect: (index: number) => void;
}) {
  const activeModuleData = modules[activeModule];

  return (
    <details id="modules" className="group rounded-[1.35rem] border border-black/[0.08] bg-white/70 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden sm:p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Course map</p>
          <h2 className="mt-1 truncate text-base font-semibold tracking-[-0.015em] sm:text-lg">
            {activeModuleData ? `Module ${activeModule + 1}: ${activeModuleData.title}` : "Choose a module"}
          </h2>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full border border-black/[0.08] px-3 py-1.5 text-xs font-semibold text-neutral-500 transition group-open:border-[#7c6cf6]/35 group-open:text-[#6c5ce7] dark:border-white/10 dark:text-white/45 dark:group-open:text-[#b9b1ff]">
          {modules.length} modules
          <svg aria-hidden="true" className="size-3.5 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </span>
      </summary>

      <ol className="grid gap-2 border-t border-black/[0.07] p-3 dark:border-white/[0.07] sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
        {modules.map((module, index) => {
          const locked = module.completionStatus === "locked";
          const complete = module.completionStatus === "completed";
          const current = activeModule === index;
          return (
            <li key={`${module.title}-${index}`}>
              <div
                className={`grid w-full grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-2xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  current
                    ? "border-[#7c6cf6]/55 bg-[#7c6cf6]/[0.08]"
                    : "border-black/[0.08] bg-black/[0.015] hover:border-[#7c6cf6]/30 dark:border-white/[0.08] dark:bg-white/[0.025]"
                }`}
              >
                <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ${
                  complete ? "bg-emerald-500 text-white" : current ? "bg-[#7c6cf6] text-white" : "bg-white text-neutral-400 ring-1 ring-black/[0.08] dark:bg-white/[0.06] dark:ring-white/10"
                }`}>
                  {complete ? <DashboardCheckMark /> : String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">{module.completionStatus.replace("_", " ")}</span>
                    {current && <span className="rounded-full bg-[#7c6cf6]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#6c5ce7] dark:text-[#b9b1ff]">Current</span>}
                  </span>
                  <span className="mt-1 block truncate text-sm font-semibold leading-5">{module.title}</span>
                  <span className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => !locked && onSelect(index)} disabled={locked} className="rounded-full bg-[#7c6cf6] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[#6b5bdd] disabled:cursor-not-allowed disabled:opacity-45">
                      Open module
                    </button>
                    <a href={buildYouTubeLearningUrl(courseTitle, module.title)} target="_blank" rel="noreferrer" className="rounded-full border border-black/[0.08] px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-neutral-500 transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/45 dark:hover:text-[#b9b1ff]">
                      Find videos
                    </a>
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

function DashboardCheckMark() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function LearningStepTabs({
  steps,
  activeStep,
  onSelect,
}: {
  steps: LearningStepItem[];
  activeStep: LearningStepId;
  onSelect: (step: LearningStepId) => void;
}) {
  return (
    <nav className="grid gap-3 md:grid-cols-3" aria-label="Learning steps">
      {steps.map((step, index) => {
        const active = step.id === activeStep;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => step.status !== "locked" && onSelect(step.id)}
            disabled={step.status === "locked"}
            className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
              active
                ? "border-[#7c6cf6]/45 bg-[#7c6cf6]/[0.08]"
                : "border-black/[0.08] bg-white/68 hover:border-[#7c6cf6]/25 dark:border-white/[0.08] dark:bg-white/[0.035]"
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-black ${
                step.status === "done" ? "bg-emerald-500 text-white" : active ? "bg-[#7c6cf6] text-white" : "bg-black/[0.05] text-neutral-500 dark:bg-white/[0.07] dark:text-white/50"
              }`}>
                {step.status === "done" ? "OK" : index + 1}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400">{step.status}</span>
            </span>
            <span className="mt-3 block text-sm font-semibold">{step.label}</span>
            <span className="mt-1 block text-xs leading-5 text-neutral-500 dark:text-white/42">{step.description}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function LearningStepPanel({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
      <div className="border-b border-black/[0.07] bg-black/[0.018] p-5 dark:border-white/[0.07] dark:bg-white/[0.025] sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-white/45">{description}</p>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
