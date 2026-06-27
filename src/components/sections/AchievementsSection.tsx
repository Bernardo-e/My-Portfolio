"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/cn";

interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  glowColor: string;
}

export function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const achievements: Achievement[] = [
    {
      id: "hackathon",
      category: "Competition",
      title: "Hackathon Winner",
      description: "Secured first place in the university-wide 36-hour hackathon, designing and deploying an innovative full-stack network security threat model.",
      date: "2024",
      glowColor: "rgba(124,58,237,0.15)", // Purple
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    },
    {
      id: "aws",
      category: "Leadership",
      title: "AWS Club Selected Member",
      description: "Selected as an official member of the campus AWS Cloud Club, collaborating on cloud deployments, operations, and technical workshops.",
      date: "2024 - Present",
      glowColor: "rgba(16,185,129,0.15)", // Emerald
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M12 2v9M8 5h8" />
        </svg>
      )
    },
    {
      id: "cgpa",
      category: "Academic",
      title: "9.32 CGPA",
      description: "Consistent top academic performer, maintaining a 9.32 GPA in B.E. Computer Science and Engineering at Sathyabama Institute of Science and Technology.",
      date: "2025 - Present",
      glowColor: "rgba(14,165,233,0.15)", // Blue
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      )
    },
    {
      id: "projects",
      category: "Engineering",
      title: "Completed Multiple Full Stack Projects",
      description: "Successfully built and deployed multiple production-grade web applications from scratch, utilizing relational and serverless databases.",
      date: "2023 - 2026",
      glowColor: "rgba(245,158,11,0.15)", // Amber
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.setProperty("--rx", `${-y}deg`);
    card.style.setProperty("--ry", `${x}deg`);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative bg-transparent py-32 px-8 overflow-hidden animate-sections"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-6 h-[1px] bg-secondary/60" />
            <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
              05 — Achievements
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            Milestones & Honors
          </motion.h2>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item, index) => {
            const isHovered = hoveredCard === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: isHovered 
                    ? "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-5px) translateZ(0)"
                    : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0)",
                  transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 1)",
                  willChange: "transform",
                } as React.CSSProperties}
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl p-8 overflow-hidden transition-all duration-500 hover:border-white/12 hover:bg-white/[0.025] hover:shadow-[0_8px_32px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${item.glowColor} 0%, transparent 60%)`,
                    opacity: isHovered ? 1 : 0
                  }}
                />

                <div className="relative z-10 flex gap-6 items-start">
                  {/* Icon container */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/[0.06] bg-white/[0.02] transition-colors duration-500"
                    style={{
                      borderColor: isHovered ? item.glowColor.replace("0.15", "0.4") : "rgba(255,255,255,0.06)",
                      color: isHovered ? "white" : "rgba(255,255,255,0.6)"
                    }}
                  >
                    {item.icon}
                  </div>

                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-white/80">
                        {item.category}
                      </span>
                      <span className="font-mono text-[9px] text-white/65">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="font-display font-light text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
