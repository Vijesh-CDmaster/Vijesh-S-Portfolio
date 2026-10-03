# Design System — Dark Cinematic / ProMax Direction

Status of the "ProMax" UI/UX skill: **not installed in this environment** (only
`skill-creator` exists under `~/.agents/skills`, and no Replit skill runtime is
present). This document encodes the same rules so every future change follows
one direction. It governs the design *around* the existing content — it never
replaces the portfolio's copy, data, or structure.

## Style

Dark cinematic + premium + technical + minimal. The feel is a professional
engineering portfolio, not a product landing page.

Avoid:

- generic SaaS templates
- excessive gradients / glassmorphism
- giant glowing text
- gaming UI and random neon colors
- excessive rounded cards
- meaningless animation

## Surface hierarchy

Use multiple dark layers instead of flat black. Tokens live in
`src/index.css` under `DESIGN SYSTEM TOKENS`:

| Token | Role |
| --- | --- |
| `--surface-base` | Primary background |
| `--surface-sunken` | Recessed wells (code blocks) |
| `--surface-raised` | Secondary surface (cards) |
| `--surface-elevated` | Elevated surface (hover states) |
| `--surface-glass` | Glass surface (blur + alpha, use sparingly) |
| `--surface-border` / `--surface-border-strong` | Borders |
| `--accent-signal` / `--accent-warm` | Accents (max one per view) |
| `--text-strong` / `--text-default` / `--text-muted` / `--text-faint` | Text ramp |

## Typography

Three families only (already loaded in `index.css`):

- **Display — Space Grotesk:** H1/H2/H3, tight tracking (`-0.05em` range)
- **Body — Manrope:** paragraphs, UI text
- **Code/Label — DM Mono:** eyebrows, labels, code, metadata

Scale tokens: `--type-display` → `--type-h1` → `--type-h2` → `--type-h3` →
`--type-body` → `--type-small` → `--type-label` → `--type-code`.
Hierarchy per level: display > h1 > h2 > h3 > body > small > label > code.
Do not introduce additional fonts.

## UX rules

Every component must answer:

1. What is this?
2. Why is it here?
3. What can the user do?
4. What happens when they interact?

Priority order: **clarity → hierarchy → interaction → visual polish.**
No decorative UI without a purpose. Interactive elements need visible hover,
focus-visible, and pressed states.

## Motion rules

- Framer Motion: UI transitions, reveals, cards, buttons, nav, modals, page
  transitions, staggered text, hover, layout animation.
- Three.js / React Three Fiber: true 3D scenes only.
- GSAP: only for long cinematic timelines / scroll sequences that genuinely
  need sequencing. Never duplicate the same animation across two libraries.
- Transform + opacity only (`transform`, `opacity`, `scale`, `rotate`,
  `translate`). Never animate `width`/`height`/`top`/`left`/`margin`.
- All timings come from `src/motion/tokens.ts`; variant shapes from
  `src/motion/variants.ts`. No hard-coded durations in components.
- `prefers-reduced-motion` is handled globally by `MotionConfig
  reducedMotion="user"` in `App.tsx` plus the CSS override in `index.css`.

## Accessibility

- Contrast: text on `--surface-base` must clear WCAG AA (4.5:1 body, 3:1 large).
- Focus-visible rings on every interactive element.
- Reduced motion: content stays fully visible and usable; movement is removed,
  not content.
- Semantic landmarks (`header`/`main`/`section`/`footer`) and heading order.

## Architecture prep for the 3D cinematic rebuild

- `src/motion/tokens.ts` — durations, easings, springs, staggers, hover/page
  transitions (single source of motion truth)
- `src/motion/variants.ts` — reusable variants (`fadeIn`, `slideUp`,
  `slideLeft`, `slideRight`, `scaleIn`, `staggerChildren`, `pageTransition`)
- `src/components/animations/` — `FadeIn`, `SectionReveal`,
  `StaggerContainer`/`StaggerItem`, `PageTransition`, `MagneticButton`,
  `TiltCard`
- 3D scenes will live alongside as their own module (R3F), consuming the same
  token palette; GSAP timelines only when a scroll-driven sequence demands it.
