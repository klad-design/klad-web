'use client'

import type { ReactNode } from 'react'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

import { useHomeLoop } from '@/components/useHomeLoop'

interface SectionProps {
  children: ReactNode
}

export function DarkSections({ children }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { setTheme } = useTheme()
  const smoother = useLenis()
  const homeLoop = useHomeLoop()
  const setThemeRef = useRef(setTheme)

  useEffect(() => {
    setThemeRef.current = setTheme
  }, [setTheme])

  useEffect(() => {
    if (!homeLoop) {
      ScrollTrigger.refresh()

      setThemeRef.current('light')

      return
    }

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
  }, [smoother, homeLoop])

  return (
    <div ref={sectionRef} className={homeLoop ? 'home-loop h-svh' : 'home-loop hidden'} aria-hidden inert>
      {children}
    </div>
  )
}
