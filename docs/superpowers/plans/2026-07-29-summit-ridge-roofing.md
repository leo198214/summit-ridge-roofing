# Summit Ridge Roofing Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, accessible, premium React landing page for Summit Ridge Roofing with a locally generated roof image and an adapted 21st.dev Hero Scrub experience.

**Architecture:** A Vite React + TypeScript app will compose small section components from `src/App.tsx`. The supplied GSAP canvas hero will live at `src/components/ui/hero-scrub.tsx`, while Motion powers only stateful UI and section reveals. A local validation module keeps the form deterministic and testable; global CSS owns tokens, responsive grids, typography, and reduced-motion fallback rules.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS v4 via `@tailwindcss/vite`, GSAP + ScrollTrigger, Motion (`motion/react`), Lucide React, Vitest, Testing Library, jsdom.

## Global Constraints

- Brand name is exactly `Summit Ridge Roofing`; do not introduce a phone number, address, testimonials, ratings, years in business, awards, or performance statistics.
- Use a generated and locally hosted roof image only. Do not use the Ferrari demo assets or remote stock images.
- Keep the provided Hero Scrub concept under `src/components/ui/hero-scrub.tsx`, but add a visible image fallback for initial load, image errors, and reduced-motion users.
- The single hero image must be rendered with `frameCount={1}`; describe the result as an immersive scroll treatment, never as a video or drone sequence.
- The form must perform only local validation and an honest local confirmation state; it must not claim transmission or delivery.
- Use semantic HTML, a single H1, visible focus indicators, labelled fields, SVG icons from Lucide, and WCAG-conscious contrast.
- Use `motion/react` with `useReducedMotion`, opacity, and transform-based animations only. Do not add decorative infinite animation.
- Support 375 px, 768 px, 1024 px, and 1440 px widths without horizontal overflow or clipped hero content.
- Keep feature dependencies limited to `gsap`, `motion`, and `lucide-react`; testing/build dependencies are allowed.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `package.json` | Scripts and the minimal runtime/development dependency set. |
| `vite.config.ts` | React, Tailwind Vite plugin, `@` alias, and Vitest environment. |
| `components.json` | shadcn-compatible alias and CSS location metadata. |
| `src/main.tsx` | React root mount. |
| `src/index.css` | Design tokens, Tailwind import, responsive utility classes, focus styles, and reduced-motion CSS. |
| `src/App.tsx` | Semantic page composition and document metadata synchronization. |
| `src/lib/contact.ts` | Assessment form types and deterministic field validation. |
| `src/lib/contact.test.ts` | Unit tests for form validation edge cases. |
| `src/components/ui/hero-scrub.tsx` | Adapted client-side GSAP canvas hero with fallback image behavior. |
| `src/components/ui/hero-scrub.test.tsx` | Hero fallback and accessible-title tests with browser API mocks. |
| `src/components/layout/site-header.tsx` | Responsive sticky header and accessible mobile navigation. |
| `src/components/layout/site-header.test.tsx` | Mobile menu state and navigation behavior tests. |
| `src/components/sections/reveal.tsx` | Reusable reduced-motion-aware Motion reveal wrapper. |
| `src/components/sections/hero-intro.tsx` | Accessible H1, value proposition, and assessment CTA. |
| `src/components/sections/services.tsx` | Three service cards with Lucide icons. |
| `src/components/sections/process.tsx` | Three-step homeowner process. |
| `src/components/sections/faq.tsx` | Accessible native-button FAQ disclosures. |
| `src/components/sections/assessment-form.tsx` | Controlled local form and confirmation state. |
| `src/components/sections/assessment-form.test.tsx` | Inline error and truthful confirmation tests. |
| `src/test/setup.ts` | Testing Library matchers, canvas mock, and configurable `matchMedia` mock. |
| `public/roof-hero.webp` | Custom generated hero asset, compressed locally. |
| `scripts/verify-hero-image.mjs` | Checks that the required local hero asset exists and is non-empty. |

---

### Task 1: Establish the Vite, Tailwind, shadcn-compatible, and test foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `components.json`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: the `@` import alias resolving to `src`, `pnpm build`, and `pnpm test` commands used by every remaining task.
- Produces: the shadcn-compatible UI path `@/components/ui` for `HeroScrub` and future UI primitives.

- [ ] **Step 1: Create the project manifest and configuration files**

