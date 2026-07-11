import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { artworkPieces, type ArtworkPiece } from "../data/artwork";
import type { ModeId } from "../lib/mode";

// ─── Lightbox ────────────────────────────────────────────────────────────────

function ArtworkLightbox({
  pieces,
  startIndex,
  onClose,
}: {
  pieces: ArtworkPiece[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const piece = pieces[idx];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + pieces.length) % pieces.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % pieces.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pieces.length, onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Artwork lightbox"
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full flex flex-col items-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {piece.src ? (
          <img
            key={piece.src}
            src={piece.src}
            alt={piece.alt}
            className="max-h-[80vh] w-full object-contain rounded-xl shadow-2xl"
          />
        ) : (
          <div className="w-full aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-neutral-500 text-sm">No image</span>
          </div>
        )}

        {/* Caption */}
        <div className="mt-3 text-center">
          <p className="text-sm text-white/70 font-medium">{piece.title}</p>
          {(piece.medium || piece.year) && (
            <p className="text-xs text-white/30 mt-0.5">
              {[piece.medium, piece.year].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

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
        {pieces.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + pieces.length) % pieces.length)}
              aria-label="Previous artwork"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % pieces.length)}
              aria-label="Next artwork"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        {pieces.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white/60">
            {idx + 1} / {pieces.length}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Aspect helpers ───────────────────────────────────────────────────────────

const aspectClass: Record<NonNullable<ArtworkPiece["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-video",
  square: "aspect-square",
};

// ─── Section ─────────────────────────────────────────────────────────────────

type ArtworkProps = {
  mode: ModeId;
  onModeChange: (m: ModeId) => void;
};

export default function Artwork({ mode, onModeChange }: ArtworkProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const teaser = mode === "technical";
  const pieces = teaser ? artworkPieces.slice(0, 3) : artworkPieces;

  return (
    <section id="artwork" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Artwork</p>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            {teaser ? "Also: I draw." : "Original illustrations."}
          </h2>
          {teaser && (
            <button
              onClick={() => onModeChange("artistic")}
              className="px-5 py-2.5 rounded-full border border-violet-500/40 bg-violet-500/10 text-sm text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer"
            >
              See my artistic side →
            </button>
          )}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {pieces.map((piece, i) => (
            <div key={`${piece.title}-${i}`} className="break-inside-avoid mb-4">
              <button
                onClick={() => setLightboxIndex(i)}
                aria-label={`View ${piece.title}`}
                className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-visible:outline focus-visible:outline-violet-500 cursor-zoom-in"
              >
                {piece.src ? (
                  <img
                    src={piece.src}
                    alt={piece.alt}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full ${aspectClass[piece.aspect ?? "square"]} flex flex-col items-center justify-center gap-2`}>
                    <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A.75.75 0 0021.75 19.5V6.75A.75.75 0 0021 6H3a.75.75 0 00-.75.75v12A.75.75 0 003 20.25z" />
                    </svg>
                    <span className="text-xs text-white/20">Add image</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Caption */}
              <div className="mt-2 px-0.5">
                <p className="text-sm text-neutral-300 font-medium leading-snug">{piece.title}</p>
                {(piece.medium || piece.year) && (
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {[piece.medium, piece.year].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <ArtworkLightbox
            pieces={pieces}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
