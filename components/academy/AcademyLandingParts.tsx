import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { ACADEMY_TUTOR_NAME, learningPathModules } from "@/lib/academy";

export function CourseStudioPreview() {
  return (
    <div className="relative rounded-[2.25rem] border border-black/10 bg-white/70 p-3 shadow-[0_45px_140px_rgba(51,35,79,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_45px_140px_rgba(0,0,0,0.45)] md:p-5">
      <div className="overflow-hidden rounded-[1.65rem] border border-black/10 bg-[#faf9f7] dark:border-white/10 dark:bg-[#0b0b0f]">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6cf6] text-xs font-bold text-white">LA</div><div><p className="text-sm font-semibold">Learning workspace</p><p className="text-[10px] text-[var(--text-tertiary)]">Frontend engineering path</p></div></div><span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-300">IN PROGRESS</span></div>
        <div className="grid md:grid-cols-[0.38fr_0.62fr]">
          <div className="border-b border-black/10 p-4 dark:border-white/10 md:border-b-0 md:border-r"><p className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">Course map</p><div className="mt-3 space-y-1">{learningPathModules.slice(0, 5).map((item, index) => <div key={item} className={`rounded-xl px-3 py-3 text-xs ${index === 1 ? "bg-[#7c6cf6] font-semibold text-white" : "text-[var(--text-secondary)]"}`}><span className="mr-2 opacity-50">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}</div></div>
        <div className="p-5 md:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7c6cf6]">Current module</p><h3 className="mt-2 text-xl font-semibold">JavaScript Basics</h3></div><div className="flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#7c6cf6] text-xs font-bold">42%</div></div><div className="mt-6 space-y-3">{["Variables, values & types", "Functions and scope", "Arrays and objects"].map((lesson, index) => <div key={lesson} className="flex items-center justify-between rounded-xl border border-black/10 p-3 dark:border-white/10"><div className="flex items-center gap-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${index === 0 ? "bg-emerald-500 text-white" : "bg-black/5 text-[var(--text-tertiary)] dark:bg-white/10"}`}>{index === 0 ? "✓" : index + 1}</span><span className="text-xs font-medium">{lesson}</span></div><span className="text-[10px] text-[var(--text-tertiary)]">{index === 0 ? "Done" : "12 min"}</span></div>)}</div><div className="mt-5 rounded-xl bg-[#7c6cf6]/10 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">{ACADEMY_TUTOR_NAME}</p><p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">Ask anything about this lesson. I’ll explain it using the course context.</p></div></div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#15151b] sm:block"><p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Quiz average</p><p className="mt-1 text-2xl font-semibold">86%</p></div>
    </div>
  );
}

export function FeatureCard({ eyebrow, title, body, className = "", accent = false, children }: { eyebrow: string; title: string; body: string; className?: string; accent?: boolean; children?: ReactNode }) {
  return <Reveal variant="scale" className={className}><article className={`h-full rounded-[1.75rem] border p-7 md:p-8 ${accent ? "border-[#7c6cf6]/30 bg-[#7c6cf6]/[0.08]" : "border-[var(--border-primary)] bg-[var(--bg-primary)]"}`}><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">{eyebrow}</p><h3 className="mt-4 text-3xl font-medium tracking-[-0.035em]">{title}</h3><p className="mt-4 leading-7 text-[var(--text-secondary)]">{body}</p>{children}</article></Reveal>;
}

export function CheckIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7" stroke="#7c6cf6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
export function ArrowIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
