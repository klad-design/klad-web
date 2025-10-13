import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { TextBlur } from '@/components/ui/TextBlur'

export const metadata: Metadata = {
  title: 'Pricing page',
}

export default function Pricing() {
  return (
    <section className="md:flex md:flex-col md:min-h-svh pb-2.5 pt-[65px] md:pt-[150px] lg:pt-0">
      <h1 className="md:text-nowrap text-[20vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        <TextBlur isBold>
          Pricing
          {' '}
          <span className="mt-2 block md:inline">価格設定</span>
        </TextBlur>
      </h1>
      <div className="relative mt-10 md:mt-12 lg:mt-8 overflow-hidden">
        <div className="absolute left-[75px] md:left-[120px] xl:left-[200px] 2xl:left-[276px] w-[90px] md:w-[134px] xl:w-[230px] 2xl:w-[300px] top-1/2 -translate-y-1/2 text-center text-p2-2xl md:text-[28px] xl:text-p1 2xl:text-p1-2xl 2x uppercase">
          <TextBlur isBold>€80 / hr</TextBlur>
        </div>
        <Image className="dark:invert w-auto max-w-fit h-[122px] md:h-[194px] xl:h-[332px] 2xl:h-[440px] -ml-10 md:-ml-[68px] xl:-ml-[120px] 2xl:-ml-[150px]" src="/images/coins.svg" alt="Coins" width={1900} height={440} />
      </div>
      <div className="md:grow grid-container grid-cols-1 md:grid-cols-6 gap-y-[30px] mt-12 md:mt-9 lg:mt-16 2xl:mt-[86px]">
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-1">
          <div className="flex flex-col gap-2.5 p4 uppercase">
            <TextBlur isBold>Types of Engagement</TextBlur>
            <div>
              <TextBlur isBold>
                <span className="inline-flex min-w-[12px]">1</span>
                <span className="inline-block min-w-[8px]">.</span>
                Hourly commitment
              </TextBlur>
              <TextBlur isBold>
                <span className="inline-flex min-w-[12px]">2</span>
                <span className="inline-block min-w-[8px]">.</span>
                Monthly commitment
              </TextBlur>
              <TextBlur isBold>
                <span className="inline-flex min-w-[12px]">3</span>
                <span className="inline-block min-w-[8px]">.</span>
                Project - based
              </TextBlur>
            </div>
            <TextBlur isBold>Min commitment : &nbsp;90 hours</TextBlur>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <div className="p5 flex flex-col gap-1 md:max-w-[180px] 2xl:max-w-[240px]">
            <p>Projects typically last around three months. Quotes depend on our hourly rate, your materials, and requested deliverables.</p>
            <p>For long-term clients, we reserve the original hourly rates for as long as we can sustain them. The longer the commitment, the more benefits and discounts we aim to offer to support our partnership.</p>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <div className="p5 flex flex-col gap-1 md:max-w-[180px] 2xl:max-w-[240px]">
            <p>Fixed-price phases (e.g., branding, illustrations) include a set number of reviews defined in the commercial proposal, which is provided within three working days post-discovery.</p>
            <p>Hourly phases offer unlimited iterations.</p>
            <p>Work begins after pre-payment. Hourly projects are billed bi-weekly or monthly, fixed-price billing is outlined in the proposal.</p>
          </div>
        </div>
        <div className="md:col-start-4 md:col-span-3 lg:col-span-1 lg:col-start-3 xl:col-span-1 xl:col-start-3 xl:self-end mt-12 xl:mt-0 2xl:mt-[95px]">
          <div className="max-w-[240px] md:max-w-[180px] 2xl:max-w-[240px] p5">
            <p>
              If you run an open-source, non-profit, or free education project,
              {' '}
              <Link href="#" className="underline">contact us</Link>
              {' '}
              for discounted rates.
            </p>
          </div>
          <div className="flex items-center gap-3 uppercase mt-1">
            <div className="text-p1-2xl md:text-p1 2xl:text-p1-2xl">
              <TextBlur isBold>15%</TextBlur>
            </div>
            <TextBlur isBold>
              <div className="flex flex-col text-p4 md:text-p5-md 2xl:text-p4-2xl">
                <span>Discount</span>
                <span>for monthly</span>
                <span>commitment</span>
              </div>
            </TextBlur>
          </div>
        </div>
        <div className="md:col-start-4 md:col-span-3 lg:col-span-2 lg:col-start-3 xl:col-span-1 xl:col-start-4 xl:row-start-1 md:self-end xl:self-start mt-7 md:mt-0">
          <div className="flex flex-col gap-4 uppercase xl:max-w-[340px] 2xl:max-w-[440px]">
            <div className="relative p1">
              <TextBlur isBold>
                Branding is
                {' '}
                <Image className="inline align-top size-10 2xl:size-14" src="/images/hook.svg" alt="Hook icon" width={46} height={46} />
                {' '}
                always&nbsp;offered at a fixed rate.
              </TextBlur>
            </div>
            <div className="p4 blur-regular max-w-[280px] 2xl:max-w-[350px]">
              COMMERCIAL PROPOSALS ARE PROVIDED WITHIN THREE DAYS AFTER THE
              {' '}
              <Link href="#" className="underline">DISCOVERY CALL</Link>
              .
            </div>
          </div>
        </div>
        <div className="md:col-start-1 md:col-span-3 lg:col-span-2 lg:col-start-1 xl:col-span-2 md:row-start-3 xl:row-start-2 md:self-end mt-16 md:mt-0">
          <div className="flex flex-col gap-3 p4 uppercase xl:max-w-[400px] 2xl:max-w-[540px]">
            <TextBlur isBold>
              <Image className="md:w-auto md:h-7 2xl:h-9" src="/images/dagger.svg" alt="Dagger image" width={116} height={38} />
            </TextBlur>
            <TextBlur isBold>
              Each project is quoted separately based on discovery sessions and briefing. Quotations are based on the studio hourly rate and requested deliverables.
            </TextBlur>
          </div>
        </div>
      </div>
    </section>
  )
}
