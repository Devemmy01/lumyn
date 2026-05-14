"use client";

import { motion } from "framer-motion";

interface Stat {
  value: string | number;
  label: string;
  description?: string;
}

interface StatsBannerProps {
  stats: Stat[];
  layout?: "horizontal" | "grid";
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const defaultStats: Stat[] = [
  { value: "100+", label: "Products Built", description: "Across diverse industries" },
  { value: "50K+", label: "Active Users", description: "Using Lumyn products daily" },
  { value: "98%", label: "Client Satisfaction", description: "From ongoing partnerships" },
  { value: "4x", label: "Performance Improvement", description: "Average metric boost" },
];

export default function StatsBanner({
  stats = defaultStats,
  layout = "grid",
}: StatsBannerProps) {
  const containerClass = layout === "horizontal"
    ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";

  return (
    <div className={containerClass}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: EASE,
          }}
          viewport={{ once: true }}
          className="metric-card"
        >
          <div className="metric-value">{stat.value}</div>
          <div className="metric-label">{stat.label}</div>
          {stat.description && (
            <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>{stat.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
