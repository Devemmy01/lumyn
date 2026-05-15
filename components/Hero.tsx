"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityOut = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full text-white mt-5 flex flex-col items-center justify-center min-h-[100svh] overflow-hidden bg-[#050505] border-b border-[#222]"
    >
      {/* Stark background, with purple accent glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#7c6cf6] opacity-[0.07] blur-[120px] pointer-events-none" />

      <AnimeBackground />

      <motion.div
        style={{ y: y1, opacity: opacityOut }}
        className={`container-wide relative z-10 w-full flex flex-col items-start ${size === "compact" ? "py-24" : "py-32 md:py-48"}`}
      >
        <motion.div className="w-full">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="inline-flex items-center gap-3 mb-8 md:mb-12 border border-[#333] px-4 py-2 bg-black uppercase tracking-widest text-xs font-bold rounded-full"
              aria-hidden={false}
              role="img"
              aria-label="Five star rating"
            >
              <div className="flex items-center gap-1 text-[#7c6cf6]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 20.013 4.665 24l1.585-8.648L.5 9.75l7.832-1.732L12 .587z" />
                  </svg>
                ))}
              </div>
              {/* Optionally render short label if provided */}
              <span className="text-[#9aa0a6] ml-2 text-xs">Top rated</span>
            </motion.div>
          )}

          <h1 className="heading-display mb-10 w-full max-w-[1200px] flex flex-wrap gap-x-4 gap-y-2 md:gap-y-6">
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

          <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-12 mt-12 md:mt-24">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.5, ease: EASE }}
              className="text-lg md:text-2xl text-neutral-400 font-medium max-w-xl text-balance leading-snug"
            >
              {subheadline}
            </motion.p>

            {(primaryCTA || secondaryCTA) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
                className="flex items-start md:items-center gap-6"
              >
                {primaryCTA && (
                  <Link
                    href={primaryCTA.href}
                    className="border rounded-full p-3 hover:bg-[#7c6cf6] transition-all flex gap-1 items-center group"
                  >
                    {primaryCTA.label}
                  </Link>
                )}
                {secondaryCTA && (
                  <Link
                    href={secondaryCTA.href}
                    className="border rounded-full p-3 hover:border-[#7c6cf6] text-[#7c6cf6]"
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
            className="mt-32 relative w-full"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
