# Roofline Cinema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken Protection Elevated media treatment with a GitHub-Pages-safe, responsive aerial-video stage and reliable still fallback.

**Architecture:** `App.tsx` passes base-aware public asset paths to `HeroScrub`. `HeroScrub` owns video playback, failure and reduced-motion states, plus viewport-aware pausing; it renders the still image only as a semantic fallback. Styling stays local to the component through responsive Tailwind classes and current brand colors.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, GSAP, Vitest, Testing Library, GitHub Pages.

## Global Constraints

- Preserve Summit Ridge's deep-slate and warm-clay brand colors.
- Use Vite's `import.meta.env.BASE_URL` for public video and image URLs.
- Video is muted, inline, looped, and only active when reduced motion is not requested.
- Reduced-motion and video-error visitors receive the existing roof image with descriptive alternative text.
- Keep mobile and desktop layouts free from horizontal overflow, and retain the existing assessment CTA behavior.

---

### Task 1: Lock down asset URL and fallback behavior

**Files:**
- Modify: `src/App.tsx:7-23`
- Modify: `src/components/ui/hero-scrub.test.tsx:11-60`
- Modify: `src/components/ui/hero-scrub.tsx:4-45`

**Interfaces:**
- Consumes: `HeroScrubProps` with `videoSrc`, `fallbackSrc`, `fallbackAlt`, `titleTop`, and `titleBottom` strings.
- Produces: a `HeroScrub` section whose `<source>` and `poster` use Vite-base-aware URLs and whose fallback image remains accessible.

- [ ] **Step 1: Write failing base-path tests**

```tsx
render(<HeroScrub videoSrc="/summit-ridge-roofing/roofing-aerial.mp4" fallbackSrc="/summit-ridge-roofing/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
expect(container.querySelector('video source')).toHaveAttribute('src', '/summit-ridge-roofing/roofing-aerial.mp4')
expect(container.querySelector('video')).toHaveAttribute('poster', '/summit-ridge-roofing/roof-hero.webp')
```

- [ ] **Step 2: Run the focused test to verify the initial behavior**

Run: `pnpm test -- src/components/ui/hero-scrub.test.tsx`

Expected: the old test only asserts root-relative video URLs and does not protect GitHub Pages asset paths.

- [ ] **Step 3: Implement Vite-base-aware asset paths**

```tsx
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

<HeroScrub
  videoSrc={assetUrl('roofing-aerial.mp4')}
  fallbackSrc={assetUrl('roof-hero.webp')}
  // existing copy props
/>
```

- [ ] **Step 4: Run the focused test to verify asset paths and fallback behavior**

Run: `pnpm test -- src/components/ui/hero-scrub.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the tested asset path fix**

```bash
git add src/App.tsx src/components/ui/hero-scrub.tsx src/components/ui/hero-scrub.test.tsx
git commit -m "fix: serve hero media from GitHub Pages base path"
```

### Task 2: Build the responsive Roofline Cinema treatment

**Files:**
- Modify: `src/components/ui/hero-scrub.tsx:1-106`
- Modify: `src/components/ui/hero-scrub.test.tsx:11-60`

**Interfaces:**
- Consumes: the base-aware media props established in Task 1.
- Produces: a lower-left content overlay, one bounded entrance reveal, viewport-paused video playback, and the existing `#assessment` CTA.

- [ ] **Step 1: Write failing media lifecycle tests**

```tsx
const { container } = render(<HeroScrub videoSrc="/roofing-aerial.mp4" fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
const video = container.querySelector('video') as HTMLVideoElement
expect(video).toHaveAttribute('playsinline')
expect(video).toHaveAttribute('muted')
```

- [ ] **Step 2: Run the focused test to verify the lifecycle contract is unprotected**

Run: `pnpm test -- src/components/ui/hero-scrub.test.tsx`

Expected: FAIL until the controlled video element exposes the required playback attributes.

- [ ] **Step 3: Implement the video stage and bounded playback lifecycle**

```tsx
const videoRef = useRef<HTMLVideoElement>(null)

useEffect(() => {
  if (!canPlayVideo || !videoRef.current) return
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) void videoRef.current?.play().catch(() => setVideoFailed(true))
    else videoRef.current?.pause()
  }, { threshold: 0.2 })
  observer.observe(videoRef.current)
  return () => observer.disconnect()
}, [canPlayVideo])
```

Use a 16:10-to-16:9 stage, layered deep-slate gradients, responsive headline sizing, and no additional decorative parallax or eyebrow label.

- [ ] **Step 4: Run component tests and production build**

Run: `pnpm test -- src/components/ui/hero-scrub.test.tsx; pnpm build`

Expected: PASS and a successful Vite build.

- [ ] **Step 5: Commit the tested Roofline Cinema implementation**

```bash
git add src/components/ui/hero-scrub.tsx src/components/ui/hero-scrub.test.tsx
git commit -m "feat: redesign Protection Elevated video stage"
```

### Task 3: Verify and publish the redesign

**Files:**
- Modify: no additional source files expected
- Verify: `src/App.tsx`, `src/components/ui/hero-scrub.tsx`, `src/components/ui/hero-scrub.test.tsx`

**Interfaces:**
- Consumes: the committed responsive video stage.
- Produces: a verified GitHub Pages deployment at `https://leo198214.github.io/summit-ridge-roofing/`.

- [ ] **Step 1: Run full automated verification**

Run: `pnpm test; pnpm verify:hero; pnpm build; git diff --check`

Expected: all tests and image checks pass; no whitespace errors.

- [ ] **Step 2: Run the Impeccable detector once on changed UI files**

Run: `node C:\Users\lexus\.codex\skills\impeccable\scripts\detect.mjs --json src/App.tsx src/components/ui/hero-scrub.tsx`

Expected: any material detector findings are fixed before publishing.

- [ ] **Step 3: Inspect desktop and mobile in one batched pass**

Open the deployed route at desktop and mobile viewport widths. Confirm the aerial video loads, the fallback remains clear, the CTA is visible, and no horizontal overflow appears.

- [ ] **Step 4: Push the committed changes to GitHub**

```bash
git push origin master
```

- [ ] **Step 5: Confirm the GitHub Pages workflow succeeds**

Open the latest `Deploy to GitHub Pages` run and verify the live URL resolves with the redesigned stage.
