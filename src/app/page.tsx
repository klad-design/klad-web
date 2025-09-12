import type { Metadata } from 'next'
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Home page',
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="pt-[60px] md:pt-[160px] lg:pt-0 overflow-hidden">
        <h1 className="md:text-nowrap text-[20vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">Klad Syndicate</h1>
        <div className="grid-container mt-10 md:mt-[60px] lg:mt-20">
          <div className="flex flex-col items-start gap-[30px] md:col-start-2 col-span-2 lg:col-span-1 lg:col-start-4 p3">
            <p>We are a multidisciplinary design syndicate offering comprehensive solutions for ambitious brands. Every design we deliver is original, and every project is approached as a unique challenge. We see our clients as long-term partners, helping them reach new heights in how they express themselves and present their identity.</p>
            <div className="max-w-[264px] md:max-w-[320px] flex flex-col gap-[15px] p5">
              <p>We actively avoid repeating ourselves. Our process may seem chaotic at times, but that flexibility is intentional, as it helps us adapt to any circumstance without falling into rigid routines.</p>
              <p>As a small team, we deliberately limit the number of projects we take on, dedicating our full focus and commitment to each one.</p>
            </div>
          </div>
          <div className="flex justify-center -mx-2.5 lg:mx-0 mt-[30px] md:mt-10 lg:mt-3 col-span-4 overflow-hidden">
            <Image className="max-w-[140svw] md:max-w-[133svw] lg:max-w-full" src="/images/world.png" alt="World map" width={1410} height={928} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="md:-mt-6">
        <div className="-rotate-2 flex gap-[0.3em] text-h1 md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase">
          <div>Branding</div>
          <div>Experience</div>
          <div>Product</div>
          <div>Branding</div>
          <div>Experience</div>
          <div>Product</div>
        </div>
        <div className="grid-container gap-y-10 mt-24 md:mt-32 lg:mt-24 p4 leading-none uppercase">
          <div>
            <div>Industries</div>
            <ul className="flex flex-col items-start mt-4">
              <li>AI</li>
              <li>Web3 & Blockchain</li>
              <li>Retail & E-commerce</li>
              <li>Lifestyle</li>
              <li>Food & Beverage</li>
              <li>Biotech</li>
              <li>Jewelry manufacturing</li>
              <li>Banking & finance</li>
              <li>Digital marketing</li>
              <li>Robotics</li>
              <li>Logistics & transportation</li>
            </ul>
          </div>
          <div>
            <div>Tools</div>
            <ul className="flex flex-col items-start mt-4">
              <li>Figma</li>
              <li>Adobe CC</li>
              <li>Blender</li>
              <li>Cinema 4D</li>
              <li>Rive</li>
              <li>ZBrush</li>
              <li>Logic Pro</li>
              <li>Ableton</li>
            </ul>
          </div>
          <div>
            <div>Development</div>
            <ul className="flex flex-col items-start mt-4">
              <li>HTML + CSS + JS</li>
              <li>React</li>
              <li>WebGL</li>
              <li>GSAP</li>
              <li>Python</li>
              <li>Shopify</li>
              <li>Webflow</li>
            </ul>
          </div>
          <div>
            <div>Services</div>
            <ul className="flex flex-col items-start mt-4">
              <li>Visual identity and logotype</li>
              <li>Packaging</li>
              <li>Signage</li>
              <li>Digital and printed material</li>
              <li>Web design</li>
              <li>UI/UX</li>
              <li>3D modeling</li>
              <li>Motion design</li>
              <li>Visual research</li>
              <li>Frontend</li>
            </ul>
          </div>
        </div>
        <div className="grid-container flex md:grid flex-wrap lg:gap-x-2.5 gap-y-2 mt-20 lg:mt-14">
          <div className="flex flex-col items-start">
            <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">45+</div>
            <div className="p5 mt-2">clients</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">over 100</div>
            <div className="p5 mt-2">completed projects</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">$20M+ raised</div>
            <div className="p5 mt-2">in seed and pre-seed rounds for startups over the past year</div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-end p1 leading-[90%] uppercase md:min-h-[92px] md:mr-3">since 2020</div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mt-20 md:mt-28">
        <h2 className="text-nowrap text-[15vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
          Team <span>专责小组</span>
        </h2>
        <div className="flex flex-col md:grid md:grid-cols-[16vw_42vw_1fr] lg:grid-cols-[14.5%_19.5%_22.5%_auto_minmax(140px,10%)] lg:gap-x-2.5 items-center mt-16 md:mt-16 lg:mt-24 px-2.5">
          <div className="hidden md:flex flex-col items-start self-end">
            <Button text="Ksusha, web" />
            <Button text="Lena, motion" />
            <Button text="Lena, branding" />
            <Button text="Egor, MGMT" />
            <Button text="Dasha, MGMT" />
          </div>
          <div className="relative z-1 lg:col-span-2">
            <Image className="md:w-full lg:max-w-[70%]" src="/images/model-1.png" alt="3d model" width={264} height={357} />
          </div>
          <div className="flex flex-col md:flex-row gap-10 md:gap-0 lg:gap-2.5 mt-6 md:m-0">

            <div className="flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-full shrink-0">
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">Ksusha</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  <p>Web design and UI/UX specialist with 11 years of design experience. Co-founder. Not limited by industry or product type. Prefers digital minimalism. Can design with existing branding (see <Link href="#" className="underline">Shareio</Link> or <Link href="#" className="underline">Chainviz</Link>) or start from scratch (see <Link href="#" className="underline">Guardrail</Link> or <Link href="#" className="underline">Circus</Link>).</p>
                  <p>Never communicates directly with the client but allows them to follow her process in Figma from the start. Handles projects together with <Link href="#" className="underline text-nowrap">Egor<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Egor 3d model" width={11} height={14} /></Link>.</p>
                  <p>A visual thinker with an understanding of web development processes. Prefers long lasting simpler solutions over intensive design and ensures brand assets translate seamlessly to the web.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-full shrink-0">
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">Lena S.</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  <p>Motion and 3D generalist with 8 years of experience and formal training. Co-founder. Adapts quickly, unconstrained by tools or trends.</p>
                  <p>Equally confident leading solo projects (e.g., <Link href="#" className="underline">Circus</Link>, <Link href="#" className="underline">Shareio</Link>) or collaborating within larger teams (e.g., <Link href="#" className="underline">Veev</Link>, <Link href="#" className="underline">Skoda</Link>). Handles projects together with <Link href="#" className="underline text-nowrap">Dasha<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Dasha 3d model" width={11} height={14} /></Link>.</p>
                  <p>Prefers artistic interpretations over commonly researched standards. Skilled at both. Has straightforward <Link href="#" className="underline">processes</Link>, shaped by past experience.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-full shrink-0">
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">Lena R.</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  <p>Brand designer with X years of experience. She has provided solutions for large-scale physical brands (see <Link href="#" className="underline">Perekrestok</Link>) and digital startups (see <Link href="#" className="underline">Shareio</Link>), in both B2B and B2C spaces.</p>
                  <p>Equally skilled in building brands from scratch (e.g. <Link href="#" className="underline">Kay</Link> or <Link href="#" className="underline">Nectar</Link>) or evolving them over time (see <Link href="#" className="underline">Guardrail</Link> or <Link href="#" className="underline">Helikon</Link>). More often works on projects together with <Link href="#" className="underline text-nowrap">Egor<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Egor 3d model" width={11} height={14} /></Link>.</p>
                  <p>Typically takes on a creative lead in branding projects, while remaining comfortable in collaborative roles.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-full shrink-0">
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">Egor</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  <p>Project lead for web and branding with 8 years in B2B marketing and analytics. Co-founder with a focus on data visualization (see <Link href="#" className="underline">Chainviz</Link>) and naming (see <Link href="#" className="underline">Namefolio</Link>).</p>
                  <p>Prefers minimal calls with only core decision-makers. Advocates for the client in design discussions, while in client-facing calls, focuses on leveraging the team’s strengths.</p>
                  <p>Shares studio <Link href="#" className="underline">expectations</Link> in every project. Primary and often the only point of contact for projects involving <Link href="#" className="underline text-nowrap">Ksusha<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Ksusha 3d model" width={11} height={14} /></Link> and <Link href="#" className="underline text-nowrap">Lena R<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Lena R 3d model" width={11} height={14} /></Link>.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-full shrink-0">
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">Dasha</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  <p>Project lead for motion and 3D with 6 years in account management and legal, and a background in conflict management. Co-founder.</p>
                  <p>Skilled in managing both fast-paced (see <Link href="#" className="underline">London Handel Festival</Link> and <Link href="#" className="underline">Skoda</Link>) and long-term projects (e.g. <Link href="#" className="underline">S+H</Link> and <Link href="#" className="underline">FutureMoney</Link>), with a focus on lasting partnerships.</p>
                  <p>Shares studio <Link href="#" className="underline">expectations</Link> in every project. Main point of contact for projects involving <Link href="#" className="underline text-nowrap">Lena S<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Lena S 3d model" width={11} height={14} /></Link>.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call */}
      <section className="mt-32 md:mt-36 pb-[60px] md:pb-[160px]">
        <div className="flex flex-col items-start text-nowrap tracking-normal leading-none uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
          <div className="relative">
            <div className="text-[13vw] md:text-[80px] lg:text-[7.2vw]">预约电话</div>
            <div className="absolute top-0 left-full md:top-auto md:-bottom-1 lg:bottom-2 rotate-[4deg] md:rotate-2 text-[3.4vw] md:text-[13px] lg:text-[1.05vw] ml-[0.5em] md:ml-[1.1em]">
              Making<br />
              your<br />
              competitors<br />
              jealous
              <Image className="absolute -top-[34px] md:-top-[65px] lg:-top-[70px] right-1 size-[60px] md:size-[100px] lg:size-[120px]" src="/images/icon-call.svg" alt="Icon call" width={50} height={50} />
            </div>
          </div>
          <h2 className="text-[16.3vw] md:text-[100px] lg:text-[10.5vw] md:mt-2.5">Book a call</h2>
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
            <p className="p3">Got an idea or want to work with us? We’re always open to new talent. Reach out to Egor to chat.</p>
            <p className="p5">Running an open-source, non-profit, or free education project? Discounted rates are available. We&#39;re always happy to connect and see how we can help.</p>
            <Link href="/privacy.txt" target="_blank" className="button button--xs underline">PRIVACY.TXT</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