Create a package with these scripts and dependency groups, then install the lockfile with `pnpm install`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "verify:hero": "node scripts/verify-hero-image.mjs"
  },
  "dependencies": {
    "gsap": "latest",
    "lucide-react": "latest",
    "motion": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@tailwindcss/vite": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vitejs/plugin-react": "latest",
    "jsdom": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vite": "latest",
    "vitest": "latest"
  }
}
```

Configure `vite.config.ts` with React, `tailwindcss()`, `resolve.alias['@'] = fileURLToPath(new URL('./src', import.meta.url))`, and this test setup:

```ts
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
  css: true,
}
```

Use this shadcn-compatible `components.json` alias map:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tsx": true,
  "rsc": false,
  "tailwind": { "config": "", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "ui": "@/components/ui", "utils": "@/lib/utils", "lib": "@/lib", "hooks": "@/hooks" }
}
```

- [ ] **Step 2: Add the browser test setup and minimal application mount**

Create `src/test/setup.ts` with a canvas no-op context and a controllable default media-query response:

```ts
import '@testing-library/jest-dom/vitest'

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({ drawImage: () => undefined }),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
})
```

Create `src/main.tsx` as `createRoot(document.getElementById('root')!).render(<App />)` and a temporary `src/App.tsx` that returns `<main><h1>Summit Ridge Roofing</h1></main>` solely to establish a compilable root.

- [ ] **Step 3: Run the empty-shell build and test commands**

Run:

```powershell
pnpm build
pnpm test
```

Expected: the TypeScript/Vite build completes, and Vitest exits successfully before test files exist because the test script includes `--passWithNoTests`.

- [ ] **Step 4: Commit the foundation**

```powershell
git add package.json pnpm-lock.yaml tsconfig.json tsconfig.app.json vite.config.ts index.html components.json src/main.tsx src/index.css src/test/setup.ts src/App.tsx
git commit -m "chore: scaffold roofing landing page"
```

### Task 2: Implement deterministic assessment validation

**Files:**
- Create: `src/lib/contact.ts`
- Create: `src/lib/contact.test.ts`

**Interfaces:**
- Produces: `AssessmentValues`, `AssessmentErrors`, `emptyAssessmentValues`, and `validateAssessment(values)` for `AssessmentForm`.
- Consumes: no UI components or browser-only APIs.

- [ ] **Step 1: Write failing validation tests**

Create `src/lib/contact.test.ts` with the expected validation contract:

```ts
import { describe, expect, it } from 'vitest'
import { emptyAssessmentValues, validateAssessment } from './contact'

describe('validateAssessment', () => {
  it('requires a name, valid email, phone, and service', () => {
    expect(validateAssessment(emptyAssessmentValues)).toEqual({
      name: 'Enter your name.',
      email: 'Enter a valid email address.',
      phone: 'Enter a phone number.',
      service: 'Choose what you need help with.',
    })
  })

  it('accepts a complete assessment request', () => {
    expect(validateAssessment({
      name: 'Avery Stone', email: 'avery@example.com', phone: '555-010-1234',
      service: 'Roof replacement', note: 'A leak appeared after heavy rain.',
    })).toEqual({})
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
pnpm test -- src/lib/contact.test.ts
```

Expected: FAIL because `./contact` does not exist.

- [ ] **Step 3: Implement the validation module**

Create this API in `src/lib/contact.ts`:

```ts
export type AssessmentValues = {
  name: string
  email: string
  phone: string
  service: string
  note: string
}

export type AssessmentErrors = Partial<Record<keyof AssessmentValues, string>>

export const emptyAssessmentValues: AssessmentValues = {
  name: '', email: '', phone: '', service: '', note: '',
}

export function validateAssessment(values: AssessmentValues): AssessmentErrors {
  const errors: AssessmentErrors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (values.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a phone number.'
  if (!values.service) errors.service = 'Choose what you need help with.'
  return errors
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
pnpm test -- src/lib/contact.test.ts
```

Expected: PASS with two tests.

- [ ] **Step 5: Commit the validation contract**

```powershell
git add src/lib/contact.ts src/lib/contact.test.ts
git commit -m "feat: validate assessment requests"
```

### Task 3: Generate and verify the local roof hero asset

**Files:**
- Create: `public/roof-hero.webp`
- Create: `scripts/verify-hero-image.mjs`

**Interfaces:**
- Produces: `/roof-hero.webp`, supplied to `HeroScrub` as both `frameUrl(0)` and `fallbackSrc`.
- Consumes: the built-in image generation tool; no remote image URL is permitted.

