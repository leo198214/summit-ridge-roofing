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
