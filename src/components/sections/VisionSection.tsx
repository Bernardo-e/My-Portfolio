"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const principles = [
  { number: "01", text: "Engineering is craft. Every function, every interaction—deliberate." },
  { number: "02", text: "Products should feel inevitable. Not built, but discovered." },
  { number: "03", text: "The best interface is the one users never notice." }
];

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative min-h-screen bg-transparent flex items-center justify-center py-40 px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Ambient light orb */}
      <motion.div
        style={{
          y,
          background: "radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, rgba(99,102,241,0.02) 40%, transparent 70%)"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
      />


      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <div className="w-6 h-[1px] bg-secondary/60" />
          <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
            09 — Vision
          </span>
          <div className="w-6 h-[1px] bg-secondary/60" />
        </motion.div>

        {/* Main statement */}
        <motion.h2
          initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-display font-extralight text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-tight text-white mb-8"
        >
          I don&apos;t build features.
          <br />
          <span className="text-white/60">I build futures.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.35 }}
          className="font-sans text-sm leading-relaxed text-white/70 max-w-lg mx-auto mb-20"
        >
          I believe software should solve meaningful problems while delivering exceptional user experiences. My goal is to build products that create real value, continuously improve as an engineer, and contribute to impactful technology through innovation and thoughtful design.
        </motion.p>

        {/* Principles */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {principles.map(({ number, text }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.12 }}
              className="group p-6 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-secondary/15 hover:bg-white/[0.025] transition-all duration-500"
            >
              <div className="font-mono text-[10px] text-secondary/40 mb-3 tracking-widest">
                {number}
              </div>
              <p className="font-sans text-sm leading-relaxed text-white/75 group-hover:text-white/80 transition-colors duration-300">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
