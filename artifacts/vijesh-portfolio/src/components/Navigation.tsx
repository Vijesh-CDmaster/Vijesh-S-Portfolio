import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { navItems } from '@/data/portfolio';

type Props = { resumeAvailable: boolean };

const SECTION_IDS = navItems.map((item) => item.href.replace('#', ''));

/**
 * Floating navigation: transparent over the hero, glass on scroll, animated
 * active-section indicator (shared layoutId), scroll progress bar, and a
 * staggered mobile menu.
 */
export default function Navigation({ resumeAvailable }: Props) {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 40));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, boolean>();

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          visibility.set(id, entry.isIntersecting);
          const firstVisible = SECTION_IDS.find((sectionId) => visibility.get(sectionId));
          if (firstVisible) setActive(firstVisible);
        },
        { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
      );
      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell mt-4">
        <motion.div
          className={`flex items-center justify-between rounded-full border px-4 py-3 backdrop-blur-xl transition-colors duration-300 md:px-5 ${
            scrolled
              ? 'border-foreground/12 bg-background/80 shadow-[0_18px_40px_rgba(0,0,0,0.35)]'
              : 'border-transparent bg-transparent'
          }`}
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: durations.base, ease: easings.out }}
        >
          <a href="#top" onClick={close} className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
              V
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Vijesh S<span className="text-primary">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const id = item.href.replace('#', '');
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`relative rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-primary/35 bg-primary/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {resumeAvailable && (
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/90 sm:flex"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                data-testid="link-resume-header"
              >
                View Resume
              </motion.a>
            )}
            <button
              className="grid size-9 place-items-center rounded-full border border-foreground/15 text-foreground lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              data-testid="button-mobile-menu"
            >
              <motion.span
                className="relative block h-0.5 w-4 bg-current"
                animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                transition={{ duration: durations.fast }}
              />
              <motion.span
                className="relative -mt-0.5 block h-0.5 w-4 bg-current"
                animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                transition={{ duration: durations.fast }}
              />
            </button>
          </div>

          {/* Scroll progress */}
          <motion.span
            className="absolute inset-x-4 -bottom-px h-px origin-left bg-gradient-to-r from-primary via-secondary to-primary/30 md:inset-x-6"
            style={{ scaleX: scrollYProgress }}
            aria-hidden="true"
          />
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.nav
              key="mobile-menu"
              className="mt-2 overflow-hidden rounded-3xl border border-foreground/12 bg-background/95 p-3 backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0, height: 0, y: -12 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -12 }}
              transition={{ duration: durations.base, ease: easings.out }}
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index, duration: durations.base, ease: easings.out }}
                  >
                    <a
                      href={item.href}
                      onClick={close}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-foreground/5 ${
                        active === item.href.replace('#', '') ? 'text-primary' : 'text-foreground'
                      }`}
                      data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      {item.label}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </a>
                  </motion.li>
                ))}
                {resumeAvailable && (
                  <motion.li
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * navItems.length, duration: durations.base }}
                  >
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      onClick={close}
                      className="mt-1 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground"
                      data-testid="link-resume-mobile"
                    >
                      View / download resume
                    </a>
                  </motion.li>
                )}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
