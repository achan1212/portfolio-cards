import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import HeroScene from "../components/canvas/HeroScene";
import ErrorBoundary from "../components/ErrorBoundary";
import { modeCopy } from "../data/modeCopy";
import type { ModeId } from "../lib/mode";

export default function Hero({ mode }: { mode: ModeId }) {
  const container = useRef<HTMLElement>(null);
  const [deckSpread, setDeckSpread] = useState(false);
  const [canvasOnTop, setCanvasOnTop] = useState(false);
  const copy = modeCopy[mode].hero;

  useEffect(() => {
    if (deckSpread) {
      setCanvasOnTop(true);
      return;
    }
    const t = window.setTimeout(() => setCanvasOnTop(false), 450);
    return () => window.clearTimeout(t);
  }, [deckSpread]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.9 }, "-=0.3")
        .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <div className={`absolute inset-0 ${canvasOnTop ? "z-20" : "z-0"}`}>
        <ErrorBoundary>
          <HeroScene onSpreadChange={setDeckSpread} />
        </ErrorBoundary>
      </div>

      <div
        className={`relative z-10 flex min-h-screen items-center px-6 pt-24 pointer-events-none transition-opacity duration-500 ${
          deckSpread ? "opacity-60" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <p className="hero-eyebrow text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">
              Portfolio · 2026
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <h1 className="hero-title text-5xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
                  {copy.titleLine1}
                  <br />
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                    {copy.titleLine2}
                  </span>
                </h1>
                <p className="hero-subtitle mt-6 text-lg text-neutral-300 max-w-xl">
                  {copy.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="hero-cta mt-10 flex flex-wrap items-center gap-4 pointer-events-auto">
              <a
                href={copy.primaryCta.href}
                className="px-6 py-3 rounded-full bg-violet-500 hover:bg-violet-400 text-white text-sm font-medium transition-colors"
              >
                {copy.primaryCta.label}
              </a>
              <a
                href="#contact"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white text-sm font-medium transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-neutral-500 z-10">
        Scroll
      </div>
    </section>
  );
}
