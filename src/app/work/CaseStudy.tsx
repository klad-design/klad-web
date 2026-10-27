'use client'

import type { ReactNode } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { useReducedMotion } from '@/components/useReducedMotion'

export function CaseStudy({ slug, closeHref, children }: { slug: string, closeHref: string, children: ReactNode }) {
  const contentRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLDivElement>(null)
  const [footerVisible, setFooterVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const footer = contentRef.current?.querySelector('footer')
    if (!footer)
      return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && closeRef.current?.contains(document.activeElement))
        footer.querySelector<HTMLAnchorElement>('a[aria-label="Close"]')?.focus({ preventScroll: true })
      setFooterVisible(entry.isIntersecting)
    })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [slug])

  useGSAP((context) => {
    if (reducedMotion)
      return
    gsap.registerPlugin(ScrollTrigger)
    // Let the router restore scroll before once-only reveals measure the new case.
    const frame = requestAnimationFrame(() => context.add(() => {
      contentRef.current?.querySelectorAll<HTMLElement>('[data-case-reveal]').forEach((section) => {
        const targets = section.querySelectorAll('img, video').length
          ? section.querySelectorAll('img, video')
          : section.firstElementChild
        gsap.fromTo(targets, { opacity: 0.4, filter: 'blur(6px)' }, {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            end: 'clamp(top 65%)',
            scrub: true,
            once: true,
          },
        })
      })
    }))
    return () => cancelAnimationFrame(frame)
  }, { scope: contentRef, dependencies: [slug, reducedMotion], revertOnUpdate: true })

  return (
    <>
      <div ref={closeRef} className="case-close" hidden={footerVisible}>
        <Button as="a" href={closeHref} label="Close" />
      </div>
      <main ref={contentRef} className="case-study pb-10">
        {children}
      </main>
    </>
  )
}
