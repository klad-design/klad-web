import Image from 'next/image'

import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

const mediaSizes = '(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)'
const pairedMediaSizes = '(min-width: 1536px) calc((100vw - 220px) / 2), (min-width: 1024px) calc((100vw - 170px) / 2), (min-width: 768px) calc((100vw - 100px) / 2), calc(100vw - 20px)'

const sections = [
  { type: 'media', src: '/images/datalane/1.avif', width: 3440, height: 2200, alt: 'Datalane website hero with a blue network and the headline Scraping the mess isn’t enough' },
  { type: 'pair', images: [{ src: '/images/datalane/2-left.avif', width: 1720, height: 1934, alt: 'Scattered white data points on black' }, { src: '/images/datalane/2-right.avif', width: 1720, height: 1934, alt: 'Outlined data circles on black' }] },
  { type: 'text', align: 'center', paragraphs: ['An experimental first direction helped sharpen the brief. Datalane wanted the confidence of a focused identity that enterprise buyers could trust. We narrowed the palette to black, white and blue, and let individual data points become the foundation of the graphic system.'] },
  { type: 'media', src: '/images/datalane/3.avif', width: 3440, height: 1934, alt: 'Blue tinted aerial view of city streets and buildings' },
  { type: 'media', src: '/images/datalane/4.avif', width: 3440, height: 1934, alt: 'Lists of local business data fields arranged on a white background' },
  { type: 'media', src: '/images/datalane/5.avif', width: 3440, height: 1934, alt: 'Minimal loading indicator on a blue background' },
  { type: 'text', align: 'right', paragraphs: ['Each dot represents both a point in Datalane’s data layer and a local business on a map. Together, the dots form a recognisable monogram. Across the wider identity, they become maps, charts, diagrams and illustrations: many small pieces making a larger picture.', 'We paired direct sans-serif headings with serif body text that feels more comfortable across longer reads. Geist Mono gives labels and technical moments their own voice.'] },
  { type: 'media', src: '/images/datalane/6.avif', width: 3440, height: 2052, alt: 'White Datalane wordmark and dotted symbol on black' },
  { type: 'text', align: 'center', paragraphs: ['Data visualisation is the core of the system. Maps locate businesses. Plots reveal coverage, gaps and distribution. Diagrams show how scattered records become usable information. The same dots that form the logo help Datalane explain what its technology knows.'] },
  { type: 'pair', images: [{ src: '/images/datalane/7-left.avif', width: 1724, height: 1934, alt: 'Blue diagram of missing data points' }, { src: '/images/datalane/7-right.avif', width: 1724, height: 1934, alt: 'Blue diagram comparing clean inputs and duplicates' }] },
  { type: 'pair', images: [{ src: '/images/datalane/8-left.avif', width: 1720, height: 1934, alt: 'ABC Oracle and Geist Mono type specimens' }, { src: '/images/datalane/8-right.avif', width: 1720, height: 1934, alt: 'Datalane data receipt on blue' }] },
  { type: 'media', src: '/images/datalane/9.avif', width: 3440, height: 2052, alt: 'Oversized white Datalane wordmark on blue' },
  { type: 'media', src: '/images/datalane/10.avif', width: 3440, height: 1934, alt: 'Datalane colour palette with blue, greyscale and coral swatches' },
  { type: 'media', src: '/images/datalane/11.avif', width: 3440, height: 1934, alt: 'Datalane navigation labels over a black network diagram' },
  { type: 'text', align: 'left', paragraphs: ['The system works at different speeds. On the website, a headline frames the problem while a map or chart shows what Datalane can uncover. In the app, the same visual language helps people work with that information. On social channels, it makes even a quick post recognisably Datalane.'] },
  { type: 'media', src: '/images/datalane/12.avif', width: 3440, height: 3868, alt: 'Grid of campaign graphics featuring a globe, customer photograph, dotted pattern and map' },
  { type: 'media', src: '/images/datalane/13.avif', width: 3440, height: 1934, alt: 'Dotted Datalane symbol centred on black' },
  { type: 'pair', images: [{ src: '/images/datalane/14-left.avif', width: 1720, height: 1336, alt: 'Pedestrians crossing a city street' }, { src: '/images/datalane/14-right.avif', width: 1720, height: 1336, alt: 'Datalane campaign about freeing sales representatives from manual research' }] },
  { type: 'media', src: '/images/datalane/15.avif', width: 3440, height: 2052, alt: 'Datalane social post about reaching buyers who spend their days on site' },
  { type: 'media', src: '/images/datalane/16.avif', width: 3440, height: 2052, alt: 'Blue Datalane campaign poster displayed at a bus shelter' },
  { type: 'text', align: 'right', paragraphs: ['A dot changes meaning depending on where it appears. In the monogram, points form a single recognisable shape. On a map, each one locates a business. In a chart, points show distribution, gaps, or relationships that are difficult to see in a spreadsheet. The same unit can carry the identity at different scales, from an app icon to an explanation of an entire market.'] },
  { type: 'pair', images: [{ src: '/images/datalane/17-left.avif', width: 1720, height: 1934, alt: 'Blue Datalane cap on a pale patterned background' }, { src: '/images/datalane/17-right.avif', width: 1720, height: 1934, alt: 'Back view of a person in a blue Datalane hoodie' }] },
  { type: 'media', src: '/images/datalane/18.avif', width: 3440, height: 1934, alt: 'Blue beaded Datalane lanyard with a key' },
  { type: 'pair', images: [{ src: '/images/datalane/19-left.avif', width: 1720, height: 1937, alt: 'Datalane letterhead on blue' }, { src: '/images/datalane/19-right.avif', width: 1720, height: 1937, alt: 'Datalane printed cards on a dark background' }] },
  { type: 'pair', images: [{ src: '/images/datalane/20-left.avif', width: 1721, height: 1934, alt: 'Front of a black Datalane hoodie on blue' }, { src: '/images/datalane/20-right.avif', width: 1721, height: 1934, alt: 'Back of a black Datalane hoodie on blue' }] },
  { type: 'text', align: 'center', paragraphs: ['The first Datalane selling guide ran to more than 80 pages. We designed its structure for screen and print, with isometric illustrations, GTM diagrams and data visualisations built in R. It gave the identity room to explain complex ideas at length.'] },
  { type: 'media', src: '/images/datalane/21.avif', width: 3440, height: 1934, alt: 'Collage of Datalane social posts with product messages and data graphics' },
  { type: 'media', src: '/images/datalane/22.avif', width: 3440, height: 2052, alt: 'Four pages from the Datalane selling guide' },
  { type: 'media', src: '/images/datalane/23.avif', width: 3440, height: 2052, alt: 'Person working on a laptop displaying a Datalane product page' },
  { type: 'media', src: '/images/datalane/24.avif', width: 3440, height: 1934, alt: 'Printed Datalane data cleanup kit in clear packaging' },
  { type: 'text', align: 'right', paragraphs: ['In motion, points gather, separate and settle into a larger picture. That movement from many to one shapes the easing, pacing and rhythm of transitions. We carried the rhythm into sound: an entry cue, background melodies and small sonic details make a Datalane video recognisable even without the image.'] },
  { type: 'pair', images: [{ src: '/images/datalane/25-left.avif', width: 1720, height: 1936, alt: 'Datalane campaign interface over blue aerial imagery' }, { src: '/images/datalane/25-right.avif', width: 1720, height: 1936, alt: 'Datalane browser interface on a dark graphic background' }] },
  { type: 'media', src: '/images/datalane/26.avif', width: 3440, height: 2052, alt: 'Laptop displaying the blue Datalane website hero' },
  { type: 'pair', images: [{ src: '/images/datalane/27-left.avif', width: 1720, height: 1934, alt: 'Datalane icons on a gray grid' }, { src: '/images/datalane/27-right.avif', width: 1720, height: 1934, alt: 'Datalane message about reaching on-site buyers' }] },
  { type: 'media', src: '/images/datalane/28.avif', width: 3440, height: 2360, alt: 'Datalane product interface with account data and campaign controls' },
  { type: 'pair', images: [{ src: '/images/datalane/29-left.avif', width: 1720, height: 1936, alt: 'Blue linked dot symbol on a pale background' }, { src: '/images/datalane/29-right.avif', width: 1720, height: 1936, alt: 'Datalane data graphic over a blue circular pattern' }] },
  { type: 'media', src: '/images/datalane/30.avif', width: 3440, height: 2052, alt: 'Datalane poster and printed material over a blue circular pattern' },
  { type: 'media', src: '/images/datalane/31.avif', width: 3440, height: 1934, alt: 'Long form Datalane article and data diagrams on a textured background' },
  { type: 'media', src: '/images/datalane/32.avif', width: 3440, height: 1934, alt: 'Grid of Datalane data visualisations and diagrams' },
  { type: 'media', src: '/images/datalane/33.avif', width: 3440, height: 2052, alt: 'Blue Datalane call to action with a white globe' },
  { type: 'media', src: '/images/datalane/34.avif', width: 3440, height: 2052, alt: 'Browser view of a Datalane market map and article' },
  { type: 'media', src: '/images/datalane/35.avif', width: 3440, height: 384, alt: 'Horizontal strip of pale blue and grey dotted patterns' },
  { type: 'media', src: '/images/datalane/36.avif', width: 3440, height: 1934, alt: 'Blue dotted illustration of a telephone, calendar and wallet' },
  { type: 'media', src: '/images/datalane/37.avif', width: 3440, height: 2052, alt: 'Datalane message about coordinating precise campaigns on a white background' },
  { type: 'media', src: '/images/datalane/38.avif', width: 3440, height: 1934, alt: 'Blue Datalane digital poster in a station concourse' },
  { type: 'pair', images: [{ src: '/images/datalane/39-left.avif', width: 1720, height: 1937, alt: 'Datalane mobile screen on a desk with stationery' }, { src: '/images/datalane/39-right.avif', width: 1721, height: 1937, alt: 'Blue paper clips and a desk stapler' }] },
  { type: 'pair', images: [{ src: '/images/datalane/40-left.avif', width: 1720, height: 1934, alt: 'Datalane dotted network diagram on white' }, { src: '/images/datalane/40-right.avif', width: 1720, height: 1934, alt: 'Presenter speaking beside a white background' }] },
  { type: 'text', align: 'center', paragraphs: ['Datalane asked us to continue as its design partner as soon as the nine-week project ended. The identity now extends across its product, guides, sales materials, videos, AI agent mascot and office and continues to grow with the company.'] },
  { type: 'media', src: '/images/datalane/41.avif', width: 3440, height: 1934, alt: 'Audience watching a Datalane presentation with a blue Thanks screen' },
] as const

