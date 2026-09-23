import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDot,
  Cloud,
  Code2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  LockKeyhole,
  Medal,
  Mail,
  Menu,
  Network,
  Phone,
  Search,
  Send,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { portfolio, navItems, type Project, type ProjectCategory } from '@/data/portfolio';

type RevealProps = { children: ReactNode; className?: string };

export function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${visible ? 'reveal' : 'opacity-0'} ${className}`}>{children}</div>;
}

export function SectionHeading({
  index,
  label,
  title,
  copy,
}: {
  index: string;
  label: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">{index} / {label}</p>
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">{title}</h2>
        {copy && <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{copy}</p>}
      </div>
    </div>
  );
}

export function Header({ resumeAvailable }: { resumeAvailable: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="section-shell mt-4">
        <div className="flex items-center justify-between rounded-full border border-foreground/10 bg-background/85 px-4 py-3 shadow-[0_14px_35px_rgba(31,69,73,0.08)] backdrop-blur-xl md:px-5">
          <a href="#top" onClick={close} className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">V</span>
            <span className="font-display text-sm font-semibold tracking-tight">Vijesh S<span className="text-primary">.</span></span>
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${item.label.toLowerCase()}`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {resumeAvailable ? (
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground transition-transform hover:-translate-y-0.5 sm:flex" data-testid="link-resume-header">
                Resume <ArrowUpRight className="size-3.5" />
              </a>
            ) : (
              <span className="hidden rounded-full border border-foreground/10 px-4 py-2 text-xs font-semibold text-muted-foreground sm:block" title="Add public/resume.pdf to enable this link">Resume soon</span>
            )}
            <button className="grid size-9 place-items-center rounded-full border border-foreground/10 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="mt-2 rounded-3xl border border-foreground/10 bg-card p-3 shadow-[0_14px_35px_rgba(31,69,73,0.1)] md:hidden">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={close} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid={`link-mobile-${item.label.toLowerCase()}`}>
                {item.label} <ChevronRight className="size-4 text-primary" />
              </a>
            ))}
            {resumeAvailable && <a href="/resume.pdf" onClick={close} className="mt-1 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm font-bold" data-testid="link-resume-mobile">Download resume <FileText className="size-4" /></a>}
          </div>
        )}
      </div>
    </header>
  );
}

