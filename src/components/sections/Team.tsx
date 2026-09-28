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
import { useReducedMotion } from '@/components/useReducedMotion'
import portraitBounds from '@/data/teamPortraitBounds.json'

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
          <Link href="https://shareio.webflow.io/" className="underline">Shareio</Link>
          {' '}
          or
          {' '}
          <Link href="https://www.behance.net/gallery/186534927/Chainviz-Validators-Explorer" className="underline">Chainviz</Link>
          ) or start from scratch (see
          {' '}
          <Link href="https://www.guardrail.ai/" className="underline">Guardrail</Link>
          {' '}
          or
          {' '}
          <Link href="https://circus-dev.webflow.io" className="underline">Circus</Link>
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
                  src="/images/team-fav/egor.avif"
                  alt="Egor 3d model preview"
                  width={11}
                  height={14}
                />
                .
              </>
            )}
          />
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
          <Link href="https://circus-dev.webflow.io/" className="underline">Circus</Link>
          ,
          {' '}
          <Link href="https://shareio.webflow.io/" className="underline">Shareio</Link>
          ) or collaborating within larger teams (e.g.,
          {' '}
          <Link href="https://www.behance.net/gallery/167777627/Veev-Motion-Library" className="underline">Veev</Link>
          ,
          {' '}
          <Link href="https://www.skoda-auto.com/" className="underline">Skoda</Link>
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
                  src="/images/team-fav/dasha.avif"
                  alt="Dasha 3d model preview"
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
          <Link href="/process" className="underline">processes</Link>
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
          Brand designer. She has provided solutions for large-scale physical brands (see
          {' '}
          <Link href="https://www.behance.net/gallery/110329005/Perekrestok" className="underline">Perekrestok</Link>
          ) and digital startups (see
          {' '}
          <Link href="https://www.behance.net/gallery/224757329/Shareio-Content-Tool" className="underline">Shareio</Link>
          ), in both B2B and B2C spaces.
        </p>
        <p>
          Equally skilled in building brands from scratch (e.g.
          {' '}
          <Link href="https://www.kay.ai/" className="underline">Kay</Link>
          {' '}
          or
          {' '}
          <Link href="https://www.nectarsocial.com/" className="underline">Nectar</Link>
          ) or evolving them over time (see
          {' '}
          <Link href="https://www.guardrail.ai/" className="underline">Guardrail</Link>
          {' '}
          or
          {' '}
          <Link href="https://helikon.io/" className="underline">Helikon</Link>
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
                  src="/images/team-fav/egor.avif"
                  alt="Egor 3d model preview"
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
          <Link href="https://www.behance.net/gallery/186534927/Chainviz-Validators-Explorer" className="underline">Chainviz</Link>
          ) and naming (see
          {' '}
          <Link href="https://www.behance.net/gallery/162125657/Namefolio-2020-2023" className="underline">Namefolio</Link>
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
                  src="/images/team-fav/ksusha.avif"
                  alt="Ksusha 3d model preview"
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
                  src="/images/team-fav/lenar.avif"
                  alt="Lena Ryazantseva 3d model preview"
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
          <Link href="https://www.london-handel-festival.com" className="underline">London Handel Festival</Link>
          {' '}
          and
          {' '}
          <Link href="https://www.skoda-auto.com/" className="underline">Skoda</Link>
          ) and long-term projects (e.g.
          {' '}
          <Link href="https://www.behance.net/gallery/240620453/StarsHoney-Product-3D" className="underline">S+H</Link>
          {' '}
          and
          {' '}
          <Link href="https://www.futuremoney.co" className="underline">FutureMoney</Link>
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
                  src="/images/team-fav/lenas.avif"
                  alt="Lena Sivakova 3d model preview"
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
const lastFrame = 121

export function Team() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const modelsRef = useRef<HTMLDivElement>(null)
  const descriptionsRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const bitmapsRef = useRef<Map<number, ImageBitmap>>(new Map())
  const prepareRef = useRef<(index: number) => void>(() => {})
  const fitRef = useRef<{ width: number, height: number, viewport: number, value: number } | null>(null)
  const frameRef = useRef(0)
  const drawnFrameRef = useRef(-1)

  const [activeMemberIndex, setActiveMemberIndex] = useState(0)

  const smoother = useLenis()
  const reducedMotion = useReducedMotion()

  const loadImageOnCanvas = useCallback((index: number) => {
    frameRef.current = index
    prepareRef.current(index)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const images = imagesRef.current

    if (index >= 0 && index <= lastFrame && canvas && context) {
      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      const width = Math.round(canvas.clientWidth * pixelRatio)
      const height = Math.round(canvas.clientHeight * pixelRatio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        drawnFrameRef.current = -1
      }

      const mobile = window.innerWidth < 768
      const bitmaps = bitmapsRef.current
      let nearest = mobile ? index : -1
      if (mobile && !bitmaps.has(index) && (!images[index]?.complete || !images[index].naturalWidth))
        return
      if (!mobile) {
        for (let i = 0; i < images.length; i++) {
          if (images[i]?.complete && images[i].naturalWidth && (nearest < 0 || Math.abs(i - index) < Math.abs(nearest - index)))
            nearest = i
        }
      }
      if (nearest < 0 || nearest === drawnFrameRef.current)
        return

      const img = images[nearest]
      let fit = 1
      if (mobile && modelsRef.current) {
        const slotHeight = modelsRef.current.clientHeight
        const cached = fitRef.current
        if (!cached || cached.width !== canvas.clientWidth || cached.height !== slotHeight || cached.viewport !== window.innerWidth) {
          const halfViewport = window.innerWidth / 2 - 4
          const value = Math.min(...portraitBounds.map(([left, top, right]) => Math.min(
            1,
            halfViewport / (canvas.clientWidth * (0.5 - left / img.width)),
            halfViewport / (canvas.clientWidth * (right / img.width - 0.5)),
            (mobileGap + slotHeight - 4) / (canvas.clientHeight * (1 - top / img.height)),
          )))
          fitRef.current = { width: canvas.clientWidth, height: slotHeight, viewport: window.innerWidth, value }
        }
        fit = fitRef.current!.value
      }

      drawnFrameRef.current = nearest
      const drawWidth = canvas.width * fit
      const drawHeight = canvas.height * fit
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(mobile ? bitmaps.get(nearest) || img : img, (canvas.width - drawWidth) / 2, canvas.height - drawHeight, drawWidth, drawHeight)
    }
  }, [])

  // Mobile scroll
  useGSAP(() => {
    if (reducedMotion)
      return

    const mm = gsap.matchMedia()

    gsap.registerPlugin(ScrollTrigger)

    mm.add('(max-width: 767px)', () => {
      const frame = { index: 0 }
      gsap.to(frame, {
        index: lastFrame,
        ease: 'none',
        onUpdate: () => loadImageOnCanvas(Math.round(frame.index)),
        scrollTrigger: {
          trigger: modelsRef.current,
          endTrigger: '.memberDescriptionEnd',
          start: `top +=${mobileGap}px`,
          end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + mobileGap}px`,
          pinSpacing: false,
          pin: true,
          scrub: 0.35,
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
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  // Desktop scroll
  useGSAP(() => {
    if (reducedMotion)
      return

    const mm = gsap.matchMedia()

    gsap.registerPlugin(ScrollTrigger)

    mm.add('(min-width: 768px)', () => {
      const teamSection = sectionRef.current
      const teamContent = contentRef.current
      const teamDescription = descriptionsRef.current

      if (!teamSection || !teamContent || !teamDescription || !smoother)
        return

      const itemWidth = () => teamDescription.firstElementChild?.getBoundingClientRect().width || 0
      const endPosition = () => itemWidth() * (team.length - 1)

      const animation = gsap.to(teamDescription, {
        x: () => -endPosition(),
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
            start: () => `${teamContent.clientHeight + itemWidth() * index + 10}px bottom`,
            end: () => `+=${itemWidth()} bottom`,
            invalidateOnRefresh: true,
            scrub: 1,
          })
        }
      })

      ScrollTrigger.create({
        id: 'global',
        refreshPriority: 1,
        trigger: teamSection,
        start: `bottom bottom`,
        end: () => `+=${endPosition()}px bottom`,
        invalidateOnRefresh: true,
        pin: true,
        scrub: 1,
        animation,
        onUpdate: (self) => {
          const progress = self.progress
          const currentMemberIndex = Math.min(Math.floor(progress * team.length), team.length - 1)
          const frameIndex = Math.round(progress * lastFrame)

          setActiveMemberIndex(currentMemberIndex)
          loadImageOnCanvas(frameIndex)
        },
      })
    })

    return () => mm.revert()
  }, { dependencies: [smoother, reducedMotion], scope: sectionRef, revertOnUpdate: true })

  // Scroll to member handler
  useEffect(() => {
    const teamSection = sectionRef.current
    const teamContent = contentRef.current
    const teamDescription = descriptionsRef.current

    const buttons = teamSection?.querySelectorAll<HTMLButtonElement>('button[data-member]')

    const handleScrollTo = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement

      if (!target || !smoother || !teamSection || !teamContent || !teamDescription)
        return

      const memberIndex = Number(target.dataset.member) || 0
      const member = teamDescription.children[memberIndex] as HTMLElement | undefined
      if (!member)
        return

      if (reducedMotion) {
        member.scrollIntoView({ block: 'center', behavior: 'instant' })
        return
      }

      const trigger = ScrollTrigger.getAll().find(item => item.trigger === teamSection && item.pin)
      if (window.matchMedia('(min-width: 768px)').matches && trigger) {
        smoother.scrollTo(trigger.start + member.clientWidth * memberIndex)
      }
      else {
        smoother.scrollTo(member, { offset: -(modelsRef.current?.clientHeight || 0) - mobileGap })
      }
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
  }, [smoother, reducedMotion])

  useEffect(() => {
    let disposed = false
    let nearSection = false
    let desktopLoaded = false
    let bitmapFailed = false
    const preparing = new Set<number>()
    const loadFrame = (index: number) => {
      if (!imagesRef.current[index]) {
        const img = new Image()
        imagesRef.current[index] = img
        img.onload = () => {
          if (!disposed)
            loadImageOnCanvas(frameRef.current)
        }
        img.src = `/images/team/${index}.avif`
      }
    }

    const prepareNear = (index: number) => {
      const bitmaps = bitmapsRef.current
      if (window.innerWidth >= 768) {
        bitmaps.forEach(bitmap => bitmap.close())
        bitmaps.clear()
        if (nearSection && !desktopLoaded) {
          desktopLoaded = true
          for (let i = 1; i <= lastFrame; i++)
            loadFrame(i)
        }
        return
      }
      if (!nearSection && index === 0)
        return

      const nearby = Array.from({ length: 21 }, (_, offset) => index + offset)
        .concat(Array.from({ length: 6 }, (_, offset) => index - offset - 1))
        .filter(i => i >= 0 && i <= lastFrame)
      nearby.forEach(loadFrame)
      if (bitmapFailed || typeof createImageBitmap !== 'function')
        return

      // Keep decoded frames near the playhead; Firefox otherwise stalls on AVIF draws.
      for (const [i, bitmap] of bitmaps) {
        if (Math.abs(i - index) > 28) {
          bitmap.close()
          bitmaps.delete(i)
        }
      }
      for (const i of nearby) {
        if (preparing.size >= 4)
          break
        const img = imagesRef.current[i]
        if (!img?.complete || !img.naturalWidth || bitmaps.has(i) || preparing.has(i))
          continue
        preparing.add(i)
        createImageBitmap(img, { resizeWidth: 768, resizeHeight: 768 }).then((bitmap) => {
          preparing.delete(i)
          if (disposed || bitmapFailed || Math.abs(i - frameRef.current) > 28) {
            bitmap.close()
          }
          else {
            bitmaps.set(i, bitmap)
            loadImageOnCanvas(frameRef.current)
          }
          if (!disposed)
            prepareNear(frameRef.current)
        }).catch(() => {
          preparing.delete(i)
          if (disposed)
            return
          bitmapFailed = true
          bitmaps.forEach(bitmap => bitmap.close())
          bitmaps.clear()
        })
      }
    }
    prepareRef.current = prepareNear

    frameRef.current = 0
    loadFrame(0)
    loadImageOnCanvas(0)
    if (!reducedMotion && window.innerWidth >= 768) {
      for (let index = 8; index <= lastFrame; index += 8)
        loadFrame(index)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || reducedMotion)
        return
      nearSection = true
      prepareNear(frameRef.current)
      observer.disconnect()
    }, { rootMargin: '800px' })

    if (sectionRef.current)
      observer.observe(sectionRef.current)

    const resize = new ResizeObserver(() => loadImageOnCanvas(frameRef.current))
    if (canvasRef.current)
      resize.observe(canvasRef.current)

    const restore = () => {
      if (document.visibilityState !== 'visible')
        return
      drawnFrameRef.current = -1
      ScrollTrigger.refresh()
      loadImageOnCanvas(frameRef.current)
    }
    document.addEventListener('visibilitychange', restore)
    window.addEventListener('pageshow', restore)

    return () => {
      disposed = true
      prepareRef.current = () => {}
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', restore)
      window.removeEventListener('pageshow', restore)
      imagesRef.current.forEach(img => img.onload = null)
      bitmapsRef.current.forEach(bitmap => bitmap.close())
      bitmapsRef.current.clear()
    }
  }, [reducedMotion, loadImageOnCanvas])

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
          <div ref={modelsRef} className="models mx-auto md:w-full relative aspect-[264/357] max-w-[264px] md:max-w-[314px] lg:max-w-[70%] will-change-transform">
            <canvas ref={canvasRef} className="absolute left-1/2 top-0 h-[calc(100%/0.86)] aspect-square -translate-x-1/2 -translate-y-[14%]" />
          </div>
        </div>
        <div ref={descriptionsRef} className="team-track flex flex-col md:flex-row">
          {team.map((member, index) => (
            <div key={member.name} className={`memberDescription ${team.length - 2 === index ? 'memberDescriptionEnd' : ''} flex justify-center lg:justify-start w-full md:w-[calc(42vw_-_20px)] lg:w-[calc(43.5vw_-_29px)] shrink-0 pt-6 md:pt-0`}>
              <div className="max-w-[264px] md:max-w-[180px] 2xl:max-w-[240px]">
                <h3 className="p1 uppercase -rotate-2">
                  <TextBlur isHorizontal>{member.name}</TextBlur>
                </h3>
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
