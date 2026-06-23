import type { Metadata } from "next";
import Link from "next/link";
import AcademyAuthForm from "@/components/academy/AcademyAuthForm";
import LumynLogo from "@/components/LumynLogo";
import AcademyThemeToggle from "@/components/academy/AcademyThemeToggle";

export const metadata: Metadata = {
  title: "Academy Sign In",
  description:
    "Sign in to Lumyn Academy and open your student dashboard.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function AcademySignInPage() {
  return (
    <main className="academy-auth-shell relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-[0.22] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="academy-orb academy-orb-one pointer-events-none absolute -left-40 top-8 h-[34rem] w-[34rem] rounded-full bg-[#6d5dfc]/20 blur-[120px]" />
      <div className="academy-orb academy-orb-two pointer-events-none absolute -right-48 bottom-0 h-[38rem] w-[38rem] rounded-full bg-[#2d8cff]/10 blur-[140px]" />
      <div className="pointer-events-none absolute left-[42%] top-[18%] h-64 w-64 rounded-full bg-[#b45cff]/[0.07] blur-[100px]" />

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-[1380px] items-center justify-between px-6 md:px-10">
        <Link href="/" aria-label="Lumyn home" className="inline-flex items-center gap-4">
          <LumynLogo compact />
          <span className="h-5 w-px bg-white/15" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Academy</span>
        </Link>
        <div className="flex items-center gap-4">
          <AcademyThemeToggle />
          <Link href="/academy" className="group inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Academy home</span>
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-[1380px] gap-14 px-6 pb-14 pt-10 md:px-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)] lg:items-center lg:gap-20 lg:pb-20 lg:pt-8">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#9185ff]/20 bg-[#8173ff]/10 px-4 py-2 text-xs font-semibold text-[#c7c1ff]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9b8cff] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9b8cff]" />
            </span>
            Your learning workspace is ready
          </div>

          <h1 className="max-w-[680px] text-[clamp(3.25rem,5.2vw,5.9rem)] font-medium leading-[0.94] tracking-[-0.045em]">
            Learn with a path that feels
            <span className="block bg-gradient-to-r from-[#c7c0ff] via-[#8f82ff] to-[#67b8ff] bg-clip-text text-transparent">made for you.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/52 md:text-lg md:leading-8">
            Turn any goal into a practical course, work through real projects,
            and get help from an AI tutor that understands what you are learning.
          </p>

          <div className="dark-visual mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d0d12] shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">

                <div>
                  <p className="text-sm font-semibold">Your learning path</p>
                  <p className="mt-0.5 text-xs text-white/36">Built around your goal and experience</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300 hidden md:block">AI powered</span>
            </div>
            <div className="grid gap-px bg-white/[0.07] sm:grid-cols-3">
              {[
                { number: "01", title: "Generate", detail: "A complete course" },
                { number: "02", title: "Practice", detail: "Quizzes & projects" },
                { number: "03", title: "Prove it", detail: "Track & certify" },
              ].map((item) => (
                <div key={item.number} className="bg-[#0d0d12]/90 px-5 py-5 sm:px-6">
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#9387ff]">{item.number}</p>
                  <p className="mt-3 text-sm font-semibold text-white/90">{item.title}</p>
                  <p className="mt-1 text-xs text-white/35">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/38">
            {[
              "Personalized curriculum",
              "Saved progress",
              "Project-first learning",
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.2 4L19 7" stroke="#9185ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[#7968ff]/10 blur-3xl" />
          <AcademyAuthForm />
        </div>
      </section>
    </main>
  );
}
