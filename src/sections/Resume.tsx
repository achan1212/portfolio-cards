const experience = [
  {
    company: "Samsung SDS America",
    role: "UI Developer — Sr. Staff Dotcom Operations",
    period: "May 2022 – Present",
    location: "Ridgefield Park, NJ",
    bullets: [
      "Decreased global page load times by 20% through code splitting, lazy loading, and CDN configuration, improving Core Web Vitals scores and user retention.",
      "Engineered flagship reserve pages for S24, S23, Tablets, and Galaxy Notebooks that captured over 5,000 pre-release customer inquiries.",
      "Revamped the Digital Service Request portal, successfully processing over 290,000 support tickets in 2024.",
      "Developed modular B2B product page components that drove a 25% increase in user engagement.",
      "Led front-end relaunch of the SamsungAds Blog, resulting in a 20% boost in lead generation.",
      "Sole front-end developer for the Solve for Tomorrow national education contest, supporting thousands of student participants.",
    ],
  },
  {
    company: "Rutgers University",
    role: "Website Designer — March2RUGardens",
    period: "June 2021 – February 2022",
    location: "New Brunswick, NJ",
    bullets: [
      "Designed a logo communicating accessibility for historically marginalized communities.",
      "Built a landing page and registration forms using WordPress and Sites by Rutgers, engaging 200+ students and volunteers.",
    ],
  },
  {
    company: "Rutgers GRID Lab",
    role: "Illustrator — Game Research Immersive Design",
    period: "July 2018 – June 2021",
    location: "New Brunswick, NJ",
    bullets: [
      "Led artistic direction for diverse educational games focused on nutrition and community initiatives.",
      "Produced 70+ vibrant illustrations across AR-powered games, fostering learning and engagement for young audiences.",
    ],
  },
];

const education = [
  {
    institution: "Rutgers University",
    degree: "Bachelor of Arts",
    period: "2017 – 2021",
    location: "New Brunswick, NJ",
    detail: "GPA 3.9",
  },
];

export default function Resume() {
  return (
    <section id="resume" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Resume</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-20">
          Experience & path.
        </h2>

        {/* Experience */}
        <div className="space-y-0">
          {experience.map((job, i) => (
            <div key={job.company + job.role} className="relative pl-8 pb-16 last:pb-0">
              {/* Timeline spine */}
              {i < experience.length - 1 && (
                <div className="absolute left-[7px] top-3 bottom-0 w-px bg-white/10" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-[6px] w-3.5 h-3.5 rounded-full border-2 border-violet-400 bg-page" />

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                <h3 className="text-lg font-semibold text-white">{job.company}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {job.location}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5">
                <span className="text-sm text-violet-400">{job.role}</span>
                <span className="text-xs text-neutral-500">{job.period}</span>
              </div>
              <ul className="space-y-2.5">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm text-neutral-400 leading-relaxed">
                    <span className="mt-1.5 flex-none w-1 h-1 rounded-full bg-violet-400/60" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-20">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-8">Education</p>
          {education.map((ed) => (
            <div key={ed.institution} className="relative pl-8">
              <div className="absolute left-0 top-[6px] w-3.5 h-3.5 rounded-full border-2 border-violet-400/50 bg-page" />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                <h3 className="text-lg font-semibold text-white">{ed.institution}</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {ed.location}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-sm text-violet-400">{ed.degree}</span>
                <span className="text-xs text-neutral-500">{ed.period}</span>
                <span className="text-xs text-neutral-500">{ed.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
