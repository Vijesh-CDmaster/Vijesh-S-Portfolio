import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

type Props = { sent: boolean };

type Node = { x: number; y: number; vx: number; vy: number };

/**
 * Lightweight 2D-canvas communication network: nodes drift, lines appear near
 * the cursor, and on successful submission a bright packet travels to the
 * center node. Falls back to a static frame under reduced motion.
 */
export default function ContactNetwork({ sent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sentRef = useRef(sent);
  const reduced = useReducedMotion();

  useEffect(() => {
    sentRef.current = sent;
  }, [sent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;
    let packet = 0;
    const mouse = { x: -999, y: -999 };
    const wasSent = { value: false };

    const nodeCount = window.innerWidth < 768 ? 14 : 26;
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, index) => {
      const angle = (index / nodeCount) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 0.4 + 0.5,
        y: Math.sin(angle) * 0.4 + 0.5,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
      };
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      if (sentRef.current && !wasSent.value) {
        wasSent.value = true;
        packet = 0;
      }

      const points = nodes.map((node) => ({ x: node.x * width, y: node.y * height }));

      // Mesh lines
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 130) {
            // Dark teal strings: the original mint green was invisible on the
            // light panel, so the mesh lines use a deep ink teal instead.
            context.strokeStyle = `rgba(16, 94, 84, ${0.5 * (1 - distance / 130)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[j].x, points[j].y);
            context.stroke();
          }
        }
      }

      // Cursor proximity lines
      if (mouse.x > -100) {
        points.forEach((point) => {
          const distance = Math.hypot(point.x - mouse.x, point.y - mouse.y);
          if (distance < 160) {
            // Dark amber strings so cursor lines read clearly on light bg.
            context.strokeStyle = `rgba(154, 90, 8, ${0.65 * (1 - distance / 160)})`;
            context.lineWidth = 1.15;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
          }
        });
      }

      // Nodes
      const center = { x: width / 2, y: height / 2 };
      points.forEach((point, index) => {
        const isCenter = index === 0;
        context.fillStyle = isCenter ? 'rgba(244, 182, 74, 0.95)' : 'rgba(110, 231, 183, 0.8)';
        context.beginPath();
        context.arc(point.x, point.y, isCenter ? 4.5 : 2.5, 0, Math.PI * 2);
        context.fill();
      });

      // Success packet: travels from the edge node to the center, then rings out
      if (packet > 0 && packet < 1) {
        packet = Math.min(1, packet + 0.012);
        const from = points[1] ?? { x: 0, y: 0 };
        const px = from.x + (center.x - from.x) * packet;
        const py = from.y + (center.y - from.y) * packet;
        context.fillStyle = '#f4b64a';
        context.shadowColor = 'rgba(244,182,74,0.9)';
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(px, py, 4, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      } else if (packet >= 1 && packet < 1.6) {
        packet += 0.012;
        const radius = 8 + (packet - 1) * 60;
        context.strokeStyle = `rgba(244, 182, 74, ${1.6 - packet})`;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        context.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Static single frame for reduced motion.
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener('resize', resize);
      canvas.addEventListener('pointermove', onPointer);
      canvas.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  return (
    <motion.div
      className="relative h-full min-h-[300px] overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-surface-sunken/70"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      data-testid="viz-contact-network"
    >
      <div className="technical-grid absolute inset-0 opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/85">
        communication mesh / cursor-reactive
      </div>
      {sent && (
        <motion.div
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="rounded-full border border-secondary/50 bg-background/85 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary backdrop-blur-sm">
            Message sent
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