- [ ] **Step 1: Generate the hero image with the built-in image tool**

Use this exact prompt, then select the best result after inspecting it:

```text
Use case: photorealistic-natural
Asset type: premium residential roofing landing page hero
Primary request: create one high-resolution photorealistic aerial three-quarter view of a newly reroofed suburban home
Scene/backdrop: quiet established neighborhood, roof is the visual focus, subtle distant foliage only
Subject: clean charcoal architectural shingles, crisp ridge lines, carefully finished flashing, no workers visible
Style/medium: premium architectural photography
Composition/framing: cinematic 16:9 landscape composition with the home centered and enough open sky/yard around the roof for gentle cropping; no text area required
Lighting/mood: early warm sunrise, natural shadows, calm and trustworthy
Color palette: charcoal, warm stone, muted green, restrained sunrise gold
Constraints: no brand logos, no signs, no readable addresses, no people, no text, no watermark, no exaggerated HDR, no impossible roof geometry
Avoid: storm damage, construction debris, luxury cars, drone interface graphics, letters, numbers
```

- [ ] **Step 2: Convert and place the selected result**

Copy the selected generated image into the project, then use the bundled Python runtime with Pillow to make `public/roof-hero.webp`. Preserve the image's landscape aspect ratio, use RGB, and choose WebP quality 82. The command must use the generated file's actual path in place of `SOURCE_IMAGE`:

```powershell
& 'C:\Users\lexus\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -c "from PIL import Image; image=Image.open(r'SOURCE_IMAGE').convert('RGB'); image.save(r'public/roof-hero.webp', 'WEBP', quality=82, method=6)"
```

- [ ] **Step 3: Write an asset verifier and run it**

Create `scripts/verify-hero-image.mjs`:

```js
import { stat } from 'node:fs/promises'

const asset = new URL('../public/roof-hero.webp', import.meta.url)
const info = await stat(asset)
if (info.size < 25_000) {
  throw new Error(`roof-hero.webp is unexpectedly small: ${info.size} bytes`)
}
console.log(`Verified local hero asset: ${info.size} bytes`)
```

Run:

```powershell
pnpm verify:hero
```

Expected: a non-empty local asset is reported and no remote URL is introduced.

- [ ] **Step 4: Commit the final local asset**

```powershell
git add public/roof-hero.webp scripts/verify-hero-image.mjs
git commit -m "feat: add local roofing hero asset"
```

### Task 4: Adapt and test the Hero Scrub component

**Files:**
- Create: `src/components/ui/hero-scrub.tsx`
- Create: `src/components/ui/hero-scrub.test.tsx`

**Interfaces:**
- Consumes: `frameCount`, `frameUrl`, `fallbackSrc`, `fallbackAlt`, `titleTop`, `titleBottom`, optional `accentHex`, and optional `defaultAspect`.
- Produces: a `<section aria-label="Cinematic roofing hero">` that always renders a meaningful fallback `<img>` while preserving GSAP's canvas choreography when motion and image loading are available.

- [ ] **Step 1: Write failing hero fallback tests**

Create `src/components/ui/hero-scrub.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroScrub } from './hero-scrub'

describe('HeroScrub', () => {
  it('renders its supplied image fallback with descriptive alternative text', () => {
    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A freshly completed charcoal shingle roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.getByRole('img', { name: /freshly completed charcoal/i })).toBeInTheDocument()
  })

  it('keeps visual display headings hidden from the accessibility tree', () => {
    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.queryByRole('heading', { name: 'Protection' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
pnpm test -- src/components/ui/hero-scrub.test.tsx
```

Expected: FAIL because the component module is absent.

- [ ] **Step 3: Implement the adapted component**

Start from the supplied source and retain its sticky section, GSAP timeline, image preloading, canvas drawing, and cleanup. Add these exact props and fallback structure:

```ts
export type HeroScrubProps = {
  frameCount: number
  frameUrl: (index: number) => string
  fallbackSrc: string
  fallbackAlt: string
  titleTop: string
  titleBottom: string
  accentHex?: string
  defaultAspect?: number
}
```

```tsx
<img
  src={fallbackSrc}
  alt={fallbackAlt}
  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
  style={{ opacity: ready && framesOk && !reduced ? 0 : 1 }}
/>
{framesOk && !reduced && <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full object-cover" />}
```

