import type { Transition } from 'framer-motion';

/**
 * Central motion tokens.
 *
 * Every timing/easing/spring used anywhere in the app should come from this
 * file so the whole site keeps one consistent motion language. Do not
 * hard-code durations or cubic-beziers inside components.
 */

/** Time budgets, in seconds. */
export const durations = {
  /** Instant feedback: press states, tiny state flips. */
  instant: 0.12,
  /** Hover feedback, color/scale micro-interactions. */
  fast: 0.2,
  /** Default UI transition length. */
  base: 0.35,
  /** Section reveals, card entrances — the house duration. */
  slow: 0.55,
  /** Intentional, cinematic moments (hero, page transitions). */
  deliberate: 0.8,
} as const;

/**
 * Cubic-bezier easings. `standard` mirrors the CSS easing already used by the
 * site's `.reveal` keyframes so CSS and Framer Motion feel identical.
 */
export const easings = {
  standard: [0.2, 0.7, 0.2, 1],
  /** Expo-out: fast start, luxurious settle. Premium entrances. */
  out: [0.16, 1, 0.3, 1],
  inOut: [0.45, 0, 0.55, 1],
  in: [0.7, 0, 0.84, 0],
} satisfies Record<string, [number, number, number, number]>;

/** Raw spring parameters — reuse with `useSpring` for motion values. */
export const springOptions = {
  /** Soft, high-end drift. */
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  /** Default interaction feel: quick, no bounce overshoot. */
  snappy: { stiffness: 260, damping: 24, mass: 1 },
  /** Playful overshoot — use sparingly. */
  lively: { stiffness: 340, damping: 17, mass: 1 },
} as const;

/** Ready-to-use spring transitions for `transition` props. */
export const springs = {
  gentle: { type: 'spring', ...springOptions.gentle },
  snappy: { type: 'spring', ...springOptions.snappy },
  lively: { type: 'spring', ...springOptions.lively },
} satisfies Record<string, Transition>;

/** Stagger timings for cascading children (grids, lists, word runs). */
export const stagger = {
  quick: 0.05,
  default: 0.08,
  slow: 0.14,
  /** Pause before the first child starts moving. */
  delayChildren: 0.08,
} as const;

/** Shared hover-intent transitions. */
export const hoverTransitions = {
  subtle: { duration: durations.fast, ease: easings.standard },
  deliberate: { duration: durations.base, ease: easings.out },
} satisfies Record<string, Transition>;

/** Route / view transitions (use with AnimatePresence). */
export const pageTransitions = {
  enter: { duration: durations.slow, ease: easings.out },
  exit: { duration: durations.fast, ease: easings.in },
} satisfies Record<string, Transition>;
