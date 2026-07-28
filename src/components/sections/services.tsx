import { House } from 'lucide-react'
import { Reveal } from './reveal'

const services = [
  {
    name: 'Roof replacement',
    description: 'Understand when replacement is the sound choice and what the scope should include before work begins.',
  },
  {
    name: 'Targeted repairs',
    description: 'Address a defined problem with a focused plan that considers the surrounding roof, not just the visible symptom.',
  },
  {
    name: 'Roof inspections',
    description: 'Get a closer look at present conditions so you can weigh maintenance, repair, and replacement with more clarity.',
  },
]

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="w-full bg-[#18242a] px-4 py-20 text-stone-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <Reveal>
          <div className="max-w-2xl min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d58b69]">Services</p>
            <h2 id="services-title" className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-stone-50 sm:text-4xl lg:text-5xl">
              The right scope starts with the right question.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid w-full min-w-0 gap-4 md:[grid-template-columns:repeat(3,minmax(0,1fr))] lg:gap-6">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={index * 0.07}>
              <article className="h-full min-w-0 rounded-2xl border border-white/10 bg-[#111a1f] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.14)] sm:p-8">
                <House aria-hidden className="size-6 text-[#d58b69]" strokeWidth={1.7} />
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-stone-50">{service.name}</h3>
                <p className="mt-4 text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">{service.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
