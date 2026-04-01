"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  badge?: string;
  size?: "default" | "compact";
  children?: React.ReactNode;
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  badge,
  size = "default",
  children,
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY   = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-ivory overflow-hidden"
      aria-label="Hero section"
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 bg-dots opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Glow 1 */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
                   w-[900px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(124,108,246,0.10) 0%, transparent 70%)",
          animation: "heroGlowDrift 11s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* Glow 2 */}
      <div
        className="absolute top-[10%] left-1/2 -translate-x-1/2
                   w-[520px] h-[320px] pointer-events-none blur-[60px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,108,246,0.08) 0%, transparent 65%)",
          animation: "heroGlowDriftSlow 14s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      <div
        className={`container-mid relative ${
          size === "compact"
            ? "py-28 md:py-36"
            : "py-28 md:py-36 lg:py-40"
        }`}
      >
        {/* ── Text block — parallax + fade on scroll ── */}
        <motion.div style={{ y: textY, opacity: fadeOut }}>
          <div className="max-w-4xl mx-auto text-center">

            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-sage/10 border border-sage/20 mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
                <span className="text-xs font-medium text-sage-dark tracking-wide">{badge}</span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.85, ease: EASE }}
              className="heading-display text-charcoal mb-6 text-balance"
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.8, ease: EASE }}
              className="body-lg text-charcoal-muted max-w-2xl mx-auto mb-10 text-balance"
            >
              {subheadline}
            </motion.p>

            {(primaryCTA || secondaryCTA) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.7, ease: EASE }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                {primaryCTA && (
                  <Link href={primaryCTA.href} className="btn-primary">
                    {primaryCTA.label}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
                {secondaryCTA && (
                  <Link href={secondaryCTA.href} className="btn-secondary">
                    {secondaryCTA.label}
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Visual slot — slower parallax ── */}
        {children && (
          <motion.div
            style={{ y: visualY }}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.95, ease: EASE }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
