import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { durations, easings, stagger } from '@/motion/tokens';
import { revealTargets, type RevealName } from '@/motion/variants';

type SectionRevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  /** Which reveal target to animate from. Defaults to slide-up. */
  from?: RevealName;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before triggering. */
  amount?: number;
};

/**
 * Scroll-triggered reveal (replacement for hand-rolled IntersectionObserver).
 * Fires once; subsequent scrolls do not replay the animation.
 * Motion stops entirely when the user prefers reduced motion.
 */
export function SectionReveal({
  children,
  from = 'up',
  delay = 0,
  duration = durations.slow,
  amount = 0.2,
  ...props
}: SectionRevealProps) {
  const { hidden, visible } = revealTargets[from];
  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: easings.out }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerContainerProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  /** Seconds between each child's entrance. */
  step?: number;
  delay?: number;
};

/**
 * Cascades its children: each child needs `variants={slideUp}`-style variants
 * and no explicit initial/animate of its own.
 */
export function StaggerContainer({
  children,
  step = stagger.default,
  delay = stagger.delayChildren,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        staggerChildren: step,
        delayChildren: delay,
        ease: easings.out,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Child of a `StaggerContainer`. Also works standalone as a `FadeIn`. */
export function StaggerItem({
  children,
  from = 'up',
  duration = durations.slow,
  ...props
}: {
  children: ReactNode;
  from?: RevealName;
  duration?: number;
} & HTMLMotionProps<'div'>) {
  const { hidden, visible } = revealTargets[from];
  return (
    <motion.div
      variants={{ hidden, visible }}
      transition={{ duration, ease: easings.out }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
