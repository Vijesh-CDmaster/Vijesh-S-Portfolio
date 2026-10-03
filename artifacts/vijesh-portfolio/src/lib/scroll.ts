/**
 * Deterministic smooth scrolling for in-page anchors.
 *
 * Chromium's native smooth scrolling (and `scrollIntoView({ behavior })`) is
 * cancelled whenever something else calls `window.scrollTo` mid-flight.
 * framer-motion's layout projection does exactly that: during layout
 * measurements it suspends and then restores the scroll position
 * (`suspendedScrollY`), which kills native smooth scrolls — e.g. while the
 * nav's shared `layoutId` pill animates between sections.
 *
 * This driver re-asserts the absolute target position every frame, so a
 * framer-motion restore merely nudges us one frame — we still land exactly
 * on the target.
 */
let frame = 0;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToId(id: string): boolean {
  const target = id ? document.getElementById(id) : null;
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY;

  cancelAnimationFrame(frame);

  if (prefersReducedMotion()) {
    window.scrollTo(0, top);
    return true;
  }

  const start = window.scrollY;
  const delta = top - start;
  if (Math.abs(delta) < 2) return true;

  // Long trips get a slightly longer (but clamped) glide.
  const duration = Math.min(1100, Math.max(450, Math.abs(delta) * 0.45));
  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, start + delta * eased);
    if (progress < 1) frame = requestAnimationFrame(step);
  };

  frame = requestAnimationFrame(step);
  return true;
}
