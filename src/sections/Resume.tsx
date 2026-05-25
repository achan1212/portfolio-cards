const experience = [
  {
    company: "Samsung SDS America",
    role: "UI Developer — Sr. Staff Dotcom Operations",
    period: "May 2022 – Present",
    location: "Ridgefield Park, NJ",
    bullets: [
      "Cut global page load times by 20% through code splitting, lazy loading, and CDN optimization — directly improving Core Web Vitals scores and reducing bounce rate across high-traffic product pages.",
      "Sole front-end engineer for Galaxy S24, S23, Tablets, and Notebook flagship reserve campaigns; pages captured 5,000+ pre-release inquiries feeding directly into the sales pipeline.",
      "Rebuilt the Digital Service Request portal end-to-end, scaling it to process 290,000+ support tickets in 2024 with zero critical incidents.",
      "Architected a modular B2B tier-pricing component system deployed across PDPs, product cards, and the compare surface, driving a 25% lift in user engagement.",
      "Led front-end relaunch of the SamsungAds Blog with performance and SEO improvements that produced a 20% increase in qualified lead generation.",
      "Served as the sole front-end engineer for Samsung's national Solve for Tomorrow STEM contest, owning all UI from wireframe review through production launch.",
    ],
  },
  {
    company: "Rutgers University",
    role: "Website Designer — March2RUGardens",
    period: "June 2021 – February 2022",
    location: "New Brunswick, NJ",
    bullets: [
      "Designed a brand identity and logo centered on accessibility and belonging for historically underserved communities.",
      "Built a responsive landing page and registration system in WordPress, onboarding 200+ students and volunteers for community garden programming across New Brunswick.",
    ],
  },
  {
    company: "Rutgers GRID Lab",
    role: "Illustrator — Game Research Immersive Design",
    period: "July 2018 – June 2021",
    location: "New Brunswick, NJ",
    bullets: [
      "Led artistic direction across three Vuforia AR titles spanning nutrition education, campus history, and community programming — owning character design, animation, and UI illustration end-to-end.",
      "Delivered 70+ production-ready illustrations and animated sprites integrated directly into shipped AR experiences for K-12 and university audiences.",
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
