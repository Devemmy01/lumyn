"use client";

import Link from "next/link";
import {
  ACADEMY_POINT_PRICE_CENTS,
  POINTS_PER_GENERATION,
} from "@/lib/academy";
import { DashboardIcon } from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

export function PointTopUpRoute({
  hasGenerationAccess,
  hasGenerationExemption,
  pointsBalance,
  purchasePoints,
  purchaseAmount,
  pendingAction,
  onPurchasePointsChange,
  onCheckout,
}: {
  hasGenerationAccess: boolean;
  hasGenerationExemption: boolean;
  pointsBalance: number;
  purchasePoints: number;
  purchaseAmount: number;
  pendingAction: string | null;
  onPurchasePointsChange: (points: number) => void;
  onCheckout: (points: number) => void;
}) {
  return (
    <div className="billing-route min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-4 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              Point top-up
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Add Academy points
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
              Points unlock new AI-generated learning paths. No monthly
              lock-in — top up when you want to build another course.
            </p>
          </div>
          <div className="whitespace-nowrap rounded-2xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm font-bold text-neutral-600 dark:border-white/10 dark:bg-white/[0.045] dark:text-white/65">
            {hasGenerationExemption
              ? "Unlimited access"
              : `${pointsBalance} points available`}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Current balance
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {hasGenerationExemption ? "Unlimited" : `${pointsBalance} points`}
              </h2>
            </div>
            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                hasGenerationAccess
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600"
              }`}
            >
              {hasGenerationExemption
                ? "exempt"
                : hasGenerationAccess
                  ? "ready"
                  : "top up"}
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              [`${POINTS_PER_GENERATION}`, "points per full path"],
              [`$${(ACADEMY_POINT_PRICE_CENTS / 100).toFixed(2)}`, "per point"],
              [
                `$${(
                  (POINTS_PER_GENERATION * ACADEMY_POINT_PRICE_CENTS) /
                  100
                ).toFixed(2)}`,
                "per generated path",
              ],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-black/[0.07] bg-black/[0.025] p-4 dark:border-white/[0.08] dark:bg-white/[0.035]"
              >
                <p className="text-xl font-black text-[#6c5ce7] dark:text-[#b9b1ff]">
                  {value}
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-white/42">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Quick bundles
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[10, 20, 50, 100].map((points) => (
              <button
                key={points}
                type="button"
                onClick={() => onPurchasePointsChange(points)}
                disabled={hasGenerationExemption}
                className={`rounded-2xl border px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  purchasePoints === points
                    ? "border-[#7c6cf6]/45 bg-[#7c6cf6]/10"
                    : "border-black/[0.07] bg-black/[0.02] hover:border-[#7c6cf6]/30 dark:border-white/[0.08] dark:bg-white/[0.035]"
                }`}
              >
                <span className="block text-sm font-black">{points}</span>
                <span className="mt-1 block text-[10px] text-neutral-500 dark:text-white/42">
                  ${((points * ACADEMY_POINT_PRICE_CENTS) / 100).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Checkout
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Buy points</h2>
          </div>
          <DashboardIcon type="card" />
        </div>

        {hasGenerationExemption ? (
          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5 text-sm leading-6 text-emerald-700 dark:text-emerald-200">
            This account has unlimited course generation access, so point
            top-ups are not required.
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const safePoints = Math.max(
                1,
                Math.min(
                  500,
                  Math.floor(Number.isFinite(purchasePoints) ? purchasePoints : 1),
                ),
              );
              onPurchasePointsChange(safePoints);
              onCheckout(safePoints);
            }}
            className="mt-5 space-y-4"
          >
            <label
              className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
              htmlFor="billing-point-purchase"
            >
              Points to buy
            </label>
            <input
              id="billing-point-purchase"
              type="number"
              min={1}
              max={500}
              value={purchasePoints}
              onChange={(event) => onPurchasePointsChange(Number(event.target.value))}
              className="h-12 w-full rounded-xl border border-black/[0.08] bg-transparent px-4 text-sm outline-none focus:border-[#7c6cf6] dark:border-white/10"
            />
            <div className="rounded-2xl bg-black/[0.035] p-4 text-sm dark:bg-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-white/40">
                  Total
                </span>
                <strong>${purchaseAmount.toFixed(2)}</strong>
              </div>
              <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-white/38">
                {purchasePoints >= POINTS_PER_GENERATION
                  ? `${Math.floor(purchasePoints / POINTS_PER_GENERATION)} full path${
                      Math.floor(purchasePoints / POINTS_PER_GENERATION) === 1
                        ? ""
                        : "s"
                    } worth of points`
                  : `${POINTS_PER_GENERATION - purchasePoints} more point${
                      POINTS_PER_GENERATION - purchasePoints === 1 ? "" : "s"
                    } needed for one full path`}
              </p>
            </div>
            <button
              type="submit"
              disabled={
                pendingAction === "checkout-points" ||
                !Number.isFinite(purchasePoints) ||
                purchasePoints < 1
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-60 sm:w-auto"
            >
              {pendingAction === "checkout-points" && <LoadingSpinner />}
              {pendingAction === "checkout-points"
                ? "Opening checkout…"
                : "Buy points"}
            </button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2 border-t border-black/[0.07] pt-4 text-[10px] font-semibold text-neutral-400 dark:border-white/[0.07]">
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
    </div>
  );
}
