import Link from "next/link";
import Reveal from "@/components/Reveal";

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

      <div className="container-wide relative py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-3xl">
          <p className="label-sm mb-7 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] shadow-[0_0_14px_rgba(124,108,246,0.7)]" />
            {eyebrow}
          </p>
          <h1 className="text-balance text-[clamp(3rem,7.2vw,6.4rem)] font-medium leading-[0.9] tracking-[-0.065em] text-[color:var(--text-primary)]">
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

          {signals.length > 0 ? (
            <div
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t pt-7"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "var(--text-tertiary)" }}
              >
                {note}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {signals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-medium"
                    style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
