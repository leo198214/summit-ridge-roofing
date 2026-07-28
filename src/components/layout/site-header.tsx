import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const navigationItems = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
]

const linkStyles =
  'rounded-sm text-sm font-medium text-stone-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47858] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f]'

const ctaStyles =
  'inline-flex min-h-11 items-center justify-center rounded-full bg-[#c47858] px-5 py-2.5 text-sm font-semibold text-[#111a1f] transition-colors hover:bg-[#d58b69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-100 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f]'

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const toggleLabel = isOpen ? 'Close navigation' : 'Open navigation'

  const closeNavigation = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#111a1f]/95 text-stone-100 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl min-w-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="min-w-0 rounded-sm font-semibold tracking-[-0.02em] text-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47858] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f]"
          aria-label="Summit Ridge Roofing, back to top"
        >
          <span className="block truncate">Summit Ridge Roofing</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className={linkStyles}>
              {item.label}
            </a>
          ))}
          <a href="#assessment" className={ctaStyles}>
            Request an assessment
          </a>
        </nav>

        <button
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={toggleLabel}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 px-3 text-sm font-medium text-stone-100 transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47858] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f] md:hidden"
        >
          <span>{toggleLabel}</span>
          {isOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </div>

      <AnimatePresence initial={!shouldReduceMotion}>
        {isOpen ? (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="border-t border-white/10 px-4 py-5 md:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col items-stretch gap-1">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeNavigation}
                  className={`${linkStyles} flex min-h-11 items-center px-3 py-2`}
                >
                  {item.label}
                </a>
              ))}
              <a href="#assessment" onClick={closeNavigation} className={`${ctaStyles} mt-3 w-full`}>
                Request an assessment
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
