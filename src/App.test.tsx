import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  configurable: true,
  value: IntersectionObserverMock,
})

describe('App', () => {
  it('renders one primary heading and the assessment destination', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /roofing that protects/i })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: /request an assessment/i })).toBeInTheDocument()
    expect(document.querySelectorAll('h1')).toHaveLength(1)
  })
})
