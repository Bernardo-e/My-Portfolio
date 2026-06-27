"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 9.32, suffix: "", label: "Current CGPA" },
  { value: 7, suffix: "+", label: "Projects Built" },
  { value: 1, suffix: "", label: "Hackathon Win" },
  { value: 1, suffix: "", label: "AWS Club Selected" }
];

const traits = ["Craftsman", "Builder", "Visionary"];

// CountUp with rAF + direct DOM text mutation — zero React re-renders during animation
function CountUp({ target, suffix, trigger }: { target: number; suffix: string; trigger: boolean }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current || !spanRef.current) return;
    hasRun.current = true;

    const el = spanRef.current;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [trigger, target, suffix]);

  return <span ref={spanRef}>0{suffix}</span>;
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const statsInView = useInView(statsRef, { once: true, margin: "-10%" });

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    // CSS-based tilt via custom properties — no JS per frame, runs on compositor
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      card.style.setProperty("--rx", `${-y}deg`);
      card.style.setProperty("--ry", `${x}deg`);
    };
    const onLeave = () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
    card.addEventListener("mousemove", onMove, { passive: true });
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen bg-transparent py-32 px-8"
    >
      {/* Subtle section darkening so text reads over the rain */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none z-0" />
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 mb-20"
      >
        <div className="w-6 h-[1px] bg-secondary/60" />
        <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
          02 — About
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">

        {/* Left: Statement */}
        <div className="space-y-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-extralight text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-tight text-white"
          >
            I build digital products<br />
            <em className="not-italic text-white/70">that feel inevitable.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-sans text-sm leading-relaxed text-white/75 max-w-md"
          >
            I am a Full Stack Developer dedicated to building impactful products rather than just applications. Focused on engineering clean, scalable systems with high-quality UI/UX, I love solving real-world problems. I thrive on continuous learning, team collaboration, and crafting thoughtful software that creates real value.
          </motion.p>

          {/* Trait pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            {traits.map((trait, i) => (
              <span
                key={trait}
                className="px-4 py-2 border border-white/20 rounded-full font-mono text-[10px] tracking-[0.2em] text-white/70 hover:border-secondary/30 hover:text-white/80 transition-all duration-300"
              >
                {trait}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: 3D depth card + stats */}
        <div className="space-y-8">
          {/* 3D Card */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "600px",
              transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform",
            } as React.CSSProperties}
            className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl p-8 overflow-hidden cursor-default shadow-[0_8px_32px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
          >

            {/* Card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-violet-500/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="font-mono text-[8px] tracking-[0.3em] text-white/65 uppercase">
                System Profile
              </div>

              <div className="space-y-3">
                {[
                  ["Specialty", "Full Stack Developer"],
                  ["Focus", "SaaS · Web Apps · Databases"],
                  ["Approach", "Build right. Ship fast. Iterate."],
                  ["Status", "Open to Internship Opportunities"],
                ].map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center border-b border-white/[0.04] pb-3">
                    <span className="font-mono text-[10px] text-white/65">{key}</span>
                    <span className="font-sans text-[11px] text-white/95">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-mono text-[9px] text-secondary/70 tracking-widest">
                  AVAILABLE FOR COLLABORATION
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            {stats.map(({ value, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                className="p-6 border border-white/[0.06] rounded-xl bg-white/[0.015] backdrop-blur-xl hover:border-secondary/30 hover:bg-white/[0.025] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all duration-300"
              >
                <div className="font-display text-3.5xl font-normal text-white tabular-nums">
                  <CountUp target={value} suffix={suffix} trigger={statsInView} />
                </div>
                <div className="font-mono text-[9px] tracking-[0.22em] text-white/80 uppercase mt-1">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
