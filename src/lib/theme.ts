export type ThemeId = "dark" | "light" | "midnight" | "ember" | "terminal";

// Only Dark and Field Journal are offered in the switcher. Midnight/Ember/
// Terminal stay fully defined below (cardThemes, CSS) so nothing breaks for
// a visitor whose localStorage still has one of those IDs saved — they're
// just no longer reachable as a new choice.
export const themes: {
  id: ThemeId;
  label: string;
  description: string;
  bg: string;
  accent: string;
}[] = [
  { id: "dark",  label: "Dark",          description: "Default",   bg: "#0a0a0a", accent: "#a78bfa" },
  { id: "light", label: "Field Journal", description: "Botanical", bg: "#f2ede1", accent: "#55703f" },
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
  // Botanical field journal: pressed-plant greens on warm paper, with sepia
  // ink for the linework instead of the other themes' metallic frame.
  light: {
    frame:         "#8a7752",
    symbol:        "#3f5730",
    back:          "#e0d7bf",
    backHighlight: "#efe8d5",
    cursorLight:   "#9db377",
    cardColors: ["#d6d9bd", "#dedbc2", "#cfd8ba", "#e0d9c5", "#d4dcc3"],
  },
};
