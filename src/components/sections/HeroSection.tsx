"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } }
};

// Removed blur() — it's the most GPU-expensive CSS property to animate
const lineVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  // Store only THIS section's ScrollTrigger instances
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const ctx = gsap.context(() => {
      // Parallax — use transform3d to stay on GPU compositor thread
      gsap.to(text, {
        y: "-10%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 2,          // Higher scrub value = more damping = less jank
          invalidateOnRefresh: true,
        }
      });

      // Scroll indicator float
      gsap.to(scrollIndicatorRef.current, {
        y: 7,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: "sine.inOut"
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Vignette overlays for text legibility */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.4) 100%)" }}
      />

      {/* Central content */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center text-center gap-6 px-8 max-w-5xl mx-auto"
        style={{ willChange: "transform" }}
      >
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.35em] text-secondary/80 uppercase">
            Active System Host
          </span>
        </motion.div>

        {/* Main name */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.h1
            variants={lineVariants}
            className="font-display font-extralight text-[clamp(4rem,12vw,11rem)] leading-none tracking-[0.08em] text-white select-none"
            style={{ textShadow: "0 0 60px rgba(59,130,246,0.15)" }}
          >
            BERNARDO
          </motion.h1>

          <motion.p
            variants={lineVariants}
            className="font-sans font-light text-[clamp(0.65rem,1.8vw,0.9rem)] tracking-[0.22em] text-white/80 mt-3 uppercase text-center max-w-2xl"
          >
            Full Stack Developer&nbsp;&nbsp;·&nbsp;&nbsp;Product Builder&nbsp;&nbsp;·&nbsp;&nbsp;Computer Science Student
          </motion.p>
        </motion.div>

        {/* Short introduction */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="font-sans text-sm leading-relaxed text-white/70 max-w-xl mt-2"
        >
          I am a Full Stack Developer passionate about building modern web applications and digital products that solve real-world problems. I enjoy transforming ideas into scalable, user-focused experiences while continuously learning new technologies and improving my engineering skills.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.9 }}
          className="flex items-center gap-4 mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
            data-magnetic
            className="px-8 py-3.5 bg-white text-black font-sans text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 cursor-pointer"
          >
            View Projects
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            data-magnetic
            className="px-8 py-3.5 border border-white/20 font-sans text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-white rounded-full transition-all duration-300 cursor-pointer bg-transparent hover:bg-white/[0.05] hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          >
            Contact Me
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group"
      >
        <span className="font-mono text-[8px] tracking-[0.3em] text-white/60 uppercase group-hover:text-white/80 transition-colors">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
