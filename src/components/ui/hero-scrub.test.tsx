import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HeroScrub } from './hero-scrub'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('HeroScrub', () => {
  it('renders its supplied image fallback with descriptive alternative text', () => {
    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A freshly completed charcoal shingle roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.getByRole('img', { name: /freshly completed charcoal/i })).toBeInTheDocument()
  })

  it('keeps visual display headings hidden from the accessibility tree', () => {
    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.queryByRole('heading', { name: 'Protection' })).not.toBeInTheDocument()
  })

  it('does not mount the canvas before the first frame is ready', () => {
    const { container } = render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })

  it('uses a single-viewport hero when resolved motion preference is reduced', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as MediaQueryList)

    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    expect(screen.getByRole('region', { name: 'Cinematic roofing hero' })).toHaveStyle({ height: '100svh' })
  })

  it('does not preload frames when resolved motion preference is reduced', () => {
    const imageConstructor = vi.fn()
    vi.stubGlobal('Image', imageConstructor)
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as MediaQueryList)

    render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    expect(imageConstructor).not.toHaveBeenCalled()
    expect(screen.getByRole('img', { name: 'A roof' })).toHaveStyle({ opacity: 1 })
  })
})
