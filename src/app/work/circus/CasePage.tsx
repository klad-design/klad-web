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
          <Button as="a" href="/work/chainviz" label="Next" />
          <Button as="a" href="/work" label="Close" />
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
          <Button as="a" href="https://circus-dev.webflow.io/" label="Website" />
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

      <SectionText title="Circus Group - roboticscentered website" align="center">
        <p>For this project, we were invited to rethink Circus’ digital presence through a 3D-focused web experience. Working carefully within the provided brand system, our goal was to create a product-driven website that feels impressive, immersive and visually compelling. Through realistic 3D and with some motion design, we transformed the website so the product takes center stage - tactile and impossible to ignore.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[1720/1152]" src="https://klad.b-cdn.net/circus/1.mp4" autoPlay loop muted playsInline preload="metadata" />
      </SectionMedia>

      <SectionText align="right">
        <p>To ensure our product visuals are both beautiful and accurate, we worked with engineering-grade 3D models of the robotic kitchen, as well as technical schematics that served as the foundation for our visual development. Using these precise references, we translated complex internal systems into visually appealing, high-fidelity 3D assets tailored specifically for the web.</p>
        <p>We enhanced the realism and engagement with subtle effects like droplets falling after cleaning, freezing mechanisms activation and other small animations that bring the product to life. These details contributed a lot to the tactile effects, making the digital experience feel almost physical.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[1720/1062]" src="https://klad.b-cdn.net/circus/2.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/3.avif" alt="Kitchen robots blueprints done by Klad" width={1720} height={660} />
      </SectionMedia>

      <SectionMedia>
        <video className="w-full aspect-[3440/1860]" src="https://klad.b-cdn.net/circus/3.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

       <SectionText align="center">
        <p>One of the standout features is an interactive “look inside” effect. By moving the cursor across the machine, users can reveal its internal structure and explore how the system operates beneath the surface. This interaction transforms technical complexity into an intuitive, exploratory experience.</p>
      </SectionText>

      <SectionMedia>
        <video className="w-full aspect-[3840/2168]" src="https://klad.b-cdn.net/circus/4.mp4" autoPlay loop muted playsInline preload="none" />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/6.avif" alt="Rethinking food with AI-robotics brand gradient done by Klad" width={1720} height={1071} />
      </SectionMedia>

       <SectionText align="left">
        <p>Alongside the 3D layer, we animated existing 2D brand elements - gradients, logo and graphic accents - carefully integrating them into the motion language of the website. This ensured that the immersive visuals remained fully aligned with the established identity.</p>
        <p>As a result, we designed a highly engaging, visually striking website that not only showcases the product in depth but elevates the entire brand presence. The project was fully implemented in Webflow, translating complex 3D and motion ideas into a smooth and production-ready experience.</p>
        <p>Website design, development and 3D were provided by our team at Klad. The branding and website copy was provided by Ming Labs.</p>
      </SectionText>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/7.avif" alt="Mainframe 3D render for Circus Group done by Klad" width={1720} height={1188} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/8.avif" alt="Refridgerator bluebrint render" width={1720} height={590} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/9.avif" alt="Roboarm render for Circus Group done by Klad" width={1720} height={820} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/circus/10.avif" alt="Brand gradient Circus Group banner done by Klad" width={1720} height={667} />
      </SectionMedia>

      {/* Footer */}
      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/stars-honey" label="Previous" />
        <Button as="a" href="/work/chainviz" label="Next" />
      </footer>
    </main>
  )
}
