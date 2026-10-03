import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Refined desktop cursor: a precise dot plus a lagging ring that expands over
 * interactive elements. Hidden on touch devices and for reduced-motion users;
 * the native cursor is only hidden while this component is active.
 */
export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(pointer: coarse)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add('cursor-none-active');

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest('a, button, [role="button"], input, textarea, [data-cursor="active"]'));
    };

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setActive(isInteractive(event.target));
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('cursor-none-active');
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block" aria-hidden="true">
      {/* Precise dot */}
      <motion.div
        className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ x, y }}
      />
      {/* Lagging ring */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: active ? 56 : 34,
          height: active ? 56 : 34,
          opacity: active ? 0.9 : 0.5,
          backgroundColor: active ? 'rgba(110, 231, 183, 0.08)' : 'rgba(110, 231, 183, 0)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
