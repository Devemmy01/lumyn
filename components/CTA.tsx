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
    <section className="py-24">
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative z-10 overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 text-center md:p-24"
        >
          {/* Noise/Texture Background if available, else CSS Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,108,246,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative z-20 max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold tracking-tighter text-[var(--text-primary)] md:text-6xl">
              {headline}
            </h2>
            
            {subtext && (
              <p className="mb-10 text-balance text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
                {subtext}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={primaryCTA.href} className="btn-primary py-3 md:py-4 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto">
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="btn-secondary w-full px-6 py-3 text-base sm:w-auto md:px-8 md:py-4 md:text-lg">
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
