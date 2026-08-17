"use client";

import Link from "next/link";
import { academySubscriptionPlan, ACADEMY_TUTOR_NAME, type SubscriptionStatus } from "@/lib/academy";
import { DashboardIcon } from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

const statusCopy: Record<string, { label: string; tone: string }> = {
  active: { label: "Active", tone: "bg-emerald-500/10 text-emerald-600" },
  past_due: { label: "Past due", tone: "bg-amber-500/10 text-amber-600" },
  pending: { label: "Pending", tone: "bg-amber-500/10 text-amber-600" },
  cancelled: { label: "Cancelled", tone: "bg-neutral-500/10 text-neutral-500" },
  inactive: { label: "Not subscribed", tone: "bg-neutral-500/10 text-neutral-500" },
};

export function BillingRoute({
  subscription,
  isSubscribed,
  pendingAction,
  onSubscribe,
  onCancelSubscription,
}: {
  subscription?: {
    planId?: string;
    status?: SubscriptionStatus;
    provider?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };
  isSubscribed: boolean;
  pendingAction: string | null;
  onSubscribe: () => void;
  onCancelSubscription: () => void;
}) {
  const status = subscription?.status ?? "inactive";
  const badge = statusCopy[status] ?? statusCopy.inactive;
  const subscribing = pendingAction === "subscribe";
  const cancelling = pendingAction === "cancel-subscription";
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="billing-route min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-4 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              Billing
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {academySubscriptionPlan.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
              {academySubscriptionPlan.description}
            </p>
          </div>
          <div
            className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold ${badge.tone}`}
          >
            {badge.label}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                Monthly price
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {academySubscriptionPlan.price}
                <span className="ml-1 text-base font-semibold text-neutral-400">
                  /{academySubscriptionPlan.cadence.replace("per ", "")}
                </span>
              </h2>
            </div>
          </div>

          {isSubscribed ? (
            <div className="mt-5 space-y-3">
              {renewalDate && (
                <p className="text-sm text-neutral-600 dark:text-white/55">
                  {subscription?.cancelAtPeriodEnd
                    ? `Renewal cancelled. Access stays active until ${renewalDate}.`
                    : `Renews on ${renewalDate}.`}
                </p>
              )}
              {!subscription?.cancelAtPeriodEnd ? (
                <button
                  type="button"
                  onClick={onCancelSubscription}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold text-neutral-600 transition hover:border-red-500/30 hover:text-red-500 disabled:opacity-60 dark:border-white/10 dark:text-white/65"
                >
                  {cancelling && <LoadingSpinner />}
                  Cancel renewal
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubscribe}
                  disabled={subscribing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-60"
                >
                  {subscribing && <LoadingSpinner />}
                  Resubscribe
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onSubscribe}
              disabled={subscribing}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-60 sm:w-auto"
            >
              {subscribing && <LoadingSpinner />}
              {subscribing ? "Opening checkout…" : academySubscriptionPlan.cta}
            </button>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            What&apos;s included
          </p>
          <div className="mt-4 space-y-2.5">
            {academySubscriptionPlan.includes.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 rounded-xl border border-black/[0.07] bg-black/[0.02] p-3 text-xs leading-5 text-neutral-600 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-white/55"
              >
                <span className="mt-0.5 text-[#7c6cf6]">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Good to know
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Learning stays free</h2>
          </div>
          <DashboardIcon type="card" />
        </div>
        <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-white/55">
          Every course, lesson, quiz, assignment, and project on Lumyn Academy
          is free with no subscription required. This plan only unlocks{" "}
          {ACADEMY_TUTOR_NAME}, unlimited AI tutoring, and free certificates on
          every course you complete. You can also unlock a certificate without
          subscribing: pay once, or earn 2 diamonds through referrals.
        </p>

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
