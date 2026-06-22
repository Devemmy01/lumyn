import Link from "next/link";

export type PolicySection = {
  title: string;
  paragraphs?: React.ReactNode[];
  bullets?: React.ReactNode[];
};

export default function PolicyPage({ eyebrow, title, summary, updated, sections }: { eyebrow: string; title: string; summary: string; updated: string; sections: PolicySection[] }) {
  return (
    <div className="bg-[var(--bg-primary)] px-6 py-20 text-[var(--text-primary)] md:px-12 md:py-28">
      <div className="mx-auto max-w-[1120px]">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-7 md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#7c6cf6]/15 blur-[100px]" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#6c5ce7] dark:text-[#b9b1ff]">{eyebrow}</p>
          <h1 className="relative mt-5 max-w-4xl text-4xl font-medium tracking-[-0.045em] md:text-7xl">{title}</h1>
          <p className="relative mt-6 max-w-3xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">{summary}</p>
          <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Last updated {updated}</p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[var(--text-tertiary)]">On this page</p>
            <nav className="mt-4 space-y-1">
              {sections.map((section, index) => <a key={section.title} href={`#section-${index + 1}`} className="block rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[#7c6cf6]/10 hover:text-[#6c5ce7]">{index + 1}. {section.title}</a>)}
            </nav>
            <div className="mt-7 border-t border-[var(--border-primary)] pt-6 text-sm leading-6 text-[var(--text-secondary)]">Questions? <Link href="/contact" className="font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]">Contact Lumyn</Link>.</div>
          </aside>

          <main className="divide-y divide-[var(--border-primary)] border-y border-[var(--border-primary)]">
            {sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-28 py-8 md:py-10">
                <div className="flex gap-5"><span className="pt-1 text-xs font-bold text-[#7c6cf6]">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><h2 className="text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{section.title}</h2>{section.paragraphs?.map((paragraph, paragraphIndex) => <div key={paragraphIndex} className="mt-5 text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">{paragraph}</div>)}{section.bullets?.length ? <ul className="mt-5 space-y-3">{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex} className="flex gap-3 text-sm leading-7 text-[var(--text-secondary)] md:text-base"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c6cf6]" />{bullet}</li>)}</ul> : null}</div></div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
