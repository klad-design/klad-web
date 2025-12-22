import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import { TextBlur } from '@/components/ui/TextBlur'

export const metadata: Metadata = {
  title: 'Process page',
}

export default function Process() {
  return (
    <section className="md:flex md:flex-col md:min-h-svh pb-2.5 pt-[65px] md:pt-[150px] lg:pt-0">
      <h1 className="md:text-nowrap text-[20vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        <TextBlur isBold>
          Process
          {' '}
          <span className="mt-2 block md:inline">过程</span>
        </TextBlur>
      </h1>
      <div className="md:grow grid-container md:grid-cols-12 gap-y-[30px] md:gap-y-9 lg:gap-y-0 lg:grid-rows-[1fr_auto_auto] mt-10 md:mt-16 lg:mt-20">
        <div className="col-span-2 md:col-start-4 md:col-span-6 lg:col-span-1 lg:self-center">
          <div className="p4 uppercase mb-4">
            <TextBlur isBold>Expected management process</TextBlur>
          </div>
          <div className="p3 flex flex-col gap-4">
            <p>
              We start with a short discovery call, followed by a proposal if the project is a good fit. Each project has a dedicated manager – usually
              {' '}
              <Link className="underline" href="#">Egor</Link>
              {' '}
              or
              {' '}
              <Link className="underline" href="#">Daria</Link>
              {' '}
              – who serves as your sole point of contact.
            </p>
          </div>
          <div className="p5 flex flex-col gap-4 max-w-[264px] md:max-w-[320px] lg:max-w-[432px] mt-[30px]">
            <p>Projects are quoted based on discovery and briefing. We typically bill 30–40 hours per person per week, and most projects run eight weeks or longer.</p>
            <p>
              We skip wireframes, instead using visual references and content planning from the start. You’ll have a multiple rounds of discussions, but final visual calls are made by the lead designer. This ensures quality and accountability, for more details refer to
              {' '}
              <Link className="underline" href="/expectations">expectations</Link>
              . We can support in-house teams or act as your external design department. Every collaboration comes with a dedicated manager who handles all communication.
            </p>
          </div>
        </div>
        <div className="col-span-2 md:col-span-full lg:col-start-1 lg:row-start-1 lg:col-span-3 lg:self-center -mx-2.5 md:mt-3 lg:-mt-2.5 lg:mr-2.5 lg:mb-5">
          <Image className="lg:max-w-[85%] dark:invert" src="/images/process.svg" alt="Process picture" width={930} height={330} />
        </div>
        <div className="md:col-span-4 lg:col-span-1 lg:col-start-1">
          <div className="flex flex-col gap-2.5 p4">
            <div className="uppercase">
              <TextBlur isBold>Branding</TextBlur>
            </div>
            <div className="uppercase">
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">1</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Briefing
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">2</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Research
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">3</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Concept definition
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">4</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Discussions
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">5</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Foundation design
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">6</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Identity elements
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">7</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Brand Guides
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">8</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Design support (optional)
                </div>
              </TextBlur>
            </div>
            <div className="mt-1">
              <TextBlur isBold>8-12 weeks</TextBlur>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-1">
          <div className="flex flex-col gap-2.5 p4">
            <div className="uppercase">
              <TextBlur isBold>Web design</TextBlur>
            </div>
            <div className="uppercase">
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">1</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Briefing
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">2</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Visual Research
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">3</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  References-based page flow
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">4</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Discussions & final copy
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">5</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Secondary pages
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">6</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Responsiveness
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">7</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Development
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">8</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Launch
                </div>
              </TextBlur>
            </div>
            <div className="flex flex-col mt-1">
              <TextBlur isBold>4-5 weeks for smaller sites</TextBlur>
              <TextBlur isBold>10-12 weeks for large websites or web apps</TextBlur>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-1">
          <div className="flex flex-col gap-2.5 p4">
            <div className="uppercase">
              <TextBlur isBold>3d & motion</TextBlur>
            </div>
            <div className="uppercase">
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">1</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Briefing
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">2</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Research
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">3</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Storyboard
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">4</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Discussions
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">5</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Styleframes
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">6</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Review
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">7</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Animation and&nbsp;effects
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">8</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Sound Design and&nbsp;finalisation
                </div>
              </TextBlur>
              <TextBlur isBold>
                <div className="flex">
                  <span className="inline-flex min-w-[12px]">9</span>
                  <span className="inline-block min-w-[8px]">.</span>
                  Launch
                </div>
              </TextBlur>
            </div>
            <div className="mt-1">
              <TextBlur isBold>4-6 weeks</TextBlur>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-start-7 md:col-span-6 lg:col-start-auto lg:col-span-1 mt-14 lg:mt-0">
          <div className="flex flex-col gap-y-1 uppercase">
            <div className="flex flex-col gap-y-1">
              <div className="p5">
                <TextBlur isBold>Next branding start date:</TextBlur>
              </div>
              <div className="p1">
                <TextBlur isBold>21 April, 2025</TextBlur>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="p5">
                <TextBlur isBold>Next web design start date:</TextBlur>
              </div>
              <div className="p1">
                <TextBlur isBold>1 may, 2025</TextBlur>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="p5">
                <TextBlur isBold>Next 3d/motion start date:</TextBlur>
              </div>
              <div className="p1">
                <TextBlur isBold>12 April, 2025</TextBlur>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:row-start-4 md:col-span-6 lg:row-start-auto lg:col-span-2 md:self-end mt-10 lg:mt-0">
          <div className="flex flex-col gap-3 p4 uppercase xl:max-w-[420px] 2xl:max-w-[540px]">
            <TextBlur isBold>
              <Image className="md:w-auto md:h-7 2xl:h-9 dark:invert" src="/images/dagger.svg" alt="Dagger image" width={116} height={38} />
            </TextBlur>
            <TextBlur isBold>
              Always depends on the project. These are just general milestones and may not apply to every case.
              {' '}
              <Link className="underline underline-offset-4" href="mailto:info@klad.design">Reach out</Link>
              {' '}
              to learn more.
            </TextBlur>
          </div>
        </div>
      </div>
    </section>
  )
}
