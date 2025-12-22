'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

export function Call() {
  return (
    <section className="pt-32 md:pt-36 pb-[60px] md:pb-[160px]">
      <div className="flex flex-col items-start text-nowrap tracking-normal leading-none uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        <div className="relative">
          <div className="text-[13vw] md:text-[80px] lg:text-[7.2vw]">
            <TextBlur>预约电话</TextBlur>
          </div>
          <div
            className="absolute top-0 left-full md:top-auto md:-bottom-1 lg:bottom-2 rotate-[4deg] md:rotate-2 text-[3.4vw] md:text-[13px] lg:text-[1.05vw] ml-[0.5em] md:ml-[1.1em] whitespace-pre-wrap blurred blurred--active"
            data-label={'Making \nyour \ncompetitors \njealous'}
          >
            <span>{'Making \nyour \ncompetitors \njealous'}</span>
            <Image className="absolute -top-[34px] md:-top-[65px] lg:-top-[70px] right-1 size-[60px] md:size-[100px] lg:size-[120px]" src="/images/icon-call.svg" alt="Icon call" width={50} height={50} />
          </div>
        </div>
        <h2 className="text-[16.3vw] md:text-[100px] lg:text-[10.5vw] md:mt-2.5">
          <a href="https://cal.com/klad-design/discovery" target="_blank">
            <TextBlur>
              Book a call
            </TextBlur>
          </a>
        </h2>
      </div>
      <div className="grid-container mt-10 lg:mt-[90px]">
        <div className="col-span-2 md:col-span-full lg:col-span-2 lg:col-start-2 lg:pr-5">
          <div className="md:max-w-[560px] lg:max-w-full md:mx-auto grid grid-cols-3 gap-2.5">
            <Image className="saturate-0 contrast-100 brightness-90" src="/images/call-1.png" alt="City image" width={900} height={600} />
            <Image className="saturate-0 contrast-100 brightness-90" src="/images/call-2.png" alt="City image" width={900} height={600} />
            <Image className="saturate-0 contrast-100 brightness-90" src="/images/call-3.png" alt="City image" width={900} height={600} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-[30px] col-span-2 lg:col-span-1 md:col-start-2 lg:col-start-4 mt-10 md:mt-[50px] lg:mt-0 lg:max-w-[320px]">
          <p className="p3">Got an idea or want to work with us? We’re always open to new talent. Reach out to Egor to chat.</p>
          <p className="p5">Running an open-source, non-profit, or free education project? Discounted rates are available. We&#39;re always happy to connect and see how we can help.</p>
          <Button as="a" href="/privacy.txt" className="button button--xs underline" target="_blank" label="privacy.txt" />
        </div>
      </div>
    </section>
  )
}
