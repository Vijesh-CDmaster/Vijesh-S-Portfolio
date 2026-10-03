import { motion, useReducedMotion } from 'framer-motion';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

const highlight = portfolio.projects.find((project) => project.id === 'ecosort');

/** Act 5 — hackathons & achievements: horizontal snap timeline on desktop,
 *  vertical stack on mobile, with the verified Vihansa result highlighted. */
export default function AchievementsSection() {
  const reduced = useReducedMotion();

  return (
    <section id="achievements" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-achievements">
      <div className="section-shell">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">06 / Achievements</p>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                Hackathons, milestones, proof.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Verified events only — no invented awards, no inflated numbers.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Highlighted result */}
        {highlight?.result && (
          <SectionReveal className="mt-12" from="scale">
            <motion.div
              className="relative overflow-hidden rounded-[1.5rem] border border-secondary/30 bg-secondary/10 p-7 md:p-9"
              whileHover={reduced ? undefined : { y: -4 }}
              data-testid="card-highlight-result"
            >
              <div className="absolute -right-10 -top-10 size-48 rounded-full bg-secondary/15 blur-3xl" />
              <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">verified result</p>
              <p className="relative mt-4 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                {highlight.result}
              </p>
              <p className="relative mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                {highlight.title} — {highlight.summary}
              </p>
            </motion.div>
          </SectionReveal>
        )}

        {/* Timeline */}
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-primary/50 via-secondary/50 to-transparent md:block" />
          <StaggerContainer className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:gap-6 md:overflow-x-auto [scrollbar-width:thin]" step={0.07}>
            {portfolio.hackathons.map((event, index) => (
              <StaggerItem
                key={event}
                from="up"
                className="w-64 shrink-0 snap-start md:w-72"
              >
                <div className="group h-full rounded-2xl border border-foreground/10 bg-surface-raised/70 p-5 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-secondary">{String(index + 1).padStart(2, '0')}</span>
                    <motion.span
                      className="grid size-8 place-items-center rounded-full border border-secondary/40 text-secondary"
                      whileHover={reduced ? undefined : { rotate: 90, scale: 1.1 }}
                      transition={{ duration: durations.base, ease: easings.out }}
                      aria-hidden="true"
                    >
                      ✦
                    </motion.span>
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold leading-snug tracking-[-0.02em] text-foreground">
                    {event}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    hackathon / project milestone
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Standing achievements */}
        <StaggerContainer className="mt-8 grid gap-4 md:grid-cols-3" step={0.09}>
          {portfolio.achievements.map((achievement) => (
            <StaggerItem key={achievement} className="rounded-2xl border border-foreground/10 bg-surface-sunken/60 p-5">
              <p className="text-sm leading-7 text-muted-foreground">{achievement}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
