'use client'

import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '@/components/useReducedMotion'
import videos from '@/data/videos.json'

export function CaseVideo({ src, poster, className }: { src: string, poster: string, className: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const { high, standard } = videos[src as keyof typeof videos] || { high: src, standard: src }

  useEffect(() => {
    const video = videoRef.current
    if (!video)
      return

    let disposed = false
    let nearby = false

    function play() {
      if (!video || disposed || !nearby || reducedMotion)
        return
      const attemptedSrc = video.getAttribute('src')
      video.play().catch((error: DOMException) => {
        if (disposed || attemptedSrc !== video.getAttribute('src') || error.name === 'AbortError')
          return
        if (error.name === 'NotSupportedError')
          retryStandard()
        else
          setFailed(true)
      })
    }

    function retryStandard() {
      if (!video || disposed)
        return
      if (video.getAttribute('src') === standard) {
        setFailed(true)
        return
      }
      setFailed(false)
      video.src = standard
      play()
    }

    function onError() {
      if (video?.error && video.error.code !== MediaError.MEDIA_ERR_ABORTED)
        retryStandard()
    }

    video.pause()
    video.addEventListener('error', onError)
    const observer = new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting
      if (!nearby) {
        video.pause()
        return
      }

      if (![high, standard].includes(video.getAttribute('src') || '')) {
        setFailed(false)
        video.poster = poster
        video.src = window.matchMedia('(max-width: 1023px)').matches ? standard : high
      }

      play()
    }, { rootMargin: '300px' })

    observer.observe(video)
    return () => {
      disposed = true
      observer.disconnect()
      video.removeEventListener('error', onError)
      video.pause()
    }
  }, [high, standard, poster, reducedMotion])

  return (
    <>
      <video ref={videoRef} className={className} controls={reducedMotion} loop muted playsInline preload="none" aria-label="Motion design showcase" />
      {failed && <a className="p4 underline" href={standard}>Open video</a>}
    </>
  )
}
