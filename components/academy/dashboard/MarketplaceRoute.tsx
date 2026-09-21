"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type MarketplaceCourse = {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  level: string;
  priceCents: number;
  currency: string;
  purchaseCount: number;
};

export function MarketplaceRoute() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<MarketplaceCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/marketplace/courses${query ? `?q=${encodeURIComponent(query)}` : ""}`, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then((payload) => {
          if (!payload.success) throw new Error(payload.error ?? "Could not load the marketplace.");
          setCourses(payload.courses ?? []);
        })
        .catch((loadError) => {
          if (loadError.name !== "AbortError") {
            setError(loadError instanceof Error ? loadError.message : "Could not load the marketplace.");
          }
        });
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  async function buyCourse(courseId: string) {
    if (!user) {
      setError("Please sign in to purchase a course.");
      return;
    }
    setBuyingId(courseId);
    setError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/marketplace/purchase/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not start checkout.");
      window.location.href = payload.authorizationUrl;
    } catch (buyError) {
      setBuyingId(null);
      setError(buyError instanceof Error ? buyError.message : "Could not start checkout.");
    }
  }

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">Marketplace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Courses from creators</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
            Pay once, keep access for life.
          </p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses…"
            className="input-field mt-5 max-w-sm"
          />
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
          {error}
        </div>
      )}

      {courses === null ? (
        <div className="flex items-center gap-3 p-8 text-sm text-neutral-500">
          <LoadingSpinner /> Loading the marketplace…
        </div>
      ) : courses.length === 0 ? (
        <p className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-10 text-center text-sm text-neutral-500 dark:border-white/[0.08] dark:bg-[#111219]">
          No courses are published yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course.slug} className="flex flex-col rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 dark:border-white/[0.08] dark:bg-[#111219]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">{course.level}</p>
              <h2 className="mt-1.5 font-semibold">{course.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-neutral-500">{course.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-bold">
                  {course.currency} {(course.priceCents / 100).toFixed(2)}
                </p>
                <p className="text-xs text-neutral-400">{course.purchaseCount} enrolled</p>
              </div>
              <button
                type="button"
                disabled={buyingId === course._id}
                onClick={() => void buyCourse(course._id)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-50"
              >
                {buyingId === course._id && <LoadingSpinner />}
                Buy now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
