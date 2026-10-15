import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

type Skill = { name: string; category: string; x: number; y: number };
type Category = { label: string; x: number; y: number; hue: string };
type Point = { x: number; y: number };
type LaidOut = { skills: Map<string, Point>; hubs: Map<string, Point> };

/**
 * Act 3 — technical constellation. Skills are stars grouped around category
 * hubs; hovering a star lifts it, glows it, draws a line to its hub and shows
 * its category. No percentage bars — just relationships.
 *
 * Positions are seeded by the polar formula below, then resolved on mount and
 * resize by a small collision-relaxation solver: every chip is measured, hubs
 * stay pinned, and overlapping chips are pushed apart until each pair keeps a
 * real gap. This prevents chips from stacking on each other or on their hub.
 */
export default function SkillsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Skill | null>(null);
  const [layout, setLayout] = useState<LaidOut | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const skillEls = useRef(new Map<string, HTMLButtonElement>());
  const hubEls = useRef(new Map<string, HTMLSpanElement>());

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

  /**
   * Measure every chip and relax the seeded positions until nothing overlaps.
   * Hubs are pinned; skills are pushed out of collisions and spring back
   * toward their seeded position. Runs before paint (useLayoutEffect) so the
   * overlap-free layout is what first renders.
   */
  const solve = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) {
      setLayout(null); // constellation is hidden (mobile) — nothing to solve
      return;
    }

    type Box = {
      id: string;
      hub: boolean;
      cx: number;
      cy: number;
      w: number;
      h: number;
      hx: number;
      hy: number;
    };

    const boxes: Box[] = [];

    categories.forEach((category) => {
      const el = hubEls.current.get(category.label);
      if (!el) return;
      const cx = (category.x / 100) * width;
      const cy = (category.y / 100) * height;
      boxes.push({ id: category.label, hub: true, cx, cy, w: el.offsetWidth, h: el.offsetHeight, hx: cx, hy: cy });
    });

    skills.forEach((skill) => {
      const el = skillEls.current.get(skill.name);
      if (!el) return;
      const hx = (skill.x / 100) * width;
      const hy = (skill.y / 100) * height;
      boxes.push({ id: skill.name, hub: false, cx: hx, cy: hy, w: el.offsetWidth, h: el.offsetHeight, hx, hy });
    });

    const PAD = 12; // required clear gap between chip boxes
    const MARGIN = 8; // inset from the field borders

    const overlaps = () => {
      let collisions = 0;
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const a = boxes[i];
          const b = boxes[j];
          const overlapX = (a.w + b.w) / 2 + PAD - Math.abs(b.cx - a.cx);
          const overlapY = (a.h + b.h) / 2 + PAD - Math.abs(b.cy - a.cy);
          if (overlapX > 0 && overlapY > 0) collisions += 1;
        }
      }
      return collisions;
    };

    const clamp = (box: Box) => {
      box.cx = Math.min(width - box.w / 2 - MARGIN, Math.max(box.w / 2 + MARGIN, box.cx));
      box.cy = Math.min(height - box.h / 2 - MARGIN, Math.max(box.h / 2 + MARGIN, box.cy));
    };

    for (let iter = 0; iter < 300; iter += 1) {
      // 1. Spring skills back toward their seeded constellation position.
      for (const box of boxes) {
        if (box.hub) continue;
        box.cx += (box.hx - box.cx) * 0.05;
        box.cy += (box.hy - box.cy) * 0.05;
        clamp(box);
      }

      // 2. Push overlapping pairs apart along the axis of least penetration.
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const a = boxes[i];
          const b = boxes[j];
          const dx = b.cx - a.cx;
          const dy = b.cy - a.cy;
          const overlapX = (a.w + b.w) / 2 + PAD - Math.abs(dx);
          const overlapY = (a.h + b.h) / 2 + PAD - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;

          if (overlapX < overlapY) {
            const sign = dx !== 0 ? Math.sign(dx) : i % 2 === 0 ? 1 : -1;
            const push = sign * overlapX;
            if (a.hub && b.hub) continue;
            if (a.hub) b.cx += push;
            else if (b.hub) a.cx -= push;
            else {
              a.cx -= push / 2;
              b.cx += push / 2;
            }
          } else {
            const sign = dy !== 0 ? Math.sign(dy) : i % 2 === 0 ? 1 : -1;
            const push = sign * overlapY;
            if (a.hub && b.hub) continue;
            if (a.hub) b.cy += push;
            else if (b.hub) a.cy -= push;
            else {
              a.cy -= push / 2;
              b.cy += push / 2;
            }
          }
        }
      }

      // 3. Keep everything inside the field, then check for a clean state.
      boxes.forEach(clamp);
      if (iter > 5 && overlaps() === 0) break;
    }

    const next: LaidOut = { skills: new Map(), hubs: new Map() };
    for (const box of boxes) {
      const point = { x: box.cx, y: box.cy };
      if (box.hub) next.hubs.set(box.id, point);
      else next.skills.set(box.id, point);
    }
    setLayout(next);
  }, [categories, skills]);

  useLayoutEffect(() => {
    solve();
  }, [solve]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => solve());
    observer.observe(container);
    // Web fonts change chip widths — resolve again once they are ready.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) solve();
    });
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [solve]);

  const activeHub = active ? categories.find((category) => category.label === active.category) : null;
  const activeHubPoint = activeHub && layout ? layout.hubs.get(activeHub.label) : null;
  const activeSkillPoint = active && layout ? layout.skills.get(active.name) : null;

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
            ref={containerRef}
            className="relative hidden h-[440px] overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-surface-sunken/70 md:block"
            onPointerLeave={() => setActive(null)}
            data-testid="viz-constellation"
          >
            <div className="technical-grid absolute inset-0 opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,231,183,0.06),transparent_70%)]" />

            {/* Connector from active skill to its hub */}
            {active && activeHubPoint && activeSkillPoint && (
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <motion.line
                  x1={activeHubPoint.x}
                  y1={activeHubPoint.y}
                  x2={activeSkillPoint.x}
                  y2={activeSkillPoint.y}
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
            {categories.map((category) => {
              const point = layout?.hubs.get(category.label);
              return (
                <div key={category.label}>
                  <span
                    ref={(el) => {
                      if (el) hubEls.current.set(category.label, el);
                      else hubEls.current.delete(category.label);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] backdrop-blur-sm"
                    style={{
                      left: point ? `${point.x}px` : `${category.x}%`,
                      top: point ? `${point.y}px` : `${category.y}%`,
                      borderColor: active?.category === category.label ? category.hue : 'rgba(255,255,255,0.18)',
                      color: active?.category === category.label ? category.hue : 'rgba(255,255,255,0.55)',
                      backgroundColor: active?.category === category.label ? 'rgba(110,231,183,0.08)' : 'rgba(10,14,20,0.7)',
                    }}
                  >
                    {category.label}
                  </span>
                </div>
              );
            })}

            {/* Skill stars */}
            {skills.map((skill) => {
              const point = layout?.skills.get(skill.name);
              const isActive = active?.name === skill.name;
              const dimmed = active && !isActive && active.category !== skill.category;
              return (
                <motion.button
                  key={skill.name}
                  ref={(el) => {
                    if (el) skillEls.current.set(skill.name, el);
                    else skillEls.current.delete(skill.name);
                  }}
                  type="button"
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[10px] backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  style={{
                    left: point ? `${point.x}px` : `${skill.x}%`,
                    top: point ? `${point.y}px` : `${skill.y}%`,
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
