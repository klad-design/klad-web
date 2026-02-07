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
          <Button as="a" href="/work/chainviz" label="Previous" />
          <Button as="a" href="/work/linux-mint" label="Next" />
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
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>Product launch with a strict two-month deadline. No visual assets, no copy and a wide range of use cases to cover. The brand had to feel authentic, creator-first and flexible enough to grow fast.</p>
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
        <Image className="w-full" src="/images/shareio/1.avif" alt="Shareio ase cover image" width={1720} height={1030} />
      </SectionMedia>

      <SectionText align="right">
        <p>The content monetization space is shifting fast. Platforms come and go, algorithms change, and creators are left adapting. Shareio set out to offer something different, a tool focused on ownership, control and direct monetization without feeds, moderation or gatekeepers.</p>
        <p>We built a visual identity around the idea of creativity as an endless dimension. Simple but expressive, confident with a subtle nostalgic edge. A brand system designed to feel clear, creator-first, and distinct - positioning Shareio as a bridge between making and earning, without anything in between.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/shareio/21.avif" alt="Three metaphors behind Shareio logo design" width={1720} height={978} />
      </SectionMedia>

      <SectionText title="Sign of three metaphors" align="center">
        <p>The logo is built around the idea of connection. Two forms merging into one suggest sharing, collaboration and the constant flow between creators and their audiences. In interface context, it subtly echoes the familiar logic of a share icon.</p>
        <p>The coin-like geometry hints at the economic layer beneath it all. Flow, impact and value converge into a single shape, pointing to the financial side of sharing — where creativity turns into income, and content becomes a sustainable asset.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/shareio/5.avif" alt="Logo design for Shareio originally done by Klad" width={1720} height={385} />
      </SectionMedia>

       <SectionText align="center">
        <p>A sequence of three dots, scaling from large to small, introduces a sense of movement. It reflects the journey of content: from creation to distribution to monetization. A quiet visual metaphor for progression, reach, and the ripple effect, which we later translated into a subtle logo animation.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/shareio/27.avif" alt="App icon design and the way it looks on the phone screen" width={1720} height={845} />
      </SectionMedia>

      <SectionText align="left">
        <p>Shareio is positioned as a pure tool accessible through a mobile app and built to give creators full control over how their work is shared and monetized. It doesn’t host feeds or shape visibility. Instead, it provides the infrastructure for secure ownership and payments, leaving creative freedom entirely in the hands of users.</p>
        <p>There are no algorithms deciding what gets seen. No moderation layers shaping content. Creators own not only their work, but the connection to their audience. The app acts as an enabler, not a filter, removing friction like demonetization risks or forced optimization.</p>
        <p>The logo is set in Averia - a typeface created by blending the shapes of many different fonts into one. Its layered origin gives it a distinct personality: slightly imperfect and human at its core. The choice was intentional. As a tool built for a wide range of creators, the identity needed to feel approachable and individual. Averia brings familiarity with a subtle nostalgic tone, reinforcing the idea that creative work should feel personal.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[3840/2494]" src="https://klad.b-cdn.net/shareio/F_08%20font_2.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2082]" src="https://klad.b-cdn.net/shareio/F_09_chrome_11.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/10.avif" alt="Chromark collection of 3D brand assets" width={1720} height={788} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2114]" src="https://klad.b-cdn.net/shareio/F_11%20gems_10.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/12.avif" alt="Emerald collection of 3D brand assets" width={1720} height={788} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2082]" src="https://klad.b-cdn.net/shareio/F_13%20aura_7.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/14.avif" alt="Luminous collection of 3D brand assets" width={1720} height={788} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/24.avif" alt="First tool for content creators to enable monetization using their existing cloud storage providers." width={1720} height={988} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/19.avif" alt="Branded tote bag design for Shareio" width={1720} height={978} />
      </SectionMedia>

      <SectionText align="center">
        <p>At the core of the product is a simple design idea: your cloud becomes your storefront. Instead of pushing creators into new platforms or complex systems, Shareio connects to the storage they already use and turns existing files into monetizable assets. This principle shaped the UX into a lightweight layer on top of existing content, where selling, licensing and sharing feel like natural extensions. Focused on clarity, the interface keeps control visible and understandable while the infrastructure stays in the background, allowing the content itself to remain at the center.</p>
      </SectionText>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/20.avif" alt="Layout design for the content banner" width={1720} height={978} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/28.avif" alt="Poster design made by Klad for Shareio" width={1720} height={1089} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2574]" src="https://klad.b-cdn.net/shareio/F_18%20quasar_7.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/37.avif" alt="Hero section web design for Shareio by Klad" width={1720} height={1304} />
      </SectionMedia>

      <SectionText align="right">
        <p>The quasar became more than a visual centerpiece. It represents the core ideas behind Shareio: decentralization as movement, ownership as a strong center, and monetization as a continuous flow of energy. It works as a visual thesis for the product, where every creator adds to a shared pulse that grows and evolves.</p>
        <p>Instead of relying on a static illustration, we designed it as a fully parametric brand artifact that adapts to context. The form changes based on input variables. Color gradients shift depending on user scenarios, animation speed responds to tone, and particle density reflects different content categories. For onboarding it appears calm and open, while product updates bring faster motion and more intensity.</p>
        <p>We built custom Blender Python scripts to generate high resolution stills and animations, allowing the quasar to live across touchpoints as a looping motion element, editorial visual, app header, or background. This turned a single concept into a flexible system that keeps the brand expressive and consistent without feeling repetitive.</p>
      </SectionText>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/39.avif" alt="Shareio content dashboard design" width={1720} height={915} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/38.avif" alt="Shareio content e-commerce design" width={1720} height={1030} />
      </SectionMedia>

      <SectionText align="center">
        <p>Shareio brings together cloud integration, blockchain, DRM, monetization, tokenomics, and creator dashboards into a single tool. Despite the technical depth, the experience had to feel familiar, trustworthy, and lightweight. The goal was to design something powerful that still feels like a simple utility, not a complex platform.</p>
        <p>We intentionally made blockchain invisible in the interface. Users do not need to understand smart contracts, gas fees, or token mechanics. These layers exist, but they are translated into clear actions, human language, and smart defaults that cover most use cases. The focus stays on the outcome, not the technology behind it.</p>
      </SectionText>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/30.avif" alt="Shareio UI design" width={1720} height={1049} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/31.avif" alt="Shareio UI mobile design" width={1720} height={1049} />
      </SectionMedia>

      <SectionText align="right">
        <p>Content sharing became the core logic of the entire app. Everything is built around the idea that distributing work should feel as easy as sending a link. At the same time, all essential tools remain accessible, from analytics to subscription management, without breaking the sense of simplicity.</p>
        <p>Magic Links form the backbone of this system. Each link carries built-in parameters like access, pricing, expiration, and DRM, so the UI had to stay clear without exposing technical complexity. We designed a modular link builder that is simple by default and expands when needed, supported by real-time previews and smart presets. Subscriptions are treated as extended Magic Links that renew automatically and adapt to access rules. Links can be shared privately or publicly, include affiliate tracking, and be updated without breaking.</p>
        <p>The monetization UX focused on simplifying a complex set of options without removing control. One-time sales, subscriptions, crypto and fiat pricing, and access settings all sit within a clean, structured flow. Visual hierarchy, modular components, and precise microcopy help advanced features feel like a natural extension of the upload process rather than separate systems.</p>
      </SectionText>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/22.avif" alt="Brand banner design for Shareio by Klad" width={1720} height={978} />
      </SectionMedia>

      <SectionText align="center">
        <p>Knowing that most creators and their audiences engage on the go, we approached the project with a mobile first mindset. Every element was designed and optimized for smaller screens, from layout to interactions.</p>
      </SectionText>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/23.avif" alt="Magic link UI design" width={1720} height={1049} />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/36.avif" alt="Shareio web UI mobile design for benefits section" width={1720} height={1049} />
      </SectionMedia>

      <SectionText align="center">
        <p>We placed strong focus on performance and reducing load times and refining asset delivery to keep the experience fast. The result is an app that feels as lightweight and focused as the product itself.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[3840/2272]" src="https://klad.b-cdn.net/shareio/F_34_1.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/32.avif" alt="Merch design for Shareio by Klad" width={1720} height={1049} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2548]" src="https://klad.b-cdn.net/shareio/F_35%20screen%20mockup_1.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionMedia>
        <Image className="w-full" src="/images/shareio/4.avif" alt="Footer design for Shareio by Klad" width={1720} height={697} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/chainviz" label="Previous" />
        <Button as="a" href="/work/linux-mint" label="Next" />
      </footer>
    </main>
  )
}
