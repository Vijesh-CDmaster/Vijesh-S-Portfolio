import { useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { durations, easings } from '@/motion/tokens';
import { navItems, portfolio } from '@/data/portfolio';
import { MagneticButton } from '@/components/animations/MagneticButton';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: easings.out } },
};

const socials = [
  { label: 'GitHub', href: portfolio.github },
  { label: 'LinkedIn', href: portfolio.linkedin },
  { label: 'LeetCode', href: portfolio.leetcode },
];

const chapters = navItems.filter((nav) => nav.href !== '#top');

/**
 * The welcome page — the site's opening screen, styled like the landing page
 * of a professional portfolio: brand header, "Welcome to my portfolio"
 * headline, short introduction, primary CTA, social links, an at-a-glance
 * stats card, and a section index previewing what's inside. Enter (or the
 * Continue button) opens the portfolio itself.
 */
export default function BlackHoleIntro({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotion();

  // Enter anywhere on the welcome screen opens the portfolio.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') onEnter();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto grain"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.slow, ease: easings.standard }}
      aria-label="Welcome page"
    >
      {/* Background layers identical to the portfolio hero. */}
      <div className="technical-grid absolute inset-x-0 top-0 -z-10 h-[680px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(ellipse_at_top,rgba(110,231,183,0.10),transparent_60%)]" />

      <div className="relative flex min-h-full flex-col">
        {/* Brand header */}
        <motion.header
          className="section-shell flex items-center justify-between gap-4 pt-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.base, ease: easings.out }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
              V
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Vijesh S<span className="text-primary">.</span>
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary sm:inline-flex">
            <span aria-hidden="true" className="status-dot size-1.5 rounded-full bg-primary" />
            Available for thoughtful work
          </span>
        </motion.header>

        {/* Main welcome composition */}
        <main className="section-shell flex flex-1 items-center py-12 md:py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
            <motion.div variants={container} initial="hidden" animate="visible">
              <motion.p
                variants={item}
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary"
              >
                <span aria-hidden="true" className="status-dot size-1.5 rounded-full bg-primary" />
                Welcome
              </motion.p>

              <motion.h1
                variants={item}
                className="mt-7 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-foreground text-balance"
              >
                Welcome to my{' '}
                <span className="text-primary">portfolio.</span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-5 font-display text-[clamp(1.25rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-foreground/85"
              >
                I&apos;m {portfolio.name} — Software Engineer{' '}
                <span className="text-primary">&amp;</span> Full-Stack Developer
              </motion.p>

              <motion.p
                variants={item}
                className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Cloud &amp; DevOps <span className="text-secondary">|</span> Applied AI{' '}
                <span className="text-secondary">|</span> Solving Real Problems
              </motion.p>

              <motion.p variants={item} className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                {portfolio.intro} Take a look around — the work, the story behind it, and
                where we might build together.
              </motion.p>

              <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
                <MagneticButton
                  onClick={onEnter}
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-[0_16px_40px_rgba(110,231,183,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-testid="button-continue-portfolio"
                >
                  Enter Portfolio <span aria-hidden="true">→</span>
                </MagneticButton>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline-offset-8 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      data-testid={`link-welcome-${social.label.toLowerCase()}`}
                    >
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.dl
                variants={item}
                className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-foreground/10 pt-6 sm:grid-cols-4"
              >
                {portfolio.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {stat.value}
                    </dd>
                    <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* At-a-glance card: what's inside the portfolio */}
            <motion.aside
              className="rounded-3xl border border-foreground/12 bg-background/70 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-8"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0.3 : 0.7, duration: 0.85, ease: easings.out }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Inside this portfolio
              </p>
              <ul className="mt-5 space-y-1">
                {chapters.map((chapter, index) => (
                  <li key={chapter.href}>
                    <button
                      type="button"
                      onClick={onEnter}
                      className="group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      data-testid={`button-welcome-chapter-${chapter.label.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {chapter.label}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-xs text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="hairline my-5" />

              <div className="space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <p className="flex items-center justify-between gap-3">
                  <span>Based in</span>
                  <span className="text-foreground">{portfolio.location}</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span>Focus</span>
                  <span className="text-foreground">Full-stack · Cloud · AI</span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span>Open to</span>
                  <span className="text-primary">Internships &amp; collabs</span>
                </p>
              </div>
            </motion.aside>
          </div>
        </main>

        {/* Footer meta */}
        <motion.footer
          className="section-shell flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 py-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0.6 : 1.4, duration: durations.base }}
        >
          <span>
            {portfolio.email} <span className="text-secondary">|</span> {portfolio.location}
          </span>
          <span className="hidden sm:inline">Press Enter to enter the portfolio</span>
          <span>© 2026 {portfolio.name}</span>
        </motion.footer>
      </div>

      {/* Accessibility fallback for keyboard users */}
      <button type="button" onClick={onEnter} className="sr-only">
        Skip to portfolio
      </button>
    </motion.div>
  );
}
