# Plan: Technical ⇄ Artistic Portfolio Mode Switch

## Goal

Let visitors flip the entire portfolio between two personas:

- **Technical mode** — Allan the UI developer: React/TypeScript work, Samsung commerce platforms, engineering skills, dev-focused resume bullets.
- **Artistic mode** — Allan the illustrator: GRID Lab AR titles, original artwork, illustration/animation skills, art-focused history.

One toggle re-frames every section rather than just filtering one list. Recruiters see a focused story for the role they're hiring; the switch itself becomes a memorable interaction that demonstrates both identities at once.

## Current state (what we build on)

| Piece | Today | Mode-relevant? |
|---|---|---|
| `src/data/projects/` | `samsung` (dev) + `grid` (illustrator) in one `workExperiences` array | Yes — already splits cleanly by discipline |
| `src/sections/Projects.tsx` | Renders all experiences as `WorkCard`s | Filter by mode |
| `src/sections/Artwork.tsx` | Masonry grid + lightbox, always visible | Artistic-mode centerpiece |
| `src/sections/Skills.tsx` | Hardcoded `skillGroups` (Frontend, CMS, Analytics, Auth) — all technical | Needs an artistic counterpart |
| `src/sections/Hero.tsx` | Dev-focused subtitle | Copy swap per mode |
| `src/sections/Resume.tsx` | Mixed dev + illustration timeline | Re-order / re-emphasize per mode |
| Theme system (`data-theme`, `ThemeSwitcher`, localStorage) | Shipped | Pattern to reuse for mode |

## Design decisions (recommended)

1. **Mode is a first-class app state, not a filter.** `mode: "technical" | "artistic"` lives in `App.tsx` alongside `theme`, persisted to `localStorage("mode")`, mirrored to `<html data-mode="...">` so the R3F hero can observe it the same way it observes `data-theme` (MutationObserver — pattern already proven in `TarotDeck.tsx`).
2. **Shareable URLs.** Also read/write `?mode=art` (or `#art`) so Allan can send recruiters a link that opens in the right persona. URL param wins over localStorage on first load.
3. **Toggle placement: segmented control in the Navbar** (`< Dev / Art >` pill next to the theme button), plus an optional larger switch in the Hero. The floating bottom-right slot is taken by ThemeSwitcher — don't stack a second floating button.
4. **Content is tagged, not duplicated.** Add a `discipline` field to data types instead of maintaining two parallel data trees. Where copy genuinely differs (hero subtitle, about paragraphs), store both variants in a small `src/data/modeCopy.ts` keyed by mode.
5. **Both modes keep all sections reachable.** Mode changes emphasis, ordering, and defaults — it should not hard-hide the other half of Allan's identity (the cross-discipline story is a differentiator). E.g. technical mode still shows a slim Artwork teaser row linking to full artistic mode.

## Implementation steps

### Phase 1 — Data model (no visual change)

1. `src/lib/mode.ts` — `export type ModeId = "technical" | "artistic"` plus a `modes` display array (label, icon, tagline) mirroring `themes` in `lib/theme.ts`.
2. `src/data/projects/types.ts` — add `discipline: ModeId` to `WorkExperience`. Tag `samsung` → `technical`, `grid` → `artistic`.
3. `src/data/modeCopy.ts` — per-mode copy: hero title/subtitle, about paragraph set (or ordering), projects section heading ("Selected work." vs "Selected illustration & AR work."), skills heading.
4. `src/sections/Skills.tsx` — extract the hardcoded `skillGroups` into `src/data/skills.ts` with two group sets: technical (existing 4) and artistic (Illustration, Character & Animation, AR / XR Tools, Design Craft — sourced from GRID tags: Digital Illustration, Character Animation, Vuforia, Educational Tech).
5. `npm run build` to confirm types are sound. Commit: *"Add mode data model and tag content by discipline"*.

### Phase 2 — Mode state & plumbing

1. `App.tsx` — `const [mode, setMode] = useState<ModeId>` with init priority: URL param → localStorage → `"technical"`. Effect writes `data-mode` on `<html>`, localStorage, and replaces the URL param (via `history.replaceState`, no router churn).
2. Pass `mode` down to `Home` → sections as props (sections are few; props beat context here and match the existing `Navbar isLight` pattern).
3. Commit: *"Add mode state with URL + localStorage persistence"*.

### Phase 3 — Toggle UI

1. `src/components/ModeToggle.tsx` — segmented pill with two options (e.g. `⌨ Dev` / `✎ Art`), animated thumb via framer-motion `layoutId`, ARIA `role="tablist"` semantics, keyboard accessible.
2. Mount in `Navbar` (desktop) — and since the navbar hides links below `md`, also render the toggle in the Hero so mobile users can find it.
3. Commit: *"Add Dev/Art mode toggle"*.

### Phase 4 — Section adaptations (the visible payoff)

Work top-to-bottom; each bullet is independently commit-able.

1. **Hero** — swap title/subtitle from `modeCopy` with a framer-motion crossfade. Tarot deck reads `data-mode` via the existing MutationObserver pattern: artistic mode remaps card sections/titles (e.g. THE STAR → "artwork") or at minimum re-targets THE STAR to `#artwork`.
2. **About** — reorder paragraphs: technical mode leads with Samsung outcomes; artistic mode leads with the illustration/AR background paragraph.
3. **Skills** — render the mode's skill group set. The GSAP deal-in animation already re-runs on IntersectionObserver; re-key the grid on mode change (`key={mode}`) so cards re-deal — a free, thematic transition.
4. **Projects** — `workExperiences.filter(w => w.discipline === mode)` as the primary list; render the off-mode experience collapsed (`isOpen=false`) under a subtle "Also…" divider, or omit it and rely on the section ordering (decide during implementation; start with filter-only, it's simplest).
5. **Artwork** — artistic mode: full masonry section, moved above Projects in `Home.tsx` ordering. Technical mode: condensed 3-item teaser row with a "See artistic side →" button that flips the mode and scrolls.
6. **Section order in `Home.tsx`** — technical: Hero, About, Skills, Projects, Artwork(teaser), Resume, Contact. Artistic: Hero, About, Artwork, Projects(GRID), Skills(art), Resume, Contact.
7. **Navbar links** — keep `navLinks` static (both modes have all anchors); only labels/order change if section order changes. Simplest: leave nav untouched in v1.
8. **Resume** — tag timeline entries with `discipline` and sort mode-first (don't hide — recruiters expect a complete history).
9. **Contact** — one-line copy variant from `modeCopy` ("front-end engineer…" vs "illustrator who ships production code…").

### Phase 5 — Transition polish

1. Wrap mode-dependent section content in `AnimatePresence mode="wait"` with a short fade/slide (≤300ms) so the whole page doesn't hard-flash.
2. Respect `prefers-reduced-motion` (Skills already does — reuse that check).
3. Optional flourish: when mode flips, the hero tarot deck does a quick gather-and-respread (trigger via the same `data-mode` observer).

### Phase 6 — Verification & ship

1. `npm run build` + `npx tsc --noEmit`.
2. Playwright screenshot pass (xvfb, pattern from earlier sessions): both modes × dark + light themes, desktop + mobile widths; verify localStorage/URL persistence and that theme switching still works inside each mode.
3. Update `CLAUDE.md` (architecture notes + what-has-been-built).
4. Commit, push to `claude/portfolio-demo-LpMCA`.

## Open questions for Allan

1. **Default mode** for first-time visitors — plan assumes `technical` (primary job target). Confirm.
2. Should artistic mode also **re-skin the theme** (e.g. auto-suggest Warm Ember)? Plan keeps theme and mode fully independent.
3. Artwork data is still **placeholder images** (`src: ""` × 10) — artistic mode lands much harder once real illustrations are added. Worth doing before or alongside Phase 4.

## Effort estimate

- Phases 1–3: small, mostly mechanical (~1 session)
- Phase 4: the bulk of the work (~1–2 sessions; each section independently shippable)
- Phases 5–6: polish + QA (~1 session)
