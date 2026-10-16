import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import { useForm, ValidationError } from '@formspree/react';

import { durations, easings } from '@/motion/tokens';
import { portfolio } from '@/data/portfolio';
import { formspreeId, resumePath } from '@/lib/site';
import { SectionReveal } from '@/components/animations';
import ContactNetwork from '@/components/ContactNetwork';
import { MagneticButton } from '@/components/animations/MagneticButton';

type FormState = 'idle' | 'typing' | 'validation' | 'submitting' | 'success' | 'error';

type ContactFields = { name: string; email: string; message: string };

type Props = { resumeAvailable: boolean };

const contactLinks = [
  { label: 'Email', value: portfolio.email, href: `mailto:${portfolio.email}`, testId: 'link-contact-email' },
  { label: 'Phone', value: portfolio.phone, href: `tel:${portfolio.phone.replaceAll(' ', '')}`, testId: 'link-contact-phone' },
  { label: 'LinkedIn', value: 'vijesh-s', href: portfolio.linkedin, testId: 'link-contact-linkedin' },
  { label: 'GitHub', value: portfolio.githubUser, href: portfolio.github, testId: 'link-contact-github' },
  { label: 'LeetCode', value: 'VIjesh_07', href: portfolio.leetcode, testId: 'link-contact-leetcode' },
];

