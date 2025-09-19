'use client'

import Image from "next/image";
import {TextBlur} from "@/components/ui/TextBlur";

export function Hero() {
  return (
    <section className="pt-[60px] md:pt-[160px] lg:pt-0 overflow-hidden">
      <h1 className="md:text-nowrap text-[20vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        <TextBlur isBold>Klad Syndicate</TextBlur>
      </h1>
      <div className="grid-container mt-10 md:mt-[60px] lg:mt-20">
        <div className="flex flex-col items-start gap-[30px] md:col-start-2 col-span-2 lg:col-span-1 lg:col-start-4 p3">
          <p>We are a multidisciplinary design syndicate offering comprehensive solutions for ambitious brands. Every design we deliver is original, and every project is approached as a unique challenge. We see our clients as long-term partners, helping them reach new heights in how they express themselves and present their identity.</p>
          <div className="max-w-[264px] md:max-w-[320px] flex flex-col gap-[15px] p5">
            <p>We actively avoid repeating ourselves. Our process may seem chaotic at times, but that flexibility is intentional, as it helps us adapt to any circumstance without falling into rigid routines.</p>
            <p>As a small team, we deliberately limit the number of projects we take on, dedicating our full focus and commitment to each one.</p>
          </div>
        </div>
        <div className="flex justify-center -mx-2.5 lg:mx-0 mt-[30px] md:mt-10 lg:mt-3 col-span-4">
          <Image className="max-w-[140svw] md:max-w-[133svw] lg:max-w-full" src="/images/world.png" alt="World map" width={1410} height={928} />
        </div>
      </div>
    </section>
  )
}