# Recruiter Questions — Answers Needed from Allan

A recruiter or hiring manager spends 30–90 seconds on a portfolio before deciding
to dig in or move on. These are the questions they'll be silently asking that the
site currently doesn't answer — grouped by section, with where each answer will
land once you provide it. Answer inline, half-sentences are fine; I'll do the
wordsmithing.

Legend: 🔴 blocks a recruiter from acting · 🟡 weakens the pitch · 🟢 polish

---

## 1. Positioning — "Is this person what I'm looking for?"

- 🔴 **What roles are you actually targeting?** Front-end engineer? Full-stack?
  Design engineer / creative technologist? UX engineer? The Dev/Art split
  supports several stories — the copy should aim at the one you want.
  → *Hero subtitle, About closing paragraph, resume headline*
- 🔴 **Location & work arrangement:** Open to remote only, hybrid, on-site?
  Willing to relocate? (Site says Mahwah, NJ and nothing else.)
  → *Contact section, resume header*
- 🔴 **Are you authorized to work in the US without sponsorship?** Recruiters
  filter on this before anything else.
  → *Usually left off the site but needed for outreach replies — confirm for the résumé PDF*
- 🟡 **What seniority are you pitching?** "3+ years" reads mid-level; "Sr. Staff
  Dotcom Operations" in the resume reads senior. Which story?
  → *Hero, resume role titles*
- 🟡 **Are you open to contract/freelance (dev or illustration), or full-time only?**
  → *Contact copy, especially in Art mode*

## 2. Proof & credibility — "Can I trust these numbers?"

For each metric on the site, a good hiring manager will probe the story behind
it. One or two sentences each — baseline, what you did, how it was measured:

- 🟡 **"Cut global page load times by 20%"** — 20% of what metric (LCP? TTI?),
  measured how, on which pages?
- 🟡 **"25% increase in user engagement"** (tier pricing) — engagement defined as
  what? Measured over what period?
- 🟡 **"5,000+ pre-release inquiries"** — per launch or cumulative?
- 🟡 **"290,000+ support tickets in 2024"** — your role in that system vs the
  backend team's?
- 🟡 **"70+ illustrations"** — total across all three GRID titles?
  → *These answers become the Problem → Approach → Result case-study write-ups
  (already on the roadmap) and interview-ready talking points*

## 3. Team context — "What did *you* do vs your team?"

- 🔴 **Samsung team shape:** How many engineers/designers/PMs do you work with
  day-to-day? Who hands you designs? Do you review others' code?
  "Sole front-end engineer" appears twice — sole on the project, or sole on the team?
  → *About, case studies; this is the #1 interview question for portfolio claims*
- 🟡 **GRID Lab pipeline:** How did your art get into the AR builds — did you
  export assets for Unity/Vuforia developers, or integrate them yourself?
  → *GRID project card descriptions, Art-mode About*

## 4. Modern stack depth — "Is the React real or is it AEM?"

The Samsung tags lean legacy (jQuery, AEM, Sass). This portfolio itself is
React 19 + R3F + Tailwind v4 — strong evidence, but the site never says *you*
built it.

- 🔴 **Add a line that this portfolio is your own work?** ("This site: React 19,
  Three.js, Tailwind v4 — source on GitHub.") It's your best modern-stack proof.
  → *Footer or About*
- 🔴 **Do you have a GitHub (or other public code) to link?** Nothing on the
  site links anywhere today. If the repo for this portfolio can be public,
  that's the single highest-value link.
  → *Navbar/footer, Contact*
- 🟡 **LinkedIn URL?** Recruiters will search for it anyway; better to control the link.
  → *Contact, footer*
- 🟡 **Any TypeScript/testing/CI experience at Samsung** not currently listed?
  The skills cards have no TypeScript entry even though this repo is TS.
  → *Skills data*

## 5. Artwork — the biggest visible gap

The Art mode is now the centerpiece of half the site, and all 10 pieces are
empty placeholders.

- 🔴 **Which 8–12 pieces do you want to show?** For each: image file, title,
  medium, year, one-line story (optional but powerful).
  → *`src/data/artwork.ts` + `public/`*
- 🟡 **What tools do you actually illustrate with?** (Procreate? Photoshop?
  Clip Studio? Traditional media?) The artistic skill cards currently list
  outputs, not tools.
  → *Skills data (Art mode)*
- 🟡 **Are you open to illustration commissions/freelance?** Changes the Art-mode
  contact copy meaningfully.
  → *Contact (Art mode)*
- 🟢 **Any personal work outside GRID Lab** (sketchbooks, prints, fan art) worth
  including to show ongoing practice since 2021?
  → *Artwork grid — recency matters; newest visible year is currently 2024 placeholders*

## 6. Education & extras

- 🔴 **What was your Bachelor of Arts *in*?** The resume literally says
  "Bachelor of Arts — GPA 3.9" with no major. (Visual Arts? Computer Science? Both?)
  → *Resume education entry*
- 🟢 **Any certifications, awards, hackathons, conference talks?** (e.g. the
  SCUP conference appearance for Voorhees Mall could be framed as one.)
  → *Resume or About*

## 7. Social proof

- 🟡 **Can you get one quotable sentence from a Samsung manager or GRID Lab
  director?** Name + title + one line beats every bullet point on the page.
  Existing LinkedIn recommendations count — paste any you have.
  → *New testimonial element on the roadmap*

## 8. Logistics

- 🔴 **Resume PDF:** the download button is waiting on `Allan_Chan_Resume.pdf`.
  Do you have a current one, or should we generate it from the site content
  once the answers above are in?
  → *`public/`, Navbar/Resume download button*
- 🟢 **Preferred contact:** email only, or add phone/calendar link?
  → *Contact*

---

## How to answer

Reply in chat or edit this file directly — bullet by bullet, in any order.
The 🔴 items unblock the most: role targeting, work arrangement, GitHub/LinkedIn
links, artwork files, degree major, and the resume PDF. Once those land I can
fold them into the copy, data files, and the case-study write-ups in one pass.
