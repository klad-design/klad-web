import Image from 'next/image'

import { CaseStudy } from '@/app/work/CaseStudy'
import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { CaseVideo } from '@/components/ui/CaseVideo'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  return (
    <CaseStudy slug="stars-honey" closeHref="/work?case=stars-honey">

      {/* Header */}
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">

        {/* Menu */}
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/linux-mint" label="Previous" />
          <Button as="a" href="/work/circus" label="Next" />
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
              <p>Stars+Honey needed product visuals for regular social content, new flavors and seasonal campaigns. The assets had to cover a growing range of bars and packaging.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>We modelled wrapped bars, unwrapped bars and packaging. Each flavor has its own ingredient renders and animations.</p>
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
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/0.avif" alt="Two Stars+Honey bars brand poster design" width={1720} height={1375} />
      </SectionMedia>

      <SectionText align="right">
        <p>We built a reusable 3D library for Stars+Honey’s collagen bars. New flavors and campaign compositions use the same product models, materials and lighting setups.</p>
        <p>The assets cover social content, retail presentations and materials for partners and investors.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/996]" src="https://klad.b-cdn.net/stars-honey/F_02%20logo%20in.mp4" poster="/images/posters/stars-honey/1.jpg" />
      </SectionMedia>

      <SectionText title="BRANDED AND PACKED" align="center">
        <p>The unwrapped bars show the texture of each filling and coating. Packaging and ingredient compositions distinguish the flavors while keeping the product range consistent.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/1.avif" alt="Raspberry donut bar Stars+Honey brand poster design" width={1720} height={1720} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/2160]" src="https://klad.b-cdn.net/stars-honey/F_05%20brand%20brackets%202_4.mp4" poster="/images/posters/stars-honey/2.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/2.avif" alt="Branded packaging boxes Stars+Honey in single flavour" width={1720} height={1164} />
      </SectionMedia>

      <SectionText align="center">
        <p>The same models and packaging layouts support the core range, new flavors and holiday editions.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/1644]" src="https://klad.b-cdn.net/stars-honey/F_02%20taste%20range%20ver%2010.mp4" poster="/images/posters/stars-honey/3.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/3.avif" alt="Branded packaging boxes Stars+Honey in multiple flavours" width={1720} height={1164} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/3774]" src="https://klad.b-cdn.net/stars-honey/F_10%20photo%20bang_3.mp4" poster="/images/posters/stars-honey/4.jpg" />
      </SectionMedia>

      <SectionText align="right">
        <p>Ingredient renders give each flavor a separate set of images and animations for social posts.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/4.avif" alt="Raspberry donut flavour brand poster design for Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/5.avif" alt="Logo poster with 3D bar design and packaging overlay" width={1720} height={967} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/6.avif" alt="Art directed shot of coffee and 3D visualised bar for Stars+Honey" width={1720} height={968} />
      </SectionMedia>

      <SectionText title="New ways to create visual stories" align="center">
        <p>The final library includes product renders, packaging, ingredient explosions and compositions for social posts. The team can combine them for new campaigns without rebuilding the assets.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/7.avif" alt="Art directed shot of girl running in the fields with the 3D visualised bar for Stars+Honey" width={1720} height={1013} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/1622]" src="https://klad.b-cdn.net/stars-honey/F_15%20brand%20carousel_3.mp4" poster="/images/posters/stars-honey/5.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/8.avif" alt="Photography done by Stars+Honey" width={1720} height={1053} />
      </SectionMedia>

      <SectionText align="center">
        <p>We combined the new 3D assets with Stars+Honey’s existing photography, keeping useful images in circulation alongside the new work.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1280]" src="https://klad.b-cdn.net/stars-honey/F_18%20couple%20scene.mp4" poster="/images/posters/stars-honey/6.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/9.avif" alt="Shot of a woman holding 3D visualised Stars+Honey bar in flavour-matching colour" width={1720} height={931} />
      </SectionMedia>

      <SectionText align="center">
        <p>We presented the bars as everyday snacks. Food textures, ingredient shots and lifestyle photography took priority over the clinical imagery often used for supplements.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/10.avif" alt="Brand shot of a couple sharing Stars+Honey" width={1720} height={966} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_21%20ingredient%20explosion%20light.mp4" poster="/images/posters/stars-honey/7.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/11.avif" alt="All flavour 3D visualisations for Stars+Honey done by Klad" width={1720} height={1720} />
      </SectionMedia>

      <SectionText align="left">
        <p>Materials, textures and lighting setups are reusable. New product variations can be made from the existing library.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/12.avif" alt="Cherry chocolate waffle cone 3D flavour visualisation" width={1720} height={1145} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/13.avif" alt="Brand photography to support new cherry flavour launch" width={1720} height={853} />
      </SectionMedia>

      <SectionText align="center">
        <p>Holiday flavors use brighter colors and stronger ingredient compositions. They share the same packaging and product models as the core range.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/14.avif" alt="Gingerbread cookie 3D flavour visualisation and brand packaging for Stars+Honey" width={1720} height={1092} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1920/1080]" src="https://klad.b-cdn.net/stars-honey/F_27%20ingredient%20explosion%20dark.mp4" poster="/images/posters/stars-honey/8.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/stars-honey/15.avif" alt="Burst of Christmas flavours 3D shot" width={1720} height={966} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/linux-mint" label="Previous" />
        <Button as="a" href="/work?case=stars-honey" label="Close" />
        <Button as="a" href="/work/circus" label="Next" />
      </footer>
    </CaseStudy>
  )
}