Use the exact section label `Cinematic roofing hero`; keep both display headings `aria-hidden`; do not put an H1 in this component. Ensure the GSAP setup effect returns `ctx.revert()`, guards every browser-only operation behind `useEffect`, and does nothing when `reduced` is true.

- [ ] **Step 4: Run targeted tests and build verification**

Run:

```powershell
pnpm test -- src/components/ui/hero-scrub.test.tsx
pnpm build
```

Expected: both hero tests pass and no server-render/browser global TypeScript error occurs.

- [ ] **Step 5: Commit the responsive hero**

```powershell
git add src/components/ui/hero-scrub.tsx src/components/ui/hero-scrub.test.tsx
git commit -m "feat: adapt cinematic roofing hero"
```

### Task 5: Build responsive navigation, introductory content, service cards, and process content

**Files:**
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-header.test.tsx`
- Create: `src/components/sections/reveal.tsx`
- Create: `src/components/sections/hero-intro.tsx`
- Create: `src/components/sections/services.tsx`
- Create: `src/components/sections/process.tsx`

**Interfaces:**
- Consumes: `Reveal` wraps visual children with `children: ReactNode` and optional `delay?: number`.
- Produces: header anchors `#services`, `#process`, `#faq`, and `#assessment`; a page-level accessible H1 in `HeroIntro`.

- [ ] **Step 1: Write a failing mobile-navigation test**

Create `src/components/layout/site-header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './site-header'

describe('SiteHeader', () => {
  it('opens and closes the labelled mobile navigation', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)
    const toggle = screen.getByRole('button', { name: /open navigation/i })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('link', { name: 'Services' }).some((link) => link.getAttribute('href') === '#services')).toBe(true)
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
```

- [ ] **Step 2: Run the navigation test to verify it fails**

Run:

```powershell
pnpm test -- src/components/layout/site-header.test.tsx
```

Expected: FAIL because `SiteHeader` is absent.

- [ ] **Step 3: Implement page content and reduced-motion-safe reveals**

Implement `Reveal` with this behavior:

```tsx
const reduced = useReducedMotion()
return <motion.div initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={{ duration: 0.42, delay }}>{children}</motion.div>
```

Implement `SiteHeader` with a 44 px minimum mobile toggle, `Menu` / `X` icons from Lucide, `aria-controls="mobile-navigation"`, and the accessible label that changes between `Open navigation` and `Close navigation`.

Implement `HeroIntro` with this exact heading and CTA:

```tsx
<h1>Roofing that protects the life beneath it.</h1>
<a href="#assessment">Request an assessment <ArrowUpRight aria-hidden /></a>
```

Use only these services: `Roof replacement`, `Targeted repairs`, and `Roof inspections`. Implement the process labels `Look closely`, `Plan clearly`, and `Build with care`. Use `<section id="services">` and `<section id="process">` and avoid fact claims beyond the service descriptions.

- [ ] **Step 4: Run the targeted test and build**

Run:

```powershell
pnpm test -- src/components/layout/site-header.test.tsx
pnpm build
```

Expected: the toggle state test passes and the components compile with the `@` alias.

- [ ] **Step 5: Commit the first content sections**

```powershell
git add src/components/layout src/components/sections/reveal.tsx src/components/sections/hero-intro.tsx src/components/sections/services.tsx src/components/sections/process.tsx
git commit -m "feat: add responsive roofing content sections"
```

### Task 6: Build the accessible FAQ and honest assessment form

**Files:**
- Create: `src/components/sections/faq.tsx`
- Create: `src/components/sections/assessment-form.tsx`
- Create: `src/components/sections/assessment-form.test.tsx`

**Interfaces:**
- Consumes: `AssessmentValues`, `emptyAssessmentValues`, and `validateAssessment` from `@/lib/contact`.
- Produces: `#faq` and `#assessment` sections with keyboard-operable interactions and no network submission.

- [ ] **Step 1: Write failing FAQ/form behavior tests**

