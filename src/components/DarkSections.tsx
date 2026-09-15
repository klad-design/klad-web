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
  const setThemeRef = useRef(setTheme)

  useEffect(() => {
    setThemeRef.current = setTheme
  }, [setTheme])

  useEffect(() => {
    if (ScrollTrigger.isTouch || reducedMotion) {
      sectionRef.current?.classList.add('max-h-0')

      ScrollTrigger.refresh()

      setThemeRef.current('light')

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
        setThemeRef.current(theme => theme === 'dark' ? 'light' : 'dark')
      },
    })

    return () => st.kill()
  }, [smoother, reducedMotion])

  return (
    <div ref={sectionRef} className="home-loop h-svh" aria-hidden inert>
      {children}
    </div>
  )
}
