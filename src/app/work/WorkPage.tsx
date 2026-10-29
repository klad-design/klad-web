'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'
import { useReducedMotion } from '@/components/useReducedMotion'

const cases = [
  {
    title: 'Datalane',
    info: ['GTM & Data', 'USA', '2025', '9 weeks, ongoing'],
    tags: ['Branding', 'Sound & motion', 'Web'],
    image: '/images/datalane/preview.avif',
    link: '/work/datalane',
    description: () => (
      <>
        <p>Datalane had technology for finding and organising local-business data, but no established brand or website. It needed to earn enterprise buyers’ trust and stand apart from Clay’s more playful approach.</p>
        <p>We built Datalane’s identity around a dot: a data point and a business on a map. In nine weeks, it became a brand and website.</p>
      </>
    ),
  },
  {
    title: 'Circus',
    info: ['Robotics', 'Germany', '2024', '6 weeks'],
    tags: ['Web design', '3D & Motion', 'Webflow'],
    image: '/images/circus/circus.avif',
    link: '/work/circus',
    description: () => (
      <>
        <p>After rebranding, Circus Group needed a full revamp of their website to match the new visual language of the company.</p>
        <p>We've completely redesigned the client’s existing website, adding a strong product focus with 3D visualisation of the robot and motion design.</p>
      </>
    ),
  },
  {
    title: 'Stars+Honey',
    info: ['Food & Beverage', 'United States', '2026', '20 weeks'],
    tags: ['Product 3D', 'Brand motion', 'Packaging'],
    image: '/images/stars-honey/s+h.avif',
    link: '/work/stars-honey',
    description: () => (
      <>
        <p>As a fast-growing brand with an active presence across social media, Stars+Honey needed a large volume of consistent, premium visuals to present the product in a refined and engaging way.</p>
        <p>We developed a complete 3D product line: wrapped bars, unwrapped formats and packaging. For every flavor, we created ingredient-specific explosion renders, designed to highlight the flavor profile while staying fully on-brand.</p>
      </>
    ),
  },
  {
    title: 'Linux Mint',
    info: ['Open-source software', 'Worldwide', '2024', '3 weeks'],
    tags: ['Brand identity', 'UI/UX', 'Brand motion'],
    image: '/images/linux-mint/linux-mint.avif',
    link: '/work/linux-mint',
    description: () => (
      <>
        <p>A visual redesign initiative for Linux Mint, aiming to modernize its identity and enhance consistency across platforms, proving that open-source software can be both user-friendly and beautifully designed by default.</p>
        <p>Our goal wasn’t to change what people love about Mint, but to give it the design foundation it currently lacks.</p>
      </>
    ),
  },
  {
    title: 'Shareio',
    info: ['Creator economy & Web3', 'United States', '2025', '9 weeks'],
    tags: ['Branding', '3D & Motion', 'UI/UX'],
    image: '/images/shareio/shareio.avif',
    link: '/work/shareio',
    description: () => (
      <>
        <p>Product launch with a strict two-month deadline. No visual assets, no copy and a wide range of use cases to cover. The brand had to feel authentic, creator-first and flexible enough to grow fast.</p>
        <p>We've created identity driven by parametrised motion. Expressive typography layered with 3D elements, shaped into a cohesive system across web and product.</p>
      </>
    ),
  },
  {
    title: 'Chainviz',
    info: ['Web3 & Blockchain', 'Turkey', '2022', '19 weeks'],
    tags: ['UI/UX', 'Brand identity', '3d'],
    image: '/images/chainviz/chainviz.avif',
    link: '/work/chainviz',
    description: () => (
      <>
        <p>W3F funded project to create a realtime WebGL Polkadot and Kusama validator ecosystem visualisation, including parachain views and validator explorer.</p>
        <p>We've created a brand concept suitable for a minimalistic data visualisation. Developed a 3D model to display the validator space. Assembled panel-based web app UI/UX.</p>
      </>
    ),
  },
]

function getCaseIndex(project: string | null | undefined) {
  return Math.max(0, cases.findIndex(({ link }) => link === `/work/${project}`))
}

