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
      <div className="container-wid relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-[#333] p-6 md:p-24 text-center z-10"
        >
          {/* Noise/Texture Background if available, else CSS Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,108,246,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

          <div className="relative z-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
              {headline}
            </h2>
            
            {subtext && (
              <p className="text-lg md:text-xl text-neutral-400 mb-10 text-balance leading-relaxed">
                {subtext}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={primaryCTA.href} className="btn-primary py-3 md:py-4 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto">
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="btn-secondary py-3 md:py-4 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto bg-[#111] hover:bg-[#1a1a1a]">
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
