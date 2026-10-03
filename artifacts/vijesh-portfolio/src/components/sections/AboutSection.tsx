import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

const nodes = [
  { id: 'fullstack', label: 'FULL-STACK', x: '12%', y: '16%', description: 'React, Node, APIs, databases — end-to-end product delivery.' },
  { id: 'ai', label: 'AI', x: '70%', y: '10%', description: 'Machine learning, computer vision, AI APIs, applied intelligence.' },
  { id: 'cloud', label: 'CLOUD', x: '18%', y: '66%', description: 'AWS, deployment workflows, cloud-ready architecture.' },
  { id: 'devops', label: 'DEVOPS', x: '66%', y: '58%', description: 'Docker, Terraform, GitHub Actions, Linux, CI/CD.' },
  { id: 'system', label: 'SYSTEM DESIGN', x: '40%', y: '38%', description: 'Sensible boundaries, resilient delivery, legible decisions.' },
];

/** Compact proof strip — factual only, straight from project data. */
function StatsStrip() {
  return (
    <section aria-label="Engineering profile" className="border-t border-foreground/10 py-10">
      <div className="section-shell">
        <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {portfolio.stats.map((stat) => (
            <StaggerItem
              key={stat.label}
              className="rounded-2xl border border-foreground/10 bg-surface-raised/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <p className="font-display text-2xl font-semibold tracking-[-0.05em] text-primary md:text-3xl">{stat.value}</p>
              <p className="mt-2 font-mono text-[10px] uppercase leading-4 tracking-[0.12em] text-muted-foreground">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/**
 * Act 3 — engineering profile: introduction on the left, interactive
 * engineering-node visualization on the right. Hovering a node expands it,
 * animates its connectors and reveals a short description.
 */
export default function AboutSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <StatsStrip />
      <section id="about" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-about">
        <div className="section-shell">
          <SectionReveal>
            <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">01 / About</p>
              <div>
                <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                  The space between an idea and something people can rely on.
                </h2>
              </div>
            </div>
          </SectionReveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <SectionReveal from="left" delay={0.05}>
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-foreground/10 bg-surface-raised/70 p-7 md:p-9">
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{portfolio.about}</p>
                <ul className="mt-8 grid gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70">
                  {['Clarity before complexity.', 'Curious across the stack.', 'Always close to the user.'].map((principle) => (
                    <li key={principle} className="flex items-center gap-3">
                      <span className="size-1.5 rounded-full bg-secondary" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            <SectionReveal from="right" delay={0.12}>
              <div
                className="relative h-full min-h-[380px] overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-surface-sunken/80 [transform-style:preserve-3d]"
                onPointerLeave={() => setActive(null)}
                data-testid="viz-engineering"
              >
                <div className="technical-grid absolute inset-0 opacity-70" />
                <p className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  engineering map / hover a node
                </p>

                {/* Connector lines */}
                <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                  {nodes.map((node) => (
                    <motion.line
                      key={`line-${node.id}`}
                      x1="50%"
                      y1="50%"
                      x2={node.x}
                      y2={node.y}
                      stroke={active === node.id ? 'rgba(110,231,183,0.85)' : 'rgba(255,255,255,0.14)'}
                      strokeWidth={active === node.id ? 1.5 : 1}
                      strokeDasharray="4 6"
                      initial={false}
                      animate={active === node.id ? { pathLength: 1, opacity: 1 } : { opacity: 0.5 }}
                      transition={{ duration: durations.base, ease: easings.out }}
                    />
                  ))}
                  <circle cx="50%" cy="50%" r="4" fill="rgba(244,182,74,0.9)" />
                </svg>

                {nodes.map((node) => (
                  <motion.button
                    key={node.id}
                    type="button"
                    className="absolute rounded-full border border-foreground/15 bg-background/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    style={{ left: node.x, top: node.y }}
                    onPointerEnter={() => setActive(node.id)}
                    onFocus={() => setActive(node.id)}
                    whileHover={reduced ? undefined : { scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    animate={active === node.id ? { borderColor: 'rgba(110,231,183,0.7)', backgroundColor: 'rgba(110,231,183,0.12)' } : {}}
                    data-testid={`node-${node.id}`}
                  >
                    {node.label}
                  </motion.button>
                ))}

                <AnimatePresence>
                  {active && (
                    <motion.p
                      key={active}
                      className="absolute inset-x-6 bottom-6 rounded-xl border border-primary/25 bg-background/90 p-4 text-sm leading-6 text-foreground backdrop-blur-md"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: durations.fast, ease: easings.out }}
                    >
                      {nodes.find((node) => node.id === active)?.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
