export type ModeId = "technical" | "artistic";

export const modes: {
  id: ModeId;
  label: string;
  tagline: string;
}[] = [
  { id: "technical", label: "Dev", tagline: "UI engineering & platforms" },
  { id: "artistic",  label: "Art", tagline: "Illustration & AR" },
];

export const DEFAULT_MODE: ModeId = "technical";

export function isModeId(value: string | null): value is ModeId {
  return value === "technical" || value === "artistic";
}

/** Accepts short URL aliases: ?mode=dev / ?mode=art */
export function parseMode(value: string | null): ModeId | null {
  if (value === "dev" || value === "technical") return "technical";
  if (value === "art" || value === "artistic") return "artistic";
  return null;
}
