import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { AssessmentForm } from './assessment-form'
import { Faq } from './faq'

afterEach(cleanup)

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
