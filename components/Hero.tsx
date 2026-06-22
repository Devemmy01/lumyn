"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimeBackground from "./AnimeBackground";

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  badge?: string;
  size?: "default" | "compact";
  children?: React.ReactNode;
}

const EASE = [0.85, 0, 0.15, 1] as [number, number, number, number];

export default function Hero({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  badge,
  size = "default",
  children,
}: HeroProps) {
  // Split headline by spaces to animate words
  const words = headline.split(" ");
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative mt-5 flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden border-b border-[#222] bg-[#050505] text-white"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 bg-[#7c6cf6] opacity-[0.1] blur-[130px]" />
      <div className="lumyn-soft-glow pointer-events-none absolute inset-0" />

      <AnimeBackground />

      <motion.div
        className={`container-wide relative z-10 flex w-full flex-col items-start ${size === "compact" ? "py-24" : "py-28 md:py-40"}`}
      >
        <motion.div className="w-full">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55 backdrop-blur-md md:mb-12"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] shadow-[0_0_20px_rgba(124,108,246,0.8)]" />
              {badge}
            </motion.div>
          )}

          <h1 className="heading-display mb-10 flex w-full max-w-[1200px] flex-wrap gap-x-4 gap-y-2 md:gap-y-6">
            {words.map((word, idx) => (
              <span
                key={idx}
                className="overflow-hidden inline-block align-top"
              >
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    delay: 0.1 + idx * 0.05,
                    duration: 1.2,
                    ease: EASE,
                  }}
                  className="inline-block origin-top-left"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-12 flex w-full flex-col justify-between gap-10 md:mt-20 md:flex-row md:items-end">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.5, ease: EASE }}
              className="max-w-xl text-balance text-lg font-medium leading-snug text-neutral-400 md:text-2xl"
            >
              {subheadline}
            </motion.p>

            {(primaryCTA || secondaryCTA) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
                className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              >
                {primaryCTA && (
                  <Link
                    href={primaryCTA.href}
                    className="btn-primary"
                  >
                    {primaryCTA.label}
                  </Link>
                )}
                {secondaryCTA && (
                  <Link
                    href={secondaryCTA.href}
                    className="btn-secondary"
                  >
                    {secondaryCTA.label}
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.5, ease: EASE }}
            className="relative mt-12 w-full md:mt-16"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
