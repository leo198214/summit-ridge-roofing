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
