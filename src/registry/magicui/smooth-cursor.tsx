"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface SmoothCursorProps {
  size?: number;
  className?: string;
}

export function SmoothCursor({
  size = 20,
  className = "",
}: SmoothCursorProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Tight spring — fast enough to feel instant, loose enough to look smooth
  const springConfig = { damping: 32, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    const isTouchCheck =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    setIsTouchDevice(isTouchCheck);
    if (isTouchCheck) return;

    // Set data attribute on <html> — the actual cursor:none is in globals.css
    document.documentElement.setAttribute("data-smooth-cursor", "true");

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - size / 2);
      cursorY.set(e.clientY - size / 2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.documentElement.removeAttribute("data-smooth-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY, size]);

  if (!isMounted || isTouchDevice) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 pointer-events-none rounded-full z-[9999] border-2 mix-blend-difference ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: "rgba(14, 165, 233, 0.55)",
        x: smoothX,
        y: smoothY,
        willChange: "transform",
        boxShadow: "0 0 10px rgba(14, 165, 233, 0.25)",
      }}
    />
  );
}
