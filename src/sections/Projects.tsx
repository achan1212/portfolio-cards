import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { workExperiences, type WorkExperience } from "../data/projects";
import type { Screenshot } from "../data/projects/types";

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: Screenshot[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const shot = images[idx];

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-5xl w-full flex flex-col items-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Alt text caption */}
        <p className="mt-3 text-xs text-white/40 text-center">{shot.alt}</p>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter pill */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white/60">
            {idx + 1} / {images.length}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Chevron ─────────────────────────────────────────────────────────────────

function ChevronUp({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-neutral-400 flex-none transition-transform duration-400 ${open ? "" : "rotate-180"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

// ─── WorkCard ────────────────────────────────────────────────────────────────

function WorkCard({ company, role, years, tags, features }: WorkExperience) {
  const [activeId, setActiveId] = useState(features[0].id);
  const [isOpen, setIsOpen] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const active = features.find((f) => f.id === activeId)!;

  useEffect(() => {
    galleryRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [activeId]);

  return (
    <div className="relative rounded-2xl">
      {/* Glow halo */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-violet-600/50 via-fuchsia-500/25 to-indigo-600/40 opacity-70 blur-md" />

      {/* Card surface */}
      <div className="relative rounded-2xl border border-white/10 bg-card overflow-hidden">

        {/* Header */}
        <button
          className="w-full px-8 pt-8 pb-6 border-b border-white/5 flex flex-wrap items-start justify-between gap-4 text-left cursor-pointer"
          onClick={() => setIsOpen((o) => !o)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">{years}</span>
              <span className="h-px w-6 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.25em] text-violet-400">{role}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {company}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 items-start">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border border-white/10 text-neutral-400 bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
          <ChevronUp open={isOpen} />
        </button>

        {/* Collapsible body */}
        <div
          className="grid transition-all duration-500 ease-in-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {/* Feature tabs */}
            <div className="px-8 pt-6 pb-2 flex flex-wrap gap-2">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
                    f.id === activeId
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                      : "text-neutral-500 border border-white/10 hover:text-neutral-300 hover:border-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Screenshot gallery */}
            <div className="relative mt-4">
              <div
                ref={galleryRef}
                className="flex gap-3 px-8 pb-4 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {active.screenshots.map((shot, i) => (
                  <button
                    key={shot.src}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View full size: ${shot.alt}`}
                    className={`group flex-none rounded-xl overflow-hidden border border-white/10 bg-white/5 h-56 cursor-zoom-in focus-visible:outline focus-visible:outline-violet-500 ${
                      shot.contain ? "w-44" : shot.portrait ? "w-36" : "w-80"
                    }`}
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                        shot.contain ? "object-contain p-3" : "object-cover object-top"
                      }`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--bg-card)] to-transparent" />
            </div>

            {/* Active feature description */}
            <div className="px-8 pt-2 pb-8">
              {active.stat && (
                <div className="inline-flex items-baseline gap-2.5 mb-4 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <span className="text-2xl font-bold tracking-tight text-violet-300">
                    {active.stat.value}
                  </span>
                  <span className="text-xs text-violet-400">{active.stat.label}</span>
                </div>
              )}
              <p className="text-neutral-400 leading-relaxed max-w-2xl text-sm">
                {active.description}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={active.screenshots}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Projects</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-20">
          Selected work.
        </h2>
        <div className="space-y-6">
          {workExperiences.map((experience) => (
            <WorkCard key={experience.id} {...experience} />
          ))}
        </div>
      </div>
    </section>
  );
}
