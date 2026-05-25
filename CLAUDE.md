# Portfolio 2026 — Claude Code Context

## Project overview
Allan Chan's personal portfolio site. React + TypeScript + Vite, deployed to Netlify.

## Stack
- **React 19 + TypeScript** — all components are `.tsx`
- **Tailwind CSS v4** — CSS-first config via `src/index.css` (`@import "tailwindcss"`)
- **Three.js** via `@react-three/fiber` + `@react-three/drei` — 3D tarot card hero
- **GSAP** — entrance animations (useGSAP hook)
- **Lenis** — smooth scroll (ReactLenis wrapper in App.tsx)
- **Framer Motion** — navbar entrance animation

## Key architecture decisions
- Project data lives in `src/data/projects/` (typed TS files), not inline in components
- `src/sections/Projects.tsx` is pure presentation — imports `workExperiences` array and maps `WorkCard`
- Theme (light/dark) toggled by adding `html.light` class via `App.tsx` state; CSS variables in `src/index.css` handle the switch
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

## Commands
```bash
npm run dev      # dev server at localhost:5173
npm run build    # tsc + vite build
npm run preview  # preview production build
```
