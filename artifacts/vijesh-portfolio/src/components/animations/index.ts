/**
 * Reusable motion building blocks.
 *
 * Rules of use:
 * - Framer Motion owns UI transitions (reveals, hovers, modals, pages).
 * - Three.js / React Three Fiber owns real 3D scenes.
 * - GSAP only for long cinematic timelines that genuinely need sequencing.
 * - Never animate width/height/top/left/margin here — transform + opacity only.
 * - All timings come from `@/motion/tokens`; all variant shapes from
 *   `@/motion/variants`. Reduced motion is respected automatically.
 */
export { FadeIn } from './FadeIn';
export { SectionReveal, StaggerContainer, StaggerItem } from './SectionReveal';
export { PageTransition } from './PageTransition';
export { MagneticButton } from './MagneticButton';
export { TiltCard } from './TiltCard';
