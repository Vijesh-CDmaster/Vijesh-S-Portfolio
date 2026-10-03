import type { TargetAndTransition, Variants } from 'framer-motion';

import { pageTransitions, stagger } from './tokens';

/**
 * Reusable variants.
 *
 * All motion values are transform/opacity only so animations stay on the GPU.
 * Timing lives in the components (from `tokens`) or directly on the variant
 * when the variant owns its transition (e.g. `pageTransition`).
 */

/** Raw from/to targets, keyed by reveal direction. */
export const revealTargets = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  up: { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1 } },
} satisfies Record<string, { hidden: TargetAndTransition; visible: TargetAndTransition }>;

export type RevealName = keyof typeof revealTargets;

export const fadeIn: Variants = { ...revealTargets.fade };
export const slideUp: Variants = { ...revealTargets.up };
export const slideLeft: Variants = { ...revealTargets.left };
export const slideRight: Variants = { ...revealTargets.right };
export const scaleIn: Variants = { ...revealTargets.scale };

/**
 * Container variant: give it to a parent to cascade its children.
 * Pair each child with `variants` and no explicit initial/animate.
 *
 *   <motion.div variants={staggerChildren()} initial="hidden" whileInView="visible">
 *     <motion.div variants={slideUp} />
 *   </motion.div>
 */
export const staggerChildren = (step: number = stagger.default): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: step,
      delayChildren: stagger.delayChildren,
    },
  },
});

/**
 * View-level transition. Carries its own enter/exit timing — intended for use
 * inside `<AnimatePresence>`:
 *
 *   <AnimatePresence mode="wait">
 *     <PageTransition key={route}>...</PageTransition>
 *   </AnimatePresence>
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: pageTransitions.enter },
  exit: { opacity: 0, transition: pageTransitions.exit },
};
