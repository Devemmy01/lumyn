"use client";

import Link from "next/link";
import { POINTS_PER_GENERATION } from "@/lib/academy";
import { CertificateCard } from "@/components/academy/dashboard/FeedbackParts";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import { ActivityIcon } from "@/components/academy/dashboard/icons";
import { lastSevenDays, learningStreak } from "@/components/academy/dashboard/utils";
import type { DashboardCourse } from "@/components/academy/dashboard/types";

export function DashboardRightRail({
  routeClassName,
  showOverviewCards,
  activityDates,
  certificateDisplayName,
  selected,
  hasGenerationAccess,
  hasGenerationExemption,
  pointsBalance,
  purchasePoints,
  purchaseAmount,
  pendingAction,
  onPurchasePointsChange,
  onCheckout,
}: {
  routeClassName: string;
  showOverviewCards: boolean;
  activityDates: string[];
  certificateDisplayName: string;
  selected?: DashboardCourse;
  hasGenerationAccess: boolean;
  hasGenerationExemption: boolean;
  pointsBalance: number;
  purchasePoints: number;
  purchaseAmount: number;
  pendingAction: string | null;
  onPurchasePointsChange: (points: number) => void;
  onCheckout: () => void;
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
        <CertificateCard studentName={certificateDisplayName} course={selected} />
      )}
      {showOverviewCards && (
        <section
          id="billing"
          className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"
        >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Points
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${hasGenerationAccess ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
          >
            {hasGenerationExemption ? "unlimited" : `${pointsBalance} left`}
          </span>
        </div>
        <p className="mt-4 font-semibold">
          {hasGenerationExemption
            ? "Unlimited course generation"
            : `${pointsBalance} Academy points`}
        </p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
          {POINTS_PER_GENERATION} points = 1 full learning path. 1 point costs
          $0.50.
        </p>
        {!hasGenerationExemption && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onCheckout();
            }}
            className="mt-4 space-y-3"
          >
            <label
              className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
              htmlFor="point-purchase"
            >
              Points to buy
            </label>
            <input
              id="point-purchase"
              type="number"
              min={1}
              max={500}
              value={purchasePoints}
              onChange={(event) =>
                onPurchasePointsChange(Number(event.target.value))
              }
              className="h-11 w-full rounded-xl border border-black/[0.08] bg-transparent px-3 text-sm outline-none focus:border-[#7c6cf6] dark:border-white/10"
            />
            <div className="rounded-xl bg-black/[0.035] p-3 text-sm dark:bg-white/[0.05]">
              <span className="text-neutral-500 dark:text-white/40">
                Total
              </span>
              <strong className="float-right">${purchaseAmount.toFixed(2)}</strong>
              <p className="mt-2 clear-both text-[11px] leading-5 text-neutral-500 dark:text-white/38">
                {purchasePoints >= POINTS_PER_GENERATION
                  ? `${Math.floor(purchasePoints / POINTS_PER_GENERATION)} full path${Math.floor(purchasePoints / POINTS_PER_GENERATION) === 1 ? "" : "s"} worth of points`
                  : `${POINTS_PER_GENERATION - purchasePoints} more point${POINTS_PER_GENERATION - purchasePoints === 1 ? "" : "s"} needed for one full path`}
              </p>
            </div>
            <button
              type="submit"
              disabled={pendingAction === "checkout-points"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60"
            >
              {pendingAction === "checkout-points" && <LoadingSpinner />}
              Buy points
            </button>
          </form>
        )}
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
