import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { themes, type ThemeId } from "../lib/theme";

type Props = {
  theme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
};

export default function ThemeSwitcher({ theme, onThemeChange }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = themes.find((t) => t.id === theme)!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="bg-card border border-white/10 rounded-2xl shadow-2xl w-56 overflow-hidden"
          >
            <p className="px-4 pt-4 pb-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
              Style
            </p>
            <div className="pb-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { onThemeChange(t.id); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  {/* Swatch: bg ring + accent dot */}
                  <div
                    className="relative flex-none w-7 h-7 rounded-full flex items-center justify-center ring-1 ring-white/10"
                    style={{ background: t.bg }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: t.accent }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-none ${theme === t.id ? "text-white font-medium" : "text-neutral-400"}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">{t.description}</p>
                  </div>

                  {theme === t.id && (
                    <svg
                      className="flex-none w-3.5 h-3.5 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Change theme"
        className="relative w-11 h-11 rounded-full bg-card border border-white/10 flex items-center justify-center shadow-xl overflow-hidden"
        style={{
          boxShadow: `0 0 0 1px ${current.accent}44, 0 8px 32px ${current.accent}1a`,
        }}
      >
        {/* Accent strip at base */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] transition-colors duration-300"
          style={{ background: current.accent }}
        />
        {/* Sparkles icon */}
        <svg
          className="w-4 h-4 text-neutral-400 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
      </motion.button>
    </div>
  );
}
