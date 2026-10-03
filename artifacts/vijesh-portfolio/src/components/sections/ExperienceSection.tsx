import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal } from '@/components/animations';

const milestones = [
  {
    kind: 'education',
    period: portfolio.education.period,
    label: 'education',
    title: portfolio.education.degree,
    meta: `${portfolio.education.school} · Current CGPA ${portfolio.education.cgpa}`,
    note: 'B.Tech Artificial Intelligence & Data Science.',
  },
  {
    kind: 'experience',
    period: portfolio.experience.period,
    label: 'internship',
    title: `${portfolio.experience.role} — ${portfolio.experience.organization}`,
    meta: `Project: ${portfolio.experience.project}`,
    note: portfolio.experience.note,
  },
  {
    kind: 'building',
    period: 'Continuous',
    label: 'building',
    title: 'Hackathons & open source',
    meta: `${portfolio.hackathons.length} events and project milestones · CNCF & Meshery contributions`,
    note: 'Turning academic work into projects with a clear user and a practical outcome.',
  },
] as const;

/** Act 5 — journey: cinematic vertical timeline whose line grows with scroll. */
export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 55%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const particleY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-experience">
      <div className="section-shell">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">04 / Journey</p>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                Still learning. Already building.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                The throughline: keep asking better questions, and turn the answers into working software.
              </p>
            </div>
          </div>
        </SectionReveal>

        <div ref={containerRef} className="relative mt-16 pl-8 md:pl-12">
          {/* Track */}
          <div className="absolute left-[3px] top-1 h-full w-px bg-foreground/12 md:left-[7px]" />
          {/* Growing line */}
          <motion.div
            className="absolute left-[3px] top-1 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-primary/40 md:left-[7px]"
            style={{ scaleY: reduced ? 1 : lineScale }}
          />
          {/* Particle traveling the timeline */}
          {!reduced && (
            <motion.span
              className="absolute left-[-2px] top-1 size-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(244,182,74,0.9)] md:left-[2px]"
              style={{ y: particleY, top: 0, marginTop: 4 }}
              aria-hidden="true"
            />
          )}

          <ol className="space-y-14">
            {milestones.map((milestone, index) => (
              <li key={milestone.title} className="relative">
                <motion.span
                  className="absolute -left-8 top-1.5 size-3 rounded-full border-2 border-background bg-primary md:-left-12"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                />
                <motion.div
                  initial={{ opacity: 0, x: 34 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: durations.slow, ease: easings.out, delay: 0.05 }}
                  className="rounded-[1.5rem] border border-foreground/10 bg-surface-raised/70 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 md:p-8"
                  data-testid={`card-milestone-${index}`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    {milestone.period} / {milestone.label}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{milestone.meta}</p>
                  {milestone.note && (
                    <p className="mt-4 rounded-xl border border-secondary/25 bg-secondary/5 px-4 py-3 font-mono text-[11px] leading-5 text-secondary/90">
                      {milestone.note}
                    </p>
                  )}
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
