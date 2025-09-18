'use client'

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useContext, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollContext } from "@/components/SmoothScroll";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: () => JSX.Element;
}

const team: TeamMember[] = [
  {
    name: "Ksusha",
    role: "web",
    image: "/images/model-1.png",
    description: () => (
      <>
        <p>Web design and UI/UX specialist with 11 years of design experience. Co-founder. Not limited by industry or product type. Prefers digital minimalism. Can design with existing branding (see <Link href="#" className="underline">Shareio</Link> or <Link href="#" className="underline">Chainviz</Link>) or start from scratch (see <Link href="#" className="underline">Guardrail</Link> or <Link href="#" className="underline">Circus</Link>).</p>
        <p>Never communicates directly with the client but allows them to follow her process in Figma from the start. Handles projects together with <Link href="#" className="underline decoration-dotted text-nowrap">Egor<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Egor 3d model" width={11} height={14} /></Link>.</p>
        <p>A visual thinker with an understanding of web development processes. Prefers long lasting simpler solutions over intensive design and ensures brand assets translate seamlessly to the web.</p>
      </>
    )
  },
  {
    name: "Lena S.",
    role: "motion",
    image: "/images/model-2.png",
    description: () => (
      <>
        <p>Motion and 3D generalist with 8 years of experience and formal training. Co-founder. Adapts quickly, unconstrained by tools or trends.</p>
        <p>Equally confident leading solo projects (e.g., <Link href="#" className="underline">Circus</Link>, <Link href="#" className="underline">Shareio</Link>) or collaborating within larger teams (e.g., <Link href="#" className="underline">Veev</Link>, <Link href="#" className="underline">Skoda</Link>). Handles projects together with <Link href="#" className="underline decoration-dotted text-nowrap">Dasha<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Dasha 3d model" width={11} height={14} /></Link>.</p>
        <p>Prefers artistic interpretations over commonly researched standards. Skilled at both. Has straightforward <Link href="#" className="underline">processes</Link>, shaped by past experience.</p>
      </>
    )
  },
  {
    name: "Lena R.",
    role: "branding",
    image: "/images/model-1.png",
    description: () => (
      <>
        <p>Brand designer with X years of experience. She has provided solutions for large-scale physical brands (see <Link href="#" className="underline">Perekrestok</Link>) and digital startups (see <Link href="#" className="underline">Shareio</Link>), in both B2B and B2C spaces.</p>
        <p>Equally skilled in building brands from scratch (e.g. <Link href="#" className="underline">Kay</Link> or <Link href="#" className="underline">Nectar</Link>) or evolving them over time (see <Link href="#" className="underline">Guardrail</Link> or <Link href="#" className="underline">Helikon</Link>). More often works on projects together with <Link href="#" className="underline decoration-dotted text-nowrap">Egor<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Egor 3d model" width={11} height={14} /></Link>.</p>
        <p>Typically takes on a creative lead in branding projects, while remaining comfortable in collaborative roles.</p>
      </>
    )
  },
  {
    name: "Egor",
    role: "MGMT",
    image: "/images/model-2.png",
    description: () => (
      <>
        <p>Project lead for web and branding with 8 years in B2B marketing and analytics. Co-founder with a focus on data visualization (see <Link href="#" className="underline">Chainviz</Link>) and naming (see <Link href="#" className="underline">Namefolio</Link>).</p>
        <p>Prefers minimal calls with only core decision-makers. Advocates for the client in design discussions, while in client-facing calls, focuses on leveraging the team’s strengths.</p>
        <p>Shares studio <Link href="#" className="underline">expectations</Link> in every project. Primary and often the only point of contact for projects involving <Link href="#" className="underline decoration-dotted text-nowrap">Ksusha<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Ksusha 3d model" width={11} height={14} /></Link> and <Link href="#" className="underline decoration-dotted text-nowrap">Lena R<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Lena R 3d model" width={11} height={14} /></Link>.</p>
      </>
    )
  },
  {
    name: "Dasha",
    role: "MGMT",
    image: "/images/model-1.png",
    description: () => (
      <>
        <p>Project lead for motion and 3D with 6 years in account management and legal, and a background in conflict management. Co-founder.</p>
        <p>Skilled in managing both fast-paced (see <Link href="#" className="underline">London Handel Festival</Link> and <Link href="#" className="underline">Skoda</Link>) and long-term projects (e.g. <Link href="#" className="underline">S+H</Link> and <Link href="#" className="underline">FutureMoney</Link>), with a focus on lasting partnerships.</p>
        <p>Shares studio <Link href="#" className="underline">expectations</Link> in every project. Main point of contact for projects involving <Link href="#" className="underline decoration-dotted text-nowrap">Lena S<Image className="inline ml-0.5 align-text-bottom w-[11px]" src="/images/model-1.png" alt="Lena S 3d model" width={11} height={14} /></Link>.</p>
      </>
    )
  }
]

