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

  useLenis((lenis) => {
    ScrollTrigger.update()
    if (lenis.options.infinite && Math.abs(lenis.scroll - previousScrollRef.current) > lenis.limit / 2) {
      // Match the repeated hero immediately when the infinite scroll wraps.
      ScrollTrigger.getAll().forEach(trigger => trigger.getTween()?.progress(1))
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

    if (pathname !== '/' || window.location.hash)
      return

    const restoration = window.history.scrollRestoration
    ScrollTrigger.clearScrollMemory('manual')
    window.scrollTo({ top: 0, behavior: 'instant' })

    return () => ScrollTrigger.clearScrollMemory(restoration)
  }, { dependencies: [pathname], revertOnUpdate: true })

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (reducedMotion)
      return

    document.querySelectorAll('.textBlur').forEach((el) => {
      const isHorizontal = el.classList.contains('textBlurHorizontal')

      if (isHorizontal)
        return

      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      tl.to(el, {
        '--value': -75,
        'ease': 'none',
      })

      ScrollTrigger.create({
        trigger: el,
        animation: tl,
        start: 'center center',
        end: 'bottom top',
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
      <div className="overflow-hidden">
        {children}
      </div>
    </ReactLenis>
  )
}
