import type { ModeId } from "../lib/mode";

export type ModeCopy = {
  hero: {
    titleLine1: string;
    titleLine2: string; // rendered with the gradient treatment
    subtitle: string;
    primaryCta: { label: string; href: string };
  };
  about: {
    /** Paragraph order — first entry leads. Keys index into aboutParagraphs. */
    paragraphOrder: ["samsung", "crossDiscipline", "lookingFor"] | ["crossDiscipline", "samsung", "lookingFor"];
  };
  projects: {
    heading: string;
  };
  skills: {
    heading: string;
  };
  contact: {
    body: string;
  };
};

/** Shared paragraph pool for About — modes reorder rather than duplicate. */
export const aboutParagraphs: Record<"samsung" | "crossDiscipline" | "lookingFor", string> = {
  samsung:
    "At Samsung SDS America, I own end-to-end front-end delivery for product launches, B2B " +
    "storefronts, and enterprise service portals that reach millions of visitors monthly. I've " +
    "shipped Galaxy flagship reserve pages, a national STEM contest platform handling thousands " +
    "of concurrent users, and a B2B commerce system serving enterprise buyers — always with a " +
    "focus on Core Web Vitals, accessibility, and zero-defect launches.",
  crossDiscipline:
    "My background in illustration and AR gives me a rare edge: I think visually before I write " +
    "a line of code. That cross-discipline perspective means I collaborate fluidly with " +
    "designers, catch interaction problems early, and produce interfaces that feel intentional — " +
    "not just functional.",
  lookingFor:
    "I'm drawn to teams building products at scale — complex data surfaces, B2B tools, " +
    "content-rich platforms — where thoughtful engineering and design both matter.",
};

export const modeCopy: Record<ModeId, ModeCopy> = {
  technical: {
    hero: {
      titleLine1: "Building immersive",
      titleLine2: "digital experiences.",
      subtitle:
        "I'm Allan — a UI developer at Samsung SDS America with 3+ years shipping B2B " +
        "commerce platforms, flagship product launches, and national-scale portals to " +
        "millions of users. I turn complex requirements into fast, accessible, polished " +
        "React experiences.",
      primaryCta: { label: "View projects", href: "#projects" },
    },
    about: {
      paragraphOrder: ["samsung", "crossDiscipline", "lookingFor"],
    },
    projects: {
      heading: "Selected work.",
    },
    skills: {
      heading: "Tools of the craft.",
    },
    contact: {
      body:
        "Whether you're scaling a product, launching something new, or need a front-end engineer " +
        "who can hold their own in a design conversation — I'd love to hear about it.",
    },
  },
  artistic: {
    hero: {
      titleLine1: "Drawing worlds,",
      titleLine2: "then building them.",
      subtitle:
        "I'm Allan — an illustrator and front-end developer. I've drawn 70+ production " +
        "illustrations, animated character sprites, and AR experiences for Rutgers GRID Lab — " +
        "and I ship the code that brings them to life. Art direction and engineering, one person.",
      primaryCta: { label: "View artwork", href: "#artwork" },
    },
    about: {
      paragraphOrder: ["crossDiscipline", "samsung", "lookingFor"],
    },
    projects: {
      heading: "Illustration & AR work.",
    },
    skills: {
      heading: "Craft of a different kind.",
    },
    contact: {
      body:
        "Whether you need illustration with production polish, AR content, or an artist who can " +
        "ship their own code — I'd love to hear about it.",
    },
  },
};
