'use client'

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const services = ["Branding", "Experience", "Product", "Branding", "Experience", "Product"]

export function Services() {
  const wordsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wordsRef.current,
        scrub: 1,
      }
    })

    tl.to(wordsRef.current, {
      xPercent: -50,
      ease: 'none',
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section className="md:-mt-6">
      <div ref={wordsRef} className="w-fit -rotate-2 flex gap-[0.3em] text-h1 md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase">
        {services.map((service, index) => (
          <div key={service + index} className="blur-xs">{service}</div>
        ))}
      </div>
      <div className="grid-container gap-y-10 mt-24 md:mt-32 lg:mt-24 p4 leading-none uppercase">
        <div>
          <div>Industries</div>
          <ul className="flex flex-col items-start mt-4">
            <li>AI</li>
            <li>Web3 & Blockchain</li>
            <li>Retail & E-commerce</li>
            <li>Lifestyle</li>
            <li>Food & Beverage</li>
            <li>Biotech</li>
            <li>Jewelry manufacturing</li>
            <li>Banking & finance</li>
            <li>Digital marketing</li>
            <li>Robotics</li>
            <li>Logistics & transportation</li>
          </ul>
        </div>
        <div>
          <div>Tools</div>
          <ul className="flex flex-col items-start mt-4">
            <li>Figma</li>
            <li>Adobe CC</li>
            <li>Blender</li>
            <li>Cinema 4D</li>
            <li>Rive</li>
            <li>ZBrush</li>
            <li>Logic Pro</li>
            <li>Ableton</li>
          </ul>
        </div>
        <div>
          <div>Development</div>
          <ul className="flex flex-col items-start mt-4">
            <li>HTML + CSS + JS</li>
            <li>React</li>
            <li>WebGL</li>
            <li>GSAP</li>
            <li>Python</li>
            <li>Shopify</li>
            <li>Webflow</li>
          </ul>
        </div>
        <div>
          <div>Services</div>
          <ul className="flex flex-col items-start mt-4">
            <li>Visual identity and logotype</li>
            <li>Packaging</li>
            <li>Signage</li>
            <li>Digital and printed material</li>
            <li>Web design</li>
            <li>UI/UX</li>
            <li>3D modeling</li>
            <li>Motion design</li>
            <li>Visual research</li>
            <li>Frontend</li>
          </ul>
        </div>
      </div>
      <div className="grid-container flex md:grid flex-wrap lg:gap-x-2.5 gap-y-2 mt-20 lg:mt-14">
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">45+</div>
          <div className="p5 mt-2">clients</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">over 100</div>
          <div className="p5 mt-2">completed projects</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">$20M+ raised</div>
          <div className="p5 mt-2">in seed and pre-seed rounds for startups over the past year</div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">since 2020</div>
        </div>
      </div>
    </section>
  )
}