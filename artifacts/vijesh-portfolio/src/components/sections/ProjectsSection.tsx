import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio, type Project, type ProjectCategory } from '@/data/portfolio';
import { SectionReveal } from '@/components/animations';
import ProjectCaseStudy from '@/components/ProjectCaseStudy';

type Filter = 'All' | ProjectCategory;

const filters: Filter[] = ['All', 'Full-Stack', 'AI / ML', 'Cloud & DevOps', 'Hackathon', 'Open Source'];

const accentClass: Record<Project['accent'], string> = {
  amber: 'from-secondary/40',
  teal: 'from-primary/40',
  coral: 'from-[#f1c2ad]/40',
  violet: 'from-[#d8d0ed]/40',
  blue: 'from-[#bfdce6]/40',
  gold: 'from-[#ecd996]/40',
};

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-1, 1], reduced ? [0, 0] : [6, -6]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-1, 1], reduced ? [0, 0] : [-6, 6]), { stiffness: 180, damping: 22 });
  const lightX = useTransform(x, [-1, 1], ['0%', '100%']);
  const lightY = useTransform(y, [-1, 1], ['0%', '100%']);
  const lightBackground = useMotionTemplate`radial-gradient(420px circle at ${lightX} ${lightY}, rgba(255,255,255,0.10), transparent 60%)`;

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    y.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 34 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: durations.base, ease: easings.out }}
      whileHover={reduced ? undefined : { y: -6 }}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
        setHovered(false);
      }}
      onPointerEnter={() => setHovered(true)}
      className="relative [perspective:1000px]"
      data-testid={`card-project-${project.id}`}
    >
      <motion.div
        className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[1.6rem] border border-foreground/10 bg-surface-raised p-6 md:p-7"
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={{ boxShadow: hovered ? '0 30px 70px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.25)' }}
        transition={{ duration: durations.base }}
      >
        {/* Cursor light */}
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ background: reduced ? 'none' : lightBackground, opacity: hovered && !reduced ? 1 : 0 }}
          aria-hidden="true"
        />
        <div className={`pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-gradient-to-br ${accentClass[project.accent] ?? accentClass.amber} to-transparent opacity-70 blur-xl`} />
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative flex items-start justify-between gap-4">
          <span className="rounded-full border border-foreground/15 bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
            {project.category}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {project.status === 'Private Repository' ? 'private' : 'open source'}
          </span>
        </div>

        <div className="relative mt-auto">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{project.kicker}</p>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-foreground">{project.title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-foreground/5 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpen(project)}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary transition-all hover:gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              data-testid={`button-project-details-${project.id}`}
            >
              Case Study <span aria-hidden="true">↗</span>
            </button>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                data-testid={`link-github-${project.id}`}
              >
                View GitHub
              </a>
            )}
            {project.status === 'Private Repository' && !project.github && (
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Private repository
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/** Act 4 — build: filterable project grid with 3D tilt cards expanding into case studies. */
export default function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('All');
  const [active, setActive] = useState<Project | null>(null);

  const visible = useMemo(() => {
    if (filter === 'All') return portfolio.projects;
    const category = filter as Exclude<ProjectCategory, 'All'>;
    return portfolio.projects.filter((project) => {
      const categories = project.categories as readonly string[] | undefined;
      return categories ? categories.includes(category) : project.category === category;
    });
  }, [filter]);

  return (
    <section id="projects" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-projects">
      <div className="section-shell">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">02 / Selected work</p>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                Projects with a point of view.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Product engineering, applied intelligence, and the systems that help software get out the door.
              </p>
            </div>
          </div>
        </SectionReveal>

        <SectionReveal className="mt-12" from="fade">
          <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-5" role="toolbar" aria-label="Project filters">
            {filters.map((item) => (
              <motion.button
                key={item}
                onClick={() => setFilter(item)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.11em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  filter === item ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={filter === item}
                data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-').replace('/', '')}`}
              >
                {filter === item && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{item}</span>
              </motion.button>
            ))}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">
              {String(visible.length).padStart(2, '0')} / {String(portfolio.projects.length).padStart(2, '0')}
            </span>
          </div>
        </SectionReveal>

        <motion.div layout className="mt-8 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.length ? (
              visible.map((project, index) => (
                <div key={project.id} className={index % 2 ? 'md:mt-10' : ''}>
                  <ProjectCard project={project} onOpen={setActive} />
                </div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center md:col-span-2"
              >
                <p className="font-display text-xl font-semibold">No projects tagged {filter} yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">This filter stays available as the portfolio grows.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{active && <ProjectCaseStudy project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
