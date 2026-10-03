import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

type Status = 'loading' | 'ready' | 'failed';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/** Network-style visualization of open-source contribution targets. */
function ContributionNetwork() {
  const reduced = useReducedMotion();
  const hubs = portfolio.openSource;
  const center = { x: 50, y: 50 };

  return (
    <div className="relative h-72 overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-surface-sunken/70" data-testid="viz-oss-network">
      <div className="technical-grid absolute inset-0 opacity-50" />
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {hubs.map((hub, index) => {
          const angle = (index / hubs.length) * Math.PI * 2 - Math.PI / 2;
          const x = center.x + Math.cos(angle) * 30;
          const y = center.y + Math.sin(angle) * 28;
          return (
            <motion.line
              key={`line-${hub.name}`}
              x1={`${center.x}%`}
              y1={`${center.y}%`}
              x2={`${x}%`}
              y2={`${y}%`}
              stroke="rgba(110,231,183,0.45)"
              strokeWidth="1"
              strokeDasharray="4 6"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2, ease: easings.out }}
            />
          );
        })}
        {hubs.map((hub, hubIndex) =>
          [0, 1, 2].map((nodeIndex) => {
            const angle = (hubIndex / hubs.length) * Math.PI * 2 - Math.PI / 2;
            const baseX = center.x + Math.cos(angle) * 30;
            const baseY = center.y + Math.sin(angle) * 28;
            const x = baseX + (nodeIndex - 1) * 6;
            const y = baseY + (nodeIndex - 1) * 5;
            return (
              <motion.circle
                key={`${hub.name}-${nodeIndex}`}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="rgba(244,182,74,0.75)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + nodeIndex * 0.15, duration: durations.base }}
                animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
                // eslint-disable-next-line react/no-unknown-property
                style={reduced ? undefined : { animation: undefined }}
              />
            );
          }),
        )}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
        open source
      </div>

      {hubs.map((hub, index) => {
        const angle = (index / hubs.length) * Math.PI * 2 - Math.PI / 2;
        const x = center.x + Math.cos(angle) * 30;
        const y = center.y + Math.sin(angle) * 28;
        return (
          <motion.a
            key={hub.name}
            href={hub.url}
            target="_blank"
            rel="noreferrer"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/20 bg-background/85 px-3.5 py-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.15, duration: durations.base }}
            data-testid={`link-oss-${hub.name.toLowerCase().replaceAll(' ', '-')}`}
          >
            {hub.name}
            <span className="mt-0.5 block text-[8px] tracking-[0.16em] text-muted-foreground">{hub.role}</span>
          </motion.a>
        );
      })}
    </div>
  );
}

/**
 * Act 5 — open source & public work: contribution network, live public
 * repositories from the GitHub API (graceful fallback, no tokens), and the
 * LeetCode profile.
 */
export default function OpenSourceSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${portfolio.githubUser}/repos?per_page=6&sort=updated`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
        return response.json();
      })
      .then((data: Repo[]) => {
        setRepos(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setStatus('failed');
      });
    return () => controller.abort();
  }, []);

  return (
    <section id="open-source" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-open-source">
      <div className="section-shell">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-[110px_1fr] md:gap-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">05 / Open source</p>
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.05em] text-balance md:text-6xl">
                Contributing beyond personal projects.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Contributions across the CNCF ecosystem and Meshery — plus everything public on GitHub.
              </p>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          <SectionReveal from="left">
            <ContributionNetwork />
            <div className="mt-4 flex flex-wrap gap-3">
              <motion.a
                href={portfolio.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
                data-testid="link-github-oss"
              >
                GitHub profile ↗
              </motion.a>
              <motion.a
                href={portfolio.leetcode}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                data-testid="link-leetcode-profile"
              >
                LeetCode profile ↗
              </motion.a>
            </div>
          </SectionReveal>

          <SectionReveal from="right" delay={0.08}>
            <div className="flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-surface-raised/70 p-6 md:p-7">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  public repositories / github
                </p>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-secondary">
                  <span className="status-dot size-1.5 rounded-full bg-secondary" />
                  {status === 'loading' ? 'syncing' : status === 'ready' ? 'live' : 'offline'}
                </span>
              </div>

              {status === 'loading' && (
                <div className="mt-5 space-y-3" aria-label="Loading repositories">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      className="h-16 rounded-xl bg-foreground/5"
                      animate={{ opacity: [0.35, 0.7, 0.35] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.15 }}
                    />
                  ))}
                </div>
              )}

              {status === 'failed' && (
                <div className="mt-5 rounded-xl border border-foreground/12 bg-foreground/[0.03] p-5" data-testid="github-fallback">
                  <p className="text-sm leading-6 text-muted-foreground">
                    Live repository data is unavailable right now. Everything public is still on the{' '}
                    <a href={portfolio.github} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
                      GitHub profile
                    </a>
                    .
                  </p>
                </div>
              )}

              {status === 'ready' && (
                <StaggerContainer className="mt-5 space-y-3" step={0.06}>
                  {repos.length === 0 && (
                    <p className="text-sm text-muted-foreground">No public repositories to show — private work stays private.</p>
                  )}
                  {repos.map((repo) => (
                    <StaggerItem key={repo.id} from="right" className="!block">
                      <motion.a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ x: 6 }}
                        className="group block rounded-xl border border-foreground/10 bg-background/40 p-4 transition-colors hover:border-primary/40"
                        data-testid={`card-repo-${repo.name}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-mono text-xs font-semibold text-foreground group-hover:text-primary">
                            {repo.name}
                          </p>
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{formatDate(repo.updated_at)}</span>
                        </div>
                        {repo.description && (
                          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{repo.description}</p>
                        )}
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 font-mono text-[10px] text-muted-foreground">
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full bg-secondary" /> {repo.language}
                            </span>
                          )}
                          <span>★ {repo.stargazers_count}</span>
                          <span>⑂ {repo.forks_count}</span>
                        </div>
                      </motion.a>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
