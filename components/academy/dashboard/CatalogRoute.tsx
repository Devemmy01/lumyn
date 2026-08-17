"use client";

import { useEffect, useMemo, useState } from "react";
import { academyLevelLabels, type AcademyLevel } from "@/lib/academy";
import { LanguageLogo } from "@/components/academy/LanguageLogo";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type CatalogEntry = {
  slug: string;
  language: string;
  languageLabel: string;
  level: AcademyLevel;
  available: boolean;
  courseTitle?: string;
  courseDescription?: string;
  moduleCount: number;
  enrollmentCount: number;
};

type CatalogResponse = { success?: boolean; catalog?: CatalogEntry[]; error?: string };

export function CatalogRoute({
  enrolledSlugs,
  pendingSlug,
  onEnroll,
  onContinue,
}: {
  enrolledSlugs: string[];
  pendingSlug: string | null;
  onEnroll: (slug: string) => void;
  onContinue: (slug: string) => void;
}) {
  const [entries, setEntries] = useState<CatalogEntry[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      try {
        const response = await fetch("/api/academy/catalog", { cache: "no-store" });
        const payload = (await response.json()) as CatalogResponse;
        if (!response.ok || !payload.catalog) {
          throw new Error(payload.error ?? "The course catalog could not be loaded.");
        }
        if (!cancelled) setEntries(payload.catalog);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The course catalog could not be loaded.",
          );
        }
      }
    }
    void loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const groups: Array<{ language: string; languageLabel: string; entries: CatalogEntry[] }> = [];
    (entries ?? []).forEach((entry) => {
      let group = groups.find((item) => item.language === entry.language);
      if (!group) {
        group = { language: entry.language, languageLabel: entry.languageLabel, entries: [] };
        groups.push(group);
      }
      group.entries.push(entry);
    });
    return groups;
  }, [entries]);

  const enrolledSet = useMemo(() => new Set(enrolledSlugs), [enrolledSlugs]);

  return (
    <div className="catalog-route w-full space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <p className="relative text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
          Course catalog
        </p>
        <h1 className="relative mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Pick a language, pick a level.
        </h1>
        <p className="relative mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
          Every course is free to learn: lessons, quizzes, assignments, and a
          final project included. Enroll in as many as you like.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {!entries && !error && (
        <div className="flex items-center justify-center gap-3 rounded-[1.75rem] border border-black/[0.08] bg-white/70 p-10 text-sm text-neutral-500 dark:border-white/[0.08] dark:bg-[#111219] dark:text-white/50">
          <LoadingSpinner /> Loading catalog…
        </div>
      )}

      {grouped.map((group) => (
        <section
          key={group.language}
          className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7"
        >
          <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.02em]">
            <LanguageLogo language={group.language} className="h-6 w-6 shrink-0" />
            {group.languageLabel}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {group.entries.map((entry) => {
              const enrolled = enrolledSet.has(entry.slug);
              const pending = pendingSlug === entry.slug;
              return (
                <article
                  key={entry.slug}
                  className={`flex flex-col rounded-2xl border p-4 ${
                    entry.available
                      ? "border-black/[0.08] bg-black/[0.02] dark:border-white/[0.08] dark:bg-white/[0.035]"
                      : "border-dashed border-black/[0.1] bg-black/[0.01] opacity-70 dark:border-white/10 dark:bg-white/[0.015]"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-400">
                    {academyLevelLabels[entry.level]}
                  </span>
                  <p className="mt-2 text-sm font-bold leading-5">
                    {entry.courseTitle ?? `${group.languageLabel} · ${academyLevelLabels[entry.level]}`}
                  </p>
                  {entry.available ? (
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-500 dark:text-white/45">
                      {entry.courseDescription ?? `${entry.moduleCount} modules`}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-white/45">
                      Content is on the way. Check back soon.
                    </p>
                  )}
                  <div className="mt-4 flex-1" />
                  {entry.available ? (
                    enrolled ? (
                      <button
                        type="button"
                        onClick={() => onContinue(entry.slug)}
                        className="mt-2 inline-flex h-10 items-center justify-center rounded-xl border border-[#7c6cf6]/35 bg-[#7c6cf6]/10 text-xs font-bold text-[#6c5ce7] transition hover:bg-[#7c6cf6]/15 dark:text-[#b9b1ff]"
                      >
                        Continue learning
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onEnroll(entry.slug)}
                        className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] text-xs font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60"
                      >
                        {pending && <LoadingSpinner />}
                        {pending ? "Enrolling…" : "Enroll for free"}
                      </button>
                    )
                  ) : (
                    <span className="mt-2 inline-flex h-10 items-center justify-center rounded-xl bg-black/[0.04] text-xs font-bold text-neutral-400 dark:bg-white/[0.05] dark:text-white/30">
                      Coming soon
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
