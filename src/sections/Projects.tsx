import { useEffect, useRef, useState } from "react";
import { workExperiences, type WorkExperience } from "../data/projects";

function ChevronUp({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-neutral-400 flex-none transition-transform duration-400 ${open ? "" : "rotate-180"}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

function WorkCard({ company, role, years, tags, features }: WorkExperience) {
  const [activeId, setActiveId] = useState(features[0].id);
  const [isOpen, setIsOpen] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);
  const active = features.find((f) => f.id === activeId)!;

  useEffect(() => {
    galleryRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [activeId]);

  return (
    <div className="relative rounded-2xl">
      {/* Glow halo */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-violet-600/50 via-fuchsia-500/25 to-indigo-600/40 opacity-70 blur-md" />

      {/* Card surface */}
      <div className="relative rounded-2xl border border-white/10 bg-card overflow-hidden">

        {/* Header — click to collapse / expand */}
        <button
          className="w-full px-8 pt-8 pb-6 border-b border-white/5 flex flex-wrap items-start justify-between gap-4 text-left cursor-pointer"
          onClick={() => setIsOpen((o) => !o)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-500">{years}</span>
              <span className="h-px w-6 bg-white/20" />
              <span className="text-xs uppercase tracking-[0.25em] text-violet-400">{role}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {company}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 items-start">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border border-white/10 text-neutral-400 bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
          <ChevronUp open={isOpen} />
        </button>

        {/* Collapsible body */}
        <div
          className="grid transition-all duration-500 ease-in-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {/* Feature tabs */}
            <div className="px-8 pt-6 pb-2 flex flex-wrap gap-2">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
                    f.id === activeId
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                      : "text-neutral-500 border border-white/10 hover:text-neutral-300 hover:border-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Screenshot gallery */}
            <div className="relative mt-4">
              <div
                ref={galleryRef}
                className="flex gap-3 px-8 pb-4 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {active.screenshots.map((shot) => (
                  <div
                    key={shot.src}
                    className={`flex-none rounded-xl overflow-hidden border border-white/10 bg-white/5 h-56 ${
                      shot.contain ? "w-44" : shot.portrait ? "w-36" : "w-80"
                    }`}
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className={`w-full h-full ${
                        shot.contain ? "object-contain p-3" : "object-cover object-top"
                      }`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--bg-card)] to-transparent" />
            </div>

            {/* Active feature description */}
            <div className="px-8 pt-2 pb-8">
              <p className="text-neutral-400 leading-relaxed max-w-2xl text-sm">
                {active.description}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4">Projects</p>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-20">
          Selected work.
        </h2>
        <div className="space-y-6">
          {workExperiences.map((experience) => (
            <WorkCard key={experience.id} {...experience} />
          ))}
        </div>
      </div>
    </section>
  );
}
