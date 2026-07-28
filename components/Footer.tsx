"use client";

import Link from "next/link";
import LumynLogo from "./LumynLogo";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Studio", href: "/about" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Lumyn Academy", href: "/academy" },
      { label: "MindFuel", href: "/mindfuel" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Start a project", href: "/contact" },
      { label: "X / Twitter", href: "https://x.com/lumynstudio" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-black/10 bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] dark:border-white/10">
      <div className="container-wide py-8 md:py-12">
        <div className="dark-visual lumyn-noise relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#09090b] px-6 py-10 text-white md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="lumyn-grid absolute inset-0 opacity-20" />
          <div className="absolute -right-24 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#7c6cf6]/25 blur-[100px]" />
          <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Your next product can be clearer
              </p>
              <h2 className="max-w-4xl text-balance text-[clamp(2.5rem,5vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white">
                Bring us the complicated part.
                <span className="block font-[Georgia] font-normal italic text-[#a99ef9]">
                  We&apos;ll find the simple way through.
                </span>
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-14 w-full items-center justify-between gap-8 rounded-full bg-white px-6 text-sm font-semibold text-[#111] transition hover:bg-[#7c6cf6] hover:text-white sm:w-auto"
            >
              Start a conversation
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[1fr_1.25fr] md:py-16">
          <div className="max-w-sm">
            <Link href="/" className="inline-block" aria-label="Lumyn home">
              <LumynLogo />
            </Link>
            <p className="mt-6 text-sm leading-6 text-[color:var(--text-secondary)]">
              Independent product studio. Strategy, design, engineering and
              applied AI—working as one clear system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-tertiary)]">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[#7c6cf6]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-tertiary)] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Lumyn Studio</p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-[#7c6cf6]">Terms</Link>
            <Link href="/refund-policy" className="hover:text-[#7c6cf6]">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
