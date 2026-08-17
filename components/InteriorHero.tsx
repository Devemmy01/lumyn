import Link from "next/link";
import Reveal from "@/components/Reveal";
import Image from "next/image";

type HeroAction = {
  label: string;
  href: string;
};

interface InteriorHeroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  signals?: string[];
  note?: string;
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.5h9M8.5 4.5l3 3-3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InteriorHero({
  eyebrow,
  title,
  accent,
  description,
  primaryAction,
  secondaryAction,
  signals = ["Strategy", "Design", "Engineering"],
  note = "Independent product studio",
}: InteriorHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)]">
      <div className="pointer-events-none absolute -left-40 top-[-18rem] h-[34rem] w-[34rem] rounded-full bg-[#7c6cf6]/12 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-14rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#7c6cf6]/10 blur-[140px]" />

      <div className="container-wide relative grid min-h-[570px] items-stretch gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:py-24">
        <Reveal className="flex max-w-5xl flex-col justify-center">
          <p className="label-sm mb-7 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] shadow-[0_0_14px_rgba(124,108,246,0.7)]" />
            {eyebrow}
          </p>
          <h1 className="text-balance text-[clamp(3.2rem,7.6vw,7.4rem)] font-medium leading-[0.86] tracking-[-0.065em] text-[color:var(--text-primary)]">
            {title}
            {accent ? (
              <span className="mt-2 block font-[Georgia] font-normal italic tracking-[-0.055em] text-[#897af8]">
                {accent}
              </span>
            ) : null}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)] sm:text-xl sm:leading-9">
            {description}
          </p>

          {primaryAction || secondaryAction ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primaryAction ? (
                <Link href={primaryAction.href} className="btn-primary gap-7">
                  {primaryAction.label}
                  <ArrowIcon />
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link href={secondaryAction.href} className="btn-secondary">
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </Reveal>

        <Reveal
          delay={100}
          variant="scale"
          className="relative hidden min-h-[360px] lg:block"
        >
          <div className="dark-visual lumyn-noise absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#09090b] p-6 text-white shadow-[0_35px_100px_rgba(0,0,0,0.3)]">
            <div className="lumyn-grid absolute inset-0 opacity-30" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7c6cf6]/25 blur-[95px]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.2em] text-white/35">
                <span>{note}</span>
                <span>2026</span>
              </div>

              <div className="space-y-3">
                {signals.map((signal, index) => (
                  <div
                    key={signal}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 transition hover:border-[#7c6cf6]/50 hover:bg-white/[0.06]"
                  >
                    <span className="text-[10px] font-semibold text-white/30">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {signal}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] opacity-45 transition group-hover:opacity-100" />
                  </div>
                ))}
              </div>

              <div className="flex items-end justify-between border-t border-white/10 pt-5">
                <p className="max-w-[14rem] text-sm leading-6 text-white/45">
                  Clear thinking, carefully translated into useful digital systems.
                </p>
                <Image src="/logo.png" alt="Lumyn Logo" width={36} height={36} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
