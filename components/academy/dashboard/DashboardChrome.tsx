"use client";

import Link from "next/link";
import {
  DashboardIcon,
  MoreIcon,
  MoonIcon,
  SunIcon,
} from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

export function MobileRouteHeading({
  view,
  progress,
}: {
  view: string;
  progress: number;
}) {
  const labels: Record<string, { eyebrow: string; title: string }> = {
    overview: { eyebrow: "Your workspace", title: "Overview" },
    learning: { eyebrow: "Keep moving", title: "My learning" },
    generate: { eyebrow: "AI course studio", title: "Build a path" },
    assignments: { eyebrow: "Practical work", title: "Assignments" },
    certificates: { eyebrow: "Your achievements", title: "Certificates" },
    billing: { eyebrow: "Point wallet", title: "Point top-up" },
  };
  const current = labels[view] ?? labels.overview;

  return (
    <div className="mb-4 flex items-end justify-between gap-4 rounded-[1.6rem] border border-white/[0.06] bg-white/[0.03] px-1 py-1 lg:hidden">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7565e8] dark:text-[#a99eff]">
          {current.eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
          {current.title}
        </h1>
      </div>
      <div className="rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-[10px] font-bold text-neutral-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50">
        {progress}% complete
      </div>
    </div>
  );
}

export function MobileDashboardNav({
  currentView,
  isDark,
  moreOpen,
  onToggleMore,
  onToggleTheme,
  onSignOut,
  signingOut,
}: {
  currentView: string;
  isDark: boolean;
  moreOpen: boolean;
  onToggleMore: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void | Promise<void>;
  signingOut: boolean;
}) {
  const primaryItems = [
    { label: "Home", href: "/academy/dashboard", view: "overview", icon: "grid" },
    { label: "Learn", href: "/academy/dashboard/learning", view: "learning", icon: "book" },
    { label: "Build", href: "/academy/dashboard/generate", view: "generate", icon: "spark" },
    { label: "Work", href: "/academy/dashboard/assignments", view: "assignments", icon: "check" },
  ];
  const moreActive = currentView === "certificates" || currentView === "billing";

  return (
    <>
      {moreOpen && (
        <button type="button" aria-label="Close mobile navigation" onClick={onToggleMore} className="fixed inset-0 z-[55] bg-black/35 backdrop-blur-[2px] lg:hidden" />
      )}
      {moreOpen && (
        <section className="fixed inset-x-3 bottom-[6.15rem] z-[75] overflow-hidden rounded-[1.8rem] border border-black/[0.08] bg-[#faf9f6]/95 p-3 shadow-[0_24px_80px_rgba(23,19,31,0.28)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#121319]/95 lg:hidden" aria-label="More dashboard actions">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/academy/dashboard/certificates" className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${currentView === "certificates" ? "bg-[#7c6cf6] text-white" : "bg-black/[0.035] dark:bg-white/[0.05]"}`}><DashboardIcon type="award" /> Certificates</Link>
            <Link href="/academy/dashboard/billing" className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${currentView === "billing" ? "bg-[#7c6cf6] text-white" : "bg-black/[0.035] dark:bg-white/[0.05]"}`}><DashboardIcon type="card" /> Point top-up</Link>
          </div>
          <button type="button" onClick={onToggleTheme} className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-black/[0.035] p-3.5 text-left dark:bg-white/[0.05]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white/70 text-[#6c5ce7] dark:border-white/10 dark:bg-white/[0.06] dark:text-[#b9b1ff]">{isDark ? <SunIcon /> : <MoonIcon />}</span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Appearance</span><span className="mt-0.5 block text-[10px] text-neutral-400">Switch to {isDark ? "light" : "dark"} mode</span></span>
            <span className="text-xs text-neutral-400">{isDark ? "Dark" : "Light"}</span>
          </button>
          <button type="button" onClick={onSignOut} disabled={signingOut} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-3.5 text-sm font-semibold text-red-500 disabled:opacity-60">{signingOut && <LoadingSpinner />}Sign out</button>
        </section>
      )}
      <nav className="academy-mobile-safe fixed inset-x-0 bottom-0 z-[80] px-3 pb-2 pt-2 lg:hidden" aria-label="Mobile dashboard navigation">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 rounded-[2rem] border border-black/[0.08] bg-[#fbfaf8]/82 p-2 shadow-[0_-18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl dark:border-white/[0.09] dark:bg-[#090a0f]/86">
          {primaryItems.map((item) => {
            const active = currentView === item.view;
            return (
              <Link key={item.view} href={item.href} className={`group relative flex min-h-[3.8rem] flex-col items-center justify-center gap-1 rounded-[1.45rem] text-[9px] font-black transition ${active ? "text-[#7c6cf6] dark:text-[#c8c1ff]" : "text-neutral-400 hover:text-[#7c6cf6] dark:text-white/35"}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${active ? "-translate-y-1 bg-[#7c6cf6] text-white shadow-[0_12px_30px_rgba(124,108,246,0.42)]" : "bg-black/[0.035] text-current dark:bg-white/[0.045]"}`}><DashboardIcon type={item.icon} /></span>
                <span className={`${active ? "-mt-1" : ""}`}>{item.label}</span>
                {active && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#7c6cf6] dark:bg-[#c8c1ff]" />}
              </Link>
            );
          })}
          <button type="button" onClick={onToggleMore} aria-expanded={moreOpen} className={`group relative flex min-h-[3.8rem] flex-col items-center justify-center gap-1 rounded-[1.45rem] text-[9px] font-black transition ${moreOpen || moreActive ? "text-[#7c6cf6] dark:text-[#c8c1ff]" : "text-neutral-400 hover:text-[#7c6cf6] dark:text-white/35"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${moreOpen || moreActive ? "-translate-y-1 bg-[#7c6cf6] text-white shadow-[0_12px_30px_rgba(124,108,246,0.42)]" : "bg-black/[0.035] text-current dark:bg-white/[0.045]"}`}><MoreIcon /></span><span className={`${moreOpen || moreActive ? "-mt-1" : ""}`}>More</span>{(moreOpen || moreActive) && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#7c6cf6] dark:bg-[#c8c1ff]" />}</button>
        </div>
      </nav>
    </>
  );
}
