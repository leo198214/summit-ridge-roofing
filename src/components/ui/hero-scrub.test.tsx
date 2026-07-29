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
    render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A freshly completed charcoal shingle roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.getByRole('img', { name: /freshly completed charcoal/i })).toBeInTheDocument()
  })

  it('keeps visual display headings hidden from the accessibility tree', () => {
    render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(screen.queryByRole('heading', { name: 'Protection' })).not.toBeInTheDocument()
  })

  it('uses the supplied aerial video as its background when motion is allowed', () => {
    const { container } = render(<HeroScrub videoSrc="/roofing-aerial.mp4" fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(container.querySelector('video source')).toHaveAttribute('src', '/roofing-aerial.mp4')
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

    render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    expect(screen.getByRole('region', { name: 'Cinematic roofing hero' })).toBeInTheDocument()
  })

  it('uses the still-image fallback when reduced motion is preferred', () => {
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

    const { container } = render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A roof' })).toHaveStyle({ opacity: 1 })
  })
})
