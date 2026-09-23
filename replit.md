# Vijesh S Portfolio

A recruiter-focused personal portfolio for Vijesh S, showcasing full-stack engineering, applied AI, Cloud and DevOps work through a polished animated web experience.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/vijesh-portfolio/src/data/portfolio.ts` — source of truth for personal details, projects, skills, education, experience, open source, and achievements.
- `artifacts/vijesh-portfolio/src/components/portfolio.tsx` — modular page sections and interactions.
- `artifacts/vijesh-portfolio/src/index.css` — visual theme, typography, grid texture, motion, and responsive utilities.
- `artifacts/vijesh-portfolio/index.html` — page metadata and SEO defaults.

## Architecture decisions

- The public site is a presentation-first React/Vite artifact with content centralized in a typed data module so updates do not require edits across components.
- Project details open in an accessible modal to keep the recruiter path fast while retaining deeper architecture and contribution context.
- Resume CTAs stay disabled until the configured path responds with an actual PDF content type.
- Contact form validation is client-side in the first build; no visitor identity or analytics data is captured implicitly.

## Product

The site introduces Vijesh as a Software Engineer & Full-Stack Developer, lets recruiters filter and inspect projects, reviews skills and experience, links to GitHub/LinkedIn/LeetCode, and provides a validated contact form with success and error states.

## User preferences

The portfolio content must not invent metrics, algorithms, experience, awards, repository access, or technologies that were not provided.

## Gotchas

- Add `public/resume.pdf` or set `VITE_RESUME_PATH` before expecting the resume CTA to activate.
- Keep contact details and project claims in `src/data/portfolio.ts`, not in individual sections.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
