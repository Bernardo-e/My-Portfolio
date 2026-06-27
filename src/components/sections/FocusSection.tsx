"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/cn";

interface FocusItem {
  title: string;
  subtitle: string;
  metric: string;
  glowColor: string;
}

export function FocusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const focusList: FocusItem[] = [
    {
      title: "Full Stack Development",
      subtitle: "Building responsive architectures, optimized API controllers, and secure middleware.",
      metric: "Next.js / Node.js",
      glowColor: "rgba(14,165,233,0.15)" // Blue
    },
    {
      title: "Data Structures & Algorithms",
      subtitle: "Designing efficient computational pipelines, caching systems, and time-optimal search methods.",
      metric: "LeetCode / Python / C",
      glowColor: "rgba(168,85,247,0.15)" // Purple
    },
    {
      title: "Product Engineering",
      subtitle: "Bridging the gap between code quality, conversion mechanics, and end-user behavior.",
      metric: "Metrics-Driven",
      glowColor: "rgba(16,185,129,0.15)" // Emerald
    },
    {
      title: "Modern UI/UX",
      subtitle: "Architecting interactive design systems, fluid micro-animations, and clean typography layouts.",
      metric: "Figma / Tailwind",
      glowColor: "rgba(236,72,153,0.15)" // Pink
    },
    {
      title: "Scalable Web Applications",
      subtitle: "Configuring serverless databases, edge routing, memory queues, and high-concurrency assets.",
      metric: "PostgreSQL / Redis",
      glowColor: "rgba(6,182,212,0.15)" // Cyan
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
      id="focus"
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
              08 — Focus
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            Current Core Focus
          </motion.h2>
        </div>

        {/* Focus items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusList.map((item, index) => {
            const isHovered = hoveredCard === item.title;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoveredCard(item.title)}
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
                    background: `radial-gradient(circle at center, ${item.glowColor} 0%, transparent 70%)`,
                    opacity: isHovered ? 1 : 0
                  }}
                />

                {/* Top border shine */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)`,
                    opacity: isHovered ? 1 : 0.4
                  }}
                />

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                  <div className="space-y-3">
                    <span className="font-mono text-[8px] tracking-[0.25em] text-white/75 uppercase">
                      SYSTEM_FOCUS // {item.metric}
                    </span>
                    <h3 className="font-display font-light text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-white/85">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-1.5 opacity-60 group-hover:opacity-90 transition-opacity duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <span className="font-mono text-[7px] tracking-[0.3em] uppercase">active monitoring</span>
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