/** Act 6 — contact: full form state machine plus a network that delivers the message. */
export default function ContactSection({ resumeAvailable }: Props) {
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [formspree, submitToFormspree, resetFormspree] = useForm<ContactFields>(formspreeId);

  // Mirror the Formspree submission lifecycle onto the section's own UI states.
  useEffect(() => {
    if (formspree.succeeded) {
      setState('success');
      return;
    }
    if (formspree.errors) {
      setState('error');
      const first = formspree.errors.getFormErrors()[0];
      setError(
        first
          ? `${first.message} If that keeps happening, email ${portfolio.email} directly — I'll still get it.`
          : `Something went wrong sending your message. Please email ${portfolio.email} directly — I'll still get it.`,
      );
    }
  }, [formspree]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setState((current) => (current === 'idle' || current === 'typing' ? 'typing' : current));
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !isValidEmail || form.message.trim().length < 12) {
      setState('validation');
      setError('Please add your name, a valid email, and a little more context (12 characters minimum).');
      return;
    }
    // Honeypot: humans never see this field, bots fill it — silently drop.
    const honeypot = event.currentTarget.elements.namedItem('_gotcha');
    if (honeypot instanceof HTMLInputElement && honeypot.value) {
      setState('success');
      return;
    }
    setError('');
    setState('submitting');
    try {
      await submitToFormspree(event);
    } catch {
      setState('error');
      setError(
        `Something went wrong sending your message. Please email ${portfolio.email} directly — I'll still get it.`,
      );
    }
  };

  const reset = () => {
    setForm({ name: '', email: '', message: '' });
    setState('idle');
    setError('');
    resetFormspree();
  };

  const fieldClass =
    'mt-2 w-full border-b bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50';

  return (
    <section id="contact" className="border-t border-foreground/10 py-24 md:py-32" data-testid="section-contact">
      <div className="section-shell">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">07 / Contact</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-balance">
            {portfolio.contactHeadline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            For roles, collaborations, or a thoughtful exchange about building things — send a note. I read every message.{' '}
            <span className="text-foreground">{portfolio.availability}</span>
          </p>
        </SectionReveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          {/* Direct channels */}
          <SectionReveal from="left" className="space-y-3">
            {contactLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group flex items-center gap-4 rounded-2xl border border-foreground/10 bg-surface-raised/60 p-4 transition-colors hover:border-primary/50"
                data-testid={link.testId}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{link.label}</span>
                  <span className="mt-1 block truncate text-sm font-semibold text-foreground">{link.value}</span>
                </span>
                <span className="ml-auto text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true">
                  ↗
                </span>
              </motion.a>
            ))}

            {resumeAvailable && (
              <motion.a
                href={resumePath}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 8 }}
                className="flex items-center justify-between rounded-2xl border border-secondary/40 bg-secondary/10 p-4 font-mono text-xs uppercase tracking-[0.16em] text-secondary"
                data-testid="link-resume-contact"
              >
                View / download resume <span aria-hidden="true">↓</span>
              </motion.a>
            )}
          </SectionReveal>

          {/* Form + network */}
          <div className="grid gap-6">
            <SectionReveal from="right">
              <AnimatePresence mode="wait">
                {state === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: durations.base, ease: easings.out }}
                    className="rounded-[1.5rem] border border-primary/30 bg-primary/10 p-8 text-center"
                    data-testid="status-contact-success"
                  >
                    <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">Message received.</p>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      Thanks for reaching out — I&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={reset}
                      className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-primary underline underline-offset-4"
                      data-testid="button-send-another"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    noValidate
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: durations.base, ease: easings.out }}
                    className="rounded-[1.5rem] border border-foreground/10 bg-surface-raised/70 p-6 backdrop-blur-sm md:p-8"
                    data-testid="form-contact"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Name</span>
                        <motion.input
                          value={form.name}
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          onChange={(event) => updateField('name', event.target.value)}
                          className={`${fieldClass} ${
                            state === 'validation' && !form.name.trim() ? 'border-red-400' : 'border-foreground/15 focus:border-primary'
                          }`}
                          placeholder="Your name"
                          whileFocus={reduced ? undefined : { scale: 1.01 }}
                          data-testid="input-contact-name"
                        />
                      </label>
                      <label className="block">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Email</span>
                        <motion.input
                          type="email"
                          value={form.email}
                          id="contact-email"
                          name="email"
                          autoComplete="email"
                          onChange={(event) => updateField('email', event.target.value)}
                          className={`${fieldClass} ${
                            state === 'validation' && !isValidEmail ? 'border-red-400' : 'border-foreground/15 focus:border-primary'
                          }`}
                          placeholder="you@company.com"
                          whileFocus={reduced ? undefined : { scale: 1.01 }}
                          data-testid="input-contact-email"
                        />
                        <ValidationError
                          field="email"
                          errors={formspree.errors}
                          className="mt-2 block font-mono text-[10px] leading-4 text-red-300"
                        />
                      </label>
                    </div>

                    <label className="mt-7 block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Message</span>
                      <motion.textarea
                        rows={5}
                        value={form.message}
                        id="contact-message"
                        name="message"
                        onChange={(event) => updateField('message', event.target.value)}
                        className={`${fieldClass} resize-none leading-7 ${
                          state === 'validation' && form.message.trim().length < 12 ? 'border-red-400' : 'border-foreground/15 focus:border-primary'
                        }`}
                        placeholder="What are you working on?"
                        whileFocus={reduced ? undefined : { scale: 1.005 }}
                        data-testid="input-contact-message"
                      />
                      <ValidationError
                        field="message"
                        errors={formspree.errors}
                        className="mt-2 block font-mono text-[10px] leading-4 text-red-300"
                      />
                    </label>

                    {/* Honeypot (Formspree's _gotcha) — invisible to humans, bots fill it and get dropped */}
                    <input
                      type="text"
                      name="_gotcha"
                      id="contact-gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-px w-px opacity-0"
                    />

                    <AnimatePresence>
                      {(state === 'validation' || state === 'error') && error && (
                        <motion.p
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0, x: reduced ? 0 : [0, -6, 6, -4, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-xs leading-5 text-red-300"
                          role="alert"
                          data-testid="status-contact-error"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <MagneticButton
                        type="submit"
                        disabled={state === 'submitting'}
                        className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-opacity disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        data-testid="button-contact-submit"
                      >
                        {state === 'submitting' ? (
                          <>
                            Sending
                            <motion.span
                              className="size-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                          </>
                        ) : (
                          'Send message →'
                        )}
                      </MagneticButton>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {state === 'typing' ? 'typing…' : 'no tracking · no spam'}
                      </span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </SectionReveal>

            <ContactNetwork sent={state === 'success'} />
          </div>
        </div>
      </div>
    </section>
  );
}
