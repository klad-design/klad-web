'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import world from '../../public/images/world.svg'

const layers = [
  'absolute blur-[3px] opacity-20 transform-gpu ease-linear max-w-[140svw] md:max-w-[133svw] lg:max-w-full will-change-transform translate-y-[calc(var(--value)_*_1.5_*_1px)]',
  'absolute blur-[3px] opacity-40 transform-gpu ease-linear max-w-[140svw] md:max-w-[133svw] lg:max-w-full will-change-transform translate-y-[calc(var(--value)_*_1_*_1px)]',
  'absolute blur-[3px] opacity-80 transform-gpu ease-linear max-w-[140svw] md:max-w-[133svw] lg:max-w-full will-change-transform translate-y-[calc(var(--value)_*_0.5_*_1px)]',
  'relative max-w-[140svw] md:max-w-[133svw] lg:max-w-full will-change-transform',
]

export function WorldMap({ eager = false }: { eager?: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [src, setSrc] = useState(world.src)

  useEffect(() => {
    const image = imageRef.current!
    const source = new window.Image()
    source.src = world.src
    let width = 0
    let generation = 0
    let url = ''
    let idle = 0
    let timer = 0
    let disposed = false

    function prepare() {
      const nextWidth = Math.round(image.getBoundingClientRect().width * window.devicePixelRatio)
      if (!nextWidth || nextWidth === width)
        return
      width = nextWidth
      const current = ++generation
      if (idle)
        window.cancelIdleCallback(idle)
      clearTimeout(timer)
      setSrc(world.src)
      async function rasterize() {
        try {
          await source.decode()
          if (disposed || current !== generation)
            return
          const canvas = document.createElement('canvas')
          canvas.width = nextWidth
          canvas.height = Math.round(nextWidth * 928 / 1410)
          const context = canvas.getContext('2d')
          if (!context)
            return
          // Cache the browser's SVG ink at the current pixel density before theme filters repaint it.
          context.drawImage(source, 0, 0, canvas.width, canvas.height)
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve))
          if (!blob || disposed || current !== generation)
            return
          const next = URL.createObjectURL(blob)
          const decoded = new window.Image()
          decoded.src = next
          try {
            await decoded.decode()
            if (disposed || current !== generation)
              return
            if (url)
              URL.revokeObjectURL(url)
            url = next
            setSrc(next)
          }
          finally {
            if (url !== next)
              URL.revokeObjectURL(next)
          }
        }
        catch {
          // Keep the original vector on decoding or canvas failures.
        }
      }
      if (typeof window.requestIdleCallback === 'function')
        idle = window.requestIdleCallback(() => void rasterize(), { timeout: 1000 })
      else
        timer = window.setTimeout(() => void rasterize(), 200)
    }

    const observer = new ResizeObserver(prepare)
    observer.observe(image)
    let density = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    function changeDensity() {
      density.removeEventListener('change', changeDensity)
      density = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      density.addEventListener('change', changeDensity)
      prepare()
    }
    density.addEventListener('change', changeDensity)
    window.addEventListener('resize', prepare)
    prepare()
    return () => {
      disposed = true
      observer.disconnect()
      density.removeEventListener('change', changeDensity)
      window.removeEventListener('resize', prepare)
      if (idle)
        window.cancelIdleCallback(idle)
      clearTimeout(timer)
      source.src = ''
      if (url)
        URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <div data-world-map data-map-raster={src !== world.src || undefined} className="textBlur relative transform-gpu will-change-[filter] invert-0 dark:invert flex justify-center -mx-2.5 lg:mx-0 mt-[30px] md:mt-10 lg:mt-3 col-span-4">
      {layers.map((className, index) => (
        <Image
          key={index}
          ref={index === 3 ? imageRef : undefined}
          className={className}
          src={src}
          alt="World map"
          width={1410}
          height={928}
          sizes="(min-width: 1024px) 90vw, (min-width: 768px) 133vw, 140vw"
          style={{ aspectRatio: '1410 / 928' }}
          unoptimized
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager && index === 0 ? 'high' : undefined}
          aria-hidden={index < 3 || undefined}
        />
      ))}
    </div>
  )
}
