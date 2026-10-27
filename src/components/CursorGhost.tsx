'use client'

import { useEffect, useRef } from 'react'

const count = 7
const follow = 0.28

export function CursorGhost() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current!
    const ghosts = Array.from(root.children) as SVGElement[]
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let points: { x: number, y: number }[] | null = null
    let x = 0
    let y = 0
    let frame = 0
    let previousTime = 0

    function hide() {
      cancelAnimationFrame(frame)
      frame = 0
      points = null
      root.hidden = true
    }

    function animate(time: number) {
      if (!points)
        return

      const elapsed = Math.max(0, Math.min(3, (time - previousTime) / (1000 / 60)))
      previousTime = time
      let moving = false

      points.forEach((point, index) => {
        const target = index === 0 ? { x, y } : points![index - 1]
        const ease = 1 - (1 - follow * (index === 0 ? 1.6 : 1)) ** elapsed
        point.x += (target.x - point.x) * ease
        point.y += (target.y - point.y) * ease

        const distance = Math.hypot(x - point.x, y - point.y)
        ghosts[index].style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`
        ghosts[index].style.opacity = String((0.85 * (1 - index / (count - 1)) + 0.12) * Math.min(1, distance / 13))
        moving ||= distance > 0.1
      })

      if (moving) {
        frame = requestAnimationFrame(animate)
      }
      else {
        frame = 0
        root.hidden = true
      }
    }

    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== 'mouse') {
        hide()
        return
      }

      x = event.clientX
      y = event.clientY
      points ??= Array.from({ length: count }, () => ({ x, y }))
      root.hidden = false
      if (!frame) {
        previousTime = performance.now()
        frame = requestAnimationFrame(animate)
      }
    }

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', hide)
    document.addEventListener('visibilitychange', hide)
    media.addEventListener('change', hide)
    return () => {
      hide()
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', hide)
      document.removeEventListener('visibilitychange', hide)
      media.removeEventListener('change', hide)
    }
  }, [])

  return (
    <div ref={rootRef} className="pointer-events-none fixed left-0 top-0 z-50" data-cursor-ghost aria-hidden="true" hidden>
      {Array.from({ length: count }, (_, index) => (
        <svg
          key={index}
          className="absolute left-0 top-0 overflow-visible opacity-0 will-change-transform"
          width="26"
          height="26"
          viewBox="0 0 32 32"
          style={{ filter: `blur(${5 * index / (count - 1)}px)` }}
        >
          <path d="M6 3 L6 25 L11.5 19.5 L15 27 L18 25.6 L14.6 18.4 L22 18 Z" fill="#fff" />
        </svg>
      ))}
    </div>
  )
}
