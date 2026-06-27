"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { soundSynth } from "../../utils/SoundSynth";
import { useMounted } from "../../hooks/use-mounted";

// Dynamically import the browser-only React Three Fiber WebGL component to bypass hydration errors
const Antigravity = dynamic(() => import("../common/Antigravity"), { ssr: false });

type ExperienceStatus =
  | "idle" // darkness, sparse trails falling, WebGL drifting, CTA standing by
  | "triggering" // click triggered, sparks erupt, sound triggers (lasts 800ms)
  | "playing" // video recreation plays fullscreen
  | "transitioning" // video recreation fades out
  | "ended"; // complete, onComplete called

type PlayPhase = "init" | "burst" | "shrink";

interface EntryExperienceProps {
  onComplete: () => void;
}

interface Trail {
  points: { x: number; y: number }[];
  relX: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
  opacity: number;
  targetOpacity: number;
  pulsePosition: number;
  pulseSpeed: number;
  pulseActive: boolean;
  color: string;
  width: number;
}

interface CanvasSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  size: number;
}

export function EntryExperience({ onComplete }: EntryExperienceProps) {
  const isMounted = useMounted();
  const [status, setStatus] = useState<ExperienceStatus>("idle");
  const [playPhase, setPlayPhase] = useState<PlayPhase>("init");
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  
  const requestRef = useRef<number | null>(null);
  const trailsRef = useRef<Trail[]>([]);
  const sparksRef = useRef<CanvasSpark[]>([]);
  const statusRef = useRef<ExperienceStatus>("idle");
  
  // Interaction and animation progress references
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    active: false,
    hoveringButton: false,
    lastBeepTime: 0
  });

  const ringPosRef = useRef({ x: 0, y: 0 }); // trailing outer cursor position
  const hoverProgRef = useRef(0.0); // smooth hover attraction factor
  const zoomScaleRef = useRef(1.0); // camera zoom scale (zooms on activation & transition)

  // Keep ref in sync for use in animation loop
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Phase timings and triggers
  useEffect(() => {
    if (status === "triggering") {
      // Awakening/triggering phase lasts 800ms to let sparks expand
      const timer = setTimeout(() => {
        setStatus("playing");
      }, 800);
      return () => clearTimeout(timer);
    }

    if (status === "transitioning") {
      // Fade out video recreation takes 1.2 seconds
      const timer = setTimeout(() => {
        setStatus("ended");
        soundSynth.fadeAndStopAmbient();
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  // Real-Time HUD animation timeline
  useEffect(() => {
    if (status === "playing") {
      setPlayPhase("init");

      // 1. After 2.5s, burst the text and expand rings
      const t1 = setTimeout(() => {
        setPlayPhase("burst");
        soundSynth.playConnectionChord();
      }, 2500);

      // 2. After 8.5s, start shrinking everything back down to a central point
      const t2 = setTimeout(() => {
        setPlayPhase("shrink");
      }, 8500);

      // 3. After 11s, end playing and start transition to home screen
      const t3 = setTimeout(() => {
        setStatus("transitioning");
      }, 11000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [status]);

  // Main Canvas Experience Loop
  useEffect(() => {
    if (cursorDotRef.current) cursorDotRef.current.style.opacity = "0";
    if (cursorRingRef.current) cursorRingRef.current.style.opacity = "0";

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Bind global window-level mouse movement tracking
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };
    const handleGlobalMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.hoveringButton = false;
      setIsHoveringButton(false);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseleave", handleGlobalMouseLeave);

    const numPointsPerTrail = 16;
    const numTrails = 12;

    // Colors mapping to creative direction
    const trailColors = [
      "rgba(14, 165, 233, 0.4)", // Electric cyan-blue
      "rgba(59, 130, 246, 0.35)", // Midnight blue-ish
      "rgba(139, 92, 246, 0.3)", // Soft purple
      "rgba(0, 229, 255, 0.4)" // Vivid electric blue
    ];

    // Initialize 12 light trails
    const trails: Trail[] = Array.from({ length: numTrails }, (_, i) => {
      const relX = i / (numTrails - 1);
      
      const points: { x: number; y: number }[] = Array.from({ length: numPointsPerTrail }, () => ({
        x: 0,
        y: 0
      }));

      return {
        points,
        relX,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.6 + Math.random() * 0.8,
        waveAmp: 6 + Math.random() * 12,
        opacity: 0.15,
        targetOpacity: 0.15,
        pulsePosition: Math.random(),
        pulseSpeed: 0.0015 + Math.random() * 0.0015,
        pulseActive: true,
        color: trailColors[i % trailColors.length],
        width: 1.5 + Math.random() * 1.5
      };
    });

    trailsRef.current = trails;

    let time = 0;
    let autoPulseTimer = 0;

    // Draw background atmosphere glow
    const drawAtmosphere = (t: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      const pulseAmp = Math.sin(t * 0.0008) * 0.02 + 1.0;
      const radGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.min(width, height) * 0.5 * pulseAmp
      );

      radGrad.addColorStop(0, "rgba(10, 32, 85, 0.45)"); // Midnight blue core
      radGrad.addColorStop(0.45, "rgba(8, 20, 60, 0.2)"); // Soft dark blue wrap
      radGrad.addColorStop(0.75, "rgba(65, 12, 100, 0.08)"); // Soft purple highlights
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fades to complete black

      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
    };

    const render = () => {
      time += 16.7; // Approx ms per frame at 60fps
      
      const curStatus = statusRef.current;

      // Update mouse values smoothly
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Smoothly update custom cursor follower styles and opacity in frame loop to prevent lag
      const cursorDot = cursorDotRef.current;
      const cursorRing = cursorRingRef.current;
      if (cursorDot && cursorRing) {
        cursorDot.style.transform = `translate3d(${mouse.targetX}px, ${mouse.targetY}px, 0)`;
        
        // Shows custom cursor follower in all active states, including idle (standby)
        const showCursor = mouse.active && curStatus !== "ended";
        const opStr = showCursor ? "1" : "0";
        if (cursorDot.style.opacity !== opStr) {
          cursorDot.style.opacity = opStr;
        }
        
        ringPosRef.current.x += (mouse.targetX - ringPosRef.current.x) * 0.15;
        ringPosRef.current.y += (mouse.targetY - ringPosRef.current.y) * 0.15;
        cursorRing.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`;
        if (cursorRing.style.opacity !== opStr) {
          cursorRing.style.opacity = opStr;
        }
      }

      // If video recreation is running/transitioning, bypass canvas trails rendering to optimize resources
      if (curStatus === "playing" || curStatus === "transitioning" || curStatus === "ended") {
        requestRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Draw background ambient color glow
      drawAtmosphere(time);

      // Smoothly interpolate hover attraction factor
      hoverProgRef.current += ((mouse.hoveringButton ? 1.0 : 0.0) - hoverProgRef.current) * 0.08;
      const hoverProg = hoverProgRef.current;

      // Camera scale interpolation (zooms in slightly on triggering)
      let targetZoom = 1.0;
      if (curStatus === "triggering") {
        targetZoom = 1.06;
      }
      zoomScaleRef.current += (targetZoom - zoomScaleRef.current) * 0.045;
      const zoom = zoomScaleRef.current;

      // Center coords (vortex point)
      const btnX = width / 2;
      const btnY = height / 2;

      // Update and draw massive click/activation spark eruption
      const sparksToRemove: number[] = [];
      sparksRef.current.forEach((s, si) => {
        const prevX = s.x;
        const prevY = s.y;
        
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha > 0) {
          const sxStart = btnX + (prevX - btnX) * zoom;
          const syStart = btnY + (prevY - btnY) * zoom;
          const sxEnd = btnX + (s.x - btnX) * zoom;
          const syEnd = btnY + (s.y - btnY) * zoom;

          ctx.beginPath();
          ctx.moveTo(sxStart, syStart);
          ctx.lineTo(sxEnd, syEnd);
          ctx.lineWidth = s.size * (1.0 + (zoom - 1.0) * 0.5);
          ctx.strokeStyle = s.color + `${s.alpha})`;
          // Only draw glow on every 3rd spark — shadowBlur is very expensive
          if (si % 3 === 0) {
            ctx.shadowColor = s.color.includes("14,") ? "rgba(14, 165, 233, 0.8)" : "rgba(168, 85, 247, 0.8)";
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          if (si % 3 === 0) ctx.shadowBlur = 0;
        } else {
          sparksToRemove.push(si);
        }
      });
      // Clear dead sparks (reverse splice to maintain indices)
      for (let i = sparksToRemove.length - 1; i >= 0; i--) {
        sparksRef.current.splice(sparksToRemove[i], 1);
      }

      // Handle auto pulses during Active state
      if (curStatus === "idle") {
        autoPulseTimer += 16.7;
        if (autoPulseTimer > 1500) {
          autoPulseTimer = 0;
          
          const activeTrails = trails.filter(t => t.opacity > 0.1);
          if (activeTrails.length > 0) {
            const randomTrail = activeTrails[Math.floor(Math.random() * activeTrails.length)];
            if (!randomTrail.pulseActive) {
              randomTrail.pulseActive = true;
              randomTrail.pulsePosition = 0;
              randomTrail.pulseSpeed = 0.0015 + Math.random() * 0.0015;
            }
          }
        }
      }

      // Update and render trails
      trails.forEach((trail) => {
        // Calculate dynamic proximity-based target opacity
        let targetOp = 0.15;
        const curStatus = statusRef.current;
        if (curStatus === "triggering") {
          targetOp = 0.65;
        } else if (mouse.active) {
          let minDistSq = 99999999;
          const hasPoints = trail.points.some(p => p.x !== 0 || p.y !== 0);
          if (hasPoints) {
            trail.points.forEach((pt) => {
              const dx = pt.x - mouse.x;
              const dy = pt.y - mouse.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < minDistSq) minDistSq = distSq;
            });
            if (minDistSq < 62500) { // 250 * 250
              const minDist = Math.sqrt(minDistSq);
              const proximityFactor = (250 - minDist) / 250;
              targetOp = 0.15 + proximityFactor * 0.40;
            }
          }
        }
        trail.targetOpacity = targetOp;

        // Slowly slide current opacity to target opacity
        trail.opacity += (trail.targetOpacity - trail.opacity) * 0.06;

        // Animate pulses along trails
        if (trail.pulseActive) {
          trail.pulsePosition += trail.pulseSpeed;
          if (trail.pulsePosition > 1.0) {
            trail.pulsePosition = 0;
          }
        }

        ctx.beginPath();

        for (let j = 0; j < numPointsPerTrail; j++) {
          const t = j / (numPointsPerTrail - 1);

          // Calculate Floating Position
          const wave = Math.sin(time * 0.001 * trail.waveSpeed + t * 4 + trail.wavePhase) * trail.waveAmp;
          const baseX = trail.relX * (width * 0.8) + width * 0.1;
          let floatX = baseX + wave;
          let floatY = t * (height + 160) - 80;

          // Pull trails towards button on hover
          if (hoverProg > 0.01) {
            const dx = btnX - floatX;
            const dy = btnY - floatY;
            const distSq = dx * dx + dy * dy;
            if (distSq < 122500) { // 350 * 350
              const dist = Math.sqrt(distSq);
              const force = (350 - dist) / 350;
              // Bend lines towards button center
              floatX += dx * force * 0.3 * hoverProg;
              floatY += dy * force * 0.12 * hoverProg;
            }
          }

          // React to cursor push-away interaction
          if (mouse.active && !mouse.hoveringButton) {
            const dx = floatX - mouse.x;
            const dy = floatY - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 25600) { // 160 * 160
              const dist = Math.sqrt(distSq);
              const force = (160 - dist) / 160;
              floatX += (dx / dist) * force * 35;
              floatY += (dy / dist) * force * 20;

              const nowAudio = Date.now();
              if (nowAudio - mouse.lastBeepTime > 320 && Math.abs(dx) < 6) {
                soundSynth.playHoverSound();
                mouse.lastBeepTime = nowAudio;
              }
            }
          }

          // Apply zoom offsets
          const sx = btnX + (floatX - btnX) * zoom;
          const sy = btnY + (floatY - btnY) * zoom;

          trail.points[j] = { x: sx, y: sy };

          if (j === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        // Draw trail background line
        ctx.lineWidth = trail.width;
        ctx.strokeStyle = trail.color.replace(/[\d.]+\)$/, `${trail.opacity})`);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Draw flowing pulse overlay
        if (trail.pulseActive && trail.opacity > 0.05) {
          const pulseIdx = Math.floor(trail.pulsePosition * (numPointsPerTrail - 1));
          const pStart = Math.max(0, pulseIdx - 3);
          const pEnd = Math.min(numPointsPerTrail - 1, pulseIdx + 3);

          ctx.beginPath();
          ctx.moveTo(trail.points[pStart].x, trail.points[pStart].y);
          for (let k = pStart + 1; k <= pEnd; k++) {
            ctx.lineTo(trail.points[k].x, trail.points[k].y);
          }

          // Glowing electric-white pulse — no shadowBlur for perf (use bright color instead)
          ctx.strokeStyle = "rgba(224, 242, 254, 0.98)";
          ctx.lineWidth = trail.width + 2.2;
          ctx.stroke();
        }
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseleave", handleGlobalMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // System Activation Handler
  const handleActivateSystem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (status !== "idle") return;

    soundSynth.init();

    // Trigger massive visual eruption sparks at button center
    const btnX = window.innerWidth / 2;
    const btnY = window.innerHeight / 2;

    const sparks: CanvasSpark[] = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 8.5; // explosive initial speed
      return {
        x: btnX,
        y: btnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        maxAlpha: 0.8 + Math.random() * 0.2,
        decay: 0.012 + Math.random() * 0.016, // fade out over 1.5 seconds
        color: Math.random() > 0.4 ? "rgba(14, 165, 233, " : "rgba(168, 85, 247, ",
        size: 1.2 + Math.random() * 1.6
      };
    });
    sparksRef.current = sparks;

    // Trigger pulses down all active trails
    trailsRef.current.forEach((trail) => {
      trail.pulseActive = true;
      trail.pulsePosition = 0;
      trail.pulseSpeed = 0.007 + Math.random() * 0.007;
      trail.opacity = 0.65;
      trail.targetOpacity = 0.65;
    });

    soundSynth.playPulseSound();
    soundSynth.playAwakenSound(0);

    setStatus("triggering");
  };



  if (!isMounted) {
    return <div className="fixed inset-0 z-50 bg-black" />;
  }

  // Determine dynamic parameters for WebGL Antigravity particle vortex
  let magnetRadius = 0;
  let ringRadius = 0;
  let waveAmplitude = 0.5;
  let particleSize = 0.9;
  let lerpSpeed = 0.03;
  let particleColor = "#1e3b8a";

  if (status === "idle") {
    if (isHoveringButton) {
      magnetRadius = 14;
      ringRadius = 5.0;
      waveAmplitude = 2.0;
      particleSize = 1.3;
      particleColor = "#0ea5e9";
      lerpSpeed = 0.05;
    } else {
      // Particles follow the cursor everywhere with a wider swirling cloud
      magnetRadius = 12;
      ringRadius = 6.5;
      waveAmplitude = 1.2;
      particleSize = 1.0;
      particleColor = "#2563eb"; // subtle electric blue
      lerpSpeed = 0.04;
    }
  } else if (status === "triggering") {
    magnetRadius = 24;
    ringRadius = 16.0;
    waveAmplitude = 3.5;
    particleSize = 1.8;
    particleColor = "#c084fc";
    lerpSpeed = 0.08;
  } else if (status === "playing") {
    if (playPhase === "init") {
      magnetRadius = 18;
      ringRadius = 3.5;
      waveAmplitude = 1.0;
      particleSize = 1.4;
      particleColor = "#0ea5e9"; // cyan core
      lerpSpeed = 0.06;
    } else if (playPhase === "burst") {
      magnetRadius = 26;
      ringRadius = 14.0;
      waveAmplitude = 1.5;
      particleSize = 1.2;
      particleColor = "#6366f1"; // indigo
      lerpSpeed = 0.065;
    } else if (playPhase === "shrink") {
      magnetRadius = 26;
      ringRadius = 0.2;
      waveAmplitude = 0.1;
      particleSize = 0.8;
      particleColor = "#3b82f6";
      lerpSpeed = 0.04;
    }
  } else if (status === "transitioning") {
    magnetRadius = 26;
    ringRadius = 32.0;
    waveAmplitude = 1.0;
    particleSize = 0.6;
    particleColor = "#1e3b8a";
    lerpSpeed = 0.03;
  }

  // Camera pushes forward and opacity fades out on transitions
  const containerTransitionClasses =
    status === "transitioning" ? "opacity-0 scale-[1.08] pointer-events-none" : "opacity-100 scale-100";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-black select-none cursor-default transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${containerTransitionClasses}`}
    >
      {/* Inject custom high-performance cybernetic keyframe animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-ccw {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 162, 255, 0.4)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.2)); }
            50% { filter: drop-shadow(0 0 18px rgba(0, 162, 255, 0.75)) drop-shadow(0 0 35px rgba(168, 85, 247, 0.5)); }
          }
          @keyframes text-burst {
            0% { letter-spacing: -0.2em; opacity: 0; filter: blur(6px); transform: scale(0.9); }
            100% { letter-spacing: 0.35em; opacity: 1; filter: blur(0); transform: scale(1); }
          }
          @keyframes sweep {
            0% { transform: translate(-100%, 0) rotate(15deg); }
            100% { transform: translate(100%, 0) rotate(15deg); }
          }
          @keyframes scanline {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
        `
      }} />

      {/* 1. WebGL Antigravity 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <Antigravity
          count={320}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={0.3}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          color={particleColor}
          autoAnimate={false}
          particleVariance={0.8}
          rotationSpeed={0.06}
          depthFactor={0.5}
          pulseSpeed={2.5}
          particleShape="capsule"
          fieldStrength={8}
        />
      </div>

      {/* 2. Core Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block w-full h-full z-10 pointer-events-none transition-opacity duration-1000 ${
          status === "playing" || status === "transitioning" || status === "ended"
            ? "opacity-0"
            : "opacity-100"
        }`}
      />

      {/* 3. Ambient Atmosphere Overlays */}
      {(status === "idle" || status === "triggering") && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/80 opacity-60 z-15" />
      )}

      {/* 4. Central System Activation Call-To-Action (z-20) */}
      <AnimatePresence>
        {status === "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-20 pointer-events-auto"
          >
            <button
              onClick={handleActivateSystem}
              onMouseEnter={() => {
                mouseRef.current.hoveringButton = true;
                setIsHoveringButton(true);
                soundSynth.playHoverSound();
              }}
              onMouseLeave={() => {
                mouseRef.current.hoveringButton = false;
                setIsHoveringButton(false);
              }}
              className="relative overflow-hidden group border border-white/10 hover:border-secondary/40 px-10 py-5 rounded-md text-[10px] font-mono text-zinc-300 hover:text-white tracking-[0.35em] transition-all duration-700 bg-white/[0.01] hover:bg-secondary/[0.06] hover:shadow-[0_0_40px_rgba(0,102,255,0.22)] cursor-pointer"
            >
              {/* Scan laser line sweeping across the button */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-secondary/15 to-transparent -translate-x-full group-hover:animate-[sweep_2s_infinite_ease-in-out] pointer-events-none" />

              {/* Rotating outer SVG tech rings */}
              <div className="absolute -inset-1.5 opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 pointer-events-none">
                <svg className="w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6, 8" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="30, 20" />
                </svg>
              </div>

              <span className="relative z-10 select-none">ENTER EXPERIENCE</span>
            </button>

            {/* Micro details line */}
            <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-600 tracking-[0.2em] uppercase select-none pointer-events-none">
              <span className="h-1 w-1 bg-secondary rounded-full animate-pulse" />
              system standing by
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Real-Time HUD Overlay (z-20) */}
      {(status === "playing" || status === "transitioning") && (
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-[1200ms] ease-in-out ${
            status === "transitioning" ? "opacity-0 scale-[0.9] blur-md" : "opacity-100 scale-100"
          }`}
        >
          <div
            className={`relative w-[600px] h-[600px] flex items-center justify-center transition-all duration-[2000ms] ${
              playPhase === "init"
                ? "scale-[0.25] opacity-0"
                : playPhase === "burst"
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0" // shrink phase
            }`}
          >
            {/* Tech concentric SVGs */}
            <svg className="absolute w-full h-full animate-[pulse-glow_4s_ease-in-out_infinite]" viewBox="0 0 200 200">
              {/* Outer compass tick circle */}
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="rgba(0, 162, 255, 0.08)"
                strokeWidth="0.5"
              />
              {/* Rotating outer ring */}
              <circle
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke="rgba(0, 162, 255, 0.25)"
                strokeWidth="0.5"
                strokeDasharray="6, 12, 30, 10"
                className="animate-[spin-cw_30s_linear_infinite]"
                style={{ transformOrigin: "center" }}
              />
              {/* Mid dotted dial */}
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="rgba(0, 162, 255, 0.35)"
                strokeWidth="0.75"
                strokeDasharray="2, 6"
                className="animate-[spin-ccw_18s_linear_infinite]"
                style={{ transformOrigin: "center" }}
              />
              {/* Inner tech ring */}
              <circle
                cx="100"
                cy="100"
                r="64"
                fill="none"
                stroke="rgba(168, 85, 247, 0.25)"
                strokeWidth="1.2"
                strokeDasharray="40, 20"
                className="animate-[spin-cw_12s_linear_infinite]"
                style={{ transformOrigin: "center" }}
              />
              {/* Core central helper ring */}
              <circle
                cx="100"
                cy="100"
                r="50"
                fill="none"
                stroke="rgba(0, 162, 255, 0.15)"
                strokeWidth="0.5"
              />
            </svg>

            {/* Glowing Tech Brackets Box */}
            <div
              className={`absolute w-[240px] h-[240px] border border-white/5 rounded-sm transition-all duration-[1500ms] ${
                playPhase === "burst" ? "scale-100 opacity-30" : "scale-[0.6] opacity-0"
              }`}
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-secondary" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-secondary" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-secondary" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-secondary" />
            </div>

            {/* Horizontal scan line inside target brackets */}
            {playPhase === "burst" && (
              <div className="absolute w-[230px] h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-[scanline_3.5s_ease-in-out_infinite]" />
            )}

            {/* Typography core block */}
            <div
              className={`absolute z-10 flex flex-col items-center justify-center text-center transition-all duration-[1500ms] ${
                playPhase === "burst" ? "scale-100 opacity-100" : "scale-[0.85] opacity-0"
              }`}
            >
              {playPhase !== "init" && (
                <>
                  <h1
                    className="text-white text-3xl sm:text-5xl font-extralight tracking-[0.35em] font-display uppercase select-none animate-[text-burst_1.8s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                    style={{
                      textShadow: "0 0 12px rgba(0, 162, 255, 0.8), 0 0 25px rgba(168, 85, 247, 0.4)",
                    }}
                  >
                    BERNARDO
                  </h1>
                  
                  {/* Digital technical subreadout */}
                  <span className="font-mono text-[6.5px] text-zinc-500 tracking-[0.25em] uppercase mt-4 select-none opacity-80">
                    SYS_LOAD_OK // INIT_PORTFOLIO_V3
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Skip button in bottom-right corner */}
      {(status === "playing" || status === "transitioning") && (
        <button
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
          onClick={(e) => {
            e.stopPropagation();
            setStatus("transitioning");
          }}
          className="absolute bottom-8 right-8 z-50 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white hover:text-white/80 transition-all duration-300 border border-white/5 hover:border-white/20 rounded-md bg-black/40 backdrop-blur-sm pointer-events-auto cursor-pointer animate-[pulse-glow_4s_infinite]"
        >
          Skip Intro
        </button>
      )}

      {/* 6. Custom Cybernetic Cursor Follower (z-[100] above everything) */}
      {status !== "transitioning" && (
        <>
          {/* Inner solid dot */}
          <div
            ref={cursorDotRef}
            className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
              status === "idle" ? "bg-white" : "bg-secondary"
            }`}
          />
          {/* Outer trailing ring - Always rotating and showing dashed reticle crosshairs */}
          <div
            ref={cursorRingRef}
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 border border-dashed transition-all duration-300 ${
              status === "idle"
                ? isHoveringButton
                  ? "w-11 h-11 border-white animate-[spin_6s_linear_infinite]"
                  : "w-7 h-7 border-white/40 animate-[spin_12s_linear_infinite]"
                : isHoveringButton
                ? "w-11 h-11 border-secondary animate-[spin_6s_linear_infinite]"
                : "w-7 h-7 border-secondary/40 animate-[spin_12s_linear_infinite]"
            }`}
          >
            {/* Dotted crosshairs target reticle inside ring always active, scaling dynamically */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className={`w-full h-[0.5px] absolute ${status === "idle" ? "bg-white" : "bg-secondary"}`} />
              <div className={`h-full w-[0.5px] absolute ${status === "idle" ? "bg-white" : "bg-secondary"}`} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
