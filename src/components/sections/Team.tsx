'use client'

import type { JSX } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import NextImage from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'

interface TeamMember {
  name: string
  role: string
  description: () => JSX.Element
}

const team: TeamMember[] = [
  {
    name: 'Ksusha',
    role: 'web',
    description: () => (
      <>
        <p>
          Web design and UI/UX specialist with 11 years of design experience. Co-founder. Not limited by industry or product type. Prefers digital minimalism. Can design with existing branding (see
          {' '}
          <Link href="#" className="underline">Shareio</Link>
          {' '}
          or
          {' '}
          <Link href="#" className="underline">Chainviz</Link>
          ) or start from scratch (see
          {' '}
          <Link href="#" className="underline">Guardrail</Link>
          {' '}
          or
          {' '}
          <Link href="#" className="underline">Circus</Link>
          ).
        </p>
        <p>
          Never communicates directly with the client but allows them to follow her process in Figma from the start. Handles projects together with
          {' '}
          <Button
            data-member={3}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Egor
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Egor 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          .
        </p>
        <p>A visual thinker with an understanding of web development processes. Prefers long lasting simpler solutions over intensive design and ensures brand assets translate seamlessly to the web.</p>
      </>
    ),
  },
  {
    name: 'Lena S.',
    role: 'motion',
    description: () => (
      <>
        <p>Motion and 3D generalist with 8 years of experience and formal training. Co-founder. Adapts quickly, unconstrained by tools or trends.</p>
        <p>
          Equally confident leading solo projects (e.g.,
          {' '}
          <Link href="#" className="underline">Circus</Link>
          ,
          {' '}
          <Link href="#" className="underline">Shareio</Link>
          ) or collaborating within larger teams (e.g.,
          {' '}
          <Link href="#" className="underline">Veev</Link>
          ,
          {' '}
          <Link href="#" className="underline">Skoda</Link>
          ). Handles projects together with
          {' '}
          <Button
            data-member={4}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Dasha
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Dasha 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          .
        </p>
        <p>
          Prefers artistic interpretations over commonly researched standards. Skilled at both. Has straightforward
          {' '}
          <Link href="#" className="underline">processes</Link>
          , shaped by past experience.
        </p>
      </>
    ),
  },
  {
    name: 'Lena R.',
    role: 'branding',
    description: () => (
      <>
        <p>
          Brand designer with X years of experience. She has provided solutions for large-scale physical brands (see
          {' '}
          <Link href="#" className="underline">Perekrestok</Link>
          ) and digital startups (see
          {' '}
          <Link href="#" className="underline">Shareio</Link>
          ), in both B2B and B2C spaces.
        </p>
        <p>
          Equally skilled in building brands from scratch (e.g.
          {' '}
          <Link href="#" className="underline">Kay</Link>
          {' '}
          or
          {' '}
          <Link href="#" className="underline">Nectar</Link>
          ) or evolving them over time (see
          {' '}
          <Link href="#" className="underline">Guardrail</Link>
          {' '}
          or
          {' '}
          <Link href="#" className="underline">Helikon</Link>
          ). More often works on projects together with
          {' '}
          <Button
            data-member={3}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Egor
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Egor 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          .
        </p>
        <p>Typically takes on a creative lead in branding projects, while remaining comfortable in collaborative roles.</p>
      </>
    ),
  },
  {
    name: 'Egor',
    role: 'MGMT',
    description: () => (
      <>
        <p>
          Project lead for web and branding with 8 years in B2B marketing and analytics. Co-founder with a focus on data visualization (see
          {' '}
          <Link href="#" className="underline">Chainviz</Link>
          ) and naming (see
          {' '}
          <Link href="#" className="underline">Namefolio</Link>
          ).
        </p>
        <p>Prefers minimal calls with only core decision-makers. Advocates for the client in design discussions, while in client-facing calls, focuses on leveraging the team’s strengths.</p>
        <p>
          Shares studio
          {' '}
          <Link href="/expectations" className="underline">expectations</Link>
          {' '}
          in every project. Primary and often the only point of contact for projects involving
          {' '}
          <Button
            data-member={0}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Ksusha
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Ksusha 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          {' '}
          and
          {' '}
          <Button
            data-member={2}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Lena R
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Lena R 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          .
        </p>
      </>
    ),
  },
  {
    name: 'Dasha',
    role: 'MGMT',
    description: () => (
      <>
        <p>Project lead for motion and 3D with 6 years in account management and legal, and a background in conflict management. Co-founder.</p>
        <p>
          Skilled in managing both fast-paced (see
          {' '}
          <Link href="#" className="underline">London Handel Festival</Link>
          {' '}
          and
          {' '}
          <Link href="#" className="underline">Skoda</Link>
          ) and long-term projects (e.g.
          {' '}
          <Link href="#" className="underline">S+H</Link>
          {' '}
          and
          {' '}
          <Link href="#" className="underline">FutureMoney</Link>
          ), with a focus on lasting partnerships.
        </p>
        <p>
          Shares studio
          {' '}
          <Link href="/expectations" className="underline">expectations</Link>
          {' '}
          in every project. Main point of contact for projects involving
          {' '}
          <Button
            data-member={1}
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Lena S
                <NextImage
                  className="inline ml-0.5 align-text-bottom w-[11px]"
                  src="/images/model-1.png"
                  alt="Lena S 3d model"
                  width={11}
                  height={14}
                />
              </>
            )}
          />
          .
        </p>
      </>
    ),
  },
]

const mobileGap = 30

export function Team() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const modelsRef = useRef<HTMLDivElement>(null)
  const descriptionsRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])

  const [activeMemberIndex, setActiveMemberIndex] = useState(0)

  const smoother = useLenis()

  const canvasFrames = {
    currentIndex: 0,
    maxIndex: 121,
  }

  const loadImageOnCanvas = useCallback((index: number) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const images = imagesRef.current

    if (index >= 0 && index < images.length && canvas && context) {
      const img = images[index]

      if (!img)
        return

      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio

      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.min(scaleX, scaleY)

      const newWidth = img.width * scale
      const newHeight = img.height * scale

      const offsetX = (canvas.width - newWidth) / 2
      const offsetY = (canvas.height - newHeight) / 2

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight)
    }
  }, [])

  // Mobile scroll
  useGSAP(() => {
    const mm = gsap.matchMedia()

    gsap.registerPlugin(ScrollTrigger)

    mm.add('(max-width: 767px)', () => {
      ScrollTrigger.create({
        trigger: modelsRef.current,
        endTrigger: '.memberDescriptionEnd',
        start: `top +=${mobileGap}px`,
        end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + mobileGap}px`,
        pinSpacing: false,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const frameIndex = Math.round(progress * (canvasFrames.maxIndex - 1))

          loadImageOnCanvas(frameIndex)
        },
      })

      team.forEach((_, index) => {
        if (index < team.length - 1) {
          const trigger = `.memberDescription:nth-child(${index + 1})`
          const tl = gsap.timeline({ defaults: { ease: 'none' } })

          tl.to(trigger, {
            '--value': 75,
            'opacity': 0.05,
            'ease': 'none',
          }, 0)

          ScrollTrigger.create({
            trigger,
            animation: tl,
            start: () => `top ${(modelsRef.current?.clientHeight || 0) + mobileGap}px`,
            end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + mobileGap}px`,
            scrub: 1,
          })
        }
      })
    })

    return () => mm.revert()
  })

  // Desktop scroll
  useGSAP(() => {
    const mm = gsap.matchMedia()

    gsap.registerPlugin(ScrollTrigger)

    mm.add('(min-width: 768px)', () => {
      const teamSection = sectionRef.current
      const teamContent = contentRef.current
      const teamDescription = descriptionsRef.current

      if (!teamSection || !teamContent || !teamDescription || !smoother)
        return

      const descriptionItemWidth = teamDescription.clientWidth / team.length
      const endPosition = descriptionItemWidth * (team.length - 1)

      const animation = gsap.to(teamDescription, {
        x: endPosition * -1,
        ease: 'none',
      })

      team.forEach((_, index) => {
        if (index < team.length - 1) {
          const trigger = `.memberDescription:nth-child(${index + 1})`
          const tl = gsap.timeline({ defaults: { ease: 'none' } })

          tl.to(trigger, {
            '--value': 75,
            'opacity': 0.05,
            'ease': 'none',
          }, 0)

          ScrollTrigger.create({
            trigger: teamContent,
            animation: tl,
            start: `${teamContent.clientHeight + descriptionItemWidth * index + 10}px bottom`,
            end: `+=${descriptionItemWidth} bottom`,
            scrub: 1,
          })
        }
      })

      ScrollTrigger.create({
        id: 'global',
        trigger: teamSection,
        start: `bottom bottom`,
        end: `+=${endPosition}px bottom`,
        pin: true,
        scrub: 1,
        animation,
        onUpdate: (self) => {
          const progress = self.progress
          const currentMemberIndex = Math.min(Math.floor(progress * team.length), team.length - 1)
          const frameIndex = Math.round(progress * (canvasFrames.maxIndex - 1))

          setActiveMemberIndex(currentMemberIndex)
          loadImageOnCanvas(frameIndex)
        },
      })
    })

    return () => mm.revert()
  }, { dependencies: [smoother], scope: sectionRef })

  // Scroll to member handler
  useEffect(() => {
    const isHorizontalView = window.matchMedia('(min-width: 768px)').matches
    const teamSection = sectionRef.current
    const teamContent = contentRef.current
    const teamDescription = descriptionsRef.current

    const buttons = teamSection?.querySelectorAll<HTMLButtonElement>('button[data-member]')

    const handleScrollTo = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement

      if (!target || !smoother || !teamSection || !teamContent || !teamDescription)
        return

      const startPosition = isHorizontalView
        ? (teamSection.parentElement?.offsetTop || 0) - (window.innerHeight - teamSection.clientHeight)
        : teamContent.offsetTop
      const memberIndex = Number(target.dataset.member) || 0
      const memberOffset = team.reduce((prev, _, index) => {
        const section = teamDescription.querySelector(`.memberDescription:nth-child(${index + 1})`)

        return section && index < memberIndex ? prev + section.getBoundingClientRect()[isHorizontalView ? 'width' : 'height'] : prev
      }, 0)

      smoother.scrollTo(startPosition + memberOffset - (isHorizontalView ? 0 : mobileGap))
    }

    if (buttons && buttons.length) {
      buttons.forEach((button) => {
        button.addEventListener('click', handleScrollTo)
      })
    }

    return () => {
      if (buttons && buttons.length) {
        buttons.forEach((button) => {
          button.removeEventListener('click', handleScrollTo)
        })
      }
    }
  }, [smoother])

  useEffect(() => {
    let imagesLoaded = 0
    const totalImages = canvasFrames.maxIndex

    const preloadImages = () => {
      for (let i = 0; i <= totalImages; i++) {
        const imageUrl = `/images/team/${i}.avif`
        const img = new Image()

        img.src = imageUrl

        img.onload = () => {
          imagesLoaded++

          if (imagesLoaded === totalImages)
            loadImageOnCanvas(canvasFrames.currentIndex)
        }

        imagesRef.current[i] = img
      }
    }

    preloadImages()
  }, [canvasFrames.currentIndex, canvasFrames.maxIndex, loadImageOnCanvas])

  return (
    <section id="team" ref={sectionRef} className="md:min-h-svh md:flex md:flex-col pt-20 md:pt-28 md:pb-2.5 z-1">
      <h2 className="text-nowrap text-[15vw] md:text-[100px] lg:text-[10.5vw] tracking-normal leading-[90%] uppercase md:my-auto -ml-1.5 lg:-ml-2.5 -rotate-2">
        <TextBlur>
          Team
          {' '}
          <span>专责小组</span>
        </TextBlur>
      </h2>
      <div ref={contentRef} className="flex flex-col md:grid md:grid-cols-[16vw_42vw_1fr] lg:grid-cols-[14.5%_19.5%_22.5%_auto_minmax(140px,10%)] lg:gap-x-2.5 items-center mt-16 md:mt-16 lg:mt-24 px-2.5">
        <div className="hidden md:flex flex-col items-start self-end">
          {team.map((member, index) => (
            <Button
              key={member.name}
              className="memberLink"
              data-member={index}
              label={`${member.name.replace('.', '')}, ${member.role}`}
              isActive={activeMemberIndex === index}
            />
          ))}
        </div>
        <div className="self-stretch z-1 lg:col-span-2">
          <div ref={modelsRef} className="models mx-auto md:w-full relative aspect-[264/357] max-w-[264px] lg:max-w-[70%] overflow-hidden will-change-transform">
            <div className="absolute inset-0">
              <canvas ref={canvasRef} className="size-full" />
            </div>
          </div>
        </div>
        <div ref={descriptionsRef} className="flex flex-col md:flex-row">
          {team.map((member, index) => (
            <div key={member.name} className={`memberDescription ${team.length - 2 === index ? 'memberDescriptionEnd' : ''} flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-[calc(43.5vw_-_29px)] shrink-0 pt-6 md:pt-0`}>
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">
                  <TextBlur isHorizontal>{member.name}</TextBlur>
                </h3>
                w
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
