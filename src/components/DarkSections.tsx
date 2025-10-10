'use client'

import type { ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'

interface SectionProps {
  children: ReactNode
}

export function DarkSections({ children }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      sectionRef.current?.remove()
      setTheme('light')
      return
    }

    const st = ScrollTrigger.create({
      id: 'darkSections',
      trigger: sectionRef.current,
      start: `top center`,
      end: () => `+=${sectionRef.current?.clientHeight || 0 / 2}px center`,
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
  }, [])

  return (
    <div ref={sectionRef} className="h-svh">
      {children}
    </div>
  )
}
