import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio, type Project } from '@/data/portfolio';

type Props = { project: Project; onClose: () => void };

type StudyBlock = { index: string; title: string; body?: string; items?: string[] };

/**
 * Project case study: the card expands into a full-screen scroll-driven
 * experience (problem → solution → architecture → technology → implementation
 * → result → links). Only blocks with real data are rendered.
 */
export default function ProjectCaseStudy({ project, onClose }: Props) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const blocks: StudyBlock[] = [
    { index: '01', title: 'Problem', body: project.summary },
    { index: '02', title: 'Solution', body: project.detail },
    { index: '03', title: 'Architecture', items: project.architecture },
    { index: '04', title: 'Technology', items: project.tags },
    { index: '05', title: 'Implementation', body: project.contribution },
    { index: '06', title: 'Result', body: project.result },
    { index: '07', title: 'Links', body: project.github ? undefined : 'Private repository — access on request.' },
  ].filter((block) => block.body || (block.items && block.items.length > 0));

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-y-auto bg-background/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.base, ease: easings.standard }}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      data-testid="dialog-case-study"
    >
      <div className="section-shell py-24">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.55, ease: easings.out }}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <motion.p
                className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: durations.base }}
              >
                {project.kicker}
              </motion.p>
              <motion.h2
                className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em]"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6, ease: easings.out }}
              >
                {project.title}
              </motion.h2>
            </div>
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.24, duration: durations.base }}
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="mt-2 grid size-11 shrink-0 place-items-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close case study"
              data-testid="button-close-project"
            >
              ✕
            </motion.button>
          </div>

          <motion.p
            className="mt-6 inline-flex rounded-full border border-foreground/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {project.category} · {project.status}
          </motion.p>

          <div className="mt-14 space-y-12">
            {blocks.map((block, blockIndex) => (
              <motion.section
                key={block.index}
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: easings.out, delay: (blockIndex % 3) * 0.05 }}
                className="grid gap-5 border-t border-foreground/10 pt-8 md:grid-cols-[110px_1fr] md:gap-8"
              >
                <div>
                  <p className="font-mono text-sm text-secondary">{block.index}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{block.title}</p>
                </div>
                <div>
                  {block.body && <p className="max-w-3xl text-base leading-8 text-foreground/85 md:text-lg">{block.body}</p>}
                  {block.items && block.items.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {block.items.map((item, index) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05, duration: durations.base }}
                          className={`rounded-full border border-foreground/15 bg-foreground/5 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/80 ${
                            block.title === 'Architecture' ? 'border-primary/30 text-primary/90' : ''
                          }`}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  {block.title === 'Links' && project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-primary-foreground"
                      data-testid="link-project-github"
                    >
                      View GitHub ↗
                    </a>
                  )}
                </div>
              </motion.section>
            ))}
          </div>

          <motion.div
            className="mt-16 flex flex-wrap items-center gap-4 border-t border-foreground/10 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={onClose}
              className="rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              ← Back to projects
            </button>
            <a
              href="#contact"
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
            >
              Discuss this build
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
