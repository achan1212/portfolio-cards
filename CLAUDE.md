# Portfolio 2026 — Claude Code Context

## Project overview
Allan Chan's personal portfolio site. React + TypeScript + Vite, deployed to Netlify.
Live repo: https://github.com/achan1212/portfolio-cards

## Stack
- **React 19 + TypeScript** — all components are `.tsx`
- **Tailwind CSS v4** — CSS-first config via `src/index.css` (`@import "tailwindcss"`)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` — 3D tarot card hero
- **GSAP** — entrance animations and Skills deck animation
- **Lenis** — smooth scroll (ReactLenis wrapper in App.tsx)
- **Framer Motion** — navbar entrance animation + lightbox transitions

## Key architecture decisions
- Project data lives in `src/data/projects/` (typed TS files), not inline in components
- `Feature` type has an optional `stat?: { value: string; label: string }` field — populate it when a feature has a measurable outcome to surface as a callout badge
- `src/sections/Projects.tsx` is pure presentation — imports `workExperiences` array, filters by `discipline`, and maps `WorkCard`
- **Theme system**: 5 presets (dark/light/midnight/ember/terminal) via `data-theme` attribute on `<html>`, driven by `App.tsx` state + `src/lib/theme.ts`; Tailwind v4 CSS variable overrides per `[data-theme]` block in `src/index.css` re-color every utility class; persisted to localStorage
- **Mode system (Dev/Art)**: `mode: "technical" | "artistic"` in `App.tsx` (`src/lib/mode.ts`), mirrored to `data-mode` on `<html>`, localStorage, and a `?mode=art` URL param (init priority: URL → localStorage → technical). Content is tagged by `discipline`, not duplicated; per-mode copy lives in `src/data/modeCopy.ts`, per-mode skill groups in `src/data/skills.ts`. Sections receive `mode` as a prop and adapt (filter/reorder/copy-swap); `Home.tsx` flips section order so each mode's centerpiece leads
- R3F components can't read DOM React context (separate reconciler) — `TarotDeck` observes `data-theme`/`data-mode` with a single MutationObserver instead
- Canvas components in `src/components/canvas/` use refs + `useFrame` for all animation — no React state in the render loop

## Styling conventions
- Dark theme defaults: background `#0a0a0a`, card surface `#111111`, accent `violet-400`
- CSS custom properties `--bg-page` and `--bg-card` drive theme switching
- Skill card glow effect uses `.skill-card-wrapper` / `.skill-card-inner` CSS classes with `radial-gradient` tracking `--mx`/`--my` mouse position
- Project cards use a blur glow layer (`absolute -inset-0.5 blur-md`) behind the card surface

## Three.js / R3F conventions
- Never allocate objects inside `useFrame` — use `useMemo` for scratch vectors/quaternions
- `AnimatedCard` in `TarotDeck.tsx` handles all per-card animation via refs (`flipValueRef`, `flipCommittedRef`) to avoid re-renders
- Card flip detection: dot product of world-space front normal vs camera direction; latches on hover to avoid mid-flip oscillation

## What has been built

### Hero (Three.js tarot deck)
- 5-card spread with fan layout — cards spread on hover/pin, collapse when idle
- Back-face detection: card flips to face viewer when its back faces the camera (dot product latch prevents oscillation at 90°)
- `flipCount` state in `TarotDeck` keeps spread open while any card is mid-flip arc
- Z-lift direction respects camera position sign so cards always lift toward viewer

### Projects section (`src/sections/Projects.tsx`)
- Collapsible `WorkCard` per employer with violet glow halo
- Feature tab switcher per card; gallery scroll resets on tab change
- **Lightbox**: clicking any screenshot opens a full-screen portal overlay (via `createPortal` to `document.body`) with fade+scale animation, keyboard nav (← → Escape), prev/next buttons, image counter, and body scroll lock
- **Metric stat badges**: features with measurable outcomes show a violet callout badge (value + label) above the description — driven by `stat` field in `Feature` type

### Skills section (`src/sections/Skills.tsx`)
- GSAP deal-in animation on scroll (IntersectionObserver, `threshold: 0.2`) — cards fan from center deck to grid positions; respects `prefers-reduced-motion`
- **Solitaire stack toggle**: "Stack" button animates all 4 cards into a centered vertical column where each card's header peeks `52px` above the next (z-index layered so lower cards sit on top). "Deal" reverses the animation. Height wrapper uses GSAP-controlled `overflow: hidden` only during transition so the deal-in entrance isn't clipped.

### Resume section (`src/sections/Resume.tsx`)
- Timeline layout with violet dot spine for experience + education

### Theme
- Quick light/dark toggle button in `Navbar` (sun/moon SVG); full 5-preset picker in the floating `ThemeSwitcher` (bottom-right)
- `[data-theme]` blocks in `src/index.css` flip `--bg-page` / `--bg-card` / Tailwind color vars; tarot cards re-texture per theme via `cardThemes` in `src/lib/theme.ts`

### Dual mode (Dev / Art)
- `ModeToggle` segmented pill in the Navbar switches the whole site between technical and artistic personas
- Hero copy crossfades; About paragraphs reorder; Skills swaps card sets (mode-keyed remount replays the GSAP deal-in); Projects filters by `discipline`; Artwork is a 3-piece teaser in Dev mode ("See my artistic side →" flips mode) and the full masonry in Art mode; Resume reorders mode-first; Contact copy swaps
- Shareable: `?mode=art` in the URL wins over localStorage on load
- Full plan/history: `docs/dual-mode-plan.md`

## What still needs to be done

### High priority
- **Résumé PDF download button** — add `public/Allan_Chan_Resume.pdf`, then wire a download button into the Navbar and/or Resume section header. Button shell is ready to add once the PDF is in place.
- **Original illustration / personal artwork** — Allan is an illustrator; adding original art (self-portrait, hero accent, or section divider) would uniquely differentiate the site from typical dev portfolios.

### Medium priority
- **Case study write-ups** — expand each project feature into a Problem → Approach → Result narrative. Currently descriptions are 1–2 sentences; a deeper write-up signals senior thinking to recruiters.
- **Testimonial / social proof** — one quoted sentence from a manager or colleague with name + title. More persuasive than any bullet point.
- **Live coded interactive demo** — a small self-contained React/Canvas experiment embedded in a section (generative art, particle system, etc.) to show building for fun, not just work.

### Nice to have
- **Mobile nav menu** — the navbar hides links below `md` breakpoint with no hamburger/drawer fallback
- **OG image + meta tags** — `<meta og:image>` and `<title>` per page for link previews when sharing
- **Contact form** — replace/supplement the mailto link with a working form (e.g., Netlify Forms)

## Commands
```bash
npm run dev      # dev server at localhost:5173
npm run build    # tsc + vite build
npm run preview  # preview production build
```
