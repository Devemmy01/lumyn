"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type Purchase = {
  _id: string;
  courseId: { title: string; slug: string } | null;
  priceCentsPaid: number;
  currency: string;
  createdAt: string;
};

export function MyPurchasesRoute() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  useEffect(() => {
    if (!user) return;
    user
      .getIdToken()
      .then((token) => fetch("/api/marketplace/purchases", { headers: { Authorization: `Bearer ${token}` } }))
      .then((response) => response.json())
      .then((payload) => {
        if (!payload.success) throw new Error(payload.error ?? "Could not load your purchases.");
        setPurchases(payload.purchases ?? []);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load your purchases."));
  }, [user]);

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">My purchases</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Courses you own</h1>
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
          {error}
        </div>
      )}

      {purchases === null ? (
        <div className="flex items-center gap-3 p-8 text-sm text-neutral-500">
          <LoadingSpinner /> Loading your purchases…
        </div>
      ) : purchases.length === 0 ? (
        <p className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-10 text-center text-sm text-neutral-500 dark:border-white/[0.08] dark:bg-[#111219]">
          You haven&apos;t purchased any creator courses yet. Browse the marketplace to find one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 dark:border-white/[0.08] dark:bg-[#111219]">
              <h2 className="font-semibold">{purchase.courseId?.title ?? "Course"}</h2>
              <p className="mt-1 text-xs text-neutral-400">
                Purchased {new Date(purchase.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
