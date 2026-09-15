'use client'

import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useReducedMotion } from '@/components/useReducedMotion'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
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

      const st = ScrollTrigger.create({
        trigger: el,
        animation: tl,
        start: 'center center',
        end: 'bottom top',
        scrub: 1,
      })

      gsap.delayedCall(0.1, () => st.refresh())
    })
  }, { dependencies: [pathname, reducedMotion], revertOnUpdate: true })

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <ReactLenis
      key={pathname}
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: !reducedMotion, infinite: pathname === '/' && !reducedMotion }}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </ReactLenis>
  )
}
