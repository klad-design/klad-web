import Image from 'next/image'

import { SectionMedia, SectionText } from '@/app/work/sections'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

const mediaSizes = '(min-width: 1536px) calc(100vw - 200px), (min-width: 1024px) calc(100vw - 150px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 20px)'
const pairedMediaSizes = '(min-width: 1536px) calc((100vw - 200px) / 2), (min-width: 1024px) calc((100vw - 150px) / 2), (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 20px)'

// Figma template copy is intentionally preserved for this unpublished pre-build.
const introCopy = 'Open-source software compromises value of good design, which is strange as good design just like good software is seeking to create simple, yet effective solutions which are enjoyed by their users. Open-source software compromises value of good design, which is strange as good design just like good software is seeking to create simple, yet effective solutions which are enjoyed by their users. '
const perspectiveCopy = 'Our work isn’t about appeasing. It’s about elevating. We listen closely but speak honestly. Our role isn’t to echo your views, but to broaden them.'
const shortCopy = 'Our work isn’t about appeasing. It’s about elevating. '
const teamCopy = (
  <>
    We bring hands-on, experienced
    {' '}
    <span className="underline">team</span>
    {' '}
    of specialists and artists who focus&nbsp;solely on&nbsp;design, delivering unique solutions without outsourcing or&nbsp;co-creation.
    <br />
    {perspectiveCopy}
  </>
)

