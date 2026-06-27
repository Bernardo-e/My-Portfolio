"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { featuredProjects } from "@/data/projects";
import { Project } from "@/types";
import { cn } from "@/utils/cn";

const projectPalettes: Record<string, { accent: string; bg: string; glow: string; textGlow: string }> = {
  "campus-orbit": {
    accent: "#0ea5e9",
    bg: "from-sky-950/40 to-blue-950/20",
    glow: "rgba(14,165,233,0.15)",
    textGlow: "rgba(14,165,233,0.4)"
  },
  "shadownet-ai": {
    accent: "#7c3aed",
    bg: "from-violet-950/40 to-purple-950/20",
    glow: "rgba(124,58,237,0.15)",
    textGlow: "rgba(124,58,237,0.4)"
  },
  "berd-ai-resume": {
    accent: "#f59e0b",
    bg: "from-amber-950/40 to-orange-950/20",
    glow: "rgba(245,158,11,0.12)",
    textGlow: "rgba(245,158,11,0.3)"
  },
  "berd-habit": {
    accent: "#10b981",
    bg: "from-emerald-950/40 to-teal-950/20",
    glow: "rgba(16,185,129,0.15)",
    textGlow: "rgba(16,185,129,0.4)"
  },
  "berd-focus": {
    accent: "#6366f1",
    bg: "from-indigo-950/40 to-slate-950/20",
    glow: "rgba(99,102,241,0.15)",
    textGlow: "rgba(99,102,241,0.4)"
  },
  "berd-todo-list": {
    accent: "#06b6d4",
    bg: "from-cyan-950/40 to-emerald-950/20",
    glow: "rgba(6,182,212,0.15)",
    textGlow: "rgba(6,182,212,0.4)"
  },
  "berd-vault": {
    accent: "#8b5cf6",
    bg: "from-purple-950/40 to-indigo-950/20",
    glow: "rgba(139,92,246,0.15)",
    textGlow: "rgba(139,92,246,0.4)"
  },
  "berd-track": {
    accent: "#f97316",
    bg: "from-orange-950/40 to-amber-950/20",
    glow: "rgba(249,115,22,0.15)",
    textGlow: "rgba(249,115,22,0.4)"
  }
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const palette = projectPalettes[project.id] || projectPalettes["campus-orbit"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.setProperty("--rx", `${-y}deg`);
    card.style.setProperty("--ry", `${x}deg`);
    const glow = card.querySelector<HTMLDivElement>(".card-glow");
    if (glow) {
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(project)}
        style={{
          transform: "perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform",
        } as React.CSSProperties}
        className="relative rounded-2xl border border-white/[0.12] overflow-hidden cursor-pointer group h-full"
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br", palette.bg, "transition-opacity duration-500", hovered ? "opacity-100" : "opacity-80")} />

        <div
          className="card-glow absolute w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${palette.glow} 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${palette.accent}60, transparent)`,
            opacity: hovered ? 1 : 0.4
          }}
        />

        <div className="relative z-10 p-8 flex flex-col h-full min-h-[340px]">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <div className="font-mono text-[8px] tracking-[0.3em] text-white/80 uppercase">
                {project.date}&nbsp;&nbsp;·&nbsp;&nbsp;{project.role}
              </div>
              <h3
                className="font-display font-light text-2xl text-white"
                style={{ textShadow: hovered ? `0 0 30px ${palette.textGlow}` : "none" }}
              >
                {project.title}
              </h3>
            </div>

            <motion.div
              animate={{ x: hovered ? 4 : 0, y: hovered ? -4 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0"
              style={{ borderColor: hovered ? palette.accent + "50" : undefined }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke={hovered ? palette.accent : "rgba(255,255,255,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>

          <p className="font-sans text-sm leading-relaxed text-white/90 flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-6">
            {project.tags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full font-mono text-[9px] tracking-wider border border-white/[0.14] text-white/85"
                style={{ borderColor: hovered ? palette.accent + "35" : undefined }}
              >
                {tag}
              </span>
            ))}
          </div>

          {project.metrics && (
            <div
              className="flex items-center gap-5 mt-5 pt-5 border-t border-white/[0.06] transition-all duration-500"
              style={{ borderColor: hovered ? palette.accent + "15" : undefined }}
            >
              {project.metrics.slice(0, 3).map(({ label, value }) => (
                <div key={label}>
                  <div
                    className="font-display text-base font-light"
                    style={{ color: hovered ? palette.accent : "rgba(255,255,255,0.7)" }}
                  >
                    {value}
                  </div>
                  <div className="font-mono text-[8px] tracking-wider text-white/60 uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Disable scroll when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const activePalette = selectedProject ? (projectPalettes[selectedProject.id] || projectPalettes["campus-orbit"]) : null;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-transparent py-32 px-8 animate-sections"
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-[1px] bg-secondary/60" />
              <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
                04 — Projects
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display font-extralight text-[clamp(2.5rem,6vw,5rem)] tracking-tight text-white leading-none"
            >
              Featured Products
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="font-mono text-[9px] tracking-widest text-white/60 uppercase hidden lg:block"
          >
            {featuredProjects.length} Systems Launched
          </motion.p>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      {/* Immersive Product Detail Modal */}
      <AnimatePresence>
        {selectedProject && activePalette && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md cursor-default"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="relative w-full max-w-5xl max-h-[88vh] overflow-y-scroll overscroll-contain rounded-2xl border border-white/[0.12] bg-[#020617]/98 p-6 sm:p-10 md:p-12 shadow-2xl"
              style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 font-mono text-[9px] text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-white/20 px-3 py-1.5 rounded bg-white/[0.02]"
              >
                ESC // CLOSE
              </button>

              {/* Glowing Background Radial Blur */}
              <div
                className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none filter blur-[100px] opacity-10"
                style={{ background: activePalette.accent }}
              />

              {/* Title & Metadata */}
              <div className="border-b border-white/[0.06] pb-8 mb-8 space-y-2">
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/80">
                  {selectedProject.date} // Role: {selectedProject.role}
                </span>
                <h2 className="font-display font-light text-4xl sm:text-5xl text-white tracking-wide">
                  {selectedProject.title}
                </h2>
              </div>

              {/* Bento Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
                {/* Left Column: Story */}
                <div className="space-y-8">
                  {/* Overview */}
                  <div className="space-y-3">
                    <h3 className="font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Overview
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-white/90">
                      {selectedProject.longDescription || selectedProject.description}
                    </p>
                  </div>

                  {/* Problem */}
                  {selectedProject.problem && (
                    <div className="space-y-3 p-5 rounded-xl border border-red-500/10 bg-red-500/[0.02]">
                      <h3 className="font-mono text-[10px] tracking-[0.25em] text-red-400 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        The Problem
                      </h3>
                      <p className="font-sans text-sm leading-relaxed text-red-200/80">
                        {selectedProject.problem}
                      </p>
                    </div>
                  )}

                  {/* Solution */}
                  {selectedProject.solution && (
                    <div className="space-y-3 p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02]">
                      <h3 className="font-mono text-[10px] tracking-[0.25em] text-emerald-400 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        The Solution
                      </h3>
                      <p className="font-sans text-sm leading-relaxed text-emerald-200/80">
                        {selectedProject.solution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Spec Sheet */}
                <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-8 lg:pt-0 lg:pl-10">
                  {/* Key Features */}
                  {selectedProject.features && (
                    <div className="space-y-3">
                      <h3 className="font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {selectedProject.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2.5 text-sm text-white/90">
                            <span className="text-secondary/80 mt-1">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Challenges & Takeaways */}
                  {(selectedProject.challenges || selectedProject.lessons) && (
                    <div className="space-y-4">
                      {selectedProject.challenges && (
                        <div className="space-y-2">
                          <h4 className="font-mono text-[9px] tracking-widest text-white/75 uppercase">
                            Engineering Challenge
                          </h4>
                          <p className="font-sans text-[12px] leading-relaxed text-white/85">
                            {selectedProject.challenges}
                          </p>
                        </div>
                      )}
                      {selectedProject.lessons && (
                        <div className="space-y-2">
                          <h4 className="font-mono text-[9px] tracking-widest text-white/75 uppercase">
                            Key Lesson Learned
                          </h4>
                          <p className="font-sans text-[12px] leading-relaxed text-white/85">
                            {selectedProject.lessons}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="space-y-3">
                    <h3 className="font-mono text-[10px] tracking-[0.25em] text-white/80 uppercase">
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full font-mono text-[9.5px] border border-white/[0.15] text-white/90 bg-white/[0.03]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {selectedProject.links.github && (
                      <a
                        href={selectedProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-5 py-3 border border-white/10 hover:border-white/30 rounded-lg text-center font-mono text-[10px] tracking-widest uppercase text-white hover:bg-white/[0.02] transition-all cursor-pointer"
                      >
                        GitHub Repo
                      </a>
                    )}
                    {selectedProject.links.live && (
                      <a
                        href={selectedProject.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-5 py-3 rounded-lg text-center font-mono text-[10px] tracking-widest uppercase text-black font-semibold hover:opacity-90 transition-all cursor-pointer"
                        style={{ backgroundColor: activePalette.accent }}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
