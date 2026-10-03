import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { pageTransition } from '@/motion/variants';

type PageTransitionProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  /** Stable key when swapping routes inside AnimatePresence. */
  transitionKey?: string;
};

/**
 * Wrap a view in `<AnimatePresence mode="wait">` to cross-fade routes:
 *
 *   <AnimatePresence mode="wait">
 *     <PageTransition transitionKey={location}>{page}</PageTransition>
 *   </AnimatePresence>
 *
 * Exit animations only run while wrapped in AnimatePresence.
 */
export function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" {...props}>
      {children}
    </motion.div>
  );
}
