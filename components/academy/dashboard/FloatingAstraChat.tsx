"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import AstraMascot from "@/components/academy/AstraMascot";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import type { TutorMessage } from "@/components/academy/dashboard/types";

const COMPOSER_MAX_HEIGHT = 132;
const COMPOSER_MIN_HEIGHT = 48;

export function FloatingAstraChat({
  messages,
  moduleTitle,
  pending,
  preferredName,
  question,
  resetting,
  onPreferredNameChange,
  onQuestionChange,
  onResetChat,
  onSubmit,
}: {
  messages: TutorMessage[];
  moduleTitle?: string;
  pending: boolean;
  preferredName: string;
  question: string;
  resetting: boolean;
  onPreferredNameChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onResetChat: () => void | Promise<void>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, open, pending]);

  useEffect(() => {
    if (!open || messages.length === 0) setConfirmReset(false);
  }, [messages.length, open]);

  useEffect(() => {
    resizeQuestionInput(questionInputRef.current);
  }, [question, open]);

  const submitQuestionFromKeyboard = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const handleQuestionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionChange(event.target.value);
    resizeQuestionInput(event.currentTarget);
  };

  const requestNewChat = () => {
    if (messages.length === 0) {
      void onResetChat();
      return;
    }
    setConfirmReset(true);
  };

  const confirmNewChat = async () => {
    setConfirmReset(false);
    await onResetChat();
  };

  return (
    <div className="fixed bottom-[6.35rem] right-4 z-[85] sm:bottom-6 sm:right-6">
      {open && (
        <section className="fixed inset-x-2 bottom-2 z-[95] flex max-h-[calc(100dvh-1rem)] min-h-[74dvh] flex-col overflow-hidden rounded-[2rem] border border-black/[0.08] bg-[#fbfaf8] text-[#18181b] shadow-[0_24px_90px_rgba(20,18,30,0.3)] dark:border-white/10 dark:bg-[#101118] dark:text-white sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[calc(100vh-8rem)] sm:max-h-[680px] sm:min-h-0 sm:w-[420px] sm:max-w-[calc(100vw-2rem)] sm:rounded-[1.7rem] sm:shadow-[0_24px_80px_rgba(20,18,30,0.24)]" aria-label={`${ACADEMY_TUTOR_NAME} floating chat`}>
          <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.07] bg-white/55 p-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.035]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7c6cf6]/10 ring-1 ring-[#7c6cf6]/15">
              <AstraMascot expression={pending ? "thinking" : "focused"} className="h-14 w-14 translate-y-1" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Always-on help</p>
              <h2 className="truncate text-sm font-semibold">{ACADEMY_TUTOR_NAME}{moduleTitle ? ` · ${moduleTitle}` : ""}</h2>
            </div>
            <button type="button" onClick={requestNewChat} disabled={resetting || pending || messages.length === 0} className="hidden h-9 items-center justify-center gap-2 rounded-full border border-black/[0.08] px-3 text-xs font-bold text-neutral-500 transition hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:text-white/50 sm:inline-flex">
              {resetting && <LoadingSpinner />}New chat
            </button>
            <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] text-lg text-neutral-500 transition hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/50" aria-label={`Close ${ACADEMY_TUTOR_NAME} chat`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </header>

          <div className="shrink-0 border-b border-black/[0.07] px-4 py-2 dark:border-white/[0.08] sm:hidden">
            <button type="button" onClick={requestNewChat} disabled={resetting || pending || messages.length === 0} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] text-xs font-bold text-neutral-500 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:text-white/50">
              {resetting && <LoadingSpinner />}New chat
            </button>
          </div>

          {confirmReset && (
            <div className="shrink-0 border-b border-[#f59e0b]/20 bg-[#f59e0b]/8 px-4 py-3 dark:border-[#fbbf24]/15 dark:bg-[#fbbf24]/8">
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Start a fresh chat?</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/55">This will clear the current Astra conversation and begin again from a clean slate.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setConfirmReset(false)} className="h-10 rounded-xl border border-black/[0.08] text-xs font-bold text-neutral-600 transition hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/60">
                  Keep chat
                </button>
                <button type="button" onClick={confirmNewChat} disabled={resetting || pending} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] text-xs font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60">
                  {resetting && <LoadingSpinner />}Start fresh
                </button>
              </div>
            </div>
          )}

          <div className="shrink-0 border-b border-black/[0.07] px-4 py-3 dark:border-white/[0.08]">
            <label className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
              Call me
              <input value={preferredName} onChange={(event) => onPreferredNameChange(event.target.value)} className="h-10 rounded-xl border border-black/[0.08] bg-white/70 px-3 text-sm font-medium normal-case tracking-normal text-[#18181b] outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="Your preferred name" maxLength={80} />
            </label>
          </div>

          <div className="academy-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(124,108,246,0.08),transparent_42%)] p-4" aria-live="polite" aria-busy={pending}>
            {messages.length ? messages.slice(-10).map((entry, index) => (
              <div key={`${entry.createdAt}-${index}`} className={`rounded-[1.2rem] p-3 text-sm leading-6 shadow-sm ${
                entry.role === "assistant"
                  ? "mr-6 border border-black/[0.07] bg-white/82 text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75"
                  : "ml-8 bg-[#7c6cf6] text-white shadow-[0_12px_28px_rgba(124,108,246,0.22)]"
              }`}>
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest opacity-55">{entry.role === "assistant" ? ACADEMY_TUTOR_NAME : "You"}</p>
                {entry.role === "assistant" ? <FormattedTutorMessage content={entry.content} /> : <p className="whitespace-pre-wrap">{entry.content}</p>}
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-[#7c6cf6]/25 p-5 text-center">
                <p className="text-sm font-semibold">Need a hint?</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/42">Ask about the current module, your assignment, or what to do next.</p>
              </div>
            )}
            {pending && <div className="inline-flex items-center gap-2 rounded-full border border-[#7c6cf6]/15 px-3 py-2 text-xs font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]"><LoadingSpinner /> Thinking...</div>}
            <div ref={conversationEndRef} />
          </div>

          <form onSubmit={onSubmit} className="grid shrink-0 gap-2 border-t border-black/[0.07] bg-white/75 p-3 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#101118]/90 sm:grid-cols-[1fr_auto]">
            <textarea ref={questionInputRef} value={question} onChange={handleQuestionChange} onKeyDown={submitQuestionFromKeyboard} disabled={pending} rows={1} className="academy-scrollbar max-h-[132px] min-h-12 min-w-0 resize-none overflow-hidden rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 disabled:opacity-60 dark:border-white/10 dark:bg-black/20" placeholder={`Ask ${ACADEMY_TUTOR_NAME}...`} required />
            <button type="submit" disabled={pending} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60">{pending && <LoadingSpinner />}Ask</button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/20 bg-[#7c6cf6] text-white shadow-[0_16px_45px_rgba(68,55,151,0.34)] transition hover:-translate-y-0.5 hover:bg-[#6b5bdd] sm:h-16 sm:w-16 sm:rounded-[1.35rem]" aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${ACADEMY_TUTOR_NAME} chat`}>
        <AstraMascot expression={pending ? "thinking" : "happy"} className="h-[4.5rem] w-[4.5rem] translate-y-1 sm:h-20 sm:w-20" />
      </button>
    </div>
  );
}

function resizeQuestionInput(element: HTMLTextAreaElement | null) {
  if (!element) return;

  element.style.height = "auto";
  const nextHeight = Math.min(Math.max(element.scrollHeight, COMPOSER_MIN_HEIGHT), COMPOSER_MAX_HEIGHT);
  element.style.height = `${nextHeight}px`;
  element.style.overflowY = element.scrollHeight > COMPOSER_MAX_HEIGHT ? "auto" : "hidden";
}

function FormattedTutorMessage({ content }: { content: string }) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .replace(/\s+(#{1,4}\s+)/g, "\n\n$1")
    .replace(/\s+-\s+/g, "\n- ")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line));
        const numberedLines = lines.filter((line) => /^\d+[.)]\s+/.test(line));

        if (/^#{1,4}\s+/.test(block)) {
          return <p key={index} className="text-sm font-bold text-[#6c5ce7] dark:text-[#c8c1ff]">{renderInline(block.replace(/^#{1,4}\s+/, ""))}</p>;
        }

        if (bulletLines.length === lines.length) {
          return <ul key={index} className="space-y-1.5 pl-4">{lines.map((line, lineIndex) => <li key={lineIndex} className="list-disc leading-6">{renderInline(line.replace(/^[-*]\s+/, ""))}</li>)}</ul>;
        }

        if (numberedLines.length === lines.length) {
          return <ol key={index} className="space-y-1.5 pl-4">{lines.map((line, lineIndex) => <li key={lineIndex} className="list-decimal leading-6">{renderInline(line.replace(/^\d+[.)]\s+/, ""))}</li>)}</ol>;
        }

        return <p key={index} className="leading-6">{renderInline(lines.join(" "))}</p>;
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-bold text-neutral-900 dark:text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded-md bg-black/[0.06] px-1.5 py-0.5 font-mono text-[0.92em] text-[#6c5ce7] dark:bg-white/[0.08] dark:text-[#c8c1ff]">{part.slice(1, -1)}</code>;
    return part;
  });
}
