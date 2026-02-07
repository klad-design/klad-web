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
          <Button as="a" href="/work/linux-mint" label="Previous" />
          <Button as="a" href="/work/chainviz" label="Next" />
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
        <video className="w-full aspect-[3840/996]" src="https://klad.b-cdn.net/stars-honey/F_02%20logo%20in.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/1644]" src="https://klad.b-cdn.net/stars-honey/F_02%20taste%20range%20ver%2010.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2160]" src="https://klad.b-cdn.net/stars-honey/F_05%20brand%20brackets%202_4.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1080/1350]" src="https://klad.b-cdn.net/stars-honey/F_10%20phone%20mockup%203.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/3774]" src="https://klad.b-cdn.net/stars-honey/F_10%20photo%20bang_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1080/1350]" src="https://klad.b-cdn.net/stars-honey/F_10_01%20phone%20mockup%205.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/1622]" src="https://klad.b-cdn.net/stars-honey/F_15%20brand%20carousel_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1280]" src="https://klad.b-cdn.net/stars-honey/F_18%20couple%20scene.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_21%20ingredient%20explosion%20light.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_27%20ingredient%20explosion%20dark.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>
      
      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/0.avif" alt="Two Stars+Honey bars brand poster design" width={1720} height={1375} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/1.avif" alt="Rasberry donut bar Stars+Honey brand poster design" width={1720} height={1720} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/2.avif" alt="Branded packaging boxes Stars+Honey in single flavour" width={1720} height={1164} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/3.avif" alt="Branded packaging boxes Stars+Honey in multiple flavours" width={1720} height={1164} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/4.avif" alt="Rasberry donut flavour brand poster design for Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/5.avif" alt="Logo poster with 3D bar design and packaging overlay" width={1720} height={967} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/6.avif" alt="Art directed shot of coffee and 3D visualised bar for Stars+Honey" width={1720} height={968} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/7.avif" alt="Art directed shot of girl running in the fields with the 3D visualised bar for Stars+Honey" width={1720} height={1013} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/8.avif" alt="Photography done by Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/9.avif" alt="Shot of a woman holding 3D visualised Stars+Honey bar in flavour-matching colour" width={1720} height={931} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/10.avif" alt="Brand shot of a couple sharing Stars+Honey" width={1720} height={966} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/11.avif" alt="All flavour 3D visualisations for Stars+Honey done by Klad" width={1720} height={1720} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/12.avif" alt="Cherry chocolate waffle cone 3D flavour visualisation" width={1720} height={1145} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/13.avif" alt="Brand photography to support new flavour launch" width={1720} height={853} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/14.avif" alt="Gingerbread cookie 3D flavour visualisation and brand packaging for Stars+Honey" width={1720} height={1092} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/15.avif" alt="Burst of Christmas flavours 3D shot" width={1720} height={966} />
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
        <Button as="a" href="/work/linux-mint" label="Previous" />
        <Button as="a" href="/work/chainviz" label="Next" />
      </footer>
    </main>
  )
}
