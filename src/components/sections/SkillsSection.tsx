"use client";

import { useRef, useState, useCallback, memo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { skillCategories } from "@/data/skills";

// ─── Animated Skill Pill ─────────────────────────────────────────────────────
const SkillPill = memo(function SkillPill({
  name,
  color,
  isHighlighted,
  isActive,
  delay,
}: {
  name: string;
  color: string;
  isHighlighted: boolean;
  isActive: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3, scale: 1.04 }}
      className="relative cursor-default"
    >
      <motion.div
        animate={{
          borderColor: isHighlighted
            ? color
            : isActive
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.07)",
          backgroundColor: isHighlighted
            ? `${color}18`
            : "rgba(255,255,255,0.025)",
          boxShadow: isHighlighted
            ? `0 0 16px ${color}30, inset 0 0 10px ${color}08`
            : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="px-4 py-2 rounded-full border text-sm font-mono tracking-wide transition-all"
      >
        <motion.span
          animate={{
            color: isHighlighted ? color : "rgba(255,255,255,0.92)",
          }}
          transition={{ duration: 0.25 }}
          className="text-[11px] font-medium tracking-[0.08em]"
        >
          {name}
        </motion.span>
      </motion.div>

      {/* Glow dot when highlighted */}
      {isHighlighted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
      )}
    </motion.div>
  );
});

// ─── Category Group ──────────────────────────────────────────────────────────
const CategoryGroup = memo(function CategoryGroup({
  cat,
  isHighlighted,
  isActive,
  baseDelay,
}: {
  cat: (typeof skillCategories)[0];
  isHighlighted: boolean;
  isActive: boolean;
  baseDelay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: isActive && !isHighlighted ? 0.35 : 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      {/* Category label */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: baseDelay }}
        className="flex items-center gap-2"
      >
        <motion.div
          animate={{
            boxShadow: isHighlighted ? `0 0 10px ${cat.color}` : "none",
            scale: isHighlighted ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: cat.color }}
        />
        <motion.span
          animate={{ color: isHighlighted ? cat.color : "rgba(255,255,255,0.7)" }}
          transition={{ duration: 0.3 }}
          className="font-mono text-[8px] tracking-[0.35em] uppercase"
        >
          {cat.label}
        </motion.span>
        <motion.div
          animate={{ opacity: isHighlighted ? 1 : 0.2 }}
          transition={{ duration: 0.3 }}
          className="flex-1 h-[1px]"
          style={{
            background: `linear-gradient(to right, ${cat.color}60, transparent)`,
          }}
        />
      </motion.div>

      {/* Skills row */}
      <div className="flex flex-wrap gap-2.5 pl-4">
        <AnimatePresence>
          {cat.skills.map((skill, i) => (
            <SkillPill
              key={skill.name}
              name={skill.name}
              color={cat.color}
              isHighlighted={isHighlighted}
              isActive={isActive}
              delay={baseDelay + i * 0.06}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// ─── Right-side legend ───────────────────────────────────────────────────────
const CategoryLegend = memo(function CategoryLegend({
  hoveredCategory,
  onHover,
}: {
  hoveredCategory: string | null;
  onHover: (id: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="font-mono text-[8px] tracking-[0.3em] text-white/40 uppercase mb-6">
        Filter by
      </div>
      {skillCategories.map((cat) => (
        <motion.div
          key={cat.id}
          onMouseEnter={() => onHover(cat.id)}
          onMouseLeave={() => onHover(null)}
          animate={{
            backgroundColor:
              hoveredCategory === cat.id
                ? `${cat.color}12`
                : "rgba(255,255,255,0)",
            borderColor:
              hoveredCategory === cat.id
                ? `${cat.color}40`
                : "rgba(255,255,255,0.04)",
          }}
          transition={{ duration: 0.25 }}
          className="group cursor-pointer border rounded-xl px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                backgroundColor:
                  hoveredCategory === cat.id ? cat.color : `${cat.color}80`,
                boxShadow:
                  hoveredCategory === cat.id ? `0 0 10px ${cat.color}` : "none",
                scale: hoveredCategory === cat.id ? 1.2 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            />
            <motion.span
              animate={{
                color:
                  hoveredCategory === cat.id
                    ? cat.color
                    : "rgba(255,255,255,0.92)",
              }}
              transition={{ duration: 0.25 }}
              className="font-sans text-sm font-medium"
            >
              {cat.label}
            </motion.span>
          </div>
          <div className="mt-2 pl-4.5 flex flex-wrap gap-1">
            {cat.skills.map((skill) => (
              <span
                key={skill.name}
                className="font-mono text-[7.5px] text-white/70"
              >
                {skill.name} ·{" "}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// ─── Main Section ─────────────────────────────────────────────────────────────
export function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryHover = useCallback((id: string | null) => {
    setHoveredCategory(id);
  }, []);

  // Precompute base delays so each category starts after the previous
  const delays = skillCategories.reduce<number[]>((acc, cat, i) => {
    const prev = i === 0 ? 0.35 : acc[i - 1] + skillCategories[i - 1].skills.length * 0.06 + 0.15;
    return [...acc, prev];
  }, []);

  const anyHovered = hoveredCategory !== null;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative bg-transparent py-32 px-8"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto">
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
              03 — Skills
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
          >
            Technology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="font-sans text-sm text-white/70 mt-3 max-w-md"
          >
            The technologies I use to build products that scale.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-20 items-start">
          {/* Left — animated skill groups */}
          {isInView && (
            <div className="flex flex-col gap-10">
              {skillCategories.map((cat, i) => (
                <CategoryGroup
                  key={cat.id}
                  cat={cat}
                  isHighlighted={hoveredCategory === cat.id}
                  isActive={anyHovered}
                  baseDelay={delays[i]}
                />
              ))}
            </div>
          )}

          {/* Right — filter legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="sticky top-32"
          >
            <CategoryLegend
              hoveredCategory={hoveredCategory}
              onHover={handleCategoryHover}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
