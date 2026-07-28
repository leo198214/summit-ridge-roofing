import { Reveal } from './reveal'

const stages = [
  {
    name: 'Look closely',
    description: 'Review the roof and the concerns you have noticed, then identify the conditions that need attention.',
  },
  {
    name: 'Plan clearly',
    description: 'Translate the findings into a practical scope so you can understand the recommended path before deciding.',
  },
  {
    name: 'Build with care',
    description: 'Carry out the agreed work with attention to the roof system and the home it is meant to protect.',
  },
]

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="w-full bg-[#111a1f] px-4 py-20 text-stone-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-12 lg:[grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal>
          <div className="max-w-xl min-w-0 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d58b69]">Our process</p>
            <h2 id="process-title" className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-stone-50 sm:text-4xl lg:text-5xl">
              From uncertainty to a considered next step.
            </h2>
          </div>
        </Reveal>

        <ol className="w-full min-w-0 divide-y divide-white/10 border-y border-white/10">
          {stages.map((stage, index) => (
            <li key={stage.name} className="min-w-0 py-8 first:pt-0 last:pb-0 sm:py-10">
              <Reveal delay={index * 0.07}>
                <article className="grid min-w-0 gap-4 sm:[grid-template-columns:minmax(0,4rem)_minmax(0,1fr)] sm:gap-6">
                  <span aria-hidden className="font-mono text-sm text-[#d58b69]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold tracking-[-0.025em] text-stone-50">{stage.name}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300 sm:text-base sm:leading-7">{stage.description}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
