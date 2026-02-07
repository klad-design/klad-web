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
            <TextBlur isBold>Linux mint</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Branding</div>
          <div>3D & motion</div>
          <div>Web</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="/" label="Website" />
          <Button as="a" href="/" label="Behance" />
          <Button as="a" href="/" label="App" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>Started website update and markup. Discovered and fixed redundant web infrastructure. Redesigned website, created new brand visuals & elements for windows decals. Developing brand starter packs for new clients as a part of the ongoing collaboration.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>Company wanted to do the redesign without actual redesign as they had a lot of physical materials and interior design that has old visuals.</p>
            </div>
          </div>
        </div>

        {/* Short information */}
        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">Netherlands</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Lifestyle & Well-being</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">9 weeks, ongoing</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2022</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_02%20build%20for%20connection.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1168]" src="https://klad.b-cdn.net/linux-mint/F_03%20lm%20logo_2.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1052]" src="https://klad.b-cdn.net/linux-mint/F_07%20banner_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/944]" src="https://klad.b-cdn.net/linux-mint/F_10%20horisontal%20banner_1.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1032]" src="https://klad.b-cdn.net/linux-mint/F_13%20open-source.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_16%20web%20mockup_7.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2846]" src="https://klad.b-cdn.net/linux-mint/F_18%20launch_2.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/linux-mint/F_21%20install%20process.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/1700]" src="https://klad.b-cdn.net/linux-mint/F_25%20phone%20mockup_1.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2024]" src="https://klad.b-cdn.net/linux-mint/F_31_2.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/1.avif" alt="Social media posts design concepts for Linux Mint by Klad" width={1720} height={974} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/2.avif" alt="Next wave of software banner design for Linux Mint by Klad" width={1720} height={1690} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/4.avif" alt="Reddit and Twitter social media post layout design for Linux Mint by Klad" width={1720} height={860} />
      </SectionMedia>

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
        <Image className="w-full" src="/images/linux-mint/15.avif" alt="Where Linux journey begins in Linux suggested brand typography" width={1720} height={672} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/16.avif" alt="New desktop menu UI look concept proposal for Linux Mint on a brand patter" width={1720} height={860} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/18.avif" alt="Dark version of website redesign for Linux Mint" width={1720} height={1998} />
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
        <Image className="w-full" src="/images/linux-mint/23.avif" alt="Desktop UI redesign for menus, icons and loaders" width={1720} height={899} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/26.avif" alt="Still Mint, just better concept banner design" width={1720} height={1146} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/27.avif" alt="What if Mint goes mobile concept shot design" width={1720} height={1491} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/28.avif" alt="Light theme terminal UI design" width={1720} height={965} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/linux-mint/29.avif" alt="Tote bag merch design in Linux Mint brand green" width={1720} height={1511} />
      </SectionMedia>

      <SectionText align="right">
        <p>We bring hands-on, experienced team of specialists and artists who focus solely on design, delivering unique solutions without outsourcing or co-creation.</p>
        <p>Our work isn’t about appeasing. It’s about elevating. We listen closely but speak honestly. Our role isn’t to echo your views, but to broaden them.</p>
        <p>Our work isn’t about appeasing. It’s about elevating. We listen closely but speak honestly. Our role isn’t to echo your views, but to broaden them.</p>
        <p>Our work isn’t about appeasing. It’s about elevating.</p>
        <p>Our work isn’t about appeasing. It’s about elevating.</p>
      </SectionText>

      <SectionText title="Make Mint fresh again" align="center">
        <p>
          Open-source software compromises value of good design, which is strange as good design just like good
          software is seeking to create simple, yet effective solutions which are enjoyed by their users. Open-source
          software compromises value of good design, which is strange as good design just like good software is seeking
          to create simple, yet effective solutions which are enjoyed by their users.
        </p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/case.png" alt="Case Image" width={1920} height={1280} />
      </SectionMedia>

      <SectionText align="left">
        <p>We bring hands-on, experienced team of specialists and artists who focus solely on design, delivering unique solutions without outsourcing or co-creation.</p>
        <p>Our work isn’t about appeasing. It’s about elevating. We listen closely but speak honestly. Our role isn’t to echo your views, but to broaden them.</p>
        <p>Our work isn’t about appeasing. It’s about elevating. We listen closely but speak honestly. Our role isn’t to echo your views, but to broaden them.</p>
        <p>Our work isn’t about appeasing. It’s about elevating.</p>
        <p>Our work isn’t about appeasing. It’s about elevating.</p>
      </SectionText>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/shareio" label="Previous" />
        <Button as="a" href="/work/stars-honey" label="Next" />
      </footer>
    </main>
  )
}
