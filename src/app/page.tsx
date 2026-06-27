"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EntryExperience } from "@/components/layout/EntryExperience";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { FocusSection } from "@/components/sections/FocusSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

import { cn } from "@/utils/cn";
import { ResumeModal } from "@/components/common/ResumeModal";
// Load SplashCursor dynamically (browser-only WebGL)
const SplashCursor = dynamic(() => import("@/components/ui/SplashCursor"), { ssr: false });
const SmoothCursor = dynamic(() => import("@/registry/magicui/smooth-cursor").then(mod => mod.SmoothCursor), { ssr: false });

// Load Lightfall dynamically (browser-only WebGL)
const Lightfall = dynamic(() => import("@/components/common/Lightfall"), { ssr: false });

const GLOBAL_LIGHTFALL_COLORS = ["#1e3a8a", "#3b82f6", "#6366f1", "#7c3aed", "#0ea5e9"];

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    // Preload critical project thumbnails in the browser background cache
    const criticalImages = ["/campus-orbit.jpg", "/berd-habit.jpg", "/berd-focus.jpg"];
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Silent background preloading of resume PDF
    fetch("/Bernardo_Resume.pdf").catch(() => {});

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") === "true") {
        try { sessionStorage.removeItem("introSeen"); } catch {}
      }
    }
    const seen = sessionStorage.getItem("introSeen");
    requestAnimationFrame(() => {
      if (seen === "true") setIsIntroComplete(true);
      setLoading(false);
    });
  }, []);

  const handleIntroComplete = () => {
    try { sessionStorage.setItem("introSeen", "true"); } catch {}
    setIsIntroComplete(true);
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <>
      {/* WebGL Fluid Splash Cursor — active after intro, perf-tuned resolutions */}
      {isIntroComplete && (
        <SplashCursor
          SIM_RESOLUTION={64}
          DYE_RESOLUTION={512}
          PRESSURE_ITERATIONS={8}
          DENSITY_DISSIPATION={4}
          VELOCITY_DISSIPATION={2.5}
          SPLAT_RADIUS={0.18}
          CURL={2}
        />
      )}

      {/* Intro experience */}
      {!isIntroComplete && (
        <EntryExperience onComplete={handleIntroComplete} />
      )}

      {/* Main portfolio — reveals after intro */}
      <div
        className={cn(
          "transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isIntroComplete ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        )}
        style={isIntroComplete ? undefined : { willChange: "opacity, transform" }}
      >
        {/*
          ─────────────────────────────────────────────────────────
          GLOBAL LIGHTFALL RAIN — preloaded and initialized in bg
          ─────────────────────────────────────────────────────────
        */}
        <div className={cn("fixed inset-0 z-0 pointer-events-none transition-opacity duration-[1400ms]", isIntroComplete ? "opacity-85" : "opacity-0")} aria-hidden>
          <Lightfall
            colors={GLOBAL_LIGHTFALL_COLORS}
            backgroundColor="#010b18"
            speed={0.5}
            streakCount={6}
            streakWidth={0.85}
            streakLength={1.2}
            glow={0.85}
            density={0.46}
            twinkle={0.5}
            zoom={2.6}
            backgroundGlow={0.22}
            opacity={0.85}
            mouseInteraction={true}
            mouseStrength={0.28}
            mouseRadius={0.85}
            mouseDampening={0.3}
            dpr={1}
          />
        </div>

        <LenisProvider>
          {/* Floating navigation */}
          <Navigation visible={isIntroComplete} />

          {/* All portfolio sections — bg-transparent so rain shows through */}
          <main className="relative z-10">
            <HeroSection />
            <HighlightsSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <AchievementsSection />
            <FocusSection />
            <VisionSection />
            <ContactSection onOpenResume={() => setIsResumeOpen(true)} />
            <Footer />
          </main>
        </LenisProvider>
      </div>

      {/* Premium fullscreen Resume Experience modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
