import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion';
import { useCallback, useRef, type ReactNode } from 'react';

import { springOptions } from '@/motion/tokens';

type TiltCardProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
  /** Max tilt in degrees at the card edge. */
  maxTilt?: number;
  className?: string;
};

/**
 * 3D perspective tilt that tracks the cursor across a card.
 * Transform-only (rotateX/rotateY), so it stays cheap; disabled under
 * prefers-reduced-motion.
 */
export function TiltCard({ children, maxTilt = 6, className, onMouseMove, onMouseLeave, ...props }: TiltCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, springOptions.gentle);
  const springY = useSpring(rotateY, springOptions.gentle);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(event);
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(px * maxTilt * 2);
      rotateX.set(-py * maxTilt * 2);
    },
    [onMouseMove, maxTilt, reduced, rotateX, rotateY],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(event);
      rotateX.set(0);
      rotateY.set(0);
    },
    [onMouseLeave, rotateX, rotateY],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
