export type ThemeId = "dark" | "light" | "midnight" | "ember" | "terminal";

export const themes: {
  id: ThemeId;
  label: string;
  description: string;
  bg: string;
  accent: string;
}[] = [
  { id: "dark",     label: "Dark",          description: "Default",        bg: "#0a0a0a", accent: "#a78bfa" },
  { id: "midnight", label: "Midnight Blue", description: "Cool navy",      bg: "#020812", accent: "#60a5fa" },
  { id: "ember",    label: "Warm Ember",    description: "Editorial",      bg: "#0d0803", accent: "#f59e0b" },
  { id: "terminal", label: "Terminal",      description: "Raw code",       bg: "#030a03", accent: "#3fb950" },
  { id: "light",    label: "Minimal Light", description: "Clean & bright", bg: "#f5f5f5", accent: "#7c3aed" },
];

export type CardTheme = {
  frame: string;         // card edge / border (was GOLD)
  symbol: string;        // icon, numeral, title (was GOLD_BRIGHT)
  back: string;          // card-back darkest bg
  backHighlight: string; // card-back radial centre
  cursorLight: string;   // cursor point-light colour
  cardColors: [string, string, string, string, string]; // per-card face bg, index matches CARDS
};

export const cardThemes: Record<ThemeId, CardTheme> = {
  dark: {
    frame:         "#d4a64a",
    symbol:        "#f5d98c",
    back:          "#1a0d2e",
    backHighlight: "#3d1f5c",
    cursorLight:   "#f5d98c",
    cardColors: ["#3d1f2e", "#2d1b54", "#0f1729", "#1e1b4b", "#3d2515"],
  },
  midnight: {
    frame:         "#93c5fd",
    symbol:        "#bfdbfe",
    back:          "#020c20",
    backHighlight: "#0c2550",
    cursorLight:   "#93c5fd",
    cardColors: ["#0c1e45", "#091840", "#061438", "#081c3d", "#0a2248"],
  },
  ember: {
    frame:         "#fbbf24",
    symbol:        "#fef3c7",
    back:          "#180c00",
    backHighlight: "#401a00",
    cursorLight:   "#fbbf24",
    cardColors: ["#2d1200", "#240f00", "#1c0c00", "#280e00", "#341500"],
  },
  terminal: {
    frame:         "#4ade80",
    symbol:        "#86efac",
    back:          "#020a02",
    backHighlight: "#092e09",
    cursorLight:   "#4ade80",
    cardColors: ["#0d1f0d", "#0a180a", "#081408", "#091609", "#0b1d0b"],
  },
  light: {
    frame:         "#7c3aed",
    symbol:        "#a78bfa",
    back:          "#2e1065",
    backHighlight: "#5b21b6",
    cursorLight:   "#7c3aed",
    cardColors: ["#5b21b6", "#4c1d95", "#3730a3", "#312e81", "#6d28d9"],
  },
};