export function Team() {
  const scrollContext = useContext(ScrollContext)
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<HTMLDivElement | null>(null);
  const descriptionsRef = useRef<HTMLDivElement | null>(null);

  const [isPageRefReady, setIsPageRefReady] = useState(Boolean(scrollContext?.current));

  useGSAP(() => {
    const mm = gsap.matchMedia();

    gsap.registerPlugin(ScrollTrigger);

    mm.add("(max-width: 767px)", () => {
      const gap = 30

      ScrollTrigger.create({
        trigger: modelsRef.current,
        endTrigger: '.memberDescriptionEnd',
        start: `top +=${gap}px`,
        end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + gap}px`,
        pinSpacing: false,
        pin: true,
        scrub: 1,
      })

      team.forEach((_, index) => {
        if (index < team.length - 1) {
          const trigger = `.memberDescription:nth-child(${index + 1})`
          const model = `.memberModel:nth-child(${index + 1}) > img`
          const tl = gsap.timeline({ defaults: { ease: 'none' } })

          tl.to(trigger, {
            opacity: 0.05,
          }, 0)

          tl.to(model, {
            clipPath: "inset(0px 0px 100%)",
            objectPosition: "50% -50px",
          }, 0)

          ScrollTrigger.create({
            trigger,
            animation: tl,
            start: () => `top ${(modelsRef.current?.clientHeight || 0) + gap * 2}px`,
            end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + gap * 2}px`,
            scrub: 0.5,
          })
        }
      })
    });
  });

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const page = scrollContext?.current
      const teamSection = sectionRef.current
      const teamDescription = descriptionsRef.current
      const smoother = ScrollSmoother.get()

      if (!page || !teamSection || !teamDescription || !smoother)
        return

      const descriptionItemWidth = teamDescription.clientWidth / team.length
      const startPosition = smoother.offset(teamSection) + teamSection.clientHeight / 2
      const endPosition = descriptionItemWidth * (team.length - 1)

      console.log(teamDescription.clientWidth)

      const animation = gsap.to(teamDescription, {
        x: endPosition * -1,
        ease: 'none',
      })

      ScrollTrigger.create({
        trigger: page,
        start: `${startPosition}px center`,
        end: `+=${endPosition}px center`,
        pin: true,
        invalidateOnRefresh: true,
        scrub: 1,
        animation,
      })

      team.forEach((_, index) => {
        if (index < team.length - 1) {
          const trigger = `.memberDescription:nth-child(${index + 1})`
          const model = `.memberModel:nth-child(${index + 1}) > img`
          const tl = gsap.timeline({ defaults: { ease: 'none' } })

          tl.to(trigger, {
            opacity: 0.05,
          }, 0)

          tl.to(model, {
            clipPath: "inset(0px 0px 100%)",
            objectPosition: "50% -50px",
          }, 0)

          ScrollTrigger.create({
            trigger,
            animation: tl,
            start: `${descriptionItemWidth * index + teamDescription.clientHeight / 2}px center`,
            end: `+=${descriptionItemWidth} center`,
            scrub: 1,
            invalidateOnRefresh: true,
          })
        }
      })
    })
  }, { dependencies: [isPageRefReady], scope: sectionRef });

  useEffect(() => {
    setIsPageRefReady(Boolean(scrollContext?.current));
  }, [scrollContext])

  return (
    <section className="mt-20 md:mt-28">
      <h2 className="text-nowrap text-[15vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase -ml-1.5 lg:-ml-2.5 -rotate-2">
        Team <span>专责小组</span>
      </h2>
      <div ref={sectionRef} className="flex flex-col md:grid md:grid-cols-[16vw_42vw_1fr] lg:grid-cols-[14.5%_19.5%_22.5%_auto_minmax(140px,10%)] lg:gap-x-2.5 items-center mt-16 md:mt-16 lg:mt-24 px-2.5">
        <div className="hidden md:flex flex-col items-start self-end">
          {team.map(member => (
            <Button key={member.name} text={`${member.name.replace('.', '')}, ${member.role}`} />
          ))}
        </div>
        <div className="self-stretch z-1 lg:col-span-2">
          <div ref={modelsRef} className="mx-auto md:w-full relative aspect-[264/357] max-w-[264px] lg:max-w-[70%] overflow-hidden will-change-transform">
            {team.map((member, index) => (
              <div key={member.name} className="memberModel absolute inset-0" style={{ height: '100%', zIndex: team.length - index }}>
                <Image
                  className="size-full object-cover object-top"
                  src={member.image}
                  alt={`${member.name} 3d model`}
                  width={264}
                  height={357}
                />
              </div>
            ))}
          </div>
        </div>
        <div ref={descriptionsRef} className="flex flex-col md:flex-row gap-10 md:gap-0 mt-6 md:m-0">
          {team.map((member, index) => (
            <div key={member.name} className={`memberDescription ${team.length - 2 === index ? 'memberDescriptionEnd' : ''} flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-[calc(43.5vw_-_29px)] shrink-0`}>
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">{member.name}</h3>
                <div className="flex flex-col gap-1.5 p5 mt-6">
                  {member.description()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}