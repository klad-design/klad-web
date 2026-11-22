import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import { TextBlur } from '@/components/ui/TextBlur'

export const metadata: Metadata = {
  alternates: { canonical: '/expectations' },
  title: 'Expectations & Working Principles – KLAD',
  description: 'How we work and what we expect from our clients. Clear communication, respect for expertise, creative ownership and a shared commitment to strong design.',
}

export default function Expectations() {
  return (
    <main className="md:flex md:flex-col md:min-h-svh pb-2.5 pt-[65px] md:pt-[150px] lg:pt-0">
      <h1 className="md:text-nowrap text-[15vw] md:text-[min(88px,11vw)] lg:text-[10.2vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        <TextBlur isBold>
          Expectations
          {' '}
          <span className="mt-2 block md:inline">기대</span>
        </TextBlur>
      </h1>
      <div className="md:grow grid-container md:grid-cols-12 gap-y-[30px] md:gap-y-9 lg:gap-y-0 lg:grid-rows-[1fr_auto_auto] mt-10 md:mt-16 lg:mt-20">
        <div className="col-span-2 md:col-start-4 md:col-span-6 lg:col-span-1 lg:self-center">
          <div className="p3 flex flex-col gap-3.5">
            <p>
              Work directly with our experienced
              {' '}
              <Link className="underline" href="/#team">team</Link>
              {' '}
              of designers and artists. Studio owners do the work. We do not outsource or co-create.
            </p>
            <p>We listen to your brief and feedback, explain our decisions and speak honestly when we disagree. You hire us for our judgment as well as the final work.</p>
          </div>
        </div>
        <div className="col-span-2 md:col-span-full lg:col-start-1 lg:row-start-1 lg:col-span-3 lg:self-center -mx-2.5 md:mt-3 lg:-mt-2.5 lg:mr-2.5 lg:mb-5">
          <img className="lg:max-w-[85%] dark:invert" src="/images/expectations.svg" alt="Expectations picture" width={930} height={330} loading="eager" fetchPriority="high" />
        </div>
        <div className="md:col-span-4 lg:col-span-1 lg:col-start-1">
          <div className="p4 uppercase">
            <TextBlur isBold>Client isn't always right</TextBlur>
          </div>
          <div className="p5 flex flex-col gap-1.5 md:max-w-[180px] 2xl:max-w-[240px] mt-3">
            <p>When you seek help from a lawyer, you expect a solution tailored to your situation. Similarly, we offer design solutions based on your input and our expertise. Just as you wouldn't edit a lawyer’s work, we don’t expect interference in our workflow if we’re to deliver high-quality results.</p>
            <p>By purchasing our services, you’re buying our expertise in the form of a design solution. While you may have different subjective preferences, the final call is ours. That means our reputation is on the line, and we reserve the final say on design decisions.</p>
            <p>We focus solely on design. We won’t step into marketing, positioning, or management decisions.</p>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-1">
          <div className="p4 uppercase">
            <TextBlur isBold>What We Expect From You</TextBlur>
          </div>
          <div className="p5 flex flex-col gap-1.5 md:max-w-[180px] 2xl:max-w-[240px] mt-3">
            <p>Treat our work with respect – during and after the process. In many ways, design is never truly finished, so treat the deliverables with care. Avoid disrupting its integrity with inconsistent materials or poor content handling.</p>
            <p>Respect our time, terms, and workflow. Urgency doesn’t cancel boundaries: send assets on time, skip unnecessary calls, and pay invoices promptly.</p>
            <p>We don’t co-create. Like lawyers, we gather input, then deliver solutions.</p>
            <p>Don’t mistake our kindness for weakness. We are not your employees, and we do not work for free.</p>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-1">
          <div className="p4 uppercase">
            <TextBlur isBold>What you can expect from&nbsp;us</TextBlur>
          </div>
          <div className="p5 flex flex-col gap-1.5 md:max-w-[180px] 2xl:max-w-[240px] mt-3">
            <p>Design led by the people responsible for the final work.</p>
            <p>A small team involved from the brief through delivery.</p>
            <p>Direct answers and clear communication.</p>
            <p>Direct work by our experienced team. No outsourcing to juniors. Studio owners are hands-on creators.</p>
            <p>Respect for your time and budget – extra costs only with your consent and clear benefit.</p>
            <p>Research and experiments shaped by your brief. We explain what we tried and why we chose a direction.</p>
          </div>
        </div>
        <div className="col-span-2 md:col-start-7 md:col-span-6 lg:col-start-auto lg:col-span-1 mt-14 lg:mt-0">
          <div className="flex flex-col gap-4 uppercase max-w-[320px] xl:max-w-[340px] 2xl:max-w-[440px]">
            <div className="p1">
              <TextBlur isBold>
                In every project,&nbsp;we aim to create the best design solution possible.
                {' '}
                <Image className="inline w-[90px] h-auto absolute bottom-0 ml-1 dark:invert" src="/images/flag.svg" alt="Flag icon" width={110} height={120} />
              </TextBlur>
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
    </main>
  )
}