const sections = [
  { type: 'media', images: [{ src: '/images/outpost/01.avif', width: 3440, height: 2052, alt: 'Outpost campaign with striped 3D forms and the message Your business is now borderless' }] },
  { type: 'media', images: [{ src: '/images/outpost/02.avif', width: 3440, height: 2052, alt: 'Outpost wordmark and striped symbol on charcoal' }] },
  { type: 'media', images: [{ src: '/images/outpost/03.avif', width: 3440, height: 978, alt: 'Outpost striped brand animation still' }] },
  { type: 'text', align: 'center', paragraphs: [introCopy] },
  { type: 'media', images: [{ src: '/images/outpost/04.avif', width: 3440, height: 1934, alt: 'Outpost brand motion frame' }] },
  { type: 'media', images: [{ src: '/images/outpost/05-left.avif', width: 1720, height: 1720, alt: 'Stepped diagonal Outpost brand pattern' }, { src: '/images/outpost/05-right.avif', width: 1720, height: 1720, alt: 'Hand writing beside a calculator and dollar bills on pale green' }] },
  { type: 'media', images: [{ src: '/images/outpost/06.avif', width: 3440, height: 2052, alt: 'Outpost striped pattern in 3D' }] },
  { type: 'text', align: 'right', paragraphs: [teamCopy] },
  { type: 'media', images: [{ src: '/images/outpost/07.avif', width: 3440, height: 2824, alt: 'Outpost world map poster and brand colour palette' }] },
  { type: 'media', images: [{ src: '/images/outpost/08-left.avif', width: 1720, height: 1720, alt: 'Wherever you’re going, we’re already there Outpost poster' }, { src: '/images/outpost/08-right.avif', width: 1720, height: 1720, alt: 'Coloured cables connected to a network switch' }] },
  { type: 'media', images: [{ src: '/images/outpost/09.avif', width: 3440, height: 2052, alt: 'Outpost campaign featuring an athlete on a running track' }] },
  { type: 'text', align: 'center', paragraphs: [introCopy] },
  { type: 'media', images: [{ src: '/images/outpost/10.avif', width: 3440, height: 1934, alt: 'Outpost brand motion frame' }] },
  { type: 'media', images: [{ src: '/images/outpost/11-left.avif', width: 1720, height: 1720, alt: 'Outpost branded dollar bills on pale blue' }, { src: '/images/outpost/11-right.avif', width: 1720, height: 1720, alt: 'Outpost email signature in a message compose window' }] },
  { type: 'media', images: [{ src: '/images/outpost/12.avif', width: 3440, height: 2052, alt: 'Outpost website introduction with stepped brand graphics' }] },
  { type: 'media', images: [{ src: '/images/outpost/13.avif', width: 3440, height: 1936, alt: 'Diagram showing the Outpost embedded Tax of Record model' }] },
  { type: 'media', images: [{ src: '/images/outpost/14.avif', width: 3440, height: 2052, alt: 'Outpost open box illustration on a striped background' }] },
  { type: 'text', align: 'right', paragraphs: [teamCopy, perspectiveCopy, shortCopy, shortCopy] },
  { type: 'media', images: [{ src: '/images/outpost/15.avif', width: 3440, height: 2052, alt: 'Laptop displaying the Outpost website on a pale green armchair' }] },
  { type: 'media', images: [{ src: '/images/outpost/16.avif', width: 3440, height: 2052, alt: 'Outpost symbol in a browser tab and the outpost.ai address' }] },
  { type: 'media', images: [{ src: '/images/outpost/17.avif', width: 3440, height: 3590, alt: 'Outpost platform page explaining automatic tax processing and embedded Tax of Record' }] },
  { type: 'media', images: [{ src: '/images/outpost/18.avif', width: 3440, height: 2052, alt: 'Laptop displaying the Outpost tax processing website' }] },
  { type: 'media', images: [{ src: '/images/outpost/19.avif', width: 3440, height: 2052, alt: 'Outpost mobile website layouts and navigation' }] },
  { type: 'media', images: [{ src: '/images/outpost/20.avif', width: 3440, height: 2052, alt: 'Outpost developer platform campaign with striped geometric forms' }] },
  { type: 'media', images: [{ src: '/images/outpost/21-left.avif', width: 1720, height: 1720, alt: 'Outpost market selector showing Canada and country flags' }, { src: '/images/outpost/21-right.avif', width: 1720, height: 1720, alt: 'Outpost set of pastel 3D brand icons' }] },
  { type: 'media', images: [{ src: '/images/outpost/22.avif', width: 3440, height: 2052, alt: 'Collection of Outpost interface components and product screens' }] },
  { type: 'media', images: [{ src: '/images/outpost/23.avif', width: 3440, height: 2052, alt: 'Black and white connectors on a pale purple background' }] },
  { type: 'media', images: [{ src: '/images/outpost/24-left.avif', width: 1720, height: 1720, alt: 'Striped Outpost puzzle piece on pale blue' }, { src: '/images/outpost/24-right.avif', width: 1720, height: 1720, alt: 'Person holding a phone displaying the Outpost mobile website' }] },
  { type: 'media', images: [{ src: '/images/outpost/25.avif', width: 3440, height: 2052, alt: 'Outpost outline icon set on charcoal' }] },
  { type: 'media', images: [{ src: '/images/outpost/26.avif', width: 3440, height: 2052, alt: 'Outpost team management interface over a world map' }] },
  { type: 'media', images: [{ src: '/images/outpost/27.avif', width: 3440, height: 2052, alt: 'Outpost product sidebar over a striped brand pattern' }] },
  { type: 'media', images: [{ src: '/images/outpost/28.avif', width: 3440, height: 2052, alt: 'Outpost world map showing supported markets' }] },
  { type: 'media', images: [{ src: '/images/outpost/29.avif', width: 3440, height: 2052, alt: 'Outpost business account dashboard on a pale purple background' }] },
  { type: 'text', align: 'right', paragraphs: [teamCopy, perspectiveCopy, shortCopy, shortCopy] },
  { type: 'media', images: [{ src: '/images/outpost/30.avif', width: 3440, height: 2052, alt: 'Collection of Outpost website layouts and brand graphics' }] },
  { type: 'media', images: [{ src: '/images/outpost/31.avif', width: 3440, height: 2052, alt: 'Outpost campaign about one integration for every market' }] },
  { type: 'media', images: [{ src: '/images/outpost/32-left.avif', width: 1720, height: 1720, alt: 'Sell globally, stay compliant Outpost poster' }, { src: '/images/outpost/32-right.avif', width: 1720, height: 1720, alt: 'Outpost T-shirt in branded packaging' }] },
  { type: 'media', images: [{ src: '/images/outpost/33.avif', width: 3440, height: 2052, alt: 'Row of sculpted mugs in the Outpost brand colours' }] },
  { type: 'media', images: [{ src: '/images/outpost/34-left.avif', width: 1720, height: 1720, alt: 'Outpost brand motion frame' }, { src: '/images/outpost/34-right.avif', width: 1720, height: 1720, alt: 'Stacked Outpost mugs on a pale purple surface' }] },
  { type: 'media', images: [{ src: '/images/outpost/35.avif', width: 3440, height: 2052, alt: 'Person wearing a fleece jacket with the Outpost striped symbol' }] },
  { type: 'media', images: [{ src: '/images/outpost/36.avif', width: 3440, height: 1934, alt: 'Outpost campaign with the message Never think about audits' }] },
  { type: 'media', images: [{ src: '/images/outpost/37-left.avif', width: 1720, height: 1720, alt: 'Outpost world map poster with green graphics and a silver spoon' }, { src: '/images/outpost/37-right.avif', width: 1720, height: 1720, alt: 'Outpost Guess the market poster with a striped classical sculpture' }] },
  { type: 'text', align: 'right', paragraphs: [teamCopy] },
  { type: 'media', images: [{ src: '/images/outpost/38.avif', width: 3440, height: 2052, alt: 'Outpost hiring campaign on a large outdoor billboard' }] },
  { type: 'media', images: [{ src: '/images/outpost/39.avif', width: 3440, height: 2052, alt: 'Outpost striped 3D brand pattern' }] },
  { type: 'media', images: [{ src: '/images/outpost/40-left.avif', width: 1720, height: 1720, alt: 'Phone displaying the Outpost mobile website on grey' }, { src: '/images/outpost/40-right.avif', width: 1720, height: 1720, alt: 'Outpost circular line illustration' }] },
  { type: 'text', align: 'center', paragraphs: [introCopy] },
  { type: 'media', images: [{ src: '/images/outpost/41.avif', width: 3440, height: 2052, alt: 'White Outpost cap on a reflective blue surface with the words God Egor' }] },
  { type: 'media', images: [{ src: '/images/outpost/42.avif', width: 3440, height: 1936, alt: 'Outpost closing brand motion frame' }] },
] as const

