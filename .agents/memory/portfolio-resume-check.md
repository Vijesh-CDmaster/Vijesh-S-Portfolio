---
name: Resume availability check
description: The Vite preview fallback can return HTML for missing static files.
---

Check both HTTP success and the expected `application/pdf` content type before enabling a resume link. A missing static asset may otherwise look available in development because the SPA fallback responds with the app shell.

**Why:** A false-positive resume CTA damages trust and violates the requirement not to hard-code a missing file.

**How to apply:** Use the same content-type guard for any future optional downloadable asset.