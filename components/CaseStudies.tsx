"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CaseStudy {
  title: string;
  description: string;
  client: string;
  challenge: string;
  result: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  href: string;
  accentColor?: string;
  image?: string;
}

interface CaseStudiesProps {
  caseStudies?: CaseStudy[];
  variant?: "grid" | "featured";
}

const defaultCaseStudies: CaseStudy[] = [
  {
    title: "MindFuel Growth Strategy",
    description: "Scaled a platform to 50K+ active users with optimized engagement.",
    client: "MindFuel",
    challenge: "Build a social platform that prioritizes meaningful interactions.",
    result: "Achieved sustainable growth with 40% MoM retention.",
    metrics: [{ label: "Users", value: "50K+" }, { label: "Retention", value: "+40%" }, { label: "Time", value: "4mo" }],
    tags: ["Product Design", "Engineering"],
    href: "/products#mindfuel",
    accentColor: "#7C6CF6",
  },
  {
    title: "Summai Implementation",
    description: "Developed an AI-powered content analysis tool.",
    client: "Summai",
    challenge: "Create a tool that extracts insights from content.",
    result: "Launched beta with 95%+ accuracy.",
    metrics: [{ label: "Accuracy", value: "95%+" }, { label: "Speed", value: "<1s" }, { label: "Users", value: "5K+" }],
    tags: ["AI", "Performance"],
    href: "/products#summai",
    accentColor: "#3B82F6",
  },
];

export default function CaseStudies({ caseStudies = defaultCaseStudies, variant = "grid" }: CaseStudiesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {caseStudies.map((study, index) => (
        <motion.div
          key={study.client}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <Link href={study.href} className="block group relative w-full h-full p-[1px]  overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative h-full bg-[#0a0a0a]  p-10 md:p-12 flex flex-col z-10 glass-panel border border-[#333] group-hover:border-[#7c6cf6]">
              
              <div className="flex items-center justify-between mb-8 cursor-pointer relative z-20">
                <span className="px-4 py-1.5 bg-white/5 border border-white/10  text-xs font-semibold tracking-wider text-white">
                  {study.client}
                </span>
                <div className="w-10 h-10  bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-500 duration-300">
                {study.title}
              </h3>
              
              <p className="text-neutral-400 text-base leading-relaxed mb-auto pb-8">
                {study.description}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                 {study.metrics.map(metric => (
                   <div key={metric.label}>
                     <p className="text-xl font-bold text-white">{metric.value}</p>
                     <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{metric.label}</p>
                   </div>
                 ))}
              </div>

              {/* Accent Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: study.accentColor }} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
