import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useMemo, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';

const floatingNodes = ['SYSTEMS', 'APIs', 'CLOUD', 'DATA'];

/**
 * Cinematic photo frame: radial glow, technical grid, orbital rings, floating
 * system nodes, a drifting particle layer, parallax depth and a mouse-following
 * light. If the real photo is missing, a clearly marked placeholder is shown
 * instead — never a generated person.
 */
export default function ProfileFrame() {
  const reduced = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.8 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.8 });

  const rotateY = useTransform(smoothX, [-1, 1], reduced ? [0, 0] : [-7, 7]);
  const rotateX = useTransform(smoothY, [-1, 1], reduced ? [0, 0] : [5, -5]);
  const photoX = useTransform(smoothX, [-1, 1], reduced ? [0, 0] : [-10, 10]);
  const photoY = useTransform(smoothY, [-1, 1], reduced ? [0, 0] : [-8, 8]);
  const glowX = useTransform(smoothX, [-1, 1], ['18%', '82%']);
  const glowY = useTransform(smoothY, [-1, 1], ['20%', '80%']);

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        delay: (index % 7) * 0.6,
        size: index % 3 === 0 ? 3 : 2,
      })),
    [],
  );

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-md [perspective:1200px]"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.9, ease: easings.out }}
      onPointerMove={handlePointer}
      onPointerLeave={handlePointerLeave}
      data-testid="frame-profile"
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-foreground/12 bg-surface-raised shadow-[0_40px_90px_rgba(0,0,0,0.55)]"
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={reduced ? undefined : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      >
        {/* Radial glow behind everything */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(110,231,183,0.14),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(244,182,74,0.12),transparent_50%)]" />
        {/* Technical grid */}
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-60" />
        {/* Mouse-following light */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_45%)]"
            style={{ left: glowX, top: glowY, translateX: '-50%', translateY: '-50%', position: 'absolute', width: '140%', height: '140%' }}
          />
        )}

        {/* Orbital rings */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 size-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-secondary/25"
          animate={reduced ? undefined : { rotate: -360 }}
          transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-secondary" />
        </motion.div>

        {/* Floating system nodes */}
        {floatingNodes.map((node, index) => (
          <motion.span
            key={node}
            className="absolute z-10 rounded-full border border-foreground/15 bg-background/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/75 backdrop-blur-sm"
            style={{
              left: index % 2 === 0 ? '6%' : 'auto',
              right: index % 2 === 0 ? 'auto' : '6%',
              top: `${18 + index * 20}%`,
            }}
            animate={reduced ? undefined : { y: [0, -7, 0] }}
            transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
          >
            {node}
          </motion.span>
        ))}

        {/* Particle field */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full bg-secondary/70"
              style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
              animate={reduced ? undefined : { opacity: [0.15, 0.9, 0.15], scale: [1, 1.6, 1] }}
              transition={{ duration: 3.4, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Photo */}
        <motion.div className="absolute inset-6 overflow-hidden rounded-2xl border border-foreground/10 bg-[#0b1016]" style={reduced ? undefined : { x: photoX, y: photoY }}>
          {!imageFailed ? (
            <img
              src={portfolio.profileImage}
              alt="Vijesh S — professional portrait"
              className="h-full w-full object-cover"
              loading="eager"
              onError={() => setImageFailed(true)}
              data-testid="img-profile"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#0e1520_0%,#131c2a_100%)] p-6 text-center" data-testid="img-profile-fallback">
              <span className="grid size-20 place-items-center rounded-full border border-primary/40 bg-primary/10 font-display text-3xl font-bold text-primary">
                VS
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Portrait pending</p>
              <p className="max-w-[16rem] font-mono text-[9px] leading-4 text-muted-foreground/70">
                Add your photo at public/images/vijesh-profile.png to replace this frame.
              </p>
            </div>
          )}
        </motion.div>

        {/* Frame caption */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 to-transparent px-5 pb-4 pt-10">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">vijesh.s / identity</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-secondary">
            <span className="status-dot size-1.5 rounded-full bg-secondary" /> online
          </span>
        </div>
      </motion.div>

      {/* Depth caption under the frame */}
      <motion.p
        className="mt-4 flex items-center justify-between px-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: durations.slow }}
      >
        <span>Full-stack · Cloud · AI</span>
        <span className="text-primary">est. 2024</span>
      </motion.p>
    </motion.div>
  );
}
