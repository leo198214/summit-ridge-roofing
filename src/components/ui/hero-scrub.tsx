import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export type HeroScrubProps = {
  videoSrc?: string
  fallbackSrc: string
  fallbackAlt: string
  titleTop: string
  titleBottom: string
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return reduced
}

export function HeroScrub({
  videoSrc = '/roofing-aerial.mp4',
  fallbackSrc,
  fallbackAlt,
  titleTop,
  titleBottom,
}: HeroScrubProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const reduced = usePrefersReducedMotion()
  const canPlayVideo = reduced === false && !videoFailed

  useEffect(() => {
    if (reduced !== false) return

    const context = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.85, delay: 0.15, ease: 'expo.out' },
      )
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic roofing hero"
      className="relative isolate min-h-[34rem] overflow-hidden bg-[#10191d] text-white sm:min-h-[38rem] lg:min-h-[42rem]"
    >
      <img
        src={fallbackSrc}
        alt={fallbackAlt}
        decoding="async"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: canPlayVideo ? 0 : 1 }}
      />

      {canPlayVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={fallbackSrc}
          aria-hidden
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      <div aria-hidden className="absolute inset-0 bg-[#071014]/55" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,13,17,0.82)_0%,rgba(5,13,17,0.35)_52%,rgba(5,13,17,0.12)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(0deg,rgba(5,13,17,0.8)_0%,rgba(5,13,17,0)_100%)]" />

      <div className="page-container relative flex min-h-[34rem] items-end py-10 sm:min-h-[38rem] sm:py-14 lg:min-h-[42rem] lg:py-16">
        <div ref={contentRef} className="max-w-3xl opacity-100">
          <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.18em] text-[#f0b69b] sm:text-base">
            Residential roofing, seen from above
          </p>
          <h2 className="mt-4 text-balance font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white [font-size:clamp(3.25rem,9vw,7.25rem)]">
            {titleTop}
            <span className="block text-[#f0b69b]">{titleBottom}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-100 sm:text-lg sm:leading-8">
            A careful roofing decision starts with a clear view of what protects your home.
          </p>
          <a
            href="#assessment"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#f0b69b] px-6 py-3 text-sm font-semibold text-[#111a1f] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#111a1f]"
          >
            Request an assessment
          </a>
        </div>
      </div>
    </section>
  )
}
