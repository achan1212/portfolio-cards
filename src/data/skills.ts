import type { ModeId } from "../lib/mode";

export type SkillGroup = {
  label: string;
  skills: string[];
};

export const skillGroupsByMode: Record<ModeId, SkillGroup[]> = {
  technical: [
    {
      label: "Frontend",
      skills: ["ReactJS", "JavaScript ES6+", "HTML5", "CSS3 / Sass", "jQuery", "Sly Slider"],
    },
    {
      label: "CMS & Platforms",
      skills: ["Adobe Experience Manager", "WordPress"],
    },
    {
      label: "Analytics & Tracking",
      skills: ["Google Tag Manager", "GA4", "Google Ads"],
    },
    {
      label: "Auth & Security",
      skills: ["JWT", "OAuth 2.0"],
    },
  ],
  artistic: [
    {
      label: "Illustration",
      skills: ["Digital Illustration", "Botanical & Wildlife Studies", "Character Design", "Portrait Characters"],
    },
    {
      label: "Animation",
      skills: ["Character Animation", "Sprite Sheets", "Animated GIFs"],
    },
    {
      label: "AR / XR",
      skills: ["Vuforia", "AR Content Pipelines", "Educational XR"],
    },
    {
      label: "Design Craft",
      skills: ["In-App UI Art", "Art Direction", "Visual Storytelling"],
    },
  ],
};
