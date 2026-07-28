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

  it('does not mount the canvas before the first frame is ready', () => {
    const { container } = render(<HeroScrub frameCount={1} frameUrl={() => '/roof-hero.webp'} fallbackSrc="/roof-hero.webp" fallbackAlt="A roof" titleTop="Protection" titleBottom="Elevated" />)
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })
})
