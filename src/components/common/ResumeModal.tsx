"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2 } from "lucide-react";
import { cn } from "@/utils/cn";
import LightRays from "@/components/ui/LightRays";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Simulate preparation progress bar loading
  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) {
            clearInterval(interval);
            return 92;
          }
          return prev + 8;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleIframeLoad = () => {
    setProgress(100);
    // Smooth delay before fading in the PDF
    setTimeout(() => {
      setLoaded(true);
    }, 250);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[500] flex flex-col bg-black/88 backdrop-blur-xl overflow-hidden select-none"
        >
          {/* Top ambient soft radial glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Modal Wrapper Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full h-full max-w-7xl mx-auto px-4 py-6 md:p-8 relative z-10"
          >
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-6 border-b border-white/[0.08]">
              {/* Profile details */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-secondary uppercase bg-secondary/10 px-2.5 py-1 rounded-sm">
                    Interactive Preview
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-white/50">
                    CGPA: 9.32
                  </span>
                </div>
                <h2 id="resume-title" className="font-display font-light text-2xl md:text-3xl text-white tracking-wide">
                  Bernardo
                </h2>
                <p className="font-mono text-[10px] tracking-wider text-white/60">
                  Software Engineer Intern | Full Stack Developer Intern
                </p>
              </div>

              {/* Actions & controls */}
              <div className="flex items-center gap-3">
                {/* View Fullscreen */}
                <a
                  href="/Bernardo_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 rounded-md font-mono text-[9px] tracking-[0.2em] text-white/80 hover:text-white uppercase transition-all duration-300 bg-white/[0.01] hover:bg-white/[0.04]"
                >
                  <Maximize2 size={10} />
                  <span>View Fullscreen</span>
                </a>

                {/* Download PDF highlighted with volumetric LightRays */}
                <div className="relative overflow-visible group">
                  <div className="absolute inset-0 -inset-x-8 -top-12 -bottom-4 pointer-events-none z-0">
                    <LightRays
                      raysOrigin="bottom-center"
                      raysColor="#0ea5e9"
                      raysSpeed={1.2}
                      lightSpread={0.35}
                      rayLength={1.4}
                      pulsating={true}
                      followMouse={true}
                      mouseInfluence={0.15}
                      className="opacity-75 scale-x-125 scale-y-110"
                    />
                  </div>
                  <a
                    href="/Bernardo_Resume.pdf"
                    download="Bernardo_Resume.pdf"
                    className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-md font-mono text-[9px] tracking-[0.2em] uppercase font-semibold hover:bg-zinc-200 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                  >
                    <Download size={10} />
                    <span>Download PDF</span>
                  </a>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-white/15 mx-1 hidden sm:block" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-9 h-9 rounded-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 bg-white/[0.01] hover:bg-white/[0.04]"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Document body container */}
            <div className="flex-1 relative rounded-xl border border-white/[0.08] bg-zinc-950/40 overflow-hidden shadow-2xl">
              {/* Dynamic minimal progress loader */}
              <AnimatePresence>
                {!loaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20 gap-4"
                  >
                    <div className="font-mono text-[9px] tracking-[0.35em] text-white/60 uppercase animate-pulse">
                      Preparing Resume...
                    </div>
                    {/* Animated linear progress bar */}
                    <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full bg-secondary"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Native PDF Iframe */}
              <div className="w-full h-full select-auto">
                <iframe
                  ref={iframeRef}
                  src="/Bernardo_Resume.pdf#toolbar=0&navpanes=0&statusbar=0"
                  onLoad={handleIframeLoad}
                  className={cn(
                    "w-full h-full border-0 transition-opacity duration-500 bg-zinc-900",
                    loaded ? "opacity-100" : "opacity-0"
                  )}
                  title="Bernardo Resume Preview"
                />
              </div>
            </div>

            {/* Micro instructions bar */}
            <div className="pt-4 flex items-center justify-between font-mono text-[7px] tracking-[0.2em] text-white/40 uppercase">
              <span>Next.js Client Embedder v1.0</span>
              <span className="hidden sm:block">Press ESC to exit preview modal</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