Create `src/components/sections/assessment-form.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AssessmentForm } from './assessment-form'
import { Faq } from './faq'

describe('AssessmentForm', () => {
  it('shows inline validation errors for an empty submission', async () => {
    const user = userEvent.setup()
    render(<AssessmentForm />)
    await user.click(screen.getByRole('button', { name: /request an assessment/i }))
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
    expect(screen.getByText('Choose what you need help with.')).toBeInTheDocument()
  })

  it('shows an honest local confirmation for a complete request', async () => {
    const user = userEvent.setup()
    render(<AssessmentForm />)
    await user.type(screen.getByLabelText('Name'), 'Avery Stone')
    await user.type(screen.getByLabelText('Email'), 'avery@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-010-1234')
    await user.selectOptions(screen.getByLabelText('What can we help with?'), 'Roof replacement')
    await user.click(screen.getByRole('button', { name: /request an assessment/i }))
    expect(screen.getByText(/captured locally for this demo/i)).toBeInTheDocument()
  })
})

describe('Faq', () => {
  it('updates aria-expanded when a question is selected', async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const question = screen.getByRole('button', { name: /how do i know whether/i })
    expect(question).toHaveAttribute('aria-expanded', 'false')
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
pnpm test -- src/components/sections/assessment-form.test.tsx
```

Expected: FAIL because `AssessmentForm` is absent.

- [ ] **Step 3: Implement FAQ and form semantics**

Implement FAQ items as native buttons and sibling content with this interaction shape:

```tsx
<button type="button" aria-expanded={openId === item.id} aria-controls={`faq-${item.id}`} onClick={() => setOpenId(openId === item.id ? null : item.id)}>
  {item.question}<Plus aria-hidden />
</button>
<div id={`faq-${item.id}`} hidden={openId !== item.id}>{item.answer}</div>
```

Give `AssessmentForm` labelled `name`, `email`, `tel`, `select`, and `textarea` controls. Submit with `event.preventDefault()`, set `errors` from `validateAssessment`, and only set confirmation when `Object.keys(nextErrors).length === 0`:

```tsx
setConfirmation('Your request has been captured locally for this demo. Connect this form to your preferred inbox or CRM before publishing.')
```

Put each error under its field as `<p id="name-error" role="alert">`, attach `aria-describedby` when that field has an error, and use a non-animated confirmation when `useReducedMotion()` is true.

- [ ] **Step 4: Run interaction tests and the build**

Run:

```powershell
pnpm test -- src/components/sections/assessment-form.test.tsx
pnpm build
```

Expected: both client-side form behavior tests pass and the page has no network integration.

- [ ] **Step 5: Commit FAQ and form behavior**

```powershell
git add src/components/sections/faq.tsx src/components/sections/assessment-form.tsx src/components/sections/assessment-form.test.tsx
git commit -m "feat: add accessible FAQ and assessment form"
```

### Task 7: Compose the page, establish responsive CSS, and add metadata

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `index.html`
- Create: `src/App.test.tsx`

**Interfaces:**
- Consumes: all section components, `HeroScrub`, and `/roof-hero.webp`.
- Produces: one document with semantic `header`, `main`, `footer`, one H1, title/meta tags, and breakpoints that preserve all content widths.

