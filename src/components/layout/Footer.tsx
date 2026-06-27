"use client";

import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-transparent py-12 px-8 border-t border-white/[0.05]">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Signature */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-display font-light text-sm tracking-widest text-white/70">
            DESIGNED & DEVELOPED BY BERNARDO
          </span>
          <span className="font-mono text-[9px] tracking-widest text-white/55 uppercase">
            Copyright © 2026 Bernardo. All Rights Reserved.
          </span>
        </div>

        {/* Right Side: Stack Info */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <span className="font-mono text-[8px] tracking-[0.25em] text-white/60 uppercase">
            Built with precision using
          </span>
          <span className="font-sans text-[11px] text-white/75 max-w-[280px] leading-relaxed">
            Next.js · TypeScript · Tailwind CSS · GSAP · Framer Motion · ReactBits
          </span>
        </div>
      </div>
    </footer>
  );
}
