'use client'

import { useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { captureImprint } from '@/components/captureImprint'

const storageKey = 'klad-page-imprints-v2'

export function PageImprints() {
  const pathname = usePathname()
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pendingRef = useRef<ReturnType<typeof captureImprint> | null>(null)
  const mergeRef = useRef(Promise.resolve())
  const pathRef = useRef(pathname)

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
    const canvas = canvasRef.current!
    let cancelled = false
    let saved: string | null = null
    try {
      saved = sessionStorage.getItem(storageKey)
    }
    catch {
      // Storage can be disabled; the effect still works for client navigations.
    }
    if (saved) {
      const image = new Image()
      image.onload = () => {
        if (cancelled || canvas.width !== 0)
          return
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext('2d')?.drawImage(image, 0, 0)
      }
      image.src = saved
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

  useLayoutEffect(() => {
    const canvas = canvasRef.current!
    const pending = pendingRef.current
    if (pathRef.current !== pathname && pending) {
      // Keep navigation order when SVG decoding finishes after a later capture.
      mergeRef.current = mergeRef.current.then(async () => {
        const snapshot = await pending
        if (!snapshot || !canvas.isConnected)
          return
        // Flatten the entire path into one bitmap so long sessions never grow the DOM.
        const history = document.createElement('canvas')
        history.width = canvas.width
        history.height = canvas.height
        if (canvas.width && canvas.height)
          history.getContext('2d')?.drawImage(canvas, 0, 0)
        canvas.width = snapshot.width
        canvas.height = snapshot.height
        const context = canvas.getContext('2d')
        if (context) {
          context.globalAlpha = 0.82
          if (history.width && history.height)
            context.drawImage(history, 0, 0, canvas.width, canvas.height)
          context.globalAlpha = 0.85
          context.drawImage(snapshot, 0, 0)
          try {
            sessionStorage.setItem(storageKey, canvas.toDataURL())
          }
          catch {
            // A full or unavailable store must never interrupt navigation.
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
    <div ref={layerRef} className="page-imprints" aria-hidden="true" inert>
      <canvas ref={canvasRef} width={0} height={0} />
    </div>
  )
}
