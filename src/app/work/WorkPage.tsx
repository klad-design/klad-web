'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

const cases = [
  {
    title: 'Stars+Honey',
    info: ['Food & Beverage', 'United States', '2026', '12 weeks, ongoing'],
    tags: ['Product 3D', 'Brand motion', 'Packaging'],
    image: '/images/case.png',
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
    info: ['Open Source Software', 'United States', '2024', '3 weeks'],
    tags: ['Branding', 'UI/UX', 'Brand motion'],
    image: '/images/case.png',
    link: '/work/linux-mint',
    description: () => (
      <>
        <p>A visual redesign initiative for Linux Mint, aiming to modernize its identity and enhance consistency across platforms, proving that open-source software can be both user-friendly and beautifully designed by default.</p>
        <p>Our goal wasn’t to change what people love about Mint, but to give it the design foundation it needs and deserves.</p>
      </>
    ),
  },
  {
    title: 'Shareio',
    info: ['Web3 & Blockchain', 'United States', '2025', '9 weeks'],
    tags: ['Branding', 'Web, UI/UX', 'Brand motion'],
    image: '/images/case.png',
    link: '/work/shareio',
    description: () => (
      <>
        <p>Product launch with a strict two-month deadline. The brand had to feel authentic, creator-first and flexible enough to grow fast.</p>
        <p>We've created dentity driven by parametrised motion. Expressive typography layered with 3D elements, shaped into a cohesive system across web and product.</p>
      </>
    ),
  },
  {
    title: 'Chainviz',
    info: ['Web3 & Blockchain', 'Turkey', '2023', '16 weeks'],
    tags: ['Branding', 'Web, UI/UX', '3d'],
    image: '/images/case.png',
    link: '/work/chainviz',
    description: () => (
      <>
        <p>App for exploration of blockchain validator infrastructure.</p>
        <p>A real-time, 3D navigable visualization of the validator space, tailored for both Polkadot and Kusama ecosystems.</p>
      </>
    ),
  },
]

export default function WorkPage() {
  const containerRef = useRef<HTMLElement>(null)
  const cursorAreaRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(1)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (menuRef.current) {
        ScrollTrigger.create({
          trigger: menuRef.current,
          start: `top +=${menuRef.current.offsetTop}px`,
          pin: true,
          scrub: 1,
        })
      }

      if (cursorRef.current && cursorAreaRef.current) {
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

        cursorAreaRef.current.addEventListener('mousemove', onMove)
        cursorAreaRef.current.addEventListener('mouseleave', onLeave)
      }
    })
  }, { scope: containerRef })

  const { contextSafe } = useGSAP(() => {
    gsap.fromTo('.case-anim-target', { opacity: 0 }, { opacity: 1, duration: 0.5 })
  }, { scope: containerRef, dependencies: [activeIndex] })

  const handleCaseChange = contextSafe((index: number) => {
    if (index === selectedIndex)
      return

    setSelectedIndex(index)

    gsap.to('.case-anim-target', {
      opacity: 0,
      duration: 0.3,
      onComplete: () => setActiveIndex(index),
    })
  })

  return (
    <section ref={containerRef} className="pt-[97px] pb-2.5 md:pt-[150px] lg:pt-0 lg:h-svh">
      <div className="grid-container lg:h-full lg:grid-rows-[auto_1fr_1fr]">

        {/* Menu */}
        <div className="col-span-full md:col-span-1 md:row-start-2 md:row-end-4 lg:row-end-3">
          <div ref={menuRef} className="overflow-auto md:overflow-visible flex gap-4 -mx-2.5 px-2.5 md:mx-0 md:px-0 md:items-start md:gap-[3px] md:flex-col">
            {cases.map(({ title }, index) => (
              <Button
                key={title}
                label={title}
                isActive={selectedIndex === index}
                onClick={() => handleCaseChange(index)}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="case-anim-target mb-2.5 md:mb-6 col-span-full mt-9 md:mt-0 md:col-start-2 md:col-end-5">
          <div className="text-[20vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-3 lg:-ml-2.5 -rotate-2">
            <TextBlur isBold>{cases[activeIndex].title}</TextBlur>
          </div>
        </div>

        {/* Media */}
        <div ref={cursorAreaRef} className="case-anim-target bg-black/10 dark:bg-white/10 col-span-full aspect-[355/295] grayscale relative md:col-start-2 md:col-end-5 mb-7 md:mb-5 lg:row-end-4 lg:row-start-2 lg:mb-0 lg:aspect-auto xl:mr-[130px]">
          <Link href={cases[activeIndex].link}>
            <Image
              className="size-full object-cover"
              src={cases[activeIndex].image}
              alt={`${cases[activeIndex].title} poster`}
              fill
            />
          </Link>
          <div ref={cursorRef} className="text-white blur-regular mix-blend-difference text-p2-2xl uppercase absolute pointer-events-none opacity-0 hidden lg:block">
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
    </section>
  )
}
