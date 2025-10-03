'use client'

import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])

  useGSAP(() => {
    gsap.registerPlugin(Observer)

    const scrollY = { value: 0, isDown: true }

    const animateBlurText = gsap.quickTo('.textBlur', '--value', {
      duration: 0.1,
      ease: 'none',
    })

    Observer.create({
      target: window,
      type: 'wheel,scroll,touch',
      onChangeY: (self) => {
        if (scrollY.isDown && self.deltaY < 0) {
          scrollY.isDown = false
        }
        else if (!scrollY.isDown && self.deltaY > 0) {
          scrollY.isDown = true
        }

        scrollY.value = gsap.utils.clamp(0, 80, scrollY.isDown ? scrollY.value + 0.5 : scrollY.value - 0.5)

        animateBlurText(scrollY.value * -1)
      },
    })
  })

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, duration: 1.5, infinite: true }}>
      <div className="overflow-hidden">
        {children}
      </div>
    </ReactLenis>
  )
}
