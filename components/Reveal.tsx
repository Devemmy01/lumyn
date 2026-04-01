"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in milliseconds before the reveal fires. */
  delay?: number;
  /** Animation variant for the reveal. */
  variant?: "up" | "fade" | "scale" | "left";
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const variants = {
  up: {
    hidden:  { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden:  { opacity: 0, scale: 0.94, y: 18 },
    visible: { opacity: 1, scale: 1,    y: 0  },
  },
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  left: {
    hidden:  { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0   },
  },
} as const;

export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[variant]}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
