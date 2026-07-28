"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CTAProps {
  headline: string;
  subtext?: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export default function CTA({ headline, subtext, primaryCTA, secondaryCTA }: CTAProps) {
  return (
    <section>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="dark-visual lumyn-noise relative z-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#09090b] p-7 text-left text-white shadow-[0_35px_110px_rgba(0,0,0,0.28)] sm:p-10 md:rounded-[2.25rem] md:p-14 lg:p-16"
        >
          <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#7c6cf6]/25 blur-[120px]" />
          <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative z-20 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Start something useful
              </p>
              <h2 className="text-balance text-[clamp(2.6rem,5.7vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">
              {headline}
              </h2>
            
              {subtext && (
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 md:text-lg md:leading-8">
                  {subtext}
                </p>
              )}
            </div>

            <div className="flex min-w-fit flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href={primaryCTA.href} className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#111] transition hover:bg-[#7c6cf6] hover:text-white">
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-semibold text-white transition hover:border-[#7c6cf6] hover:bg-[#7c6cf6]/15">
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