- [ ] **Step 1: Write a failing composition test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders one primary heading and the assessment destination', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /roofing that protects/i })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /request an assessment/i })).toBeInTheDocument()
    expect(document.querySelectorAll('h1')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the composition test to verify it fails**

Run:

```powershell
pnpm test -- src/App.test.tsx
```

Expected: FAIL because the temporary app shell lacks the form and semantic composition.

- [ ] **Step 3: Compose the page and implement responsive CSS**

Compose `App` in this order: `SiteHeader`, `<main>`, `HeroIntro`, `HeroScrub`, `Services`, `Process`, `Faq`, `AssessmentForm`, and footer. Pass the hero this exact data:

```tsx
const roofFrameUrl = useCallback(() => '/roof-hero.webp', [])

<HeroScrub
  frameCount={1}
  frameUrl={roofFrameUrl}
  fallbackSrc="/roof-hero.webp"
  fallbackAlt="A freshly completed charcoal shingle roof on a suburban home"
  titleTop="Protection"
  titleBottom="Elevated"
  accentHex="#9A4E32"
/>
```

In `src/index.css`, import the approved Google font pairing with `display=swap`, import Tailwind, and define this responsive container contract:

```css
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap');
@import "tailwindcss";

:root { --page-gutter: clamp(1rem, 4vw, 4.5rem); --content-width: 75rem; }
html { scroll-behavior: smooth; }
body { min-width: 20rem; overflow-x: clip; }
.page-container { width: min(calc(100% - (var(--page-gutter) * 2)), var(--content-width)); margin-inline: auto; }
.service-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.process-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 48rem) { .service-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .process-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; } }
```

Use `clamp()` for display type and avoid fixed widths for text blocks, cards, form controls, hero card wrappers, and header links. At `<768 px`, hide desktop navigation and show the menu toggle; at `>=768 px`, reverse that visibility. Configure `index.html` with `viewport-fit=cover`, title `Summit Ridge Roofing | Residential Roofing`, a meaningful meta description, and Open Graph title/description tags.

- [ ] **Step 4: Run full unit/build validation**

Run:

```powershell
pnpm test
pnpm verify:hero
pnpm build
```

Expected: all tests pass, the hero asset verifier reports the local file, and `dist/` is produced.

- [ ] **Step 5: Commit the integrated landing page**

```powershell
git add src/App.tsx src/App.test.tsx src/index.css index.html
git commit -m "feat: compose Summit Ridge Roofing landing page"
```

### Task 8: Verify behavior and responsive visual integrity at every required width

**Files:**
- Modify only if a verification failure identifies a concrete defect in the files above.

**Interfaces:**
- Consumes: running Vite application from `pnpm dev -- --host 127.0.0.1`.
- Produces: evidence that the page works at 375 px, 768 px, 1024 px, and 1440 px with no horizontal overflow, clipping, or unusable controls.

- [ ] **Step 1: Start the local app and inspect the initial page**

Run:

```powershell
pnpm dev -- --host 127.0.0.1
```

Open the reported local URL in the browser automation tool. Confirm that the title and description match `index.html`, that the roof image renders locally, and that no network request targets the Ferrari repository.

- [ ] **Step 2: Test the required viewport matrix**

At each viewport below, load the homepage, capture a screenshot, and run `document.documentElement.scrollWidth <= window.innerWidth` in the page:

| Viewport | Required checks |
| --- | --- |
| 375 x 812 | Mobile navigation toggle is reachable, hero display text remains inside the viewport, cards stack, fields remain full width, and form submit button is at least 44 px tall. |
| 768 x 1024 | Navigation transitions cleanly, service/process grids use available width without narrow columns, and sticky hero does not cover following content. |
| 1024 x 768 | Desktop navigation is visible, three-card layouts remain readable, and hero image/card do not crop required content. |
| 1440 x 900 | Page container caps at a readable measure, whitespace feels intentional, and display text does not become uncomfortably wide. |

- [ ] **Step 3: Test keyboard, reduced motion, and failure fallbacks**

Use keyboard Tab/Enter to open the mobile navigation, operate one FAQ, focus each form control, and submit invalid then valid data. Emulate `prefers-reduced-motion: reduce` and confirm the fallback `<img>` remains visible while the canvas/motion effects do not animate. Temporarily replace the hero `frameUrl` with `/missing-roof.webp` during a local test and verify the fallback remains visible, then restore `/roof-hero.webp` before committing.

- [ ] **Step 4: Correct concrete failures and rerun the complete suite**

For each failure, change only the responsible component/CSS rule, then run:

```powershell
pnpm test
pnpm verify:hero
pnpm build
```

Expected: tests, asset verification, and production build all pass after the final responsive review.

- [ ] **Step 5: Commit verification fixes only when files changed**

If this task changed files, commit only the corrected files:

```powershell
git add src index.html
git commit -m "fix: polish responsive roofing landing page"
```

## Self-Review

### Spec coverage

- Premium residential identity, generated image, local hosting, no fabricated proof, and the specified name are covered by Tasks 3, 5, and 7.
- The requested Hero Scrub integration, GSAP behavior, one-frame transparency, and static/reduced-motion/error fallback are covered by Task 4 and verified by Task 8.
- Motion usage is constrained and implemented through `Reveal`, header/form state, and reduced-motion handling in Tasks 4-7.
- Semantic structure, form labels/validation, FAQ controls, visual focus, SEO metadata, and no false form-delivery claim are covered by Tasks 2, 5, 6, and 7.
- Mobile/desktop sizing and resize behavior are implemented through responsive CSS in Task 7 and verified across four viewport sizes in Task 8.
- Tests, build checks, asset checks, and keyboard/reduced-motion tests are explicit in every relevant task.

### Placeholder and consistency check

The plan contains no unspecified implementation work, no undeclared interfaces, and no unmatched prop/function names. `AssessmentValues`, `validateAssessment`, `HeroScrub` props, selector IDs, and section anchors are defined before their consuming tasks.