export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-48">
      <div className="technical-grid absolute inset-x-0 top-0 -z-10 h-[620px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="section-shell">
        <div className="grid items-end gap-14 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              <span className="status-dot size-1.5 rounded-full bg-primary" /> available for thoughtful work
            </div>
            <p className="reveal reveal-delay-1 mt-7 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{portfolio.eyebrow}</p>
            <h1 className="reveal reveal-delay-2 mt-4 max-w-4xl font-display text-[clamp(3.5rem,9vw,8.4rem)] font-semibold leading-[.88] tracking-[-0.09em]">
              Software<br /><span className="text-primary">that holds</span><br />up.
            </h1>
            <p className="reveal reveal-delay-3 mt-5 font-mono text-xs uppercase tracking-[0.15em] text-primary">{portfolio.role} <span className="text-muted-foreground">· {portfolio.secondary}</span></p>
            <p className="reveal reveal-delay-3 mt-7 max-w-xl text-lg leading-8 text-muted-foreground">{portfolio.intro}</p>
            <div className="reveal reveal-delay-4 mt-9 flex flex-wrap items-center gap-3">
              <a href="#projects" className="group inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-1" data-testid="link-hero-projects">
                See selected work <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-3.5 text-sm font-bold transition-colors hover:border-primary hover:text-primary" data-testid="link-hero-contact">
                Start a conversation <ArrowUpRight className="size-4" />
              </a>
              {resumeAvailable && <a href="/resume.pdf" target="_blank" rel="noreferrer" className="font-mono text-xs text-muted-foreground underline decoration-foreground/20 underline-offset-4 hover:text-primary" data-testid="link-resume-hero">View resume</a>}
            </div>
          </div>
          <div className="reveal reveal-delay-3 relative lg:pb-4">
            <div className="float-slow relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <span>vijesh.s / operating-system</span><span className="text-primary">01:01:01</span>
              </div>
              <div className="rounded-2xl bg-[#163c41] p-5 text-[#e8f2df] md:p-7">
                <div className="mb-10 flex items-center gap-2 font-mono text-[11px] text-[#f4b64a]"><Terminal className="size-3.5" /> now shipping</div>
                <pre className="overflow-x-auto font-mono text-[11px] leading-7 md:text-xs"><code><span className="text-[#8dd3c7]">const</span> engineer = {'{'}{'\n'}  name: <span className="text-[#f4b64a]">'Vijesh S'</span>,{'\n'}  focus: [<span className="text-[#f4b64a]">'systems'</span>, <span className="text-[#f4b64a]">'interfaces'</span>,{'\n'}           <span className="text-[#f4b64a]">'applied AI'</span>],{'\n'}  bias: <span className="text-[#f4b64a]">'make it useful'</span>{'\n'}{'}'};</code></pre>
                <div className="mt-10 border-t border-[#d8f2db]/15 pt-4 font-mono text-[10px] text-[#9bbab6]">// build with intent · deploy with care</div>
              </div>
              <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full border border-secondary/40" />
            </div>
            <p className="mt-4 flex items-center justify-between px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><span>Full-stack · Cloud · AI</span><span>Scroll to explore ↓</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="01" label="About" title="The space between an idea and something people can rely on." copy={portfolio.about} /></Reveal>
        <Reveal className="mt-16">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-primary p-7 text-primary-foreground md:col-span-2 md:p-10">
              <Sparkles className="mb-16 size-6 text-secondary" />
              <p className="max-w-2xl font-display text-2xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">“The best engineering is felt in the absence of friction.”</p>
              <p className="mt-8 max-w-md text-sm leading-7 text-primary-foreground/70">I care about the quiet decisions: sensible boundaries, useful feedback, resilient delivery, and interfaces that respect attention.</p>
            </div>
            <div className="technical-grid rounded-3xl border border-foreground/10 p-7 md:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">01 — working style</p>
              <ul className="mt-10 space-y-5 text-sm font-semibold leading-6">
                <li className="flex gap-3"><CircleDot className="mt-1 size-4 shrink-0 text-secondary" />Clarity before complexity.</li>
                <li className="flex gap-3"><CircleDot className="mt-1 size-4 shrink-0 text-secondary" />Curious across the stack.</li>
                <li className="flex gap-3"><CircleDot className="mt-1 size-4 shrink-0 text-secondary" />Always close to the user.</li>
              </ul>
            </div>
          </div>
        </Reveal>
        <Reveal className="mt-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {portfolio.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-foreground/10 bg-card p-5">
                <p className="font-display text-2xl font-semibold tracking-[-0.05em] text-primary md:text-3xl">{stat.value}</p>
                <p className="mt-2 font-mono text-[10px] uppercase leading-4 tracking-[0.12em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const accentClass: Record<Project['accent'], string> = {
    amber: 'bg-secondary/85 text-foreground',
    teal: 'bg-[#c9e4d7] text-primary',
    coral: 'bg-[#f1c2ad] text-foreground',
    violet: 'bg-[#d8d0ed] text-primary',
    blue: 'bg-[#bfdce6] text-primary',
    gold: 'bg-[#ecd996] text-primary',
  };
  return (
    <article className="group relative flex min-h-[370px] flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] md:p-7" data-testid={`card-project-${project.id}`}>
      <div className={`absolute right-0 top-0 h-28 w-28 rounded-bl-[5rem] opacity-80 transition-transform duration-500 group-hover:scale-125 ${accentClass[project.accent]}`} />
      <div className="relative flex items-start justify-between gap-4">
        <span className="rounded-full border border-foreground/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{project.category}</span>
        {project.status === 'Private Repository' ? <LockKeyhole className="size-4 text-muted-foreground" /> : <Github className="size-4 text-muted-foreground" />}
      </div>
      <div className="relative mt-auto">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{project.kicker}</p>
        <h3 className="font-display text-3xl font-semibold tracking-[-0.06em]">{project.title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">{project.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{tag}</span>)}</div>
        <button onClick={() => onOpen(project)} className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary transition-all group-hover:gap-3" data-testid={`button-project-details-${project.id}`}>
          Inspect project <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory>('All');
  const [active, setActive] = useState<Project | null>(null);
  const filters: ProjectCategory[] = ['All', 'Full-Stack', 'AI / ML', 'Cloud & DevOps', 'Hackathon', 'Open Source'];
  const visible = useMemo(() => filter === 'All' ? portfolio.projects : portfolio.projects.filter((p) => p.categories?.some((category) => category === filter) ?? p.category === filter), [filter]);
  return (
    <section id="projects" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="02" label="Selected work" title="Projects with a point of view." copy="A growing body of work across product engineering, applied intelligence, and the systems that help software get out the door." /></Reveal>
        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center gap-2 border-b border-foreground/10 pb-5">
            <Search className="mr-2 size-4 text-muted-foreground" />
            {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.11em] transition-colors ${filter === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} aria-pressed={filter === item} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">{visible.length.toString().padStart(2, '0')} / {portfolio.projects.length.toString().padStart(2, '0')}</span>
          </div>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
           {visible.length ? visible.map((project, index) => <Reveal key={project.id} className={index % 2 ? 'md:mt-12' : ''}><ProjectCard project={project} onOpen={setActive} /></Reveal>) : <div className="rounded-3xl border border-dashed border-foreground/15 p-10 text-center md:col-span-2"><p className="font-display text-xl font-semibold">No projects tagged {filter} yet.</p><p className="mt-2 text-sm text-muted-foreground">This filter stays available as the portfolio grows.</p></div>}
        </div>
      </div>
      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${project.title} details`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-foreground/10 bg-card p-7 shadow-2xl md:p-10">
        <button onClick={onClose} className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-foreground/10 hover:bg-muted" aria-label="Close project details" data-testid="button-close-project"><X className="size-4" /></button>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{project.kicker}</p>
        <h3 className="mt-5 font-display text-5xl font-semibold tracking-[-0.07em]">{project.title}</h3>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{project.detail}</p>
        <div className="mt-9 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">{tag}</span>)}</div>
         {project.architecture && <div className="mt-9"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">Architecture</p><div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">{project.architecture.map((step, index) => <span key={step} className="flex items-center gap-2"><span className="rounded-full border border-foreground/10 px-3 py-2">{step}</span>{index < project.architecture!.length - 1 && <ChevronRight className="size-3 text-primary" />}</span>)}</div></div>}
         {project.contribution && <p className="mt-7 text-sm leading-7 text-muted-foreground"><strong className="text-foreground">Contribution:</strong> {project.contribution}</p>}
         {project.result && <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-primary">{project.result}</p>}
        <div className="mt-10 flex items-center gap-4 border-t border-foreground/10 pt-6">
          <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">{project.status === 'Private Repository' ? <LockKeyhole className="size-4" /> : <Github className="size-4" />} {project.status}</span>
          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground" data-testid="link-project-github">View repository <ExternalLink className="size-3.5" /></a>}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="03" label="Capabilities" title="Wide enough to connect the dots. Sharp enough to ship." /></Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {portfolio.skills.map((group, index) => {
            const icons = [Code2, Cloud, Network, Search, Sparkles, Cloud, Terminal];
            const Icon = icons[index] ?? Code2;
            return <Reveal key={group.label} className={index === 1 ? 'md:mt-10' : index === 2 ? 'md:mt-5' : ''}><div className="rounded-3xl border border-foreground/10 bg-card p-6 md:p-7"><Icon className="size-6 text-primary" /><p className="mt-16 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">0{index + 1} / {group.label}</p><ul className="mt-5 space-y-3">{group.items.map((item) => <li key={item} className="flex items-center gap-2 text-sm font-semibold"><Check className="size-4 text-secondary-foreground" />{item}</li>)}</ul></div></Reveal>;
          })}
        </div>
        <Reveal className="mt-5"><div className="rounded-3xl bg-secondary p-7 md:flex md:items-center md:justify-between md:p-9"><p className="max-w-xl font-display text-2xl font-semibold tracking-[-0.04em] md:text-3xl">I learn in public, then make the learning useful.</p><div className="mt-6 flex gap-3 md:mt-0"><a href={portfolio.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background" data-testid="link-github-skills"><Github className="size-4" /> GitHub <ArrowUpRight className="size-3" /></a><a href={portfolio.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2.5 text-xs font-bold" data-testid="link-leetcode-skills">LeetCode <ArrowUpRight className="size-3" /></a></div></div></Reveal>
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section id="journey" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="04" label="Journey" title="Still learning. Already building." copy="The throughline is simple: keep asking better questions, and turn the answer into working software." /></Reveal>
        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="rounded-3xl bg-[#163c41] p-7 text-[#e8f2df] md:p-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f4b64a]">Open source / public record</p>
              <h3 className="mt-12 font-display text-3xl font-semibold tracking-[-0.06em]">Contributing beyond personal projects.</h3>
              <div className="mt-8 space-y-4">
                {portfolio.openSource.map((item) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-[#d8f2db]/15 pb-4 text-sm"><span><span className="block font-semibold">{item.name}</span><span className="mt-1 block text-xs text-[#b8d0cb]">{item.organization} · {item.role}</span></span><ArrowUpRight className="size-4 text-[#f4b64a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-3"><a href={portfolio.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#e8f2df] px-4 py-2.5 text-xs font-bold text-[#163c41]" data-testid="link-github-journey"><Github className="size-4" /> GitHub <ArrowUpRight className="size-3" /></a><a href={portfolio.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#d8f2db]/25 px-4 py-2.5 text-xs font-bold text-[#e8f2df]" data-testid="link-leetcode-journey">View LeetCode <ArrowUpRight className="size-3" /></a></div>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-0">
              <div className="relative border-l border-foreground/15 pb-11 pl-8"><span className="absolute -left-1.5 top-0 size-3 rounded-full border-2 border-background bg-secondary" /><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">2024–2028 / education</p><h3 className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em]"><GraduationCap className="size-5 text-primary" /> {portfolio.education.degree}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{portfolio.education.school} · Current CGPA {portfolio.education.cgpa}</p></div>
              <div className="relative border-l border-foreground/15 pb-11 pl-8"><span className="absolute -left-1.5 top-0 size-3 rounded-full border-2 border-background bg-primary" /><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{portfolio.experience.period} / internship</p><h3 className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em]"><BriefcaseBusiness className="size-5 text-primary" /> {portfolio.experience.role}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{portfolio.experience.organization} · Project: {portfolio.experience.project}</p></div>
              <div className="relative border-l border-foreground/15 pl-8"><span className="absolute -left-1.5 top-0 size-3 rounded-full border-2 border-background bg-accent" /><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Hackathons / achievements</p><h3 className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold tracking-[-0.04em]"><BookOpen className="size-5 text-primary" /> Vihansa 2026 — 2nd Prize</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">EcoSort-Vision · {portfolio.hackathons.length} events and project milestones across the journey.</p><div className="mt-5 flex flex-wrap gap-2">{portfolio.hackathons.map((event) => <span key={event} className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{event}</span>)}</div></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="04" label="Achievements" title="Progress you can inspect." copy="Not a wall of badges. A few signals of how I choose problems, follow through, and keep growing." /></Reveal>
        <div className="mt-14 overflow-hidden rounded-3xl border border-foreground/10 bg-card">
          {portfolio.achievements.map((achievement, index) => (
            <Reveal key={achievement}>
              <div className="grid gap-5 border-b border-foreground/10 p-6 last:border-b-0 md:grid-cols-[90px_1fr_40px] md:items-center md:p-8">
                <p className="font-mono text-xs text-primary">0{index + 1}</p>
                <p className="max-w-2xl font-display text-xl font-medium leading-snug tracking-[-0.03em] md:text-2xl">{achievement}</p>
                <Medal className="size-5 text-secondary" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes('@') || form.message.trim().length < 12) {
      setState('error');
      setError('Please add your name, a valid email, and a little more context (12 characters minimum).');
      return;
    }
    setState('success');
    setError('');
  };
  return (
    <section id="contact" className="border-t border-foreground/10 py-24 md:py-32">
      <div className="section-shell">
        <Reveal><SectionHeading index="05" label="Contact" title="Have a good problem? Let’s look at it." copy="For roles, collaborations, or a thoughtful exchange about building things, send a note. I read every message." /></Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <Reveal>
            <div className="space-y-5">
              <a href={`mailto:${portfolio.email}`} className="group flex items-center gap-4 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-primary" data-testid="link-contact-email"><span className="grid size-10 place-items-center rounded-full bg-muted"><Mail className="size-4 text-primary" /></span><span><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Email</span><span className="mt-1 block text-sm font-semibold">{portfolio.email}</span></span><ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
              <a href={`tel:${portfolio.phone.replaceAll(' ', '')}`} className="group flex items-center gap-4 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-primary" data-testid="link-contact-phone"><span className="grid size-10 place-items-center rounded-full bg-muted"><Phone className="size-4 text-primary" /></span><span><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Phone</span><span className="mt-1 block text-sm font-semibold">{portfolio.phone}</span></span><ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
              <div className="flex gap-3 pt-4"><a href={portfolio.github} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-foreground/10 transition-colors hover:border-primary hover:text-primary" aria-label="GitHub" data-testid="link-contact-github"><Github className="size-4" /></a><a href={portfolio.linkedin} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-foreground/10 transition-colors hover:border-primary hover:text-primary" aria-label="LinkedIn" data-testid="link-contact-linkedin"><Linkedin className="size-4" /></a><a href={portfolio.leetcode} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-foreground/10 transition-colors hover:border-primary hover:text-primary" aria-label="LeetCode" data-testid="link-contact-leetcode"><Code2 className="size-4" /></a></div>
            </div>
          </Reveal>
          <Reveal>
            {state === 'success' ? (
              <div className="grid min-h-[330px] place-items-center rounded-3xl bg-primary p-8 text-center text-primary-foreground"><div><div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-foreground"><Check className="size-6" /></div><h3 className="mt-6 font-display text-3xl font-semibold tracking-[-0.05em]">Message received.</h3><p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-primary-foreground/70">Thanks for reaching out. I’ll get back to you soon.</p><button onClick={() => { setState('idle'); setForm({ name: '', email: '', message: '' }); }} className="mt-7 text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4" data-testid="button-send-another">Send another</button></div></div>
            ) : (
              <form onSubmit={submit} className="rounded-3xl border border-foreground/10 bg-card p-6 md:p-8" noValidate>
                <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full border-b border-foreground/15 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" placeholder="Your name" data-testid="input-contact-name" /></label><label className="block"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full border-b border-foreground/15 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" placeholder="you@company.com" data-testid="input-contact-email" /></label></div>
                <label className="mt-8 block"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Message</span><textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full resize-none border-b border-foreground/15 bg-transparent py-3 text-sm leading-7 outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary" placeholder="What are you working on?" data-testid="input-contact-message" /></label>
                {state === 'error' && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-xs leading-5 text-destructive" role="alert" data-testid="status-contact-error">{error}</p>}
                <button type="submit" className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-contact-submit">Send message <Send className="size-4" /></button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer({ resumeAvailable }: { resumeAvailable: boolean }) {
  return (
    <footer className="border-t border-foreground/10 py-8">
      <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <p className="font-display text-lg font-semibold tracking-[-0.04em]">Vijesh S<span className="text-primary">.</span></p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Built with curiosity · {portfolio.location}</p>
        <div className="flex items-center gap-4 text-xs font-semibold"><a href="#top" className="transition-colors hover:text-primary" data-testid="link-back-top">Back to top ↑</a>{resumeAvailable && <a href="/resume.pdf" target="_blank" rel="noreferrer" className="transition-colors hover:text-primary" data-testid="link-resume-footer">Resume</a>}</div>
      </div>
    </footer>
  );
}