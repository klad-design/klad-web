'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '@/components/useReducedMotion'

export function CaseVideo({ src, poster, className }: { src: string, poster: string, className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video)
      return

    video.pause()
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause()
        return
      }

      if (!video.getAttribute('src')) {
        video.poster = poster
        video.src = src
      }

      if (!reducedMotion) {
        video.play().catch((error: DOMException) => {
          if (error.name !== 'AbortError')
            setFailed(true)
        })
      }
    }, { rootMargin: '300px' })

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [src, poster, reducedMotion])

  return (
    <>
      <video ref={videoRef} className={className} controls={reducedMotion} loop muted playsInline preload="none" aria-label="Motion design showcase" onError={() => setFailed(true)} />
      {failed && <a className="p4 underline" href={src}>Open video</a>}
    </>
  )
}
