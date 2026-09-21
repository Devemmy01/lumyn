interface IndexHeroProps {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
}

/** Shared hero for /tools and /guides index pages — centered, stat-driven,
 * deliberately not the same asymmetric "dark card" pattern InteriorHero uses
 * elsewhere on the site, so a listing page reads as its own thing rather
 * than a reused template. */
export default function IndexHero({ eyebrow, title, accent, description, stats }: IndexHeroProps) {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-[#7c6cf6]/12 blur-[150px]" />

      <div className="container-wide relative py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label-sm mb-6 inline-flex items-center justify-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] shadow-[0_0_14px_rgba(124,108,246,0.7)]" />
            {eyebrow}
          </p>
          <h1
            className="text-balance text-[clamp(2.5rem,6.2vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.04em]"
            style={{ color: "var(--text-primary)" }}
          >
            {title}{" "}
            {accent ? (
              <span className="font-[Georgia] font-normal italic tracking-[-0.03em] text-[#897af8]">
                {accent}
              </span>
            ) : null}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        </div>

        {stats.length > 0 && (
          <div
            className="mx-auto mt-14 grid max-w-xl gap-4 border-t pt-10"
            style={{ borderColor: "var(--border-primary)", gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-semibold sm:text-3xl" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
                <p
                  className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
