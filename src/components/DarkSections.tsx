'use client'

import type { ReactNode } from 'react'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import { useReducedMotion } from '@/components/useReducedMotion'

interface SectionProps {
  children: ReactNode
}

export function DarkSections({ children }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { setTheme } = useTheme()
  const smoother = useLenis()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (ScrollTrigger.isTouch || reducedMotion) {
      sectionRef.current?.classList.add('max-h-0')

      ScrollTrigger.refresh()

      setTheme('light')

      return
    }

    sectionRef.current?.classList.remove('max-h-0')

    if (!smoother)
      return

    const st = ScrollTrigger.create({
      id: 'darkSections',
      trigger: sectionRef.current,
      start: `top center`,
      end: 'bottom center',
      onEnter: () => {
        const theme = localStorage.getItem('theme')

        if (theme === 'dark') {
          setTheme('light')
        }
        else {
          setTheme('dark')
        }
      },
    })

    const timer = setTimeout(() => {
      st.refresh()
    }, 1000)

    return () => {
      st.kill()
      clearTimeout(timer)
    }
  }, [smoother, reducedMotion, setTheme])

  return (
    <div ref={sectionRef} className="home-loop h-svh overflow-hidden" aria-hidden inert>
      {children}
    </div>
  )
}