export function CasePage() {
  return (
    <main className="pb-10 2xl:[&>section:has(img)]:py-[25px]">
      <header className="relative grid-container my-2.5 lg:gap-y-20 pb-10 2xl:min-h-[583px] 2xl:grid-rows-[272px_1fr] 2xl:gap-y-0 2xl:pb-0">
        <div className="col-span-full flex gap-5 items-start justify-between md:justify-end md:gap-10 md:absolute md:top-0 md:right-0 lg:gap-[45px]">
          <Button as="a" href="/work/chainviz" label="Previous" />
          <Button as="a" href="/work/datalane" label="Next" />
          <Button as="a" href="/work" label="Close" />
        </div>

        <div className="col-span-full mt-10 mb-12 md:mt-0 md:mb-24 lg:col-span-full lg:order-first">
          <h1 className="text-nowrap text-[12vw] md:text-[60px] lg:text-[4vw] tracking-normal leading-[90%] uppercase -rotate-2 md:-mt-2.5 lg:-mt-5">
            <TextBlur isBold>Outpost</TextBlur>
          </h1>
        </div>

        <div className="flex flex-col items-start gap-[5px] blur-regular uppercase p4 leading-none">
          <div>Branding</div>
          <div>3D &amp; motion</div>
          <div>Web</div>
        </div>

        <div className="flex flex-col items-start gap-[5px]">
          <Button as="a" href="https://outpost.ai/" label="Website" />
          {/* shortcut: Figma has no Behance or App URLs; enable these links when supplied. */}
          <Button label="Behance" disabled title="Coming soon" className="disabled:cursor-default" />
          <Button label="App" disabled title="Coming soon" className="disabled:cursor-default" />
        </div>

        <div className="flex flex-col gap-5 mt-4 md:mt-0 md:gap-3 lg:col-start-4 lg:max-w-[180px] 2xl:max-w-[240px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Solution</h2>
            <div className="p5">
              <p>Started website update and markup. Discovered and fixed redundant web infrastructure. Redesigned website, created new brand visuals &amp; elements for windows decals. Developing brand starter packs for new clients as a part of the ongoing collaboration.</p>
            </div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Task</h2>
            <div className="p5">
              <p>Company wanted to do the redesign without actual redesign as they had a lot of physical materials and interior design that has old visuals.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-4 md:mt-0 md:w-[130px] md:ml-auto lg:w-auto lg:ml-0 2xl:w-[160px] 2xl:gap-4 2xl:-translate-x-[160px]">
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Country</h2>
            <div className="p5">Netherlands</div>
          </div>
          <div className="flex flex-col gap-[3px]">
            <h2 className="blur-regular uppercase p4">Industry</h2>
            <div className="p5">Lifestyle &amp; Well-being</div>
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

      {sections.map((section, index) => section.type === 'text'
        ? (
            <SectionText key={index} align={section.align}>
              <div className={`flex flex-col gap-5 2xl:py-[75px] 2xl:text-p2-2xl ${section.align === 'center' ? '2xl:w-[1300px] 2xl:-ml-[162px]' : '2xl:w-[597px] 2xl:-ml-[207px]'}`}>
                {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              </div>
            </SectionText>
          )
        : (
            <SectionMedia key={section.images[0].src}>
              <div className={section.images.length === 2 ? 'grid md:grid-cols-2' : undefined}>
                {section.images.map(image => (
                  <Image
                    key={image.src}
                    unoptimized
                    preload={index === 0}
                    sizes={section.images.length === 2 ? pairedMediaSizes : mediaSizes}
                    className="w-full"
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                  />
                ))}
              </div>
            </SectionMedia>
          ))}

      <footer className="flex justify-center gap-10">
        <Button as="a" href="/work/chainviz" label="Previous" />
        <Button as="a" href="/work/datalane" label="Next" />
      </footer>
    </main>
  )
}
