"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/utils/cn";
import { User, Briefcase, Code, Mail } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about", icon: User },
  { label: "Work", href: "#projects", icon: Briefcase },
  { label: "Skills", href: "#skills", icon: Code },
  { label: "Contact", href: "#contact", icon: Mail },
];

interface NavigationProps {
  visible?: boolean;
}

const nodeVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    boxShadow: "0 0 0px rgba(14, 165, 233, 0)" 
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    boxShadow: "0 0 15px rgba(14, 165, 233, 0.12)",
    transition: {
      opacity: { duration: 0.4, delay: i * 0.15 },
      scale: { type: "spring", stiffness: 220, damping: 18, delay: i * 0.15 + 0.05 },
      boxShadow: { duration: 0.5, delay: i * 0.15 + 0.25 }
    }
  })
};

const lineVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      delay: 0.8,
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

const hoverAnimation = {
  y: -6,
  scale: 1.05,
  rotate: 1.5,
  boxShadow: "0 0 25px rgba(14, 165, 233, 0.45), inset 0 0 12px rgba(14, 165, 233, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.09)",
  borderColor: "rgba(14, 165, 233, 0.35)",
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25
  }
};

export function Navigation({ visible = true }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let ticking = false;
    let isScrolled = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const shouldScroll = window.scrollY > 60;
        if (shouldScroll !== isScrolled) {
          isScrolled = shouldScroll;
          setScrolled(shouldScroll);
        }
        ticking = false;
      });
    };

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-8 py-4 transition-all duration-500",
            scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/[0.04]" : "bg-transparent"
          )}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display font-light text-[11px] tracking-[0.4em] text-white/80 hover:text-white transition-colors duration-300 uppercase cursor-pointer"
            data-magnetic
          >
            Bernardo
          </button>

          {/* Premium Circular Node Navigation */}
          <ul className="relative flex items-start gap-10 py-1">
            {/* The glowing energy connection network line */}
            <motion.div
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-[23px] left-[22px] right-[22px] h-[1px] bg-gradient-to-r from-sky-500/10 via-sky-500/40 to-sky-500/10 pointer-events-none z-0"
              style={{ transformOrigin: "left" }}
            >
              {/* Electric pulse 1 */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-[2px] bg-sky-400 blur-[1px]"
                animate={{ left: ["-5%", "105%"] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut"
                }}
              />
              {/* Electric pulse 2 (reverse direction) */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-[2px] bg-violet-400 blur-[1px]"
                animate={{ right: ["-5%", "105%"] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Links loop */}
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.slice(1);

              return (
                <li key={link.label} className="relative z-10 list-none">
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="flex flex-col items-center gap-2.5 focus:outline-none relative group cursor-pointer"
                    data-magnetic
                  >
                    {/* Circle Node element */}
                    <motion.div
                      custom={index}
                      variants={nodeVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={hoverAnimation}
                      className={cn(
                        "w-11 h-11 rounded-full relative flex items-center justify-center transition-all duration-300",
                        isActive
                          ? "bg-white/[0.12] border border-sky-400/40 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                          : "bg-white/[0.03] border border-white/[0.08] shadow-[0_0_15px_rgba(14,165,233,0.08)]"
                      )}
                    >
                      {/* Soft violet accent lighting */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500/10 to-transparent pointer-events-none" />

                      {/* Smooth reflection highlight */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

                      {/* Icon */}
                      <Icon
                        size={16}
                        className={cn(
                          "transition-all duration-300",
                          isActive
                            ? "text-sky-400 drop-shadow-[0_0_6px_rgba(14,165,233,0.5)]"
                            : "text-white/60 group-hover:text-white group-hover:drop-shadow-[0_0_4px_rgba(14,165,233,0.3)]"
                        )}
                      />

                      {/* Active state overlays */}
                      {isActive && (
                        <>
                          {/* Slowly rotating dashed energy ring */}
                          <motion.div
                            className="absolute -inset-[6px] rounded-full border border-dashed border-sky-400/25 pointer-events-none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                          />
                          {/* Thin progress/active ring */}
                          <motion.div
                            layoutId="active-nav-ring"
                            className="absolute -inset-[3px] rounded-full border border-sky-500/60 pointer-events-none shadow-[0_0_8px_rgba(14,165,233,0.2)]"
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          />
                        </>
                      )}
                    </motion.div>

                    {/* Label */}
                    <span
                      className={cn(
                        "font-mono text-[8px] tracking-[0.2em] uppercase transition-colors duration-300 select-none",
                        isActive ? "text-white font-medium" : "text-white/40 group-hover:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right CTA */}
          <a
            href="mailto:narded2007@gmail.com"
            className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            narded2007@gmail.com
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
