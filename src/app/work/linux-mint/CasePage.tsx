import Image from 'next/image'

import { CaseStudy } from '@/app/work/CaseStudy'
import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { CaseVideo } from '@/components/ui/CaseVideo'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  return (
    <CaseStudy slug="linux-mint" closeHref="/work?case=linux-mint">

      {/* Header */}
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">

        {/* Menu */}
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/shareio" label="Previous" />
          <Button as="a" href="/work/stars-honey" label="Next" />
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
              <p>An independent visual identity concept for Linux Mint, covering the logo, colors, typography, website and desktop interface.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Concept</h2>
            <div className="p5">
              <p>A consistent design foundation for the system, built around Mint’s existing character.</p>
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
        <CaseVideo className="w-full aspect-[3840/2024]" src="https://klad.b-cdn.net/linux-mint/F_31_2.mp4" poster="/images/posters/linux-mint/1.jpg" />
      </SectionMedia>

      <SectionText align="right">
        <p>Linux Mint makes a practical desktop available to newcomers. We wanted its identity to be as consistent as the experience the project aims to provide.</p>
        <p>Our starting points were the variations in logos, green tones and typography across Mint’s interfaces. We proposed a shared set of rules for all three.</p>
        <p>The proposal combines a redesigned logo, a green-and-white palette and a defined type system. The moving logomark carries those elements into animation.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_02%20build%20for%20connection.mp4" poster="/images/posters/linux-mint/2.jpg" />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1168]" src="https://klad.b-cdn.net/linux-mint/F_03%20lm%20logo_2.mp4" poster="/images/posters/linux-mint/3.jpg" />
      </SectionMedia>

      <SectionText title="Make Mint fresh again" align="center">
        <p>The same logo, colors and typography apply to the website, installer and desktop UI. A common foundation makes the identity easier to use and maintain.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/1.avif" alt="Social media posts design concepts for Linux Mint by Klad" width={1720} height={974} />
      </SectionMedia>

      <SectionText align="right">
        <p>We admire Linux Mint’s work and made this concept independently. It is a proposal, not an adopted redesign.</p>
        <p>We hope it starts a discussion about design in open-source software. We would be happy to develop the system further with the project.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/2.avif" alt="Next wave of software banner design for Linux Mint by Klad" width={1720} height={1690} />
      </SectionMedia>

      <SectionText align="left">
        <p>Our critique is not an attack on open-source software but a call to action. Software today, as a form of digital craftsmanship, is in crisis. Take Apple’s latest design language: while it appears to evolve naturally from Aqua GUI, it introduces several critical issues. It increases hardware demands, nudging users to upgrade devices prematurely; it compromises accessibility by favoring style over legibility; and it ships incomplete, signaling that UX concerns will be addressed later. Apple, once a benchmark for design-centric experience, now appears to drift further from those ideals with each macOS release since Snow Leopard.</p>
        <p>This design crisis isn't just about aesthetics - it’s also tied to the imposition of AI, erosion of user ownership, and the commodification of software. We see open source as the only way forward: a model rooted in collective stewardship and transparency. Our visual proposal is a contribution to that ethos. If adopted, we would be happy to oversee and scale the visual system further.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1052]" src="https://klad.b-cdn.net/linux-mint/F_07%20banner_3.mp4" poster="/images/posters/linux-mint/4.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/4.avif" alt="Reddit and Twitter social media post layout design for Linux Mint by Klad" width={1720} height={860} />
      </SectionMedia>

      <SectionText align="center">
        <p>The desktop concepts extend the same identity into Cinnamon’s menus, icons and interface elements.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/9.avif" alt="Clarity, identity, freedom poster design concept for Linux MInt by Klad" width={1720} height={1963} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/12.avif" alt="Brand shot compilation accenting user-centricity" width={1720} height={1296} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/13.avif" alt="USB stick brand design concept and website browser look concept for Linux Mint" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/14.avif" alt="Mobile website design and custom keyboard keys in branded colours for Linux Mint" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1032]" src="https://klad.b-cdn.net/linux-mint/F_13%20open-source.mp4" poster="/images/posters/linux-mint/5.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/16.avif" alt="New desktop menu UI look concept proposal for Linux Mint on a brand patter" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/15.avif" alt="Where Linux journey begins in Linux suggested brand typography" width={1720} height={672} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_16%20web%20mockup_7.mp4" poster="/images/posters/linux-mint/6.jpg" />
      </SectionMedia>

      <SectionText align="right">
        <p>The concept covers the website, installer, desktop and physical materials. We also explored a mobile interface to test the system in a different format.</p>
        <p>Linux Mint deserves appreciation and support. Even if our visual initiative isn’t embraced, we encourage you to support the project directly through donations. It’s a small act that helps a great system continue to grow.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/18.avif" alt="Dark version of website redesign for Linux Mint" width={1720} height={1998} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/2846]" src="https://klad.b-cdn.net/linux-mint/F_18%20launch_2.mp4" poster="/images/posters/linux-mint/7.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/19.avif" alt="New login UI desktop design for Cinnamon" width={1720} height={1078} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/20.avif" alt="Redefined desktop interface dark poster design for Linux Mint by Klad" width={1720} height={2231} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/21.avif" alt="Crisp new look desktop UI concept banner" width={1720} height={1152} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_21%20install%20process.mp4" poster="/images/posters/linux-mint/8.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/23.avif" alt="Desktop UI redesign for menus, icons and loaders" width={1720} height={899} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/26.avif" alt="Still Mint, just better concept banner design" width={1720} height={1146} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/27.avif" alt="What if Mint goes mobile concept shot design" width={1720} height={1491} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/1700]" src="https://klad.b-cdn.net/linux-mint/F_25%20phone%20mockup_1.mp4" poster="/images/posters/linux-mint/9.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/28.avif" alt="Light theme terminal UI design" width={1720} height={965} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/linux-mint/29.avif" alt="Tote bag merch design in Linux Mint brand green" width={1720} height={1511} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/shareio" label="Previous" />
        <Button as="a" href="/work?case=linux-mint" label="Close" />
        <Button as="a" href="/work/stars-honey" label="Next" />
      </footer>
    </CaseStudy>
  )
}
