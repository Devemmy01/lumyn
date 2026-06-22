"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

const systemNodes = [
  { label: "Studio", x: "10%", y: "24%", desktopX: "33%", desktopY: "30%", delay: 0, className: "" },
  { label: "Academy", x: "58%", y: "20%", desktopX: "58%", desktopY: "24%", delay: 0.2, className: "" },
  {
    label: "Products",
    x: "74%",
    y: "58%",
    desktopX: "72%",
    desktopY: "56%",
    delay: 0.35,
    className: "hidden sm:block",
  },
  {
    label: "Journal",
    x: "16%",
    y: "62%",
    desktopX: "26%",
    desktopY: "64%",
    delay: 0.5,
    className: "hidden sm:block",
  },
];

const metrics = [
  ["Signal", "94"],
  ["Focus", "87"],
  ["Craft", "99"],
];

export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 22 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="dark-visual relative mx-auto min-h-[340px] w-full max-w-6xl select-none overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07070a] p-3 shadow-[0_40px_140px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:min-h-[500px] md:min-h-[620px] md:rounded-[2rem] md:p-8"
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      aria-hidden="true"
    >
      <div className="lumyn-hero-glow lumyn-grid absolute inset-0" />
      <div className="absolute left-1/2 top-[46%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-[380px] sm:w-[380px] md:top-1/2 md:h-[520px] md:w-[520px]" />
      <div className="absolute left-1/2 top-[46%] h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c6cf6]/25 sm:h-[250px] sm:w-[250px] md:top-1/2 md:h-[340px] md:w-[340px]" />
      <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="absolute left-1/2 top-[48%] z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.35rem] border border-white/15 bg-black/50 shadow-[0_30px_100px_rgba(124,108,246,0.28)] backdrop-blur-xl sm:h-40 sm:w-40 md:top-1/2 md:h-56 md:w-56 md:rounded-[2rem]">
        <div className="absolute inset-3 rounded-[1.1rem] border border-white/10 bg-white/[0.03] md:inset-4 md:rounded-[1.5rem]" />
        <div className="relative scale-75 sm:scale-110 md:scale-150">
          <Image src="/logo.png" alt="Lumyn Logo" width={100} height={100} priority />
        </div>
      </div>

      <svg
        className="absolute inset-0 h-full w-full text-[#7c6cf6]/30 sm:text-[#7c6cf6]/35"
        viewBox="0 0 1000 620"
        fill="none"
        preserveAspectRatio="none"
      >
        {[
          "M500 310 C330 160 210 190 160 176",
          "M500 310 C650 120 780 132 820 138",
          "M500 310 C690 430 810 400 860 430",
          "M500 310 C350 445 260 428 190 455",
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 + index * 0.15 }}
          />
        ))}
      </svg>

      {systemNodes.map((node) => (
        <motion.div
          key={node.label}
          className={`absolute left-[var(--node-x)] top-[var(--node-y)] z-30 max-w-[112px] rounded-2xl border border-white/10 bg-black/70 px-3 py-2 text-xs font-medium text-white/80 shadow-2xl backdrop-blur-xl sm:max-w-none sm:px-4 sm:py-3 sm:text-sm md:left-[var(--node-x-md)] md:top-[var(--node-y-md)] ${node.className}`}
          style={
            {
              "--node-x": node.x,
              "--node-y": node.y,
              "--node-x-md": node.desktopX,
              "--node-y-md": node.desktopY,
            } as CSSProperties
          }
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.7, delay: node.delay },
            scale: { duration: 0.7, delay: node.delay },
            y: { duration: 0.7, delay: node.delay },
          }}
        >
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#7c6cf6] shadow-[0_0_18px_rgba(124,108,246,0.9)]" />
          {node.label}
        </motion.div>
      ))}

      <div className="absolute left-5 top-8 z-20 hidden w-72 rounded-3xl border border-white/10 bg-black/50 p-5 shadow-2xl backdrop-blur-xl md:block">
        <div className="mb-5 flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="space-y-2 font-mono text-xs leading-6 text-white/65">
          <p>
            <span className="text-[#b9adff]">const</span> lumyn = studio()
          </p>
          <p className="pl-4 text-white/40">.buildCalmSystems()</p>
          <p className="pl-4 text-white/40">.teachEngineering()</p>
          <p className="pl-4 text-white/40">.publishInPublic()</p>
        </div>
      </div>

      <div className="absolute bottom-8 right-5 z-20 hidden w-80 rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-xl md:block">
        <p className="mb-5 text-xs uppercase tracking-[0.18em] text-white/35">
          System Health
        </p>
        <div className="space-y-4">
          {metrics.map(([label, value]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-[#7c6cf6]"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-5 md:hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-white/35">
            Lumyn OS
          </p>
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/50">
            Live
          </span>
        </div>
        <p className="mt-2 text-sm font-medium leading-snug tracking-tight text-white/80">
          Software, learning, and products in one calm system.
        </p>
      </motion.div>
    </motion.div>
  );
}
