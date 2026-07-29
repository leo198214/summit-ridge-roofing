# Roofline Cinema section redesign

## Goal

Replace the broken image-led "Protection Elevated" visual with an aerial-roof video stage that works from GitHub Pages, remains clear on every viewport, and gives motion-sensitive visitors a complete still-image alternative.

## Direction

Use a cinematic, full-bleed aerial video within a single responsive stage. Keep Summit Ridge's deep-slate and warm-clay palette rather than adopting the unrelated pink palette returned by the generic design-system search. The overlay uses one concise eyebrow, the two-line "Protection / Elevated" headline, supporting copy, and a direct assessment CTA. Contrast is secured by layered dark gradients rather than translucent cards.

## Asset and delivery behavior

- Serve the supplied `roofing-aerial.mp4` and existing `roof-hero.webp` through Vite's repository-aware base URL, so GitHub Pages requests `/summit-ridge-roofing/...` rather than the domain root.
- Load video only when motion is allowed. It is muted, inline, looped, and paused outside the viewport to avoid needless playback.
- Use the still roof image for reduced-motion visitors and when video playback errors. The image remains meaningful with descriptive alt text; the decorative video remains hidden from assistive technology.

## Interaction and responsive layout

- Keep a single, bounded reveal for the copy when motion is allowed; no scroll-jacking or multi-layer parallax.
- Desktop: generous landscape video stage with lower-left copy; Mobile: compact, stacked typography and a stable minimum height with no horizontal overflow.
- Preserve existing anchor CTA behavior, focus treatment, semantics, and assessment flow.

## Verification

- Extend component tests to cover base-aware video and poster URLs, reduced-motion fallback, and the playback pause behavior.
- Build and test locally, then inspect one desktop and one mobile view of the deployed site.
- Run the Impeccable detector on the changed UI files and resolve material findings before handoff.
