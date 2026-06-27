"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { journeyEntries } from "@/data/journey";
import { cn } from "@/utils/cn";

const typeColors: Record<string, string> = {
  startup: "#0ea5e9",
  work: "#7c3aed",
  education: "#10b981",
  milestone: "#f59e0b"
};

const typeLabels: Record<string, string> = {
  startup: "Startup",
  work: "Work",
  education: "Education",
  milestone: "Milestone"
};

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative bg-transparent py-32 px-8"
    >
      <div className="absolute inset-0 bg-black/58 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-5xl mx-auto">
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
              06 — Journey
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            How I Got Here
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[140px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-secondary/20 via-white/5 to-transparent" />

          <div className="space-y-0">
            {journeyEntries.map((entry, i) => {
              const color = typeColors[entry.type];
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                  className="relative flex items-start gap-8 pb-14"
                >
                  {/* Year badge */}
                  <div className="w-[110px] flex-shrink-0 pt-1.5">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-white/75 tabular-nums">
                      {entry.year}
                    </span>
                  </div>

                  {/* Timeline node */}
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2 bg-black transition-all duration-300"
                      style={{ borderColor: color }}
                    />
                    {/* Glow pulse on first load */}
                    <div
                      className="absolute inset-[-4px] rounded-full animate-ping opacity-20"
                      style={{ background: color, animationDuration: `${2 + i * 0.5}s` }}
                    />
                  </div>

                  {/* Content card */}
                  <div className="flex-1 pb-2">
                    <div className="group rounded-xl border border-white/[0.05] bg-white/[0.01] p-6 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.02]">
                      {/* Type badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="font-mono text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-full border"
                          style={{ color, borderColor: color + "30", background: color + "08" }}
                        >
                          {typeLabels[entry.type]}
                        </span>
                        {entry.highlight && (
                          <span className="font-mono text-[9px] text-white/80">
                            {entry.highlight}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-light text-lg text-white mb-0.5">
                        {entry.role}
                      </h3>
                      <div className="font-mono text-[10px] tracking-widest text-white/85 mb-4">
                        {entry.company}&nbsp;&nbsp;·&nbsp;&nbsp;{entry.location}
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-white/88">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
