"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";


interface ContactSectionProps {
  onOpenResume?: () => void;
}

export function ContactSection({ onOpenResume }: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });
  const [emailHovered, setEmailHovered] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [linkedinHovered, setLinkedinHovered] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen bg-transparent flex flex-col items-center justify-center py-40 px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/52 pointer-events-none z-0" />
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Convergence ambient glow — intensifies near footer */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom center, rgba(14,165,233,0.06) 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="w-6 h-[1px] bg-secondary/60" />
          <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/60 uppercase">
            10 — Contact
          </span>
          <div className="w-6 h-[1px] bg-secondary/60" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="font-display font-extralight text-[clamp(2.3rem,6.5vw,5.5rem)] leading-none tracking-tight text-white mb-6"
        >
          Let&apos;s Build Something<br />
          <span className="text-white/25">Great Together.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="font-sans text-sm text-white/70 max-w-sm mb-14 leading-relaxed"
        >
          Whether you have an internship position, a SaaS build, or want to discuss engineering — let&apos;s connect.
        </motion.p>

        {/* Email link */}
        <motion.a
          href="mailto:narded2007@gmail.com"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.45 }}
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          data-magnetic
          className="relative font-display font-light text-[clamp(1.2rem,3vw,2rem)] text-white/80 hover:text-white tracking-wide transition-colors duration-500 mb-14 cursor-pointer"
        >
          narded2007@gmail.com
          <span
            className="absolute bottom-0 left-0 right-0 h-[1px] transition-all duration-500 origin-left"
            style={{
              background: "linear-gradient(to right, rgba(14,165,233,0.6), rgba(99,102,241,0.4))",
              transform: emailHovered ? "scaleX(1)" : "scaleX(0)"
            }}
          />
        </motion.a>

        {/* Social links & Resume Download */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
        >
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/Bernardo-e"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setGithubHovered(true)}
              onMouseLeave={() => setGithubHovered(false)}
              className="relative inline-block font-mono text-[10px] tracking-[0.3em] text-white/70 hover:text-sky-400 uppercase transition-all duration-300 cursor-pointer pb-1.5"
            >
              GitHub
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 transition-transform duration-300 origin-left"
                style={{
                  transform: githubHovered ? "scaleX(1)" : "scaleX(0)"
                }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/bernardo-e-092aaa387"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setLinkedinHovered(true)}
              onMouseLeave={() => setLinkedinHovered(false)}
              className="relative inline-block font-mono text-[10px] tracking-[0.3em] text-white/70 hover:text-sky-400 uppercase transition-all duration-300 cursor-pointer pb-1.5"
            >
              LinkedIn
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400 transition-transform duration-300 origin-left"
                style={{
                  transform: linkedinHovered ? "scaleX(1)" : "scaleX(0)"
                }}
              />
            </a>
          </div>

          <button
            onClick={onOpenResume}
            className="px-8 py-3.5 border border-white/30 hover:border-sky-400 font-mono text-[10px] tracking-[0.25em] text-white hover:text-sky-300 uppercase rounded-md transition-all duration-300 cursor-pointer bg-white/[0.04] hover:bg-sky-500/10 hover:shadow-[0_0_20px_rgba(14,165,233,0.22)] hover:scale-[1.03]"
          >
            View Resume
          </button>
        </motion.div>
      </div>
    </section>
  );
}
