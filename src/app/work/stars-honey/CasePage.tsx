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
            <TextBlur isBold>Stars+Honey</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Product 3D</div>
          <div>Brand motion</div>
          <div>Packaging</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://starsandhoney.com/" label="Website" />
          <Button as="a" href="https://www.behance.net/gallery/240620453/StarsHoney-Product-3D" label="Behance" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>As a fast-growing brand with an active presence across social media, Stars+Honey needed a large volume of consistent, premium visuals to present the product in a refined and engaging way.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>We developed a complete 3D product line: wrapped bars, unwrapped formats and packaging. For every flavor, we created ingredient-specific explosion renders, designed to highlight the flavor profile while staying fully on-brand.</p>
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
            <div className="p5">Food & Beverage</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">20 weeks</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2026</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/0.avif" alt="Two Stars+Honey bars brand poster design" width={1720} height={1375} />
      </SectionMedia>

      <SectionText align="right">
        <p>We created a cohesive library of 3D assets for Stars+Honey collagen bars brand that allows for endless combinations for campaigns, seasonal drops and new flavor announcements. Scaling product visuals now costs significantly less, as new variations are built from the existing system.</p>
        <p>Built to support growth, the visual system helps the brand scale beyond online sales into retail. Not only it powers consistent social content, it also simplifies presentations for partners and investors.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[3840/996]" src="https://klad.b-cdn.net/stars-honey/F_02%20logo%20in.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionText title="BRANDED AND PACKED" align="center">
        <p>Each unwrapped bar was rendered to feel visually appealing and genuinely delicious. With a strong foundation we established early on, adding and refining new flavors becomes a smooth and efficient process, while still allowing each bar to retain its own character.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/1.avif" alt="Rasberry donut bar Stars+Honey brand poster design" width={1720} height={1720} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/2160]" src="https://klad.b-cdn.net/stars-honey/F_05%20brand%20brackets%202_4.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/2.avif" alt="Branded packaging boxes Stars+Honey in single flavour" width={1720} height={1164} />
      </SectionMedia>

      <SectionText align="center">
        <p>Consistency is key, especially for a brand with a wide variety of flavors like Stars+Honey. With a clearly defined visual system, we were able to support the core product line alongside new flavors and holiday editions, extending the brand without disrupting its visual language.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[3840/1644]" src="https://klad.b-cdn.net/stars-honey/F_02%20taste%20range%20ver%2010.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/3.avif" alt="Branded packaging boxes Stars+Honey in multiple flavours" width={1720} height={1164} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/3774]" src="https://klad.b-cdn.net/stars-honey/F_10%20photo%20bang_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionText align="right">
        <p>Introducing new visual directions in socials requires a careful, brand-led approach. By highlighting key ingredients in 3D, we created eye-catching assets that both function independently and keep expanding the Stars+Honey visual narrative.</p>
        <p>Each unwrapped bar was rendered to feel visually appealing and genuinely delicious.</p>
        <p>With a strong foundation we established early on, adding and refining new flavors becomes a smooth and efficient process, while still allowing each bar to retain its own character.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/4.avif" alt="Rasberry donut flavour brand poster design for Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/5.avif" alt="Logo poster with 3D bar design and packaging overlay" width={1720} height={967} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/6.avif" alt="Art directed shot of coffee and 3D visualised bar for Stars+Honey" width={1720} height={968} />
      </SectionMedia>

      <SectionText title="New ways to create visual stories" align="center">
        <p>The key outcome of the project was creation of a soft, flavor-driven visual ecosystem - calm, elegant and quietly playful. Designed to support the brand’s daily storytelling and make content creation beautifully seamless, providing with a flexible toolkit that always stays true to Stars+Honey’s gentle aesthetic.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/7.avif" alt="Art directed shot of girl running in the fields with the 3D visualised bar for Stars+Honey" width={1720} height={1013} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3840/1622]" src="https://klad.b-cdn.net/stars-honey/F_15%20brand%20carousel_3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/8.avif" alt="Photography done by Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionText align="center">
        <p>Beyond creating new visuals from scratch, we also elevated Stars+Honey’s existing photography and 3D compositions by integrating our updated assets. This approach allows the brand to refresh familiar visuals and extend the value of existing content without losing its original character or forcing changes where they aren’t necessary.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[1920/1280]" src="https://klad.b-cdn.net/stars-honey/F_18%20couple%20scene.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/9.avif" alt="Shot of a woman holding 3D visualised Stars+Honey bar in flavour-matching colour" width={1720} height={931} />
      </SectionMedia>

      <SectionText align="center">
        <p>Stars+Honey is an aesthetic-driven brand built around a genuinely good, healthy product. When creating the visual assets, it was essential for us to stay true to this positioning, presenting the bars as an everyday snack rather than a dietary supplement. Every composition was designed to feel natural, appetizing and lifestyle-oriented, reinforcing wellness through texture and mood instead of clinical cues. This approach allows the brand to communicate health in a way that feels modern and approachable.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/10.avif" alt="Brand shot of a couple sharing Stars+Honey" width={1720} height={966} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_21%20ingredient%20explosion%20light.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/11.avif" alt="All flavour 3D visualisations for Stars+Honey done by Klad" width={1720} height={1720} />
      </SectionMedia>

      <SectionText align="left">
        <p>The project was built as a modular system. Every material, texture and lighting setup can be reused or extended, allowing the brand to scale its visual assets efficiently and cost-effectively. </p>
        <p>This gives the Stars+Honey team the freedom to create premium visuals for daily storytelling, seasonal drops and new flavour launches — quickly and without friction.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/12.avif" alt="Cherry chocolate waffle cone 3D flavour visualisation" width={1720} height={1145} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/13.avif" alt="Brand photography to support new cherry flavour launch" width={1720} height={853} />
      </SectionMedia>

      <SectionText align="center">
        <p>Apart from soft, serene compositions, we introduced bolder visual moments filled with flavor and energy. Brighter colors, expressive ingredient forms and richer contrasts carefully woven into the system, allowing communicate special or holiday flavors more vividly while remaining true to the brand’s refined aesthetic.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/14.avif" alt="Gingerbread cookie 3D flavour visualisation and brand packaging for Stars+Honey" width={1720} height={1092} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_27%20ingredient%20explosion%20dark.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/stars-honey/15.avif" alt="Burst of Christmas flavours 3D shot" width={1720} height={966} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/linux-mint" label="Previous" />
        <Button as="a" href="/work/chainviz" label="Next" />
      </footer>
    </main>
  )
}
