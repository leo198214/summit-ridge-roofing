# Summit Ridge Roofing Landing Page - Design Specification

## Purpose

Create a premium, conversion-focused single-page website for a fictional residential roofing company, Summit Ridge Roofing. The page should help a homeowner understand the company's services and confidently request a roof assessment without relying on fabricated credibility claims, testimonials, ratings, years in business, or contact details.

## Audience and primary action

The audience is homeowners considering a roof replacement, repair, or inspection. The primary action is to request a roof assessment using the page's contact form. Navigation and all primary calls to action should scroll to that form.

## Chosen visual direction

The page will use the approved crafted-residential direction:

- Brand name: **Summit Ridge Roofing**.
- Tone: dependable, design-conscious, calm, and premium.
- Palette: deep slate / near-black foundation, warm clay-orange action color, soft warm-gray surfaces, and restrained off-white text.
- Typography: Lexend for display text and Source Sans 3 for body text, with system fallbacks to prevent invisible text during font loading.
- Image direction: a custom, locally hosted, high-resolution aerial photo of a newly reroofed suburban home with charcoal architectural shingles and sunrise light. It must contain no text, logos, watermarks, or people.

## Page architecture

1. **Sticky navigation** - Wordmark, anchor links for Services, Process, and FAQ, plus a visible "Request an assessment" CTA.
2. **Cinematic hero** - The supplied 21st.dev Hero Scrub component, adapted to the brand and a locally hosted generated roof image. The hero copy will read "Protection" and "Elevated," with a concise value proposition and CTA positioned before the scroll interaction.
3. **Services** - Three clear offerings: roof replacement, repair, and inspections. Each uses a Lucide icon and concise homeowner-oriented copy.
4. **Why the work matters** - A small editorial section explaining materials, clean-site care, and clear recommendations without claiming unverified achievements.
5. **Process** - A three-step path from assessment through installation and final walkthrough.
6. **FAQ** - Four to five practical questions that address timing, evaluation, repair versus replacement, and cleanup. This uses accessible disclosure controls.
7. **Assessment form / final CTA** - Name, email, phone, service need, and optional project note. On successful client-side validation, it shows a clear local confirmation state; no message is sent to a fabricated endpoint.
8. **Footer** - Brand name, navigation anchors, and an explicit placeholder-free note that the contact form is the way to start an assessment.

## Animation and visual system

- Keep the requested Hero Scrub component under `src/components/ui/hero-scrub.tsx` and preserve its GSAP scroll choreography.
- Supply the generated roof image locally from `public/roof-hero.webp` with `frameCount={1}`. The component's title movement and image-card scale will produce the intended immersive, 3D-like scroll treatment without misrepresenting a single image as a real video sequence.
- Improve Hero Scrub with a visible first-frame image fallback while the canvas loads, when loading fails, and when `prefers-reduced-motion` is enabled.
- Use `motion/react` for small, meaningful UI motion: entry stagger, card reveal, CTA hover/tap feedback, form confirmation, and FAQ expansion. Motion must use transforms/opacity, modest durations, and `useReducedMotion` safeguards.
- Avoid decorative loops, excessive parallax, scroll-jacking, or layout-affecting animations.

## Technical architecture

- Bootstrap a Vite React + TypeScript project.
- Use Tailwind CSS with a shadcn-compatible `src/components/ui` structure.
- Add `gsap`, `motion`, and `lucide-react` as the only feature dependencies needed for the interface.
- Use `src/App.tsx` for page composition, `src/components/ui/hero-scrub.tsx` for the adapted supplied component, and focused local components for navigation, FAQ, assessment form, and reveal primitives where they improve readability.
- Put global tokens, responsive rules, font loading, focus treatments, and reduced-motion CSS in `src/index.css`.
- Use local generated imagery only; do not hotlink the Ferrari demo or stock-photo assets.

## Interaction and data behavior

- Anchor links scroll to their target sections and have visible focus states.
- The form uses controlled local state and inline validation. The confirmation state says the request has been captured for this demo; it must not imply that an email or lead was actually transmitted.
- FAQ items maintain an expanded/collapsed state with native buttons and `aria-expanded`.
- The Hero Scrub is client-only, detects image errors, reserves its visual space, and falls back to the local image instead of leaving a blank canvas.

## Accessibility, SEO, and performance

- Use semantic landmarks, one H1, ordered heading hierarchy, descriptive form labels, and accessible icon labels where icons convey information.
- Meet WCAG contrast targets and retain visible keyboard focus.
- Respect `prefers-reduced-motion` in both GSAP and Motion behavior.
- Test mobile-first layouts at 375 px, 768 px, 1024 px, and 1440 px with no horizontal overflow.
- Include a title, meta description, Open Graph description, and concise image alt text.
- Keep the hero image compressed and local, reserve media dimensions to avoid layout shift, and lazy-load below-the-fold imagery if later added.

## Validation plan

1. Run TypeScript/build validation after setup and again after implementation.
2. Verify keyboard navigation, form validation, FAQ states, link targets, and reduced-motion behavior.
3. Check the hero canvas fallback on a failed image URL and with reduced motion enabled.
4. Review desktop and mobile screenshots for hierarchy, spacing, contrast, clipping, and sticky-section behavior.
5. Confirm no remote Ferrari assets, fake proof points, fake contact details, emojis used as icons, or misleading form-submission claims remain.

## Scope boundaries

This task creates a polished front-end landing page only. It does not create a backend, CRM connection, email delivery, analytics, domain configuration, authentic customer testimonials, a real phone number, or a true multi-frame drone/video sequence.
