'use client'

import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis } from 'lenis/react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useHomeLoop } from '@/components/useHomeLoop'
import { useReducedMotion } from '@/components/useReducedMotion'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const reducedMotion = useReducedMotion()
  const homeLoop = useHomeLoop()
  const themePathRef = useRef<string | null>(null)
  const previousScrollRef = useRef(0)
  const hasLoopedRef = useRef(false)

  useLenis((lenis) => {
    const wrapped = lenis.options.infinite && Math.abs(lenis.scroll - previousScrollRef.current) > lenis.limit / 2
    const headings = wrapped ? ScrollTrigger.getAll().filter(trigger => trigger.trigger?.matches('h1 .textBlur')) : []
    const incomingHeading = headings[lenis.scroll < previousScrollRef.current ? 0 : 1]
    const outgoingProgress = headings.find(trigger => trigger !== incomingHeading)?.animation?.totalProgress()
    if (wrapped && !hasLoopedRef.current) {
      hasLoopedRef.current = true
      headings[0]?.refresh()
    }
    ScrollTrigger.update()
    if (wrapped) {
      // Align map layers and carry the visible heading's trail across the wrap.
      ScrollTrigger.getAll().forEach(trigger => trigger.getTween()?.progress(1))
      incomingHeading?.getTween()?.resetTo('totalProgress', incomingHeading.progress, outgoingProgress)
    }
    previousScrollRef.current = lenis.scroll
  })

  useEffect(() => {
    if (themePathRef.current === pathname)
      return
    themePathRef.current = pathname
    setTheme(pathname.startsWith('/work/') ? 'dark' : 'light')
  }, [pathname, setTheme])

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [pathname])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    hasLoopedRef.current = false
    previousScrollRef.current = 0
  }, { dependencies: [pathname], revertOnUpdate: true })

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (reducedMotion)
      return

    document.querySelectorAll('.textBlur').forEach((el) => {
      const isHorizontal = el.classList.contains('textBlurHorizontal')

      if (isHorizontal)
        return

      const initialHero = el.closest('h1') && !el.closest('.home-loop')
      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      tl.to(el, {
        '--value': -75,
        'ease': 'none',
      })

      ScrollTrigger.create({
        trigger: el,
        animation: tl,
        start: () => initialHero && !hasLoopedRef.current ? 0 : 'center center',
        end: 'bottom top',
        invalidateOnRefresh: true,
        scrub: 1,
      })
    })
  }, { dependencies: [pathname, reducedMotion], revertOnUpdate: true })

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(true), 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <ReactLenis
      key={pathname}
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: !reducedMotion, infinite: pathname === '/' && homeLoop }}
    >
      <div className="overflow-hidden" data-page-content data-case-page={pathname.startsWith('/work/') || undefined}>
        {children}
      </div>
    </ReactLenis>
  )
}
