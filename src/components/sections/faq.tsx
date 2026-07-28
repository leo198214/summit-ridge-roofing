import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

const faqItems = [
  {
    id: 'repair-or-replace',
    question: 'How do I know whether a repair or replacement makes sense?',
    answer: 'Start with the condition of the full roof, the source and extent of the concern, and how a focused repair would relate to the surrounding materials. An assessment can help you compare those factors before choosing a scope.',
  },
  {
    id: 'before-assessment',
    question: 'What should I note before requesting an assessment?',
    answer: 'Write down where you noticed the issue, when it appears, and any changes you can see safely from the ground. Photos taken from a safe location can also help preserve useful context.',
  },
  {
    id: 'active-leak',
    question: 'What should I do if I notice an active leak?',
    answer: 'Keep people away from any wet electrical fixtures or sagging materials, contain water only when it is safe to do so, and document what you observe. Avoid climbing onto a wet or damaged roof.',
  },
  {
    id: 'inspection-focus',
    question: 'What can a roof assessment help clarify?',
    answer: 'A careful review can help distinguish the visible symptom from its likely source and identify which parts of the roof system deserve closer attention before a scope is selected.',
  },
]

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section id="faq" aria-labelledby="faq-title" className="w-full bg-stone-100 px-4 py-20 text-[#111a1f] sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-10 lg:[grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="max-w-xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a95639]">Questions to consider</p>
          <h2 id="faq-title" className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#111a1f] sm:text-4xl lg:text-5xl">
            A clearer roof decision starts with useful context.
          </h2>
        </div>

        <div className="w-full min-w-0 divide-y divide-[#111a1f]/15 border-y border-[#111a1f]/15">
          {faqItems.map((item) => {
            const isOpen = openId === item.id

            return (
              <article key={item.id} className="min-w-0 py-1">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex min-h-14 w-full items-center justify-between gap-5 py-5 text-left text-lg font-semibold tracking-[-0.015em] text-[#111a1f] outline-none focus-visible:ring-2 focus-visible:ring-[#a95639] focus-visible:ring-offset-4 focus-visible:ring-offset-stone-100 sm:min-h-16 sm:text-xl"
                  >
                    <span>{item.question}</span>
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-[#111a1f]/20">
                      {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                </h3>
                <div id={`faq-${item.id}`} hidden={!isOpen}>
                  <p className="max-w-2xl pb-6 pr-12 text-sm leading-6 text-[#445158] sm:text-base sm:leading-7">{item.answer}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
