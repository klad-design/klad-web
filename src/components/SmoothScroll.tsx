'use client'

import type { ReactNode, RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'
import { createContext, useRef } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export const ScrollContext = createContext<RefObject<HTMLDivElement | null> | undefined>(undefined)

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const smoother = useRef<ScrollSmoother | null>(null)
  const pathname = usePathname()

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

    smoother.current = ScrollSmoother.create({
      smooth: 1,
    })
  }, {
    dependencies: [pathname],
    revertOnUpdate: true,
  })

  return (
    <ScrollContext.Provider value={pageRef}>
      <div id="smooth-wrapper" className="overflow-hidden">
        <div id="smooth-content">
          <div id="page" className="will-change-transform" ref={pageRef}>{children}</div>
        </div>
      </div>
    </ScrollContext.Provider>
  )
}
