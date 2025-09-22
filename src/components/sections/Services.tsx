'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

const titles = ['Branding', 'Experience', 'Product']

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

const advantages = [
  { title: '45+', description: 'clients' },
  { title: 'over 100', description: 'completed projects' },
  { title: '$20M+ raised', description: 'in seed and pre-seed rounds for startups over the past year' },
  { title: 'since 2020' },
]

export function Services() {
  const wordsRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    gsap.to('.service', {
      xPercent: -100,
      repeat: -1,
      duration: 15,
      ease: 'linear',
    })
  }, { scope: wordsRef })

  return (
    <section className="-mt-6 md:-mt-14 lg:-mt-20">
      <div ref={wordsRef} className="-rotate-2 w-fit flex text-h1 md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase">
        <div className="service w-fit flex gap-[0.3em] pl-[0.3em]">
          {titles.map((service, index) => (
            <div key={service + index} className="blur-xs hover:blur-none transition-all duration-500 cursor-pointer">
              {service}
            </div>
          ))}
        </div>
        <div className="service w-fit flex gap-[0.3em] pl-[0.3em]">
          {titles.map((service, index) => (
            <div key={service + index} className="blur-xs hover:blur-none transition-all duration-500 cursor-pointer">
              {service}
            </div>
          ))}
        </div>
      </div>
      <div className="grid-container gap-y-10 mt-32 md:mt-40 p4 leading-none uppercase">
        {services.map(service => (
          <div key={service.title}>
            <div className="blurred blurred--active" data-label={service.title}>
              <span>{service.title}</span>
            </div>
            <ul className="flex flex-col items-start mt-4">
              {service.list.map(item => (
                <li key={item} className="blurred blurred--active" data-label={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid-container flex md:grid flex-wrap lg:gap-x-2.5 gap-x-6 gap-y-3 mt-[74px] lg:mt-14">
        {advantages.map(({ title, description }) => (
          <div key={title} className="flex flex-col items-start">
            <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">
              <div className="blurred blurred--active [&>span]:blur-[0.75px] before:blur-[5px] after:blur-[2px]" data-label={title}>
                <span>{title}</span>
              </div>
            </div>
            {description && <div className="p5 mt-1.5">{description}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
