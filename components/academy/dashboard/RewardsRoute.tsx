"use client";

import { DIAMONDS_TO_UNLOCK_CERTIFICATE, REFERRALS_PER_DIAMOND } from "@/lib/academy";
import { AwardIcon } from "@/components/academy/dashboard/icons";
import type { DashboardBadge, DashboardGamification } from "@/components/academy/dashboard/types";

const BADGE_INFO: Record<string, { name: string; description: string }> = {
  streak_7: { name: "Week Streak", description: "Learned 7 days in a row." },
  streak_30: { name: "Month Streak", description: "Learned 30 days in a row." },
  first_certificate: { name: "First Certificate", description: "Unlocked your first certificate." },
  first_course_completed: { name: "Course Complete", description: "Finished your first course." },
  quiz_perfectionist: { name: "Perfect Score", description: "Scored 100% on a module quiz." },
  polyglot: { name: "Polyglot", description: "Enrolled in courses across 2+ languages." },
};

const ALL_BADGE_IDS = Object.keys(BADGE_INFO);

export function RewardsRoute({
  gamification,
  diamondsBalance,
  referralCode,
  referralsCount,
  referralLink,
  onCopyReferralLink,
}: {
  gamification: DashboardGamification;
  diamondsBalance: number;
  referralCode?: string;
  referralsCount: number;
  referralLink: string;
  onCopyReferralLink: () => void;
}) {
  const xpTotal = gamification.xpTotal ?? 0;
  const level = Math.floor(xpTotal / 500) + 1;
  const xpIntoLevel = xpTotal % 500;
  const levelProgress = Math.round((xpIntoLevel / 500) * 100);
  const earnedBadgeIds = new Set(gamification.badges.map((badge) => badge.badgeId));
  const badgeById = new Map<string, DashboardBadge>(
    gamification.badges.map((badge) => [badge.badgeId, badge]),
  );
  const referralsIntoDiamond = referralsCount % REFERRALS_PER_DIAMOND;
  const referralProgress = Math.round((referralsIntoDiamond / REFERRALS_PER_DIAMOND) * 100);

  return (
    <div className="rewards-route min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
          Rewards
        </p>
        <h1 className="relative mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Level {level}
        </h1>
        <p className="relative mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
          {xpTotal} XP earned. {500 - xpIntoLevel} XP to level {level + 1}.
        </p>
        <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c6cf6] to-[#38bdf8] transition-all"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Current streak
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
            {gamification.streakCurrent} {gamification.streakCurrent === 1 ? "day" : "days"}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
            Longest streak: {gamification.streakLongest} {gamification.streakLongest === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Diamonds
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{diamondsBalance}</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
            {DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds unlocks one certificate for free.
          </p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Badges
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              {earnedBadgeIds.size} of {ALL_BADGE_IDS.length} earned
            </h2>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AwardIcon />
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_BADGE_IDS.map((badgeId) => {
            const info = BADGE_INFO[badgeId];
            const earned = earnedBadgeIds.has(badgeId);
            const badge = badgeById.get(badgeId);
            return (
              <div
                key={badgeId}
                className={`rounded-2xl border p-4 ${
                  earned
                    ? "border-[#7c6cf6]/30 bg-[#7c6cf6]/[0.07]"
                    : "border-dashed border-black/[0.1] bg-black/[0.015] opacity-60 dark:border-white/10 dark:bg-white/[0.015]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    earned ? "bg-[#7c6cf6] text-white" : "bg-black/[0.06] text-neutral-400 dark:bg-white/[0.06]"
                  }`}
                >
                  {earned ? "★" : "•"}
                </span>
                <p className="mt-3 text-sm font-bold">{info.name}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/45">
                  {info.description}
                </p>
                {earned && badge?.earnedAt && (
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#6c5ce7] dark:text-[#b9b1ff]">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#7c6cf6]/25 bg-[#7c6cf6]/[0.06] p-5 shadow-sm sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
          Referrals
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{referralsCount} friends joined</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/55">
          {REFERRALS_PER_DIAMOND} referrals = 1 diamond. {DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds
          unlocks one certificate for free.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-[#7c6cf6] transition-all"
            style={{ width: `${referralProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-neutral-500 dark:text-white/40">
          {referralsIntoDiamond} of {REFERRALS_PER_DIAMOND} referrals toward your next diamond.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="min-w-0 flex-1 truncate rounded-xl bg-white/65 px-3 py-2.5 text-xs font-semibold text-[#6c5ce7] dark:bg-black/20 dark:text-[#b9b1ff]">
            {referralLink || (referralCode ? `Code: ${referralCode}` : "Referral link loading...")}
          </p>
          <button
            type="button"
            onClick={onCopyReferralLink}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6b5bdd]"
          >
            Copy link
          </button>
        </div>
      </section>
    </div>
  );
}
