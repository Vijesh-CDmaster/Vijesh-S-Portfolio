import { motion, type Variants } from 'framer-motion';

import { easings } from '@/motion/tokens';
import { scrollToId } from '@/lib/scroll';
import { portfolio } from '@/data/portfolio';
import { MagneticButton } from '@/components/animations/MagneticButton';
import ProfileFrame from '@/components/ProfileFrame';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 44, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: easings.out } },
};

type Props = { resumeAvailable: boolean };

/**
 * Act 2 — identity. Split composition: choreographed typography on the left,
 * cinematic photo frame on the right. Sequence: nav (handled globally) →
 * photo → headline lines → supporting text → CTAs.
 */
export default function HeroSection({ resumeAvailable }: Props) {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
      {/* Background layers */}
      <div className="technical-grid absolute inset-x-0 top-0 -z-10 h-[680px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(ellipse_at_top,rgba(110,231,183,0.10),transparent_60%)]" />

      <div className="section-shell">
        <div className="grid items-center gap-16 lg:grid-cols-[1.06fr_.94fr]">
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.div
              variants={line}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary"
            >
              <span className="status-dot size-1.5 rounded-full bg-primary" /> available for thoughtful work
            </motion.div>

            <motion.h1 className="mt-8 font-display font-semibold leading-[0.9] tracking-[-0.06em]">
              <span className="block overflow-hidden">
                <motion.span className="block text-[clamp(3.2rem,9vw,7.5rem)]" variants={line}>
                  Vijesh S
                </motion.span>
              </span>
              <span className="mt-3 block overflow-hidden">
                <motion.span className="block text-[clamp(1.5rem,3.6vw,3rem)] text-primary" variants={line}>
                  Software Engineer
                </motion.span>
              </span>
              <span className="mt-1 block overflow-hidden">
                <motion.span className="block text-[clamp(1.5rem,3.6vw,3rem)]" variants={line}>
                  &amp; Full-Stack Developer
                </motion.span>
              </span>
            </motion.h1>

            <motion.p variants={line} className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Cloud &amp; DevOps <span className="text-secondary">|</span> Applied AI{' '}
              <span className="text-secondary">|</span> Solving Real Problems
            </motion.p>

            <motion.p variants={line} className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {portfolio.intro}
            </motion.p>

            <motion.div variants={line} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton
                onClick={() => scrollToId('projects')}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-[0_16px_40px_rgba(110,231,183,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                data-testid="button-hero-work"
              >
                View My Work <span aria-hidden="true">↓</span>
              </MagneticButton>

              {resumeAvailable && (
                <MagneticButton
                  onClick={() => window.open('/resume.pdf', '_blank', 'noopener')}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-4 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  data-testid="button-hero-resume"
                >
                  Download Resume <span aria-hidden="true">↗</span>
                </MagneticButton>
              )}
            </motion.div>

            <motion.p variants={line} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{portfolio.eyebrow}</span>
              <span className="text-primary/70">{portfolio.location}</span>
            </motion.p>
          </motion.div>

          <ProfileFrame />
        </div>
      </div>
    </section>
  );
}
