import { motion } from "framer-motion";
import { modes, type ModeId } from "../lib/mode";

type Props = {
  mode: ModeId;
  onModeChange: (m: ModeId) => void;
  /** Larger variant for the Hero on mobile */
  size?: "sm" | "md";
};

export default function ModeToggle({ mode, onModeChange, size = "sm" }: Props) {
  const pad = size === "sm" ? "px-3 py-1" : "px-5 py-2";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      role="radiogroup"
      aria-label="Portfolio mode"
      className="relative inline-flex items-center rounded-full border border-white/10 bg-white/5 p-0.5"
    >
      {modes.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={active}
            title={m.tagline}
            onClick={() => onModeChange(m.id)}
            className={`relative rounded-full ${pad} ${text} font-medium transition-colors cursor-pointer ${
              active ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`mode-thumb-${size}`}
                className="absolute inset-0 rounded-full bg-violet-500/25 border border-violet-500/40"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
