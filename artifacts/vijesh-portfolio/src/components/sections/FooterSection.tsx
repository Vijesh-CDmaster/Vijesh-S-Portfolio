import { motion, useReducedMotion } from 'framer-motion';

import { portfolio } from '@/data/portfolio';

type Props = { resumeAvailable: boolean };

const socials = [
  { label: 'GitHub', href: portfolio.github },
  { label: 'LinkedIn', href: portfolio.linkedin },
  { label: 'LeetCode', href: portfolio.leetcode },
  { label: 'Email', href: `mailto:${portfolio.email}` },
];

/** Act 7 — exit: minimal, premium, one quiet status pulse. */
export default function FooterSection({ resumeAvailable }: Props) {
  const reduced = useReducedMotion();

  return (
    <footer className="border-t border-foreground/10 bg-surface-sunken/60 py-10" data-testid="footer">
      <div className="section-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-[-0.04em] text-foreground">
            Vijesh S<span className="text-primary">.</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Software Engineer &amp; Full-Stack Developer
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer">
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : undefined}
              rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
              whileHover={{ y: -3 }}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
              data-testid={`link-footer-${social.label.toLowerCase()}`}
            >
              {social.label}
            </motion.a>
          ))}
          {resumeAvailable && (
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
              data-testid="link-resume-footer"
            >
              Resume
            </a>
          )}
          <a href="#top" className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-back-top">
            Back to top ↑
          </a>
        </nav>

        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            <motion.span
              className="status-dot size-1.5 rounded-full bg-primary"
              animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            system online
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
