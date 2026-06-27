"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  // Store the exact ticker function reference so we can remove it correctly
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 2.0,
      wheelMultiplier: 1.1,
      // Exponential ease-out: settles instantly without overshoot
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Keep stable reference so cleanup can remove the exact same fn
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    tickerFnRef.current = tickerFn;
    gsap.ticker.add(tickerFn);

    // Disable lag smoothing so GSAP doesn't try to "catch up" after tab focus
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
