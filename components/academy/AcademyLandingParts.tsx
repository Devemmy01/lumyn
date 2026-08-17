import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { LanguageLogo } from "@/components/academy/LanguageLogo";
import { ACADEMY_TUTOR_NAME, academyLanguages } from "@/lib/academy";

const catalogPreview = academyLanguages.slice(0, 5);
const currentModuleLessons = [
  { label: "The if Statement", status: "Done" },
  { label: "elif and else", status: "12 min" },
  { label: "Logical Operators", status: "10 min" },
];

export function CourseStudioPreview() {
  return (
    <div className="relative rounded-[2.25rem] border border-black/10 bg-white/70 p-3 shadow-[0_45px_140px_rgba(51,35,79,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_45px_140px_rgba(0,0,0,0.45)] md:p-5">
      <div className="overflow-hidden rounded-[1.65rem] border border-black/10 bg-[#faf9f7] dark:border-white/10 dark:bg-[#0b0b0f]">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <LanguageLogo language="python" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Python Fundamentals</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Beginner track · Free
              </p>
            </div>
          </div>
          
        </div>
        <div className="grid md:grid-cols-[0.38fr_0.62fr]">
          <div className="border-b border-black/10 p-4 dark:border-white/10 md:border-b-0 md:border-r">
            <p className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">
              Course catalog
            </p>
            <div className="mt-3 space-y-1">
              {catalogPreview.map((language, index) => (
                <div
                  key={language.id}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-xs ${index === 0 ? "bg-[#7c6cf6] font-semibold text-white" : "text-[var(--text-secondary)]"}`}
                >
                  <span className="flex items-center gap-2">
                    <LanguageLogo
                      language={language.id}
                      className="h-4 w-4 shrink-0"
                    />
                    {language.label}
                  </span>
                  {!language.available && (
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? "text-white/70" : "text-[var(--text-tertiary)]"}`}
                    >
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7c6cf6]">
                  Current module
                </p>
                <h3 className="mt-2 text-xl font-semibold">Making Decisions</h3>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#7c6cf6] text-xs font-bold">
                42%
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {currentModuleLessons.map((lesson, index) => (
                <div
                  key={lesson.label}
                  className="flex items-center justify-between rounded-xl border border-black/10 p-3 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${index === 0 ? "bg-emerald-500 text-white" : "bg-black/5 text-[var(--text-tertiary)] dark:bg-white/10"}`}
                    >
                      {index === 0 ? "✓" : index + 1}
                    </span>
                    <span className="text-xs font-medium">{lesson.label}</span>
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-[#7c6cf6]/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                {ACADEMY_TUTOR_NAME}
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
                Ask anything about this lesson. I’ll explain it using the course
                context.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#15151b] sm:flex">
        <span className="text-2xl" aria-hidden="true">
          🔥
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Streak
          </p>
          <p className="text-xl font-semibold">7 days</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureCard({
  eyebrow,
  title,
  body,
  className = "",
  accent = false,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
  accent?: boolean;
  children?: ReactNode;
}) {
  return (
    <Reveal variant="scale" className={className}>
      <article
        className={`h-full rounded-[1.75rem] border p-7 md:p-8 ${accent ? "border-[#7c6cf6]/30 bg-[#7c6cf6]/[0.08]" : "border-[var(--border-primary)] bg-[var(--bg-primary)]"}`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
          {eyebrow}
        </p>
        <h3 className="mt-4 text-3xl font-medium tracking-[-0.035em]">
          {title}
        </h3>
        <p className="mt-4 leading-7 text-[var(--text-secondary)]">{body}</p>
        {children}
      </article>
    </Reveal>
  );
}

export function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.2 4L19 7"
        stroke="#7c6cf6"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
