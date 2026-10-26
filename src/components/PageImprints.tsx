'use client'

import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { captureImprint } from '@/components/captureImprint'
import { useReducedMotion } from '@/components/useReducedMotion'

const storageKey = 'klad-page-imprints-v3'

export function PageImprints() {
  const pathname = usePathname()
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasesRef = useRef<HTMLCanvasElement[]>([])
  const pendingRef = useRef<ReturnType<typeof captureImprint> | null>(null)
  const mergeRef = useRef(Promise.resolve())
  const pathRef = useRef(pathname)
  const reducedMotion = useReducedMotion()

  useLenis((lenis) => {
    if (pathname !== '/' || !lenis.options.infinite || window.location.hash)
      return
    const loop = document.querySelector<HTMLElement>('.home-loop')
    if (loop && layerRef.current) {
      // Carry the same imprint through both copies of the looping hero.
      const top = lenis.scroll > lenis.limit / 2 ? loop.getBoundingClientRect().top + window.scrollY : 0
      layerRef.current.style.top = `${top}px`
    }
  })

  useEffect(() => {
    let cancelled = false
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey) || '[]')
      if (Array.isArray(saved)) {
        mergeRef.current = Promise.all(saved.slice(0, 2).map(async (src, index) => {
          if (typeof src !== 'string' || !src.startsWith('data:image/png;base64,'))
            return
          const image = new Image()
          image.src = src
          try {
            await image.decode()
            if (cancelled)
              return
            const canvas = canvasesRef.current[index]
            canvas.width = image.width
            canvas.height = image.height
            canvas.getContext('2d')?.drawImage(image, 0, 0)
          }
          catch {
            // A damaged stored image must not interrupt navigation.
          }
        })).then(() => {})
      }
    }
    catch {
      // Storage can be disabled; the effect still works for client navigations.
    }

    function capture() {
      const root = document.querySelector<HTMLElement>('[data-page-content]')
      if (root)
        pendingRef.current = captureImprint(root).catch(() => null)
    }

    function onClick(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.download || (link.target && link.target !== '_self'))
        return
      const url = new URL(link.href)
      if (url.origin === location.origin && url.pathname !== pathRef.current)
        capture()
    }

    function onPopState() {
      if (location.pathname !== pathRef.current)
        capture()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    return () => {
      cancelled = true
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion)
      canvasesRef.current.forEach(canvas => canvas.getAnimations().forEach(animation => animation.cancel()))
  }, [reducedMotion])

  useLayoutEffect(() => {
    const [canvas, older] = canvasesRef.current
    const pending = pendingRef.current
    if (pathRef.current !== pathname && pending) {
      // Keep navigation order when SVG decoding finishes after a later capture.
      mergeRef.current = mergeRef.current.then(async () => {
        const snapshot = await pending
        if (!snapshot || !canvas.isConnected)
          return
        canvasesRef.current.forEach(canvas => canvas.getAnimations().forEach(animation => animation.cancel()))
        // Keep only two previous pages, without baking their opacity into the ink.
        older.width = canvas.width
        older.height = canvas.height
        if (canvas.width && canvas.height)
          older.getContext('2d')?.drawImage(canvas, 0, 0)
        canvas.width = snapshot.width
        canvas.height = snapshot.height
        const context = canvas.getContext('2d')
        if (context) {
          context.drawImage(snapshot, 0, 0)
          try {
            sessionStorage.setItem(storageKey, JSON.stringify(canvasesRef.current.filter(canvas => canvas.width).map(canvas => canvas.toDataURL())))
          }
          catch {
            // A full or unavailable store must never interrupt navigation.
          }
          if (pathRef.current === pathname && !pathname.startsWith('/work/') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.animate([
              { opacity: 1, filter: 'blur(0px)' },
              { opacity: 0.5, filter: 'blur(4px)' },
            ], { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
            if (older.width)
              older.animate([{ opacity: 0.5 }, { opacity: 0.3 }], { duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
          }
        }
      })
    }
    pathRef.current = pathname
    pendingRef.current = null

    const frame = requestAnimationFrame(() => {
      layerRef.current!.style.top = `${window.scrollY}px`
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <div ref={layerRef} className="page-imprints" data-work={pathname === '/work' || undefined} hidden={pathname.startsWith('/work/')} aria-hidden="true" inert>
      {[0, 1].map(index => (
        <canvas
          key={index}
          ref={(canvas) => {
            if (canvas)
              canvasesRef.current[index] = canvas
          }}
          width={0}
          height={0}
        />
      ))}
    </div>
  )
}
