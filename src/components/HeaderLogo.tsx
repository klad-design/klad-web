'use client'

import { useLenis } from 'lenis/react'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useReducedMotion } from '@/components/useReducedMotion'

export function HeaderLogo({ mode, className = '', hidden = false }: { mode: 'scroll' | 'autoplay' | 'static', className?: string, hidden?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null)
  const [markup, setMarkup] = useState('')
  const visualRef = useRef<HTMLSpanElement>(null)
  const artworkRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const timeRef = useRef(-1)
  const reducedMotion = useReducedMotion()
  const active = mode !== 'static' && !reducedMotion

  function seek(time: number) {
    if (svgRef.current && timeRef.current !== time) {
      svgRef.current.setCurrentTime(time)
      timeRef.current = time
    }
  }

  const smoother = useLenis((lenis) => {
    if (mode === 'scroll' && active && !hidden)
      seek(lenis.limit > 0 ? Math.max(0, Math.min(1, lenis.progress)) * 2 : 0)
  }, [mode, active, hidden])

  useEffect(() => {
    if (!active || markup)
      return
    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch('/images/logo-scroll-motion.svg', { signal: controller.signal })
        if (!response.ok)
          return
        const document = new DOMParser().parseFromString(await response.text(), 'image/svg+xml')
        const svg = document.documentElement
        if (document.querySelector('parsererror') || svg.localName !== 'svg' || svg.namespaceURI !== 'http://www.w3.org/2000/svg' || !svg.querySelector('#logo-outline') || !svg.querySelector('#logo-body') || !svg.querySelector('#logo-word-face') || !svg.querySelector('animate'))
          return
        svg.setAttribute('viewBox', '106 180 748 600')
        svg.setAttribute('width', '100%')
        svg.setAttribute('height', '100%')
        svg.setAttribute('style', 'display:block;overflow:hidden')
        // React selects the reduced-motion artwork; SVG styles must not leak into the page.
        svg.querySelector('style')?.remove()
        svg.querySelector('.still')?.remove()
        // Inline WebKit caches animated <use> outlines; paint and clip the actual paths.
        const outline = svg.querySelector('#logo-outline')!
        svg.querySelectorAll('use[href="#logo-outline"]').forEach((use) => {
          const path = outline.cloneNode(true) as Element
          path.removeAttribute('id')
          for (const attribute of use.attributes) {
            if (attribute.name !== 'href')
              path.setAttribute(attribute.name, attribute.value)
          }
          use.replaceWith(path)
        })
        if (!controller.signal.aborted)
          // Calibrate the ink directly; an outer SVG color filter can paint a seam in Firefox.
          setMarkup(new XMLSerializer().serializeToString(svg).replaceAll('#E6E6E6', '#E7E7E7').replaceAll('#010101', '#000000'))
      }
      catch {
        // Keep the independently rendered static logo on network or decoding failures.
      }
    }
    void load()
    return () => controller.abort()
  }, [active, markup])

  useLayoutEffect(() => {
    const visual = visualRef.current
    if (!anchor || !visual)
      return
    const imprints = document.querySelector<HTMLElement>('.page-imprints')
    let previous: DOMRect | undefined
    function position() {
      const bounds = anchor!.getBoundingClientRect()
      const { left, top, width, height } = bounds
      if (!hidden && imprints) {
        imprints.style.setProperty('--header-logo-x', `${left + width / 2}px`)
        imprints.style.setProperty('--header-logo-y', `${top + height / 2 + window.scrollY}px`)
        imprints.style.setProperty('--header-logo-radius', `${width * 0.55}px`)
      }
      if (previous && left === previous.left && top === previous.top && width === previous.width && height === previous.height)
        return
      previous = bounds
      Object.assign(visual!.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` })
    }
    position()
    const observer = new ResizeObserver(position)
    observer.observe(anchor)
    const header = anchor.closest('.site-header')
    if (header)
      observer.observe(header)
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [anchor, hidden])

  useLayoutEffect(() => {
    const svg = artworkRef.current?.querySelector('svg')
    if (!svg || !active)
      return
    svgRef.current = svg
    timeRef.current = -1
    svg.pauseAnimations()
    seek(0)
    let frame = 0
    let timer = 0
    function syncScroll() {
      if (mode === 'scroll') {
        smoother?.resize()
        const limit = document.documentElement.scrollHeight - window.innerHeight
        seek(limit > 0 ? Math.max(0, Math.min(1, window.scrollY / limit)) * 2 : 0)
      }
    }
    function play() {
      const start = performance.now()
      function tick(now: number) {
        const time = (now - start) / 1000
        if (time >= 2) {
          // Land on the identical first frame; native freeze can stop short in WebKit.
          seek(0)
          timer = window.setTimeout(play, 10000)
        }
        else {
          seek(time)
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    function visibility() {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      if (mode === 'autoplay') {
        seek(0)
        if (!document.hidden && !hidden)
          play()
      }
      else {
        syncScroll()
      }
    }
    const observer = new ResizeObserver(syncScroll)
    observer.observe(document.documentElement)
    window.addEventListener('resize', syncScroll)
    document.addEventListener('visibilitychange', visibility)
    visibility()
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', syncScroll)
      document.removeEventListener('visibilitychange', visibility)
      svgRef.current = null
    }
  }, [markup, active, mode, hidden, smoother])

  return (
    <span ref={setAnchor} className={`header-logo-slot block size-[60px] md:size-[70px] lg:size-[80px] ${className}`}>
      {anchor && createPortal(
        <span
          ref={visualRef}
          data-header-logo
          data-logo-mode={mode}
          data-animated={(active && !!markup) || undefined}
          aria-hidden="true"
          className={`mix-blend-difference pointer-events-none fixed left-0 top-0 z-40 ${hidden ? 'invisible' : ''}`}
        >
          <Image className={`absolute inset-0 block size-full [filter:url(#brand-inversion)] ${active && markup ? 'invisible' : ''}`} src="/images/logo-still.svg" alt="" width={60} height={60} loading="eager" />
          {active && markup && <span ref={artworkRef} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: markup }} />}
        </span>,
        anchor.ownerDocument.body,
      )}
    </span>
  )
}
