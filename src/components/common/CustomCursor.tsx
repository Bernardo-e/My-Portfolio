"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorState {
  hovering: boolean;
  clicking: boolean;
  text: boolean;
}

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>({ hovering: false, clicking: false, text: false });
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 700 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 700 });
  const ringX = useSpring(mouseX, { damping: 35, stiffness: 200 });
  const ringY = useSpring(mouseY, { damping: 35, stiffness: 200 });

  const magneticElements = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      // Magnetic attraction
      const target = e.target as HTMLElement;
      const isMagnetic = target.closest("[data-magnetic]");
      const isText = target.closest("p, span, h1, h2, h3, h4, h5, h6, li, a:not([data-magnetic])");
      const isInteractive = target.closest("button, a, [role='button'], input, textarea, select");

      setState({
        hovering: !!(isInteractive || isMagnetic),
        clicking: false,
        text: !!isText && !isInteractive
      });

      if (isMagnetic) {
        const rect = (isMagnetic as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const maxDist = Math.max(rect.width, rect.height) * 0.8;

        if (dist < maxDist) {
          const pull = 0.3;
          mouseX.set(e.clientX - distX * pull);
          mouseY.set(e.clientY - distY * pull);
        }
      }
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setState(s => ({ ...s, clicking: true }));
    const onUp = () => setState(s => ({ ...s, clicking: false }));

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY, visible]);

  const dotSize = state.clicking ? 6 : state.hovering ? 0 : 6;
  const ringSize = state.clicking ? 20 : state.hovering ? 44 : 28;
  const ringBorder = state.hovering ? "rgba(14,165,233,0.8)" : "rgba(255,255,255,0.35)";
  const dotColor = state.hovering ? "rgba(14,165,233,1)" : "rgba(255,255,255,0.9)";

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Inner dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          width: dotSize,
          height: dotSize,
          background: dotColor,
        }}
        animate={{ opacity: visible ? 1 : 0, scale: state.clicking ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        className="fixed top-0 left-0 rounded-full -translate-x-1/2 -translate-y-1/2"
      />
      {/* Outer ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          borderColor: ringBorder,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 rounded-full border -translate-x-1/2 -translate-y-1/2 border-dashed animate-[spin_12s_linear_infinite]"
      />
    </div>
  );
}
