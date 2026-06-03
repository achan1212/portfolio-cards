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
