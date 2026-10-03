import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

type Skill = { name: string; category: string; x: number; y: number };
type Category = { label: string; x: number; y: number; hue: string };

/**
 * Act 3 — technical constellation. Skills are stars grouped around category
 * hubs; hovering a star lifts it, glows it, draws a line to its hub and shows
 * its category. No percentage bars — just relationships.
 */
export default function SkillsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Skill | null>(null);

  const categories: Category[] = useMemo(
    () =>
      portfolio.skills.map((group, index) => ({
        label: group.label,
        x: 12 + (index % 4) * 25,
        y: index < 4 ? 24 : 74,
        hue: index % 2 === 0 ? 'rgba(110,231,183,0.9)' : 'rgba(244,182,74,0.9)',
      })),
    [],
  );

  const skills: Skill[] = useMemo(() => {
    const result: Skill[] = [];
    portfolio.skills.forEach((group, groupIndex) => {
      const hub = categories[groupIndex];
      group.items.forEach((item, itemIndex) => {
        const angle = (itemIndex / group.items.length) * Math.PI * 2 + groupIndex;
        const radius = 9 + (itemIndex % 3) * 3.5;
        result.push({
          name: item,
          category: group.label,
          x: Math.min(92, Math.max(4, hub.x + Math.cos(angle) * radius)),
          y: Math.min(90, Math.max(8, hub.y + Math.sin(angle) * radius * 0.8)),
        });
      });
    });
    return result;
  }, [categories]);

  const activeHub = active ? categories.find((category) => category.label === active.category) : null;
  const activeSkill = skills.find((skill) => skill.name === active?.name);

  return (
    <section id="skills" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-skills">
      <div className="section-shell">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">03 / Capabilities</p>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                Wide enough to connect the dots.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                A technical constellation — hover any skill to see where it lives.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Constellation field (pointer devices) */}
        <SectionReveal className="mt-12" from="fade">
          <div
            className="relative hidden h-[440px] overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-surface-sunken/70 md:block"
            onPointerLeave={() => setActive(null)}
            data-testid="viz-constellation"
          >
            <div className="technical-grid absolute inset-0 opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.06),transparent_70%)]" />

            {/* Connector from active skill to its hub */}
            {active && activeHub && activeSkill && (
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <motion.line
                  x1={`${activeHub.x}%`}
                  y1={`${activeHub.y}%`}
                  x2={`${activeSkill.x}%`}
                  y2={`${activeSkill.y}%`}
                  stroke="rgba(110,231,183,0.75)"
                  strokeWidth="1.2"
                  strokeDasharray="3 5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: durations.base, ease: easings.out }}
                />
              </svg>
            )}

            {/* Category hubs */}
            {categories.map((category) => (
              <div key={category.label}>
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-sm"
                  style={{
                    left: `${category.x}%`,
                    top: `${category.y}%`,
                    borderColor: active?.category === category.label ? category.hue : 'rgba(255,255,255,0.18)',
                    color: active?.category === category.label ? category.hue : 'rgba(255,255,255,0.55)',
                    backgroundColor: active?.category === category.label ? 'rgba(110,231,183,0.08)' : 'rgba(10,14,20,0.7)',
                  }}
                >
                  {category.label}
                </span>
              </div>
            ))}

            {/* Skill stars */}
            {skills.map((skill) => {
              const isActive = active?.name === skill.name;
              const dimmed = active && !isActive && active.category !== skill.category;
              return (
                <motion.button
                  key={skill.name}
                  type="button"
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[10px] backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  style={{
                    left: `${skill.x}%`,
                    top: `${skill.y}%`,
                    borderColor: isActive ? 'rgba(110,231,183,0.8)' : 'rgba(255,255,255,0.14)',
                    backgroundColor: isActive ? 'rgba(110,231,183,0.14)' : 'rgba(10,14,20,0.72)',
                    color: isActive ? '#6ee7b7' : 'rgba(220,228,238,0.72)',
                  }}
                  onPointerEnter={() => setActive(skill)}
                  onFocus={() => setActive(skill)}
                  animate={
                    reduced
                      ? undefined
                      : {
                          y: dimmed ? 0 : [0, -4, 0],
                          opacity: dimmed ? 0.35 : 1,
                          scale: isActive ? 1.12 : 1,
                        }
                  }
                  transition={
                    isActive
                      ? { duration: durations.fast }
                      : { duration: 3.2, repeat: Infinity, delay: (skill.name.length % 5) * 0.4, ease: 'easeInOut' }
                  }
                  data-testid={`skill-${skill.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}
                >
                  {skill.name}
                </motion.button>
              );
            })}

            <AnimatePresence>
              {active && (
                <motion.div
                  className="absolute bottom-5 left-5 rounded-xl border border-primary/30 bg-background/90 px-4 py-3 backdrop-blur-md"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: durations.fast, ease: easings.out }}
                >
                  <p className="font-display text-sm font-semibold text-foreground">{active.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">part of {active.category}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionReveal>

        {/* Structured category cards (always visible, mobile-friendly) */}
        <StaggerContainer className="mt-6 grid gap-4 md:grid-cols-3">
          {portfolio.skills.map((group, index) => (
            <StaggerItem
              key={group.label}
              className="rounded-3xl border border-foreground/10 bg-surface-raised/70 p-6 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')} / {group.label}
                </p>
                <motion.span
                  className="size-1.5 rounded-full bg-secondary"
                  animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-foreground/5 px-2.5 py-1 font-mono text-[11px] text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <SectionReveal className="mt-6" from="scale">
          <div className="flex flex-col gap-5 rounded-3xl border border-secondary/25 bg-secondary/10 p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <p className="max-w-xl font-display text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
              I learn in public, then make the learning useful.
            </p>
            <div className="flex shrink-0 gap-3">
              <motion.a
                href={portfolio.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background"
                data-testid="link-github-skills"
              >
                GitHub ↗
              </motion.a>
              <motion.a
                href={portfolio.leetcode}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-4 py-2.5 text-xs font-bold text-foreground"
                data-testid="link-leetcode-skills"
              >
                LeetCode ↗
              </motion.a>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
