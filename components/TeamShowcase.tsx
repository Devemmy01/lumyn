"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface TeamShowcaseProps {
  members: TeamMember[];
  variant?: "grid" | "featured";
}

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const defaultMembers: TeamMember[] = [
  {
    name: "Alex Johnson",
    role: "Founder & Engineering Lead",
    bio: "Full-stack engineer with 10+ years building scalable products. Previously at TechFlow.",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "Maya Patel",
    role: "Product & Design",
    bio: "Product strategist focused on user-centered design and data-driven decisions.",
    social: {
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    name: "James Chen",
    role: "CTO & Infrastructure",
    bio: "Cloud architect specializing in scalable systems and DevOps optimization.",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
];

export default function TeamShowcase({
  members = defaultMembers,
  variant = "grid",
}: TeamShowcaseProps) {
  if (variant === "featured") {
    return (
      <div className="space-y-8">
        {members.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="featured-card group"
          >
            <div className="p-8 md:p-10">
              {/* Avatar + Name */}
              <div className="flex items-start gap-6 mb-6">
                {member.image && (
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={64}
                    height={64}
                    className=" w-16 h-16 object-cover"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-semibold group-hover:text-sage transition-colors" style={{ color: "var(--text-primary)" }}>
                    {member.name}
                  </h3>
                  <p className="text-sage font-medium mt-1">{member.role}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {member.bio}
              </p>

              {/* Social Links */}
              {member.social && (
                <div className="flex gap-4 mt-6 pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="hover:text-sage transition-colors" style={{ color: "var(--text-secondary)" }}>
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="hover:text-sage transition-colors" style={{ color: "var(--text-secondary)" }}>
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="hover:text-sage transition-colors" style={{ color: "var(--text-secondary)" }}>
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member, index) => (
        <motion.div
          key={member.name}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="card-elevated"
        >
          {/* Avatar */}
          {member.image && (
            <Image
              src={member.image}
              alt={member.name}
              width={48}
              height={48}
              className=" w-12 h-12 object-cover mb-5"
            />
          )}

          {/* Name & Role */}
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
          <p className="text-sage text-sm font-medium mt-1 mb-4">{member.role}</p>

          {/* Bio */}
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            {member.bio}
          </p>

          {/* Social */}
          {member.social && (
            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
              {member.social.linkedin && (
                <a href={member.social.linkedin} className="hover:text-sage transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M14.5 1H1.5a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h13a.5.5 0 00.5-.5V1.5a.5.5 0 00-.5-.5z"/>
                  </svg>
                </a>
              )}
              {member.social.twitter && (
                <a href={member.social.twitter} className="hover:text-sage transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M15.5 3.5a6 6 0 01-1.7.5 3 3 0 001.3-1.6 6 6 0 01-1.9.7 3 3 0 10-5.1 2.7A8.5 8.5 0 012 3a3 3 0 00.9 4 3 3 0 01-1.4-.4v.04a3 3 0 002.4 2.9 3 3 0 01-1.4.05 3 3 0 002.8 2.1A6 6 0 011 13a8.5 8.5 0 014.6 1.3"/>
                  </svg>
                </a>
              )}
              {member.social.github && (
                <a href={member.social.github} className="hover:text-sage transition-colors" style={{ color: "var(--text-tertiary)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.6 5.5 7.6.4.07.55-.2.55-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-1-1-1.3-1-1.3-.8-.5.06-.5.06-.5.9.07 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.07-.6.3-1 .56-1.2-2-.2-4.1-1-4.1-4.5 0-1 .35-1.8.9-2.5-.1-.2-.4-1 .08-2.1 0 0 .73-.24 2.4.9.7-.2 1.4-.3 2.1-.3.7 0 1.4.1 2.1.3 1.67-1.14 2.4-.9 2.4-.9.48 1.1.18 1.9.09 2.1.56.7.9 1.5.9 2.5 0 3.5-2.1 4.3-4.1 4.5.35.3.65.9.65 1.8v2.6c0 .2.15.5.55.4 3.2-1 5.5-4.1 5.5-7.6C16 3.6 12.4 0 8 0z"/>
                  </svg>
                </a>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
