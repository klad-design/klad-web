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
          <Button as="a" href="/work/shareio" label="Previous" />
          <Button as="a" href="/work/stars-honey" label="Next" />
          <Button as="a" href="/work" label="Close" />
        </div>

        {/* Title */}
        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Linux Mint</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Brand identity</div>
          <div>UI/UX</div>
          <div>Brand motion</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://github.com/klad-design/linuxmint-brand" label="Github" />
          <Button as="a" href="https://www.behance.net/gallery/232107079/Linux-Mint#" label="Behance" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Initiative</h2>
            <div className="p5">
              <p>A visual redesign initiative for Linux Mint, aiming to modernize its identity and enhance consistency across platforms, proving that open-source software can be both user-friendly and beautifully designed by default.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Concept</h2>
            <div className="p5">
              <p>Our goal wasn’t to change what people love about Mint, but to give it the design foundation it currently lacks.</p>
            </div>
          </div>
        </div>

        {/* Short information */}
        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">Worldwide</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Open-source software</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">3 weeks</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2024</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <video className="w-full aspect-[3840/2024]" src="https://klad.b-cdn.net/linux-mint/F_31_2.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionText align="right">
        <p>Linux Mint is one of the few distributions that genuinely prioritize user experience, yet it continues to suffer from a long-standing visual identity crisis. This reflects a broader perception that non-commercial software often sacrifices design and usability. While Mint positions itself as an out-of-the-box solution, its inconsistent visual language frequently pushes users into a DIY experience - not by choice, but by necessity.</p>
        <p>Our work focused on two core challenges: inconsistency and a dated visual presence. Across platforms, Linux Mint’s identity appears fragmented—colors shift between interfaces, logos vary in tone and execution, and typography lacks cohesion. Even the brand’s defining color, green, is applied inconsistently. These details, while seemingly minor, shape perception and weaken the sense of reliability that Mint stands for.</p>
        <p>We began with the foundation: a redesigned logo and a defined color system that anchors the brand in a clear, recognizable visual language. From there, we introduced a coherent typographic structure and a minimalist palette built around green and white to improve clarity while reducing maintenance complexity. The dynamic logomark reinforces Mint’s identity as a user-friendly, GUI-first system and acts as a symbolic centerpiece for future evolution.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_02%20build%20for%20connection.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1168]" src="https://klad.b-cdn.net/linux-mint/F_03%20lm%20logo_2.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText title="Make Mint fresh again" align="center">
        <p>We began with the logo and core brand elements because they form the anchor of any scalable visual system. In Linux Mint’s case, the absence of a clearly defined foundation, from inconsistent greens to shifting typographic choices, has made the identity feel fragmented across platforms. By establishing a unified logomark, a consistent color palette rooted in Mint’s own name, and a coherent typographic structure, we created a base that allows the visual language to scale naturally. From the website and installer to the desktop UI and future touchpoints, this foundation ensures that every element feels recognizably part of the same system. Fixing the core makes everything else simpler and more maintainable.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/1.avif" alt="Social media posts design concepts for Linux Mint by Klad" width={1720} height={974} />
      </SectionMedia>

      <SectionText align="right">
        <p>We admire Linux Mint and its mission to provide a user-friendly gateway for Linux newcomers. Our initiative supports this vision by offering a clearer, more cohesive visual identity. At the heart of the challenge lies the absence of a strong design foundation: something we believe is crucial for the project’s continued growth and accessibility.</p>
        <p>Even if our proposal is not formally adopted, we hope it initiates a broader conversation about the role of design in open-source software. Good design should not be exclusive to proprietary platforms. Linux can be modern, intuitive, and visually refined. By default.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/2.avif" alt="Next wave of software banner design for Linux Mint by Klad" width={1720} height={1690} />
      </SectionMedia>

      <SectionText align="left">
        <p>Our critique is not an attack on open-source software but a call to action. Software today, as a form of digital craftsmanship, is in crisis. Take Apple’s latest design language: while it appears to evolve naturally from Aqua GUI, it introduces several critical issues. It increases hardware demands, nudging users to upgrade devices prematurely; it compromises accessibility by favoring style over legibility; and it ships incomplete, signaling that UX concerns will be addressed later. Apple, once a benchmark for design-centric experience, now appears to drift further from those ideals with each macOS release since Snow Leopard.</p>
        <p>This design crisis isn't just about aesthetics - it’s also tied to the imposition of AI, erosion of user ownership, and the commodification of software. We see open source as the only way forward: a model rooted in collective stewardship and transparency. Our visual proposal is a contribution to that ethos. If adopted, we would be happy to oversee and scale the visual system further.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[1920/1052]" src="https://klad.b-cdn.net/linux-mint/F_07%20banner_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/4.avif" alt="Reddit and Twitter social media post layout design for Linux Mint by Klad" width={1720} height={860} />
      </SectionMedia>

      <SectionText align="center">
        <p>Linux Mint is more than just a green theme. Cinnamon can be more than a Windows 7 lookalike. With a solid visual foundation, Mint could become a leader in design innovation without losing its functional appeal. We began by redesigning the logo, the anchor of any identity. Ironically, despite its name, Mint lacks a consistent green color. Our proposal resolves this, introducing a defined palette and a coherent typographic system.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/9.avif" alt="Clarity, identity, freedom poster design concept for Linux MInt by Klad" width={1720} height={1963} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/12.avif" alt="Brand shot compilation accenting user-centricity" width={1720} height={1296} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/13.avif" alt="USB stick brand design concept and website browser look concept for Linux Mint" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/14.avif" alt="Mobile website design and custom keyboard keys in branded colours for Linux Mint" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1032]" src="https://klad.b-cdn.net/linux-mint/F_13%20open-source.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/16.avif" alt="New desktop menu UI look concept proposal for Linux Mint on a brand patter" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/15.avif" alt="Where Linux journey begins in Linux suggested brand typography" width={1720} height={672} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_16%20web%20mockup_7.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText align="right">
        <p>The visual language we propose extends across web, installer, desktop UI, and even physical assets. To illustrate its flexibility, we included a conceptual mobile interface—a thought experiment to show how good design scales naturally across platforms.</p>
        <p>We focus on two core issues: lack of consistency (evident in conflicting fonts, colors, and outdated logos) and an overall dated look. Our solution is minimalist, scalable, and rooted in clarity. The dynamic logomark reinforces Mint’s identity as a user-friendly, GUI-first system. It also acts as a symbolic centerpiece, suggesting new digital horizons.</p>
        <p>Our concept demonstrates how fixing even a single aspect, such color system definition can improve coherence while simplifying visual maintenance. By focusing on a streamlined green-and-white palette, we deliver clarity without sacrificing personality.</p>
        <p>Linux Mint deserves appreciation and support. Even if our visual initiative isn’t embraced, we encourage you to support the project directly through donations. It’s a small act that helps a great system continue to grow.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/18.avif" alt="Dark version of website redesign for Linux Mint" width={1720} height={1998} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2846]" src="https://klad.b-cdn.net/linux-mint/F_18%20launch_2.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/19.avif" alt="New login UI desktop design for Cinnamon" width={1720} height={1078} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/20.avif" alt="Redefined desktop interface dark poster design for Linux Mint by Klad" width={1720} height={2231} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/21.avif" alt="Crisp new look desktop UI concept banner" width={1720} height={1152} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_21%20install%20process.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/23.avif" alt="Desktop UI redesign for menus, icons and loaders" width={1720} height={899} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/26.avif" alt="Still Mint, just better concept banner design" width={1720} height={1146} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/27.avif" alt="What if Mint goes mobile concept shot design" width={1720} height={1491} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/1700]" src="https://klad.b-cdn.net/linux-mint/F_25%20phone%20mockup_1.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/28.avif" alt="Light theme terminal UI design" width={1720} height={965} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/29.avif" alt="Tote bag merch design in Linux Mint brand green" width={1720} height={1511} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/shareio" label="Previous" />
        <Button as="a" href="/work/stars-honey" label="Next" />
      </footer>
    </main>
  )
}
