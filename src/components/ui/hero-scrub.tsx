'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const IMMERSE_OVERFILL = 1.04
const ENTRY_DELAY = 0.2
const CARD_START_SCALE_DESKTOP = 0.6
const CARD_START_SCALE_MOBILE = 0.82

export type HeroScrubProps = {
  frameCount: number
  frameUrl: (index: number) => string
  fallbackSrc: string
  fallbackAlt: string
  titleTop: string
  titleBottom: string
  accentHex?: string
  defaultAspect?: number
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mediaQuery.matches)

    update()
    mediaQuery.addEventListener?.('change', update)

    return () => mediaQuery.removeEventListener?.('change', update)
  }, [])

  return reduced
}

export function HeroScrub({
  frameCount,
  frameUrl,
  fallbackSrc,
  fallbackAlt,
  titleTop,
  titleBottom,
  accentHex = '#3a9b8a',
  defaultAspect = 16 / 9,
}: HeroScrubProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const lastDrawnRef = useRef(-1)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleTopRef = useRef<HTMLHeadingElement>(null)
  const titleBottomRef = useRef<HTMLHeadingElement>(null)

  const [ready, setReady] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [framesOk, setFramesOk] = useState(true)
  const [aspect, setAspect] = useState(defaultAspect)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    let errored = 0
    let batchTimer: number | undefined
    const images: HTMLImageElement[] = new Array(frameCount)
    const errorThreshold = Math.min(5, frameCount)

    setReady(false)
    setCanvasReady(false)
    setFramesOk(true)
    setAspect(defaultAspect)
    lastDrawnRef.current = -1
    imagesRef.current = images

    const markFirstFrameReady = (image: HTMLImageElement) => {
      if (cancelled) return

      if (!image.naturalWidth || !image.naturalHeight) {
        setFramesOk(false)
        return
      }

      setAspect(image.naturalWidth / image.naturalHeight)
      setReady(true)
    }

    const markFrameError = () => {
      errored += 1
      if (!cancelled && errored >= errorThreshold) setFramesOk(false)
    }

    const loadFrame = (index: number) => {
      const image = new window.Image()
      image.decoding = 'async'
      if (index < 4) image.fetchPriority = 'high'
      image.onerror = markFrameError
      if (index === 0) image.onload = () => markFirstFrameReady(image)
      image.src = frameUrl(index)
      images[index] = image
    }

    const initialCount = Math.min(20, frameCount)
    for (let index = 0; index < initialCount; index += 1) loadFrame(index)

    const batchSize = 20
    let cursor = initialCount
    const loadNextBatch = () => {
      if (cancelled) return

      const end = Math.min(frameCount, cursor + batchSize)
      for (let index = cursor; index < end; index += 1) loadFrame(index)
      cursor = end
      if (cursor < frameCount) batchTimer = window.setTimeout(loadNextBatch, 80)
    }
    batchTimer = window.setTimeout(loadNextBatch, 200)

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && !images[0]?.complete) setFramesOk(false)
    }, 4500)

    return () => {
      cancelled = true
      if (batchTimer !== undefined) window.clearTimeout(batchTimer)
      window.clearTimeout(fallbackTimer)
      images.forEach((image) => {
        if (!image) return
        image.onload = null
        image.onerror = null
      })
      if (imagesRef.current === images) imagesRef.current = []
    }
  }, [defaultAspect, frameCount, frameUrl, reduced])

  useEffect(() => {
    if (reduced || !ready || !framesOk) return

    const image = imagesRef.current[0]
    if (!image?.naturalWidth || !image.naturalHeight) return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) {
      setFramesOk(false)
      return
    }

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    context.drawImage(image, 0, 0)
    lastDrawnRef.current = 0
    setCanvasReady(true)
  }, [framesOk, ready, reduced])

  useEffect(() => {
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ delay: ENTRY_DELAY })
      timeline.from(backgroundRef.current, {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
      })
      timeline.from(cardRef.current, {
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.35)
      timeline.from(titleTopRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'expo.out',
      }, 0.5)
      timeline.from(titleBottomRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'expo.out',
      }, 0.62)
    }, sectionRef)

    return () => context.revert()
  }, [reduced])

  useEffect(() => {
    if (reduced || !canvasReady || !framesOk) return

    const section = sectionRef.current
    if (!section) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const viewportSize = () => ({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const startScale = () => {
        const { width, height } = viewportSize()
        const narrowOrPortrait = width < 768 || (width < 1024 && height > width)
        return narrowOrPortrait ? CARD_START_SCALE_MOBILE : CARD_START_SCALE_DESKTOP
      }

      const immerseScale = () => {
        const { width, height } = viewportSize()
        const baseWidth = Math.min(width * 0.96, height * 0.72 * aspect)
        const baseHeight = Math.min(height * 0.72, (width * 0.96) / aspect)
        if (baseWidth <= 0 || baseHeight <= 0) return 1.5
        return Math.max(width / baseWidth, height / baseHeight) * IMMERSE_OVERFILL
      }

      const isLoaded = (index: number) => {
        const image = imagesRef.current[index]
        return Boolean(image?.complete && image.naturalWidth > 0)
      }

      const drawFrame = (index: number) => {
        const canvas = canvasRef.current
        if (!canvas) return

        let frameIndex = index
        if (!isLoaded(frameIndex)) {
          let closestLoaded = -1
          for (let distance = 1; distance < frameCount; distance += 1) {
            if (frameIndex - distance >= 0 && isLoaded(frameIndex - distance)) {
              closestLoaded = frameIndex - distance
              break
            }
            if (frameIndex + distance < frameCount && isLoaded(frameIndex + distance)) {
              closestLoaded = frameIndex + distance
              break
            }
          }
          if (closestLoaded === -1) return
          frameIndex = closestLoaded
        }

        if (lastDrawnRef.current === frameIndex) return

        const image = imagesRef.current[frameIndex]
        const context2d = canvas.getContext('2d')
        if (!context2d || !image) return

        context2d.drawImage(image, 0, 0, canvas.width, canvas.height)
        lastDrawnRef.current = frameIndex
      }

      gsap.set(cardRef.current, {
        scale: startScale,
        transformOrigin: '50% 50%',
      })

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const mappedProgress = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.63)
            const frameIndex = Math.min(
              frameCount - 1,
              Math.floor(mappedProgress * frameCount),
            )
            drawFrame(frameIndex)
          },
        },
      })

      master.to(cardRef.current, {
        scale: 1,
        ease: 'power2.out',
        duration: 0.15,
      }, 0)
      master.to(titleTopRef.current, {
        x: () => (window.innerWidth < 768 ? '-70vw' : '-60vw'),
        letterSpacing: '0.02em',
        ease: 'power2.inOut',
        duration: 0.15,
      }, 0)
      master.to(titleBottomRef.current, {
        x: () => (window.innerWidth < 768 ? '70vw' : '60vw'),
        letterSpacing: '0.02em',
        ease: 'power2.inOut',
        duration: 0.15,
      }, 0)
      master.to(cardRef.current, {
        scale: immerseScale,
        ease: 'power2.in',
        duration: 0.63,
      }, 0.15)
      master.to(titleTopRef.current, {
        opacity: 0,
        ease: 'power1.in',
        duration: 0.22,
      }, 0.15)
      master.to(titleBottomRef.current, {
        opacity: 0,
        ease: 'power1.in',
        duration: 0.22,
      }, 0.15)
      master.to(cardRef.current, {
        scale: startScale,
        ease: 'power3.inOut',
        duration: 0.22,
      }, 0.78)
      master.to(titleTopRef.current, {
        x: 0,
        opacity: 1,
        letterSpacing: '-0.04em',
        ease: 'power2.inOut',
        duration: 0.22,
      }, 0.78)
      master.to(titleBottomRef.current, {
        x: 0,
        opacity: 1,
        letterSpacing: '-0.04em',
        ease: 'power2.inOut',
        duration: 0.22,
      }, 0.78)

      ScrollTrigger.refresh()
    }, sectionRef)

    const refreshScrollState = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refreshScrollState)

    return () => {
      window.removeEventListener('resize', refreshScrollState)
      context.revert()
    }
  }, [aspect, canvasReady, frameCount, framesOk, reduced])

  const showCanvas = canvasReady && framesOk && !reduced

  return (
    <section
      ref={sectionRef}
      aria-label="Cinematic roofing hero"
      className="relative w-full overflow-clip bg-black text-white"
      style={{ height: 'min(420vh, 260rem)' }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
        <div
          ref={backgroundRef}
          aria-hidden
          className="absolute inset-0 z-0"
          style={{ backgroundColor: accentHex }}
        />
        <div aria-hidden className="absolute inset-0 z-0 bg-black/30" />
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 55%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 md:gap-4">
          <h2
            ref={titleTopRef}
            aria-hidden
            className="whitespace-nowrap font-black uppercase"
            style={{
              fontSize: 'clamp(3.75rem, 12vw, 11rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
            }}
          >
            {titleTop}
          </h2>

          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[12px] shadow-[0_20px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 will-change-transform md:rounded-[16px]"
            style={{
              width: `min(96vw, calc(72svh * ${aspect}))`,
              height: `min(72svh, calc(96vw / ${aspect}))`,
              aspectRatio: aspect,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]"
            />
            {ready && framesOk && !reduced ? (
              <canvas
                ref={canvasRef}
                aria-hidden
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />
            ) : null}
            <img
              src={fallbackSrc}
              alt={fallbackAlt}
              decoding="async"
              loading="eager"
              className="absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700"
              style={{ opacity: showCanvas ? 0 : 1 }}
            />
          </div>

          <h2
            ref={titleBottomRef}
            aria-hidden
            className="whitespace-nowrap font-black uppercase"
            style={{
              fontSize: 'clamp(3.75rem, 12vw, 11rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
            }}
          >
            {titleBottom}
          </h2>
        </div>
      </div>
    </section>
  )
}
