"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export interface SmoothCursorProps {
  size?: number;
  color?: string;
  className?: string;
}

export function SmoothCursor({
  size = 20,
  color = "rgba(14, 165, 233, 0.4)", // matching electric blue secondary theme
  className = "",
}: SmoothCursorProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    
    const checkTouch = () => {
      setIsTouchDevice(
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
      );
    };

    checkTouch();
    if (isTouchDevice) return;

    // Set cursor: none globally when active on desktop
    const style = document.createElement("style");
    style.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - size / 2);
      cursorY.set(e.clientY - size / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY, size, isTouchDevice]);

  if (!isMounted || isTouchDevice) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 pointer-events-none rounded-full z-[9999] border-2 mix-blend-difference ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: color,
        x: smoothX,
        y: smoothY,
        boxShadow: "0 0 12px rgba(14, 165, 233, 0.3)",
      }}
    />
  );
}
