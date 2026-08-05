'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

import { SectionMedia } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

export function CasePage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return (
    <main className="pb-10">
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/circus" label="Previous" />
          <Button as="a" href="/work/chainviz" label="Next" />
          <Button as="a" href="/work" label="Close" />
        </div>

        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>DataLane</TextBlur>
          </h1>
        </div>

        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Branding</div>
          <div>Web</div>
          <div>Datavis</div>
        </div>

        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://www.datalane.com/" label="Website" />
        </div>

        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>Create a distinctive brand and digital presence for DataLane, a GTM engineering platform helping enterprise teams reach local businesses.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>An ongoing design partnership covering brand identity, website implementation and custom data visualisation across product, content and physical touchpoints.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">USA</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">GTM engineering</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">Ongoing partnership</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2026</div>
          </div>
        </div>
      </header>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/1.avif" alt="DataLane homepage with a cobalt-blue network graphic and the headline ‘Scraping the mess isn’t enough.’" width={3840} height={2456} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/2.avif" alt="DataLane wordmark and dotted D symbol centred on a light-grey background" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/3.avif" alt="Dotted DataLane D symbol centred on a black background" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/4.avif" alt="DataLane loading screen with a segmented progress bar on a blue background" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/5.avif" alt="Data quality diagram with circles and labels for missing inputs, duplicates and clean inputs" width={3448} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/6.avif" alt="DataLane navigation categories arranged over a black network diagram" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/7.avif" alt="Blue brand statement layout with an oversized DataLane wordmark" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/8.avif" alt="Typeface specimen beside a receipt-styled DataLane data graphic" width={3440} height={2350} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/9.avif" alt="DataLane campaign layout connecting a customer portrait to data points around a highlighted headline" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/10.avif" alt="Social campaign layout with pedestrians at a crossing and messaging about freeing sales reps from manual research" width={3440} height={1336} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/11.avif" alt="DataLane brand palette with blue, greyscale and coral colour swatches" width={3440} height={1186} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/12.avif" alt="Blue DataLane poster with an outlined human profile and messaging about reaching on-site buyers" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/13.avif" alt="White geometric lattice sphere on a textured blue background" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/14.avif" alt="Horizontal strip of blue and grey DataLane brand patterns" width={3440} height={446} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/15.avif" alt="DataLane poster with a stylised globe and messaging about seeing the whole market" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/16.avif" alt="Blue DataLane hoodie shown on a model beside a close-up of the woven brand label" width={3440} height={1546} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/17.avif" alt="Front and back views of a blue DataLane hoodie" width={3440} height={2030} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/18.avif" alt="Audience viewing the DataLane website on a large stage display" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/19.avif" alt="Vertical strip of blue DataLane business cards on a black background" width={3440} height={1935} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/21.avif" alt="Portrait-led DataLane social post titled ‘7 Diagrams That Explain Why Restaurant GTM Is Broken’" width={3441} height={1937} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/22.avif" alt="DataLane call-to-action screen with brand messaging and a get-in-touch button" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/23.avif" alt="Restaurant storefront annotated with business data beside a mapped location view" width={3440} height={1937} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/24.avif" alt="DataLane browser and mobile website mockups on a blue-and-black layout" width={3440} height={1935} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/25.avif" alt="Long-form DataLane article about B2B restaurant sales paired with data diagrams" width={3440} height={2052} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/26.avif" alt="Grid of DataLane data visualisations including charts, funnels, layers and filters" width={3440} height={2782} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/27.avif" alt="Web layouts showing GTM analysis and a campaign filter interface over aerial imagery" width={3440} height={1937} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/28.avif" alt="DataLane product interface listing matching accounts beneath local-business data messaging" width={3440} height={2360} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/29.avif" alt="Retail employee photograph beside a list of local-business data fields" width={3440} height={1937} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/30.avif" alt="DataLane office interior with a blue column, transparent bench and illuminated brand message" width={3440} height={2782} />
      </SectionMedia>

      <SectionMedia>
        <Image className="w-full" src="/images/datalane/31.avif" alt="DataLane wordmark formed from white particles on a blue background" width={3440} height={1748} />
      </SectionMedia>

      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/circus" label="Previous" />
        <Button as="a" href="/work/chainviz" label="Next" />
      </footer>
    </main>
  )
}
