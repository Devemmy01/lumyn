"use client";

import Link from "next/link";
import { DIAMONDS_TO_UNLOCK_CERTIFICATE } from "@/lib/academy";
import { CertificateCard } from "@/components/academy/dashboard/FeedbackParts";
import { ActivityIcon } from "@/components/academy/dashboard/icons";
import { lastSevenDays, learningStreak } from "@/components/academy/dashboard/utils";
import type { DashboardEnrollment } from "@/components/academy/dashboard/types";

export function DashboardRightRail({
  routeClassName,
  showOverviewCards,
  activityDates,
  certificateDisplayName,
  primaryEnrollment,
  diamondsBalance,
  isSubscribed,
}: {
  routeClassName: string;
  showOverviewCards: boolean;
  activityDates: string[];
  certificateDisplayName: string;
  primaryEnrollment?: DashboardEnrollment;
  diamondsBalance: number;
  isSubscribed: boolean;
}) {
  const streak = learningStreak(activityDates);

  return (
    <aside
      className={`${routeClassName}-route-aside space-y-4 2xl:sticky 2xl:top-[100px] 2xl:self-start`}
    >
      <section className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Learning rhythm
            </p>
            <h2 className="mt-1 font-semibold">{streak} {streak === 1 ? "day" : "days"} streak</h2>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]">
            <ActivityIcon />
          </span>
        </div>
        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {lastSevenDays().map((day) => {
            const active = activityDates.includes(day.key);
            return (
              <div key={day.key} className="text-center">
                <div
                  className={`h-11 rounded-lg transition ${active ? "bg-[#7c6cf6]" : "bg-black/[0.04] dark:bg-white/[0.05]"}`}
                />
                <p className="mt-1.5 text-[9px] font-semibold text-neutral-400">
                  {day.label}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-white/40">
          {streak > 0
            ? "Complete one focused activity today to keep your rhythm alive."
            : "Complete one lesson, quiz, or submission to start your streak."}
        </p>
      </section>
      {showOverviewCards && (
        <CertificateCard studentName={certificateDisplayName} enrollment={primaryEnrollment} />
      )}
      {showOverviewCards && (
        <section
          id="billing"
          className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Astra &amp; diamonds
            </p>
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${isSubscribed ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
            >
              {isSubscribed ? "subscribed" : "not subscribed"}
            </span>
          </div>
          <p className="mt-4 font-semibold">
            {diamondsBalance} diamond{diamondsBalance === 1 ? "" : "s"}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
            {DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds unlocks one certificate for free.
            Earned only through referrals.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/academy/dashboard/rewards"
              className="rounded-xl border border-black/[0.08] px-3 py-2.5 text-center text-xs font-bold text-neutral-600 transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/60 dark:hover:text-[#b9b1ff]"
            >
              Rewards
            </Link>
            <Link
              href="/academy/dashboard/billing"
              className="rounded-xl bg-[#7c6cf6] px-3 py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#6b5bdd]"
            >
              {isSubscribed ? "Manage plan" : "Subscribe"}
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-black/[0.07] pt-4 text-[10px] font-semibold text-neutral-400 dark:border-white/[0.07]">
            <Link href="/terms" className="hover:text-[#6c5ce7]">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#6c5ce7]">
              Privacy
            </Link>
            <Link href="/refund-policy" className="hover:text-[#6c5ce7]">
              Refund policy
            </Link>
            <span>Payments by Flutterwave</span>
          </div>
        </section>
      )}
    </aside>
  );
}
