"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";

interface Service {
  title: string;
  description: string;
  icon?: React.ReactNode;
  tags?: string[];
}

interface ServicesProps {
  services?: Service[];
}

const EASE = [0.85, 0, 0.15, 1] as [number, number, number, number];

const defaultServices: Service[] = [
  {
    title: "Product Development",
    description: "End-to-end product development from concept to launch. We handle design, engineering, and deployment so you can focus on your vision.",
    tags: ["Full-Stack", "Architecture", "Deployment"],
  },
  {
    title: "Systems Engineering",
    description: "Scalable, performant systems designed for growth. We architect solutions that handle millions of users without breaking a sweat.",
    tags: ["Cloud Infrastructure", "DevOps", "Performance"],
  },
  {
    title: "UI / UX Design",
    description: "Beautiful, brutalist, and intuitive interfaces. We design with data and deep aesthetic awareness, ignoring standard assumptions.",
    tags: ["Design Systems", "Prototyping", "Interactions"],
  },
  {
    title: "Intelligence",
    description: "Leverage the power of AI to transform your business. From custom LLM tools to predictive modeling infrastructure.",
    tags: ["AI Tools", "LLM Integration", "Data Science"],
  }
];

export default function Services({ services = defaultServices }: ServicesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div ref={containerRef} className="w-full border-t border-[#333] flex flex-col relative overflow-hidden bg-[#050505]">
      {services.map((service, index) => {
        const isHovered = hoveredIndex === index;
        
        return (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
            viewport={{ once: true, margin: "-50px" }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative border-b border-[#333] py-12 md:py-20 flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-16 cursor-default transition-all duration-700 hover:bg-[#7c6cf6]/5 px-6 md:px-12 -mx-6 md:-mx-12 overflow-hidden"
          >
            {/* Parallax block number */}
            <div className="flex-1 md:max-w-2xl relative z-10">
              <motion.span style={{ y: backgroundY }} className="text-[#333] block mb-4 md:mb-8 font-mono text-sm tracking-widest uppercase transition-colors duration-500 group-hover:text-[#7c6cf6]">
                0{index + 1}
              </motion.span>
              <h3 className="text-4xl md:text-6xl font-medium tracking-tight uppercase text-white transition-transform duration-700 ease-out group-hover:translate-x-4">
                {service.title}
              </h3>
            </div>
            
            <div className="flex-1 md:max-w-xl flex flex-col justify-end mt-4 md:mt-20 relative z-10">
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed mb-8 md:mb-12 transition-colors duration-500 group-hover:text-neutral-200">
                {service.description}
              </p>
              
              {service.tags && (
                <div className="flex flex-wrap gap-3">
                  {service.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium tracking-widest uppercase px-4 py-2 border border-[#333] text-neutral-400 transition-colors duration-500 group-hover:border-[#7c6cf6] group-hover:text-[#7c6cf6] group-hover:bg-[#7c6cf6]/10">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
