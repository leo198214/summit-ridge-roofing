import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'

export function HeroIntro() {
  return (
    <section className="w-full bg-[#111a1f] px-4 py-20 text-stone-100 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <Reveal>
          <div className="max-w-4xl min-w-0">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d58b69]">
              Thoughtful roofing decisions
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-stone-50 sm:text-5xl lg:text-7xl">
              Roofing that protects the life beneath it.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
              Clear assessment, practical recommendations, and careful roofing work help you choose the right next step for your home.
            </p>
            <a
              href="#assessment"
              className="mt-9 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#c47858] px-6 py-3 text-sm font-semibold text-[#111a1f] transition-colors hover:bg-[#d58b69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-100 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f]"
            >
              Request an assessment
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
