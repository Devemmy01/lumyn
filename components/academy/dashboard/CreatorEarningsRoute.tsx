"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type Totals = { totalEarningsCents: number; totalSales: number; currency: string | null };
type CourseBreakdown = { courseId: string; courseTitle: string; earningsCents: number; sales: number };
type RecentSale = { courseId: string; courseTitle: string; earningsCents: number; currency: string; createdAt: string };

function formatMoney(cents: number, currency: string | null) {
  return `${currency ?? ""} ${(cents / 100).toFixed(2)}`.trim();
}

export function CreatorEarningsRoute() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [byCourse, setByCourse] = useState<CourseBreakdown[] | null>(null);
  const [recent, setRecent] = useState<RecentSale[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  useEffect(() => {
    if (!user) return;
    user
      .getIdToken()
      .then((token) => fetch("/api/marketplace/creator/earnings", { headers: { Authorization: `Bearer ${token}` } }))
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.success) throw new Error(payload.error ?? "Could not load your earnings.");
        setTotals(payload.totals);
        setByCourse(payload.byCourse ?? []);
        setRecent(payload.recent ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load your earnings."));
  }, [user]);

  const loading = totals === null && !error;

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">Creator studio</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Earnings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
            What you&apos;ve earned across every course sale, after Lumyn&apos;s cut. Paystack settles this to your bank on its normal schedule.
          </p>
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 p-8 text-sm text-neutral-500">
          <LoadingSpinner /> Loading your earnings…
        </div>
      ) : (
        totals && (
          <>
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-4 dark:border-white/[0.08] dark:bg-[#111219]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Total earnings</p>
                <p className="mt-1.5 text-2xl font-semibold">{formatMoney(totals.totalEarningsCents, totals.currency)}</p>
              </div>
              <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-4 dark:border-white/[0.08] dark:bg-[#111219]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Total sales</p>
                <p className="mt-1.5 text-2xl font-semibold">{totals.totalSales}</p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 dark:border-white/[0.08] dark:bg-[#111219]">
              <div className="border-b border-black/[0.06] p-5 dark:border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">By course</p>
              </div>
              {byCourse && byCourse.length ? (
                <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                  {byCourse.map((entry) => (
                    <div key={entry.courseId} className="flex items-center justify-between gap-4 p-5">
                      <p className="min-w-0 truncate font-medium">{entry.courseTitle}</p>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold">{formatMoney(entry.earningsCents, totals.currency)}</p>
                        <p className="text-xs text-neutral-500">{entry.sales} sold</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-8 text-center text-sm text-neutral-500">No sales yet.</p>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 dark:border-white/[0.08] dark:bg-[#111219]">
              <div className="border-b border-black/[0.06] p-5 dark:border-white/[0.06]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Recent sales</p>
              </div>
              {recent && recent.length ? (
                <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                  {recent.map((sale, index) => (
                    <div key={`${sale.courseId}-${sale.createdAt}-${index}`} className="flex items-center justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{sale.courseTitle}</p>
                        <p className="text-xs text-neutral-500">{new Date(sale.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="shrink-0 font-semibold">{formatMoney(sale.earningsCents, sale.currency)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-8 text-center text-sm text-neutral-500">No sales yet.</p>
              )}
            </section>
          </>
        )
      )}
    </div>
  );
}
