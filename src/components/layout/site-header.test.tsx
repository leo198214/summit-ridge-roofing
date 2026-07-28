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
