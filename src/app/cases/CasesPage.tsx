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
    title: 'Chainviz',
  },
  {
    title: 'Shareio',
  },
  {
    title: 'Process',
  },
  {
    title: 'Omnia',
  },
  {
    title: 'Veev',
  },
  {
    title: 'Subvt',
  },
  {
    title: 'Namefolio',
  },
]

export default function CasesPage() {
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
          <Link href="/cases/case">
            <Image
              className="size-full object-cover"
              src="/images/case.png"
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
            <div>Lifestyle & Well-being</div>
            <div>Netherlands</div>
            <div>2022</div>
            <div>9 weeks, ongoing</div>
          </div>
          <div className="p4 blur-regular uppercase flex flex-wrap gap-2.5 mt-4 md:mt-3">
            <span>Branding</span>
            <span>Web, UI/UX</span>
            <span>3D</span>
          </div>
          <div className="p5 flex flex-col gap-4 mt-[30px] md:gap-2 md:mt-4">
            <p>Started website update and markup. Discovered and fixed redundant web infrastructure. Redesigned website, created new brand visuals & elements for windows decals. Developing brand starter packs for new clients as a part of the ongoing collaboration.</p>
            <p>Company wanted to do the redesign without actual redesign as they had a lot of physical materials and interior design that has old visuals.</p>
          </div>
        </div>

        {/* Link */}
        <div className="col-span-full mt-8 md:mt-0 md:col-start-4 md:col-end-5 lg:hidden">
          <Button as="a" href="/cases/case" label="View case" />
        </div>
      </div>
    </section>
  )
}
