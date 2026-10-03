import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import BlackHoleScene from '@/components/three/BlackHoleScene';

type Phase = 'intro' | 'warp' | 'welcome';

const welcomeLines = [
  { text: 'WELCOME', className: 'font-mono text-xs uppercase tracking-[0.5em] text-secondary', delay: 0.1 },
  { text: 'VIJESH S', className: 'font-display text-6xl font-semibold tracking-[-0.06em] md:text-8xl', delay: 0.45 },
  { text: 'SOFTWARE ENGINEER & FULL-STACK DEVELOPER', className: 'font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/80 md:text-sm', delay: 0.9 },
  { text: 'CLOUD & DEVOPS | SOLVING REAL PROBLEMS', className: 'font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-xs', delay: 1.25 },
];

/**
 * Act 1 — the entry portal: star field, black hole, cursor gravity, then a
 * cinematic dive through the singularity into the WELCOME sequence.
 */
export default function BlackHoleIntro({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('intro');
  const warpRef = useRef(0);
  const boostRef = useRef(1);
  const uiRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!reduced) return;
    // Reduced motion: keep content, skip the cinematic dive choreography.
    warpRef.current = 0.25;
    boostRef.current = 1;
  }, [reduced]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const beginWarp = useCallback(() => {
    if (phase !== 'intro') return;

    if (reduced) {
      setPhase('welcome');
      return;
    }

    setPhase('warp');
    const tl = gsap.timeline({ onComplete: () => setPhase('welcome') });
    timelineRef.current = tl;

    tl.to(warpRef, { current: 1, duration: 1.7, ease: 'power3.in' }, 0)
      .to(boostRef, { current: 3.5, duration: 1.4, ease: 'power2.in' }, 0)
      .to(uiRef.current, { scale: 5, opacity: 0, duration: 1.25, ease: 'power3.in' }, 0.1)
      .to(blackoutRef.current, { opacity: 1, duration: 0.55, ease: 'power2.in' }, 1.15);
  }, [phase, reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: durations.slow, ease: easings.standard }}
      aria-label="Entry experience"
    >
      <BlackHoleScene warpRef={warpRef} boostRef={boostRef} />

      {/* Vignette keeps type legible over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
      <div ref={blackoutRef} className="pointer-events-none absolute inset-0 bg-black opacity-0" />

      <AnimatePresence mode="wait">
        {phase !== 'welcome' ? (
          <motion.div
            key="intro-ui"
            ref={uiRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.2, ease: easings.out } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.p
              className="font-mono text-[10px] uppercase tracking-[0.45em] text-secondary md:text-xs"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: easings.out }}
            >
              Software Engineer
            </motion.p>
            <motion.h1
              className="mt-5 font-display text-[clamp(3rem,12vw,9rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white"
              initial={{ opacity: 0, y: 34, letterSpacing: '0.08em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '-0.06em' }}
              transition={{ delay: 0.55, duration: 1, ease: easings.out }}
            >
              VIJESH S
            </motion.h1>
            <motion.p
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.35em] text-white/70 md:text-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: easings.out }}
            >
              Full-Stack <span className="text-secondary">•</span> AI <span className="text-secondary">•</span> Cloud{' '}
              <span className="text-secondary">•</span> DevOps
            </motion.p>
            <motion.button
              type="button"
              onClick={beginWarp}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: easings.out }}
              whileHover={reduced ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative mt-12 overflow-hidden rounded-full border border-secondary/50 bg-secondary/10 px-9 py-4 font-mono text-xs uppercase tracking-[0.3em] text-secondary backdrop-blur-sm transition-colors hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              data-testid="button-enter-portfolio"
            >
              <span className="relative z-10">Enter Portfolio</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-secondary/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
            <motion.p
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              cursor bends the field
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: durations.base, ease: easings.standard } }}
          >
            <div className="flex flex-col items-center gap-6 md:gap-8">
              {welcomeLines.map((line) => (
                <motion.p
                  key={line.text}
                  className={`${line.className} text-balance`}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: reduced ? line.delay * 0.4 : line.delay, duration: 0.8, ease: easings.out }}
                >
                  {line.text}
                </motion.p>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={onEnter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0.8 : 1.7, duration: 0.6 }}
              whileHover={reduced ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-14 rounded-full border border-foreground/25 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-foreground/85 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              data-testid="button-continue-portfolio"
            >
              Continue →
            </motion.button>
            <motion.button
              type="button"
              onClick={onEnter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 1 : 2.4, duration: 0.6 }}
              className="sr-only"
            >
              Skip to portfolio
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
