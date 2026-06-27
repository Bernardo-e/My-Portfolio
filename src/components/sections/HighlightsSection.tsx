"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/cn";

interface Highlight {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  glowColor: string;
}

export function HighlightsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const highlights: Highlight[] = [
    {
      id: "cgpa",
      value: "9.32",
      label: "Cumulative CGPA (CSE)",
      glowColor: "rgba(14,165,233,0.15)", // Blue
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      )
    },
    {
      id: "hackathon",
      value: "Winner",
      label: "Hackathon Winner",
      glowColor: "rgba(168,85,247,0.15)", // Purple
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
          <path d="M12 2a4 4 0 0 0-4 4v6h8V6a4 4 0 0 0-4-4z" />
        </svg>
      )
    },
    {
      id: "projects",
      value: "7+",
      label: "Projects Shipped",
      glowColor: "rgba(16,185,129,0.15)", // Emerald
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    {
      id: "stack",
      value: "Full Stack",
      label: "Developer & Product Builder",
      glowColor: "rgba(236,72,153,0.15)", // Pink
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      id: "aws",
      value: "Member",
      label: "AWS Club Selected Member",
      glowColor: "rgba(245,158,11,0.15)", // Amber
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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
      id="highlights"
      className="relative bg-transparent py-24 px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/55 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="w-6 h-[1px] bg-secondary/60" />
          <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
            01 — Highlights
          </span>
        </motion.div>

        {/* Highlights Bento-ish Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {highlights.map((item, index) => {
            const isHovered = hoveredCard === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
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
                className="relative rounded-2xl border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:border-white/12 hover:bg-white/[0.025] hover:shadow-[0_8px_32px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
              >
                {/* Mouse interaction glowing background */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${item.glowColor} 0%, transparent 70%)`,
                    opacity: isHovered ? 1 : 0
                  }}
                />

                {/* Card border shine */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)`,
                    opacity: isHovered ? 1 : 0.4
                  }}
                />

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/[0.06] bg-white/[0.02] mb-6 transition-all duration-500"
                    style={{
                      borderColor: isHovered ? item.glowColor.replace("0.15", "0.4") : "rgba(255,255,255,0.06)",
                      color: isHovered ? "white" : "rgba(255,255,255,0.65)"
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Value & Label */}
                  <div className="space-y-2">
                    <h3
                      className="font-display font-light text-3.5xl text-white tracking-wide transition-all duration-500"
                      style={{
                        textShadow: isHovered ? `0 0 20px ${item.glowColor.replace("0.15", "0.4")}` : "none"
                      }}
                    >
                      {item.value}
                    </h3>
                    <p className="font-mono text-[9px] tracking-widest text-white/90 uppercase leading-normal">
                      {item.label}
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
