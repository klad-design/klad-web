'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'
import { TextBlur } from '@/components/ui/TextBlur'

const titles = ['Branding', 'Experience', 'Product', 'Branding', 'Experience', 'Product']

const services = [
  {
    title: 'Industries',
    list: [
      'AI',
      'Web3 & Blockchain',
      'Retail & E-commerce',
      'Lifestyle',
      'Food & Beverage',
      'Biotech',
      'Jewelry manufacturing',
      'Banking & finance',
      'Digital marketing',
      'Robotics',
      'Logistics & transportation',
    ],
  },
  {
    title: 'Tools',
    list: [
      'Figma',
      'Adobe CC',
      'Blender',
      'Cinema 4D',
      'Rive',
      'ZBrush',
      'Logic Pro',
      'Ableton',
    ],
  },
  {
    title: 'Development',
    list: [
      'HTML + CSS + JS',
      'React',
      'WebGL',
      'GSAP',
      'Python',
      'Shopify',
      'Webflow',
    ],
  },
  {
    title: 'Services',
    list: [
      'Visual identity and logotype',
      'Packaging',
      'Signage',
      'Digital and printed material',
      'Web design',
      'UI/UX',
      '3D modeling',
      'Motion design',
      'Visual research',
      'Frontend',
    ],
  },
]

export function Services() {
  const wordsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wordsRef.current,
        scrub: 1,
      },
    })

    tl.to(wordsRef.current, {
      xPercent: -20,
      ease: 'none',
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section className="md:-mt-6">
      <div ref={wordsRef} className="w-fit -rotate-2 flex gap-[0.3em] text-h1 md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase">
        {titles.map((service, index) => (
          <div key={service + index} className="blur-xs hover:blur-none transition-all duration-500 cursor-pointer">
            <TextBlur>{service}</TextBlur>
          </div>
        ))}
      </div>
      <div className="grid-container gap-y-10 mt-24 md:mt-32 lg:mt-24 p4 leading-none uppercase">
        {services.map(service => (
          <div key={service.title}>
            <div>
              <TextBlur isBold>{service.title}</TextBlur>
            </div>
            <ul className="flex flex-col items-start mt-4">
              {service.list.map(item => (
                <li key={item}>
                  <TextBlur isBold>{item}</TextBlur>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid-container flex md:grid flex-wrap lg:gap-x-2.5 gap-y-2 mt-20 lg:mt-14">
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">
            <TextBlur isBold>45+</TextBlur>
          </div>
          <div className="p5 mt-2">clients</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">
            <TextBlur isBold>over 100</TextBlur>
          </div>
          <div className="p5 mt-2">completed projects</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">
            <TextBlur isBold>$20M+ raised</TextBlur>
          </div>
          <div className="p5 mt-2">in seed and pre-seed rounds for startups over the past year</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">
            <TextBlur isBold>since 2020</TextBlur>
          </div>
        </div>
      </div>
    </section>
  )
}
