import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { emptyAssessmentValues, validateAssessment, type AssessmentValues } from '@/lib/contact'

const confirmation = 'Your request has been captured locally for this demo. Connect this form to your preferred inbox or CRM before publishing.'

const fieldClassName = 'mt-2 min-h-12 w-full rounded-xl border border-white/20 bg-[#111a1f] px-4 py-3 text-base text-stone-50 outline-none transition-colors placeholder:text-stone-500 focus-visible:border-[#d58b69] focus-visible:ring-2 focus-visible:ring-[#d58b69] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18242a]'

export function AssessmentForm() {
  const [values, setValues] = useState<AssessmentValues>(emptyAssessmentValues)
  const [errors, setErrors] = useState<ReturnType<typeof validateAssessment>>({})
  const [isConfirmed, setIsConfirmed] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  function updateValue(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setIsConfirmed(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAssessment(values)
    setErrors(nextErrors)
    setIsConfirmed(Object.keys(nextErrors).length === 0)
  }

  return (
    <section id="assessment" aria-labelledby="assessment-title" className="w-full bg-[#18242a] px-4 py-20 text-stone-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-12 lg:[grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="max-w-xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d58b69]">Start with the details</p>
          <h2 id="assessment-title" className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-stone-50 sm:text-4xl lg:text-5xl">
            Request an assessment.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">
            Share what you have noticed and the kind of help you are considering. This demo keeps your entry in the browser only.
          </p>
        </div>

        <form aria-label="Request an assessment" noValidate onSubmit={handleSubmit} className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111a1f]/70 p-5 shadow-[0_24px_65px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="assessment-name" className="text-sm font-semibold text-stone-100">Name</label>
              <input
                id="assessment-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={updateValue}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={fieldClassName}
              />
              {errors.name && <p id="name-error" role="alert" className="mt-2 text-sm leading-5 text-[#f3a383]">{errors.name}</p>}
            </div>

            <div className="min-w-0">
              <label htmlFor="assessment-email" className="text-sm font-semibold text-stone-100">Email</label>
              <input
                id="assessment-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={updateValue}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={fieldClassName}
              />
              {errors.email && <p id="email-error" role="alert" className="mt-2 text-sm leading-5 text-[#f3a383]">{errors.email}</p>}
            </div>

            <div className="min-w-0">
              <label htmlFor="assessment-phone" className="text-sm font-semibold text-stone-100">Phone</label>
              <input
                id="assessment-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={updateValue}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={fieldClassName}
              />
              {errors.phone && <p id="phone-error" role="alert" className="mt-2 text-sm leading-5 text-[#f3a383]">{errors.phone}</p>}
            </div>

            <div className="min-w-0">
              <label htmlFor="assessment-service" className="text-sm font-semibold text-stone-100">What can we help with?</label>
              <select
                id="assessment-service"
                name="service"
                value={values.service}
                onChange={updateValue}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? 'service-error' : undefined}
                className={fieldClassName}
              >
                <option value="">Select an option</option>
                <option value="Roof replacement">Roof replacement</option>
                <option value="Targeted repairs">Targeted repairs</option>
                <option value="Roof inspection">Roof inspection</option>
              </select>
              {errors.service && <p id="service-error" role="alert" className="mt-2 text-sm leading-5 text-[#f3a383]">{errors.service}</p>}
            </div>

            <div className="min-w-0 sm:col-span-2">
              <label htmlFor="assessment-note" className="text-sm font-semibold text-stone-100">Project note (optional)</label>
              <textarea
                id="assessment-note"
                name="note"
                rows={5}
                value={values.note}
                onChange={updateValue}
                aria-invalid={Boolean(errors.note)}
                aria-describedby={errors.note ? 'note-error' : undefined}
                className={fieldClassName}
              />
              {errors.note && <p id="note-error" role="alert" className="mt-2 text-sm leading-5 text-[#f3a383]">{errors.note}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#c47858] px-6 py-3 text-sm font-semibold text-[#111a1f] transition-colors hover:bg-[#d58b69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-100 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f] sm:w-auto"
          >
            Request an assessment
            <ArrowUpRight aria-hidden className="size-4" />
          </button>

          <AnimatePresence>
            {isConfirmed && (
              <motion.p
                key="assessment-confirmation"
                role="status"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.24 }}
                className="mt-6 rounded-xl border border-[#d58b69]/35 bg-[#d58b69]/10 px-4 py-3 text-sm leading-6 text-stone-100"
              >
                {confirmation}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  )
}
