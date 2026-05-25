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
};

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  years: string;
  tags: string[];
  features: Feature[];
};
