"use client";

import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  variant?: "minimal" | "default" | "featured";
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const testimonials: Testimonial[] = [
  {
    quote: "Lumyn transformed our product roadmap. Their ability to understand our vision and execute with precision was exceptional.",
    author: "Sarah Chen",
    role: "Product Lead",
    company: "TechFlow",
    rating: 5,
  },
  {
    quote: "Working with the Lumyn team was seamless. They delivered a sophisticated product that exceeded all our expectations.",
    author: "Michael Torres",
    role: "CEO & Founder",
    company: "InnovateLabs",
    rating: 5,
  },
  {
    quote: "The level of attention to detail and execution was outstanding. Lumyn doesn't just build products, they build solutions.",
    author: "Emma Richardson",
    role: "Founder",
    company: "NextGen Collective",
    rating: 5,
  },
];

export default function Testimonials({
  testimonials: customTestimonials = testimonials,
  variant = "default",
}: TestimonialsProps) {
  const displayTestimonials = customTestimonials.length > 0 ? customTestimonials : testimonials;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  if (variant === "minimal") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="card-testimonial"
          >
            {/* Star rating */}
            {testimonial.rating && (
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 16 16" className="text-amber-400" fill="currentColor">
                    <path d="M8 1l2.4 5h5.4l-4.4 3.2 1.7 5.3-4.7-3.4-4.7 3.4 1.7-5.3-4.4-3.2h5.4z" />
                  </svg>
                ))}
              </div>
            )}

            {/* Quote */}
            <p className="leading-relaxed text-sm md:text-base mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="border-t pt-4" style={{ borderColor: "var(--border-primary)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{testimonial.author}</p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{testimonial.role} at {testimonial.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {displayTestimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="flex flex-col h-full"
        >
          <div className="card-elevated flex flex-col h-full">
            {/* Star rating */}
            {testimonial.rating && (
              <div className="flex gap-1.5 mb-5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 16 16" className="text-amber-400" fill="currentColor">
                    <path d="M8 1l2.4 5h5.4l-4.4 3.2 1.7 5.3-4.7-3.4-4.7 3.4 1.7-5.3-4.4-3.2h5.4z" />
                  </svg>
                ))}
              </div>
            )}

            {/* Quote */}
            <p className="leading-relaxed text-base mb-8 flex-1 italic" style={{ color: "var(--text-secondary)" }}>
              "{testimonial.quote}"
            </p>

            {/* Divider */}
            <div className="my-6" style={{ borderTop: "1px solid var(--border-primary)" }}></div>

            {/* Author info */}
            <div>
              <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{testimonial.author}</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                {testimonial.role} <span style={{ color: "var(--text-tertiary)" }}>at</span> {testimonial.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
