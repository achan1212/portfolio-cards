import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type React from "react";
import { skillGroupsByMode } from "../data/skills";

// How many px of each stacked card peek above the next — enough to show the label
const PEEK_HEIGHT = 52;

// Mode wiring lands in a later phase; until then the section shows the technical set
const skillGroups = skillGroupsByMode.technical;

function SkillCard({ label, skills }: { label: string; skills: string[] }) {
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <li>
      <div className="skill-card-wrapper" onMouseMove={handleMouseMove}>
        <div className="skill-card-inner">
          <h3 className="text-xs uppercase tracking-[0.25em] text-violet-400 mb-5">
            {label}
          </h3>
          <ul className="space-y-2.5">
            {skills.map((skill) => (
              <li key={skill} className="text-sm text-neutral-300">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function Skills() {
  const gridRef = useRef<HTMLUListElement>(null);
  const heightWrapperRef = useRef<HTMLDivElement>(null);
  const originalHeightRef = useRef<number | null>(null);
  const [isStacked, setIsStacked] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;

    const cards = Array.from(gridEl.children) as HTMLElement[];
    const ctx = gsap.context(() => gsap.set(cards, { opacity: 0 }));

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (heightWrapperRef.current && originalHeightRef.current === null) {
          originalHeightRef.current = heightWrapperRef.current.scrollHeight;
        }

        if (prefersReducedMotion) {
          gsap.set(cards, { opacity: 1 });
          return;
        }

        const gridRect = gridEl.getBoundingClientRect();
        const deckX = gridRect.width / 2;

        cards.forEach((card, i) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left - gridRect.left + cardRect.width / 2;

          gsap.fromTo(
            card,
            {
              x: deckX - cardCenterX,
              y: -28,
              rotation: (i - (cards.length - 1) / 2) * 8,
              scale: 0.88,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: 0.65,
              delay: i * 0.11,
              ease: "power3.out",
              clearProps: "x,y,rotation,scale",
            }
          );
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(gridEl);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  function handleToggle() {
    if (animatingRef.current) return;
    const wrapper = heightWrapperRef.current;
    const gridEl = gridRef.current;
    if (!wrapper || !gridEl) return;

    const cards = Array.from(gridEl.children) as HTMLElement[];
    animatingRef.current = true;

    if (!isStacked) {
      if (originalHeightRef.current === null) {
        originalHeightRef.current = wrapper.scrollHeight;
      }

      const gridRect = gridEl.getBoundingClientRect();
      const card0Rect = cards[0].getBoundingClientRect();
      const maxCardHeight = Math.max(...cards.map((c) => c.getBoundingClientRect().height));

      // Center the solitaire column in the grid
      const stackLeft = (gridRect.width - card0Rect.width) / 2;
      const stackedHeight = (cards.length - 1) * PEEK_HEIGHT + maxCardHeight;

      gsap.set(wrapper, { height: wrapper.scrollHeight, overflow: "hidden" });

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardLeft = cardRect.left - gridRect.left;
        const cardTop = cardRect.top - gridRect.top;

        gsap.to(card, {
          x: stackLeft - cardLeft,
          // Place card i at i * PEEK_HEIGHT from the top of the grid
          y: i * PEEK_HEIGHT - cardTop,
          // Cards lower in the pile (higher i) sit on top visually
          zIndex: i + 1,
          duration: 0.5,
          delay: (cards.length - 1 - i) * 0.08,
          ease: "power3.inOut",
        });
      });

      gsap.to(wrapper, {
        height: stackedHeight,
        duration: 0.5,
        delay: 0.1,
        ease: "power3.inOut",
        onComplete: () => {
          animatingRef.current = false;
          setIsStacked(true);
        },
      });
    } else {
      const targetHeight = originalHeightRef.current ?? wrapper.scrollHeight;

      gsap.to(wrapper, {
        height: targetHeight,
        duration: 0.5,
        ease: "power3.inOut",
      });

      cards.forEach((card, i) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          zIndex: 0,
          duration: 0.5,
          delay: i * 0.08,
          ease: "power3.out",
          clearProps: "x,y,zIndex",
          onComplete:
            i === cards.length - 1
              ? () => {
                  gsap.set(wrapper, { clearProps: "height,overflow" });
                  animatingRef.current = false;
                  setIsStacked(false);
                }
              : undefined,
        });
      });
    }
  }

  return (
    <section
      id="skills"
      className="py-32 px-6 border-t border-white/5"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-7xl mx-auto">
        <p
          className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-4"
          aria-hidden="true"
        >
          Skills
        </p>
        <div className="flex items-end justify-between mb-16">
          <h2
            id="skills-heading"
            className="text-4xl md:text-5xl font-semibold tracking-tight text-white"
          >
            Tools of the craft.
          </h2>
          <button
            onClick={handleToggle}
            aria-label={isStacked ? "Deal skill cards" : "Stack skill cards"}
            aria-expanded={!isStacked}
            aria-controls="skills-grid"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-colors shrink-0"
          >
            {isStacked ? (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <rect x="0.5" y="3.5" width="7" height="10" rx="1.5" transform="rotate(-15 0.5 3.5)" />
                  <rect x="6" y="1.5" width="8" height="11" rx="1.5" />
                  <rect x="12.5" y="3.5" width="7" height="10" rx="1.5" transform="rotate(15 12.5 3.5)" />
                </svg>
                Deal
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <rect x="3" y="1.5" width="14" height="11" rx="1.5" />
                  <rect x="3" y="4" width="14" height="11" rx="1.5" />
                  <rect x="3" y="6.5" width="14" height="11" rx="1.5" />
                </svg>
                Stack
              </>
            )}
          </button>
        </div>

        <div ref={heightWrapperRef}>
          <ul
            id="skills-grid"
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0"
            aria-label="Technical skills by category"
          >
            {skillGroups.map((group) => (
              <SkillCard key={group.label} label={group.label} skills={group.skills} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
