'use client'

import { useLayoutEffect, useRef } from 'react'

export function PageNoise() {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const noise = ref.current!
    function position() {
      // Keep the original document-anchored tile phase on a viewport-sized surface.
      noise.style.backgroundPositionY = `${-(window.scrollY % 150)}px`
    }
    position()
    noise.dataset.active = ''
    window.addEventListener('scroll', position, { passive: true })
    return () => window.removeEventListener('scroll', position)
  }, [])
  return <div ref={ref} data-page-noise aria-hidden="true" inert />
}
