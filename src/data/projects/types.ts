import type { ModeId } from "../../lib/mode";

export type Screenshot = {
  src: string;
  alt: string;
  portrait?: boolean;
  contain?: boolean;
};

export type Feature = {
  id: string;
  label: string;
  description: string;
  screenshots: Screenshot[];
  stat?: { value: string; label: string };
};

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  years: string;
  discipline: ModeId;
  tags: string[];
  features: Feature[];
};
