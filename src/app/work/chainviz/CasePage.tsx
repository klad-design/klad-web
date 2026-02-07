'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'

import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  const { setTheme } = useTheme()

  setTheme('dark')

  return (
    <main className="pb-10">

      {/* Header */}
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">

        {/* Menu */}
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/stars-honey" label="Previous" />
          <Button as="a" href="/work/shareio" label="Next" />
          <Button as="a" href="/work" label="Close" />
        </div>

        {/* Title */}
        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Shareio</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Branding</div>
          <div>3D & motion</div>
          <div>UI/UX</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://shareio.webflow.io/" label="Website" />
          <Button as="a" href="https://www.behance.net/gallery/224757329/Shareio-Content-Tool" label="Behance" />
          // <Button as="a" href="/" label="App" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>A small team was launching a new product with a strict two-month deadline. No visual assets, no copy and a wide range of use cases to cover. The brand had to feel authentic, creator-first and flexible enough to grow fast.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>Identity driven by parametrised motion. Expressive typography layered with 3D elements, shaped into a cohesive system across web and product.</p>
            </div>
          </div>
        </div>

        {/* Short information */}
        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">United States</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Creator economy & Web3</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">9 weeks</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2025</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <video className="w-full aspect-[2800/1570]" src="https://klad.b-cdn.net/chainviz/1_logo%20block%20animation_3.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/1606]" src="https://klad.b-cdn.net/chainviz/3_blockchain%20rythm%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/1578]" src="https://klad.b-cdn.net/chainviz/4_blockchain%20model%20preview%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/2760]" src="https://klad.b-cdn.net/chainviz/5_means%20of%20ui%20animation_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/1682]" src="https://klad.b-cdn.net/chainviz/6_validator%20hover%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[2800/2066]" src="https://klad.b-cdn.net/chainviz/7_load%20and%20era%20animation.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/shareio/1.avif" alt="Shareio ase cover image" width={1720} height={1030} />
      </SectionMedia>

      <SectionText align="right">
        <p>The content monetization space is shifting fast. Platforms come and go, algorithms change, and creators are left adapting. Shareio set out to offer something different, a tool focused on ownership, control and direct monetization without feeds, moderation or gatekeepers.</p>
        <p>We built a visual identity around the idea of creativity as an endless dimension. Simple but expressive, confident with a subtle nostalgic edge. A brand system designed to feel clear, creator-first, and distinct - positioning Shareio as a bridge between making and earning, without anything in between.</p>
      </SectionText>

      <SectionText title="Sign of three metaphors" align="center">
        <p>The logo is built around the idea of connection. Two forms merging into one suggest sharing, collaboration and the constant flow between creators and their audiences. In interface context, it subtly echoes the familiar logic of a share icon.</p>
        <p>The coin-like geometry hints at the economic layer beneath it all. Flow, impact and value converge into a single shape, pointing to the financial side of sharing — where creativity turns into income, and content becomes a sustainable asset.</p>
      </SectionText>

       <SectionText align="center">
        <p>A sequence of three dots, scaling from large to small, introduces a sense of movement. It reflects the journey of content: from creation to distribution to monetization. A quiet visual metaphor for progression, reach, and the ripple effect, which we later translated into a subtle logo animation.</p>
      </SectionText>

      <SectionText align="left">
        <p>Shareio is positioned as a pure tool accessible through a mobile app and built to give creators full control over how their work is shared and monetized. It doesn’t host feeds or shape visibility. Instead, it provides the infrastructure for secure ownership and payments, leaving creative freedom entirely in the hands of users.</p>
        <p>There are no algorithms deciding what gets seen. No moderation layers shaping content. Creators own not only their work, but the connection to their audience. The app acts as an enabler, not a filter, removing friction like demonetization risks or forced optimization.</p>
        <p>The logo is set in Averia - a typeface created by blending the shapes of many different fonts into one. Its layered origin gives it a distinct personality: slightly imperfect and human at its core. The choice was intentional. As a tool built for a wide range of creators, the identity needed to feel approachable and individual. Averia brings familiarity with a subtle nostalgic tone, reinforcing the idea that creative work should feel personal.</p>
      </SectionText>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/stars-honey" label="Previous" />
        <Button as="a" href="/work/shareio" label="Next" />
      </footer>
    </main>
  )
}
