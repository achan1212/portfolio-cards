// The stack that used to live in the standalone Skills section. Kept as data
// so it stays easy to edit, but rendered inline as part of the biography
// rather than as a separate card grid.
const stack: { label: string; skills: string[] }[] = [
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

export default function About() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">About</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-[1.1]">
          I'm Allan Chan — a UI developer and illustrator based in Mahwah, NJ.
        </h2>
        <p className="mt-8 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          At Samsung SDS America, I own end-to-end front-end delivery for product launches, B2B
          storefronts, and enterprise service portals that reach millions of visitors monthly. I've
          shipped Galaxy flagship reserve pages, a national STEM contest platform handling thousands
          of concurrent users, and a B2B commerce system serving enterprise buyers — always with a
          focus on Core Web Vitals, accessibility, and zero-defect launches.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          Day to day that means React and modern JavaScript against Adobe Experience Manager and
          WordPress, wiring up GA4 and Google Tag Manager so teams can actually see how a launch
          performs, and handling auth flows with JWT and OAuth 2.0 where the work touches
          enterprise sign-in.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          My background in illustration and AR gives me a rare edge: I think visually before I write
          a line of code. That cross-discipline perspective means I collaborate fluidly with
          designers, catch interaction problems early, and produce interfaces that feel intentional —
          not just functional.
        </p>
        <p className="mt-4 text-lg text-neutral-400 leading-relaxed max-w-2xl">
          I'm drawn to teams building products at scale — complex data surfaces, B2B tools,
          content-rich platforms — where thoughtful engineering and design both matter.
        </p>

        {/* Full stack listing, kept compact so it reads as a footnote to the
            biography rather than competing with it. */}
        <dl className="mt-14 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl border-t border-white/10 pt-8">
          {stack.map((group) => (
            <div key={group.label}>
              <dt className="text-xs uppercase tracking-[0.25em] text-violet-400 mb-3">
                {group.label}
              </dt>
              <dd>
                <ul className="space-y-1.5">
                  {group.skills.map((skill) => (
                    <li key={skill} className="text-sm text-neutral-400">
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
