import type React from "react";

const skillGroups = [
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
];

function SkillCard({ label, skills }: { label: string; skills: string[] }) {
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div className="skill-card-wrapper" onMouseMove={handleMouseMove}>
      <div className="skill-card-inner">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-400 mb-5">{label}</p>
        <ul className="space-y-2.5">
          {skills.map((skill) => (
            <li key={skill} className="text-sm text-neutral-300">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Skills</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-16">
          Tools of the craft.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <SkillCard key={group.label} label={group.label} skills={group.skills} />
          ))}
        </div>
      </div>
    </section>
  );
}
