export const resumePath =
  import.meta.env.VITE_RESUME_PATH || `${import.meta.env.BASE_URL}resume.pdf`;

/**
 * Formspree form key backing the contact form (https://formspree.io/f/...).
 * Overridable per environment via VITE_FORMSPREE_ID; the default is the live form.
 */
export const formspreeId: string = import.meta.env.VITE_FORMSPREE_ID || 'mljgzrkp';
