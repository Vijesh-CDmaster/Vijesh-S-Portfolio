import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { durations, easings } from '@/motion/tokens';
import { revealTargets, type RevealName } from '@/motion/variants';

type FadeInProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  /** Which reveal target to animate from. Defaults to a plain fade. */
  from?: RevealName;
  delay?: number;
  duration?: number;
};

/**
 * Enters once on mount with a transform/opacity animation.
 * For scroll-triggered entrances use `SectionReveal` instead.
 */
export function FadeIn({
  children,
  from = 'fade',
  delay = 0,
  duration = durations.slow,
  ...props
}: FadeInProps) {
  const { hidden, visible } = revealTargets[from];
  return (
    <motion.div
      initial={hidden}
      animate={visible}
      transition={{ duration, delay, ease: easings.out }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
