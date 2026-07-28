"use client";

import { useEffect, useRef, type FormEvent } from "react";
import AstraMascot from "@/components/academy/AstraMascot";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";
import type { TutorMessage } from "@/components/academy/dashboard/types";

export function TutorPanel({ messages, question, pending, onQuestionChange, onSubmit }: { messages: TutorMessage[]; question: string; pending: boolean; onQuestionChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void> }) {
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, pending]);

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-[#7c6cf6]/20 bg-white/75 p-5 shadow-sm dark:bg-[#111219] sm:p-7">
      <header className="relative flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7c6cf6]/10 shadow-[0_10px_25px_rgba(124,108,246,0.16)] ring-1 ring-[#7c6cf6]/15">
          <AstraMascot expression={pending ? "thinking" : messages.length ? "focused" : "happy"} className="h-16 w-16 translate-y-1" />
        </div>
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Context-aware help</p><h2 className="mt-1 text-xl font-semibold">{ACADEMY_TUTOR_NAME}</h2></div>
        <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</span>
      </header>
      <div className="academy-scrollbar relative mt-5 max-h-96 space-y-3 overflow-y-auto pr-2" aria-live="polite" aria-busy={pending}>
        {messages.length ? messages.slice(-8).map((entry, index) => (
          <div key={`${entry.createdAt}-${index}`} className={`rounded-2xl p-4 text-sm leading-6 ${entry.role === "assistant" ? "mr-4 border border-[#7c6cf6]/15 bg-white/70 shadow-sm dark:bg-white/[0.05] sm:mr-8" : "ml-4 bg-[#7c6cf6] text-white shadow-[0_10px_25px_rgba(124,108,246,.16)] sm:ml-8"}`}>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest opacity-55">{entry.role === "assistant" ? ACADEMY_TUTOR_NAME : "You"}</p>
            {entry.content}
          </div>
        )) : !pending ? (
          <div className="rounded-2xl border border-dashed border-[#7c6cf6]/25 p-6 text-center"><p className="text-sm font-medium">Stuck on something?</p><p className="mt-1 text-xs text-neutral-500 dark:text-white/40">Ask {ACADEMY_TUTOR_NAME} for an explanation, example, or hint about this module.</p></div>
        ) : null}
        {pending && <TutorTypingIndicator />}
        <div ref={conversationEndRef} />
      </div>
      <form onSubmit={onSubmit} className="relative mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={question} onChange={(event) => onQuestionChange(event.target.value)} disabled={pending} className="h-12 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white/75 px-4 text-sm outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 disabled:opacity-60 dark:border-white/10 dark:bg-black/20" placeholder={pending ? `${ACADEMY_TUTOR_NAME} is thinking...` : `Ask ${ACADEMY_TUTOR_NAME} about this module...`} required />
        <button type="submit" disabled={pending} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60">{pending ? "Thinking..." : `Ask ${ACADEMY_TUTOR_NAME}`}</button>
      </form>
    </section>
  );
}

function TutorTypingIndicator() {
  return (
    <div className="mr-12 w-fit rounded-2xl border border-[#7c6cf6]/15 bg-white/80 px-4 py-3 shadow-sm dark:bg-white/[0.05]" role="status">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#7565e8] dark:text-[#b9b1ff]">{ACADEMY_TUTOR_NAME}</p>
      <div className="flex items-center gap-1.5" aria-hidden="true"><span className="academy-typing-dot" /><span className="academy-typing-dot" /><span className="academy-typing-dot" /></div>
      <span className="sr-only">{ACADEMY_TUTOR_NAME} is typing</span>
    </div>
  );
}
