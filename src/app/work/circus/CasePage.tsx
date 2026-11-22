import Image from 'next/image'

import { CaseStudy } from '@/app/work/CaseStudy'
import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { CaseVideo } from '@/components/ui/CaseVideo'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  return (
    <CaseStudy slug="circus" closeHref="/work?case=circus">

      {/* Header */}
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">

        {/* Menu */}
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/stars-honey" label="Previous" />
          <Button as="a" href="/work/datalane" label="Next" />
        </div>

        {/* Title */}
        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Circus</TextBlur>
          </h1>
        </div>

        {/* Tags */}
        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Web design</div>
          <div>3D & motion</div>
          <div>Webflow dev</div>
        </div>

        {/* Links */}
        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://www.circus-group.com/" label="Website" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>After rebranding, Circus Group needed a full revamp of their website to match the new visual language of the company.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>Completely redesigned the client’s existing website, adding a strong product focus with 3D visualisation of the robot and motion design.</p>
            </div>
          </div>
        </div>

        {/* Short information */}
        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">Germany</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Robotics</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">6 weeks</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2024</div>
          </div>
        </div>
      </header>

      <SectionText title="Robotics-centered website" align="center">
        <p>We redesigned Circus’ website around its robotic kitchen, using 3D models and animation to explain the product. The work followed the existing brand system.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1720/1152]" src="https://klad.b-cdn.net/circus/1.mp4" poster="/images/posters/circus/1.jpg" />
      </SectionMedia>

      <SectionText align="right">
        <p>The engineering models and technical schematics supplied by Circus were the basis for our 3D assets. We adapted them for the website while retaining the machine’s construction and internal details.</p>
        <p>Animations show the cleaning cycle, falling droplets and freezing mechanisms. These small details explain what happens inside the kitchen.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[1720/1062]" src="https://klad.b-cdn.net/circus/2.mp4" poster="/images/posters/circus/2.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/3.avif" alt="Kitchen robots blueprints done by Klad" width={1720} height={660} />
      </SectionMedia>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3440/1860]" src="https://klad.b-cdn.net/circus/3.mp4" poster="/images/posters/circus/3.jpg" />
      </SectionMedia>

      <SectionText align="center">
        <p>The “look inside” interaction reveals the machine’s internal structure as the cursor moves across it.</p>
      </SectionText>

      <SectionMedia>
        <CaseVideo className="w-full aspect-[3840/2168]" src="https://klad.b-cdn.net/circus/4.mp4" poster="/images/posters/circus/4.jpg" />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/6.avif" alt="Rethinking food with AI-robotics brand gradient done by Klad" width={1720} height={1071} />
      </SectionMedia>

      <SectionText align="left">
        <p>We also animated the existing gradients, logo and graphic elements, using the same timing and transitions as the 3D sequences.</p>
        <p>Our team designed and built the website in Webflow, including the 3D assets and motion.</p>
        <p>Branding and website copy were provided by Ming Labs.</p>
      </SectionText>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/7.avif" alt="Mainframe 3D render for Circus Group done by Klad" width={1720} height={1188} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/8.avif" alt="Refrigerator blueprint render" width={1720} height={590} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/9.avif" alt="Roboarm render for Circus Group done by Klad" width={1720} height={820} />
      </SectionMedia>

      <SectionMedia>
        <Image sizes="(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)" className="w-full" src="/images/circus/10.avif" alt="Brand gradient Circus Group banner done by Klad" width={1720} height={667} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/stars-honey" label="Previous" />
        <Button as="a" href="/work?case=circus" label="Close" />
        <Button as="a" href="/work/datalane" label="Next" />
      </footer>
    </CaseStudy>
  )
}
