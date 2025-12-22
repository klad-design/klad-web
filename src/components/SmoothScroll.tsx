'use client'

import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)
  const pathname = usePathname()

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [pathname])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

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

      setTimeout(() => st.refresh(), 100)
    })
  }, { dependencies: [pathname] })

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => t.refresh())
  }, [pathname])

  return (
    <ReactLenis
      key={pathname}
      root
      ref={lenisRef}
      options={{ lerp: 0.1, duration: 1.5, infinite: pathname === '/' }}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </ReactLenis>
  )
}
