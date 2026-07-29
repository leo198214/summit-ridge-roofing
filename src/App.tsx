import { SiteHeader } from './components/layout/site-header'
import { AssessmentForm } from './components/sections/assessment-form'
import { Faq } from './components/sections/faq'
import { HeroIntro } from './components/sections/hero-intro'
import { Process } from './components/sections/process'
import { Services } from './components/sections/services'
import { HeroScrub } from './components/ui/hero-scrub'

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-[#111a1f]">
      <SiteHeader />

      <main>
        <HeroIntro />
        <HeroScrub
          videoSrc="/roofing-aerial.mp4"
          fallbackSrc="/roof-hero.webp"
          fallbackAlt="A freshly completed charcoal shingle roof on a suburban home"
          titleTop="Protection"
          titleBottom="Elevated"
        />
        <Services />
        <Process />
        <Faq />
        <AssessmentForm />
      </main>

      <footer className="border-t border-white/10 bg-[#111a1f] px-4 py-12 text-stone-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl min-w-0">
            <p className="text-lg font-semibold tracking-[-0.02em] text-stone-50">Summit Ridge Roofing</p>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Clear context for considered roofing decisions about replacement, repair, and inspection.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <a href="#services" className="rounded-sm text-stone-300 transition-colors hover:text-white">Services</a>
            <a href="#process" className="rounded-sm text-stone-300 transition-colors hover:text-white">Process</a>
            <a href="#faq" className="rounded-sm text-stone-300 transition-colors hover:text-white">FAQ</a>
            <a href="#assessment" className="rounded-sm text-stone-300 transition-colors hover:text-white">Assessment</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