export function CasePage() {
  return (
    <main className="pb-10">
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10">
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/circus" label="Previous" />
          <Button as="a" href="/work/chainviz" label="Next" />
          <Button as="a" href="/work?case=datalane" label="Close" />
        </div>

        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Datalane</TextBlur>
          </h1>
        </div>

        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Branding</div>
          <div>Sound &amp; motion</div>
          <div>Web</div>
        </div>

        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://www.datalane.com/" label="Website" />
        </div>

        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>Datalane had technology for finding and organising local-business data, but no established brand or website. It needed to earn enterprise buyers’ trust and stand apart from Clay’s more playful approach.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>We built Datalane’s identity around a dot: a data point and a business on a map. In nine weeks, it became a brand and website.</p>
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
            <div className="p5">GTM &amp; Data</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Length</h2>
            <div className="p5">9 weeks, ongoing</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Year</h2>
            <div className="p5">2025</div>
          </div>
        </div>
      </header>

      {sections.map(section => section.type === 'media'
        ? (
            <SectionMedia key={section.src}>
              <Image sizes={mediaSizes} className="w-full" src={section.src} alt={section.alt} width={section.width} height={section.height} />
            </SectionMedia>
          )
        : section.type === 'pair'
          ? (
              <SectionMedia key={section.images[0].src}>
                <div className="grid gap-5 md:grid-cols-2">
                  {section.images.map(image => <Image key={image.src} sizes={pairedMediaSizes} className="w-full" src={image.src} alt={image.alt} width={image.width} height={image.height} />)}
                </div>
              </SectionMedia>
            )
          : (
              <SectionText key={section.paragraphs[0]} align={section.align}>
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </SectionText>
            ))}

      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/circus" label="Previous" />
        <Button as="a" href="/work/chainviz" label="Next" />
      </footer>
    </main>
  )
}
