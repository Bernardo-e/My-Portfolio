"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/utils/cn";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
}

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: ProcessStep[] = [
    {
      number: "01",
      title: "Research",
      description: "Deep dive into problem spaces, user pain points, competitor analysis, and technological constraints.",
      glowColor: "rgba(14,165,233,0.15)", // Blue
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Planning",
      description: "Map architecture, plan technical specifications, model database schemas, and align development timelines.",
      glowColor: "rgba(168,85,247,0.15)", // Purple
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Design",
      description: "Establish design tokens, typography scales, wireframes, and clickable visual prototypes in Figma.",
      glowColor: "rgba(236,72,153,0.15)", // Pink
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 2 12 22Z" />
          <path d="M12 6V12L16 14" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Development",
      description: "Write structured, type-safe, and self-documenting code utilizing industry best practices.",
      glowColor: "rgba(16,185,129,0.15)", // Emerald
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      number: "05",
      title: "Testing",
      description: "Deploy automated unit testing, integration tests, responsiveness audits, and layout validation checks.",
      glowColor: "rgba(245,158,11,0.15)", // Amber
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11" />
        </svg>
      )
    },
    {
      number: "06",
      title: "Deployment",
      description: "Set up continuous integration scripts and host applications across globally edge-cached CDN nodes.",
      glowColor: "rgba(6,182,212,0.15)", // Cyan
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      )
    },
    {
      number: "07",
      title: "Iteration",
      description: "Assess user behaviors, monitor errors, analyze site analytics, and roll out feature expansions.",
      glowColor: "rgba(99,102,241,0.15)", // Indigo
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      )
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative bg-transparent py-32 px-8 overflow-hidden animate-sections"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Laser connection styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes laser-flow {
            0% { stroke-dashoffset: 24; }
            100% { stroke-dashoffset: 0; }
          }
          .laser-path {
            stroke-dasharray: 8, 16;
            animation: laser-flow 1.5s linear infinite;
          }
        `
      }} />

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
              07 — Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            Development Workflow
          </motion.h2>
        </div>

        {/* Process Flow Cards (Flex column layout for absolute control) */}
        <div className="relative space-y-12">
          {/* Vertical linking SVG connector */}
          <div className="absolute left-[34px] top-6 bottom-6 w-[2px] pointer-events-none hidden md:block" aria-hidden>
            <svg className="w-full h-full" fill="none">
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="rgba(14,165,233,0.3)"
                strokeWidth="2"
                className="laser-path"
              />
            </svg>
          </div>

          {steps.map((step, index) => {
            const isActive = activeStep === index;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className="relative md:pl-20 group"
              >
                {/* Node dot connection */}
                <div className="absolute left-[24px] top-4 w-5 h-5 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center pointer-events-none z-10 transition-all duration-500 group-hover:scale-110 hidden md:flex">
                  <div
                    className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{
                      background: isActive ? "white" : "rgba(255,255,255,0.2)",
                      boxShadow: isActive ? `0 0 10px white` : "none"
                    }}
                  />
                </div>

                {/* Flow card container */}
                <div
                  className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between transition-all duration-500 hover:border-white/10 hover:bg-white/[0.02]"
                >
                  <div className="flex gap-6 items-center">
                    {/* Step ID */}
                    <span className="font-mono text-xs text-white/75 select-none">
                      {step.number}
                    </span>

                    {/* Step Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/[0.05] bg-white/[0.02] flex-shrink-0 transition-colors duration-500"
                      style={{
                        borderColor: isActive ? step.glowColor.replace("0.15", "0.4") : "rgba(255,255,255,0.05)",
                        color: isActive ? "white" : "rgba(255,255,255,0.4)"
                      }}
                    >
                      {step.icon}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-light text-lg text-white">
                        {step.title}
                      </h3>
                      <p className="font-sans text-sm text-white/88 max-w-2xl leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-[8px] tracking-[0.25em] text-white/10 uppercase hidden xl:block select-none">
                    STAG_PHASE // OK
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