export default function WorkPage({ initialCase }: { initialCase?: string }) {
  const containerRef = useRef<HTMLElement>(null)
  const cursorAreaRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<{ x: number, y: number, axis: 'x' | 'y' | null } | null>(null)
  const suppressClick = useRef(false)
  const wheel = useRef({ delta: 0, lastDelta: 0, lastEvent: -Infinity, lastStep: -Infinity, falling: 0, coasting: false, timer: 0 })
  const selection = useRef(getCaseIndex(initialCase))
  const current = useRef(getCaseIndex(initialCase))
  const transitioning = useRef(false)
  const transitionSource = useRef<'select' | 'swipe' | 'wheel' | 'key'>('select')
  const [activeIndex, setActiveIndex] = useState(() => getCaseIndex(initialCase))
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    function restoreSelection() {
      const project = new URLSearchParams(window.location.search).get('case')
      const index = getCaseIndex(project)
      gsap.killTweensOf('.case-anim-target')
      gsap.set('.case-anim-target', { opacity: 1 })
      clearTimeout(wheel.current.timer)
      wheel.current.delta = 0
      wheel.current.lastEvent = -Infinity
      wheel.current.lastStep = -Infinity
      transitioning.current = false
      selection.current = index
      current.current = index
      setActiveIndex(index)
    }

    restoreSelection()
    window.addEventListener('popstate', restoreSelection)
    return () => window.removeEventListener('popstate', restoreSelection)
  }, { scope: containerRef, dependencies: [initialCase], revertOnUpdate: true })

  // Warm posters so queued transitions don't wait on a new download.
  useEffect(() => {
    cases.forEach(({ image }) => {
      const img = new window.Image()
      img.src = image
    })
  }, [])

  useEffect(() => {
    const area = cursorAreaRef.current
    if (!area)
      return

    function onTouchMove(event: TouchEvent) {
      const start = swipeStart.current
      if (!start || event.touches.length !== 1) {
        swipeStart.current = null
        return
      }
      const x = Math.abs(event.touches[0].clientX - start.x)
      const y = Math.abs(event.touches[0].clientY - start.y)
      if (!start.axis && Math.max(x, y) >= 10)
        start.axis = x > y * 1.2 ? 'x' : 'y'
      if (start.axis === 'x') {
        suppressClick.current = true
        if (event.cancelable)
          event.preventDefault()
      }
    }

    // Lock horizontal swipes before Safari takes over for vertical scrolling.
    area.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => area.removeEventListener('touchmove', onTouchMove)
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (cursorRef.current && cursorAreaRef.current && !reducedMotion) {
        const area = cursorAreaRef.current
        const xTo = gsap.quickTo(cursorRef.current, 'x', { ease: 'power3' })
        const yTo = gsap.quickTo(cursorRef.current, 'y', { ease: 'power3' })

        function onMove(e: MouseEvent) {
          if (!cursorRef.current || !cursorAreaRef.current)
            return

          const cursorRect = cursorRef.current.getBoundingClientRect()
          const areaRect = cursorAreaRef.current.getBoundingClientRect()
          const relX = e.pageX - areaRect.left
          const relY = e.pageY - areaRect.top
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const x = relX - cursorRect.width / 2
          const y = relY - cursorRect.height / 2 - scrollTop

          gsap.to(cursorRef.current, { opacity: 1 })

          xTo(x)
          yTo(y)
        }

        function onLeave() {
          gsap.to(cursorRef.current, { opacity: 0 })
        }

        area.addEventListener('mousemove', onMove)
        area.addEventListener('mouseleave', onLeave)

        return () => {
          area.removeEventListener('mousemove', onMove)
          area.removeEventListener('mouseleave', onLeave)
        }
      }
    })
  }, { scope: containerRef, dependencies: [reducedMotion], revertOnUpdate: true })

  const { contextSafe } = useGSAP(() => {
    const fromGesture = transitionSource.current !== 'select'
    if (transitionSource.current === 'key') {
      menuRef.current?.querySelectorAll('button')[activeIndex]?.focus({ preventScroll: true })
    }
    gsap.fromTo('.case-anim-target', { opacity: 0 }, {
      opacity: 1,
      duration: reducedMotion ? 0 : fromGesture ? 0.12 : 0.5,
      ease: fromGesture ? 'power2.out' : 'power1.out',
      onComplete: () => {
        transitioning.current = false
        advance()
      },
    })
  }, { scope: containerRef, dependencies: [activeIndex, reducedMotion], revertOnUpdate: true })

  useGSAP(() => {
    const menu = menuRef.current
    if (menu && menu.scrollWidth > menu.clientWidth) {
      const button = menu.children[activeIndex].getBoundingClientRect()
      const bounds = menu.getBoundingClientRect()
      menu.scrollBy({
        left: Math.min(button.left - bounds.left - 10, 0) || Math.max(button.right - bounds.right + 10, 0),
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
    }
  }, { dependencies: [activeIndex, reducedMotion] })

  function advance() {
    if (transitioning.current || selection.current === current.current)
      return
    transitioning.current = true
    gsap.killTweensOf('.case-anim-target')
    gsap.to('.case-anim-target', {
      opacity: 0,
      duration: reducedMotion ? 0 : transitionSource.current === 'select' ? 0.1 : 0.08,
      ease: 'power1.in',
      onComplete: () => {
        const index = transitionSource.current === 'select'
          ? selection.current
          : current.current + Math.sign(selection.current - current.current)
        if (index === current.current) {
          gsap.to('.case-anim-target', {
            opacity: 1,
            duration: reducedMotion ? 0 : 0.12,
            onComplete: () => {
              transitioning.current = false
              advance()
            },
          })
          return
        }
        current.current = index
        const url = new URL(window.location.href)
        url.searchParams.set('case', cases[index].link.split('/').pop()!)
        window.history.replaceState(null, '', url)
        setActiveIndex(index)
      },
    })
  }

  const handleCaseChange = contextSafe((index: number, source: 'select' | 'swipe' | 'wheel' | 'key' = 'select') => {
    if (source !== 'wheel') {
      clearTimeout(wheel.current.timer)
      wheel.current.delta = 0
      wheel.current.lastEvent = -Infinity
      wheel.current.lastStep = -Infinity
    }
    index = Math.max(0, Math.min(cases.length - 1, index))
    if (index === selection.current)
      return

    selection.current = index
    transitionSource.current = source
    advance()
  })

  const requestCase = useEffectEvent(handleCaseChange)

  useEffect(() => {
    const main = containerRef.current
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')

    function onKeyDown(event: KeyboardEvent) {
      if (!desktop.matches || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
        || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
        || (event.target instanceof HTMLElement && event.target.closest('header, input, textarea, select, [contenteditable], [role="dialog"]'))) {
        return
      }
      event.preventDefault()
      if (!event.repeat) {
        const index = selection.current + (event.key === 'ArrowDown' ? 1 : -1)
        requestCase(index, 'key')
      }
    }

    function flushWheel() {
      const gesture = wheel.current
      clearTimeout(gesture.timer)
      if (!desktop.matches) {
        gesture.delta = 0
        return
      }
      if (gesture.coasting || Math.abs(gesture.delta) < 60)
        return
      if (gesture.falling > 0 && performance.now() - gesture.lastEvent > 80) {
        gesture.coasting = true
        gesture.delta = 0
        return
      }
      const wait = 200 - (performance.now() - gesture.lastStep)
      if (wait > 0) {
        gesture.timer = window.setTimeout(flushWheel, Math.ceil(wait))
        return
      }
      const direction = Math.sign(gesture.delta)
      const index = Math.max(0, Math.min(cases.length - 1, selection.current + direction))
      if (index === selection.current) {
        gesture.delta = 0
        return
      }
      requestCase(index, 'wheel')
      gesture.delta -= direction * 60
      gesture.lastStep = performance.now()
      if (Math.abs(gesture.delta) >= 60)
        gesture.timer = window.setTimeout(flushWheel, 200)
    }

    function onWheel(event: WheelEvent) {
      if (!desktop.matches || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const movement = horizontal ? event.deltaX : event.deltaY
      if (!movement)
        return
      const now = performance.now()
      const gesture = wheel.current
      const delta = movement * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)
      const magnitude = Math.abs(delta)
      const idle = now - gesture.lastEvent
      const reversed = Math.sign(delta) !== Math.sign(gesture.lastDelta)
      const tick = event.deltaMode !== 0 || (magnitude >= 60 && (idle > 160 || magnitude >= Math.abs(gesture.lastDelta)))
      if (idle > 160 || reversed) {
        gesture.falling = 0
        gesture.coasting = false
        if (reversed) {
          gesture.delta = 0
          gesture.lastStep = -Infinity
        }
      }
      else if (magnitude < Math.abs(gesture.lastDelta) - 0.5) {
        gesture.falling++
        if (gesture.falling >= 3)
          gesture.coasting = true
      }
      else if (magnitude > Math.abs(gesture.lastDelta) + 0.5) {
        gesture.falling = 0
        gesture.coasting = false
      }
      gesture.lastEvent = now
      gesture.lastDelta = delta
      const bottom = document.documentElement.scrollHeight - window.innerHeight
      if (!horizontal && ((delta > 0 && window.scrollY < bottom - 2) || (delta < 0 && window.scrollY > 2))) {
        gesture.delta = 0
        clearTimeout(gesture.timer)
        return
      }
      event.preventDefault()
      event.stopPropagation()
      if (tick) {
        clearTimeout(gesture.timer)
        gesture.delta = 0
        gesture.falling = 0
        gesture.coasting = false
        gesture.lastStep = now
        requestCase(selection.current + Math.sign(delta), 'wheel')
        return
      }
      // shortcut: WheelEvent has no momentum phase, replace three-sample decay detection when native phases are available.
      if (gesture.coasting) {
        clearTimeout(gesture.timer)
        gesture.delta = 0
        return
      }
      gesture.delta += delta
      flushWheel()
    }

    window.addEventListener('keydown', onKeyDown)
    main?.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      main?.removeEventListener('wheel', onWheel, { capture: true })
      clearTimeout(wheel.current.timer)
    }
  }, [])

  return (
    <main ref={containerRef} className="pt-[97px] pb-2.5 md:pt-[150px] lg:pt-0 lg:min-h-svh">
      <div className="grid-container lg:min-h-[calc(100svh-10px)] lg:grid-rows-[auto_1fr_1fr]">
        {/* Menu */}
        <div className="col-span-full md:col-span-1 md:row-start-2 md:row-end-4 lg:row-end-3">
          <div
            ref={menuRef}
            className="overflow-x-auto overflow-y-hidden scroll-px-2.5 py-1 -my-1 md:overflow-visible md:py-0 md:my-0 flex gap-4 -mx-2.5 px-2.5 md:mx-0 md:px-0 md:items-start md:gap-[3px] md:flex-col md:sticky md:top-[100px] lg:top-2.5"
          >
            {cases.map(({ title }, index) => (
              <Button
                key={title}
                label={title}
                isActive={activeIndex === index}
                aria-pressed={activeIndex === index}
                className="shrink-0"
                onClick={() => handleCaseChange(index)}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="case-anim-target @container mb-2.5 md:mb-6 col-span-full mt-9 md:mt-0 md:col-start-2 md:col-end-5">
          <h1 className="text-[14cqw] md:text-[min(100px,14cqw)] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
            <TextBlur isBold>{cases[activeIndex].title}</TextBlur>
          </h1>
        </div>

        {/* Media */}
        <div
          ref={cursorAreaRef}
          className="case-anim-target bg-black/10 dark:bg-white/10 col-span-full aspect-[355/295] grayscale relative md:col-start-2 md:col-end-5 mb-7 md:mb-5 lg:row-end-4 lg:row-start-2 lg:mb-0 lg:aspect-auto xl:mr-[130px]"
        >
          <Link
            className="absolute inset-0 touch-pan-y touch-pinch-zoom select-none [-webkit-touch-callout:none]"
            href={cases[activeIndex].link}
            aria-label={`View ${cases[activeIndex].title} case study`}
            onPointerDown={(event) => {
              if (event.pointerType === 'mouse')
                suppressClick.current = false
            }}
            onTouchStart={(event) => {
              suppressClick.current = false
              const touch = event.touches[0]
              swipeStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY, axis: null } : null
            }}
            onTouchCancel={() => { swipeStart.current = null }}
            onTouchEnd={(event) => {
              const start = swipeStart.current
              swipeStart.current = null
              if (!start || start.axis !== 'x' || event.touches.length)
                return
              event.preventDefault()
              const x = event.changedTouches[0].clientX - start.x
              const threshold = Math.min(110, Math.max(75, event.currentTarget.clientWidth * 0.25))
              if (Math.abs(x) >= threshold)
                handleCaseChange(selection.current + (x < 0 ? 1 : -1), 'swipe')
            }}
            onClick={(event) => {
              if (suppressClick.current && event.detail !== 0)
                event.preventDefault()
              suppressClick.current = false
            }}
          >
            <Image
              data-case-cover
              className="size-full object-cover"
              src={cases[activeIndex].image}
              alt={`${cases[activeIndex].title} poster`}
              fill
              unoptimized
              draggable={false}
            />
          </Link>

          <div
            ref={cursorRef}
            className="text-white blur-regular mix-blend-difference text-p2-2xl uppercase absolute pointer-events-none opacity-0 hidden lg:block"
          >
            View case
          </div>
        </div>

        {/* Description */}
        <div className="case-anim-target col-span-full md:col-start-2 md:col-end-3 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:flex lg:flex-col lg:justify-end">
          <div className="p4 blur-regular uppercase">
            {cases[activeIndex].info.map(tag => <div key={tag}>{tag}</div>)}
          </div>
          <div className="p4 blur-regular uppercase flex flex-wrap gap-2.5 mt-4 md:mt-3">
            {cases[activeIndex].tags.map(tag => <span key={tag}>{tag}</span>)}
          </div>
          <div className="p5 flex flex-col gap-4 mt-[30px] md:gap-2 md:mt-4">
            {cases[activeIndex].description()}
          </div>
        </div>

        {/* Link */}
        <div className="col-span-full mt-8 md:mt-0 md:col-start-4 md:col-end-5 lg:hidden">
          <Button as="a" href={cases[activeIndex].link} label="View case" />
        </div>
      </div>
    </main>
  )
}
