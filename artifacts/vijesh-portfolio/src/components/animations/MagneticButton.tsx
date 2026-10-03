import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion';
import { useCallback, useRef, type ReactNode } from 'react';

import { springOptions } from '@/motion/tokens';

type MagneticButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode;
  /** How strongly the element follows the cursor (0 = still, 1 = full pull). */
  strength?: number;
  className?: string;
};

/**
 * Cursor-attracted button. The element leans toward the pointer while hovered
 * and springs back to rest on leave — transform-only, GPU friendly.
 * Disabled entirely under prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  strength = 0.3,
  className,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions.snappy);
  const springY = useSpring(y, springOptions.snappy);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onMouseMove?.(event);
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [onMouseMove, reduced, strength, x, y],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onMouseLeave?.(event);
      x.set(0);
      y.set(0);
    },
    [onMouseLeave, x, y],
  );

  return (
    <motion.button
      ref={ref}
      className={className}
      style={reduced ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
