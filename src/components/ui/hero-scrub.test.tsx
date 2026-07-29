import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('uses the supplied aerial video and poster as its background when motion is allowed', () => {
    const { container } = render(<HeroScrub videoSrc="/summit-ridge-roofing/roofing-aerial.mp4" fallbackSrc="/summit-ridge-roofing/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    expect(container.querySelector('video source')).toHaveAttribute('src', '/summit-ridge-roofing/roofing-aerial.mp4')
    expect(container.querySelector('video')).toHaveAttribute('poster', '/summit-ridge-roofing/roof-hero.webp')
    expect(container.querySelector('video')).toHaveAttribute('preload', 'none')
    expect(container.querySelector('video')).not.toHaveAttribute('autoplay')
  })

  it('uses the still image when the aerial video cannot play', async () => {
    const { container } = render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    const video = await waitFor(() => {
      const element = container.querySelector('video')
      expect(element).toBeInTheDocument()
      return element as HTMLVideoElement
    })

    fireEvent.error(video)

    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A roof' })).toHaveStyle({ opacity: 1 })
  })

  it('pauses the aerial video when the stage leaves the viewport', async () => {
    let callback: IntersectionObserverCallback | undefined
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)

    class IntersectionObserverMock {
      constructor(handler: IntersectionObserverCallback) {
        callback = handler
      }

      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
      takeRecords = vi.fn(() => [])
      root = null
      rootMargin = '0px'
      thresholds = [0.2]
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

    render(<HeroScrub fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)

    await waitFor(() => expect(callback).toBeTypeOf('function'))

    act(() => {
      callback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    })

    expect(pause).toHaveBeenCalled()
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
