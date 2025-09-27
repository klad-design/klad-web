'use client'

import type { LenisRef } from 'lenis/react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
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

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, duration: 1.5, infinite: true }}>
      <div className="overflow-hidden">
        {children}
      </div>
    </ReactLenis>
  )
}
