"use client";

import { useEffect } from "react";
import AstraMascot from "@/components/academy/AstraMascot";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";

export type CelebrationEvent =
  | { kind: "xp"; amount: number }
  | { kind: "streak"; days: number }
  | { kind: "badge"; name: string }
  | { kind: "level"; level: number };

function celebrationCopy(event: CelebrationEvent) {
  switch (event.kind) {
    case "xp":
      return { title: `+${event.amount} XP`, body: "Nice work, keep the momentum going." };
    case "streak":
      return { title: `${event.days} day streak`, body: "You showed up again today. That's how it adds up." };
    case "badge":
      return { title: "Badge earned", body: event.name };
    case "level":
      return { title: `Level ${event.level}`, body: "You leveled up. Your XP keeps climbing." };
  }
}

export function AstraCelebrationToast({
  event,
  onDismiss,
}: {
  event: CelebrationEvent | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!event) return;
    const timer = window.setTimeout(onDismiss, 4200);
    return () => window.clearTimeout(timer);
  }, [event, onDismiss]);

  if (!event) return null;
  const copy = celebrationCopy(event);

  return (
    <div
      role="status"
      aria-live="polite"
      className="academy-celebration-toast fixed left-1/2 top-4 z-[120] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 sm:left-auto sm:right-6 sm:top-6 sm:translate-x-0"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111218] p-3 pr-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
          <AstraMascot expression="celebrating" className="h-11 w-11" label={`${ACADEMY_TUTOR_NAME} celebrating`} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-[#b9b1ff]">{copy.title}</p>
          <p className="mt-0.5 truncate text-xs text-white/65">{copy.body}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto shrink-0 rounded-full p-1 text-white/40 transition hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
