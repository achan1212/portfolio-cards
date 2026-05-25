# Allan Chan — Portfolio 2026

Personal portfolio site for Allan Chan, UI Developer at Samsung SDS America.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Three.js** via `@react-three/fiber` and `@react-three/drei` — interactive 3D tarot card hero
- **GSAP** — entrance animations
- **Lenis** — smooth scroll
- **Tailwind CSS v4** — styling
- **Framer Motion** — navbar animation
- **Netlify** — deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  components/
    canvas/       # Three.js hero scene (HeroScene, TarotDeck, TarotCard)
    layout/       # Navbar
  data/
    projects/     # Samsung & GRID Lab work experience data
  sections/       # Hero, About, Skills, Projects, Resume, Contact
  pages/          # Home page
public/
  samsung/        # Samsung project screenshots
  GRIDimages/     # GRID Lab illustration assets
```

## Deployment

Configured for Netlify via `netlify.toml`. Pushes to `main` auto-deploy.
