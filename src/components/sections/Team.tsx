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

gsap.registerPlugin(ScrollTrigger)

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
const mobileScrub = 0.35
const lastFrame = 121
const previewFrames = new Set([0, 30, 60, 90, lastFrame, ...Array.from({ length: 15 }, (_, index) => (index + 1) * 8)])

export function Team() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const modelsRef = useRef<HTMLDivElement>(null)
  const descriptionsRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const directionRef = useRef(1)
  const drawnFrameRef = useRef(-1)
  const canvasModeRef = useRef({ mobile: false, interpolate: false })

  const [activeMemberIndex, setActiveMemberIndex] = useState(0)

  const smoother = useLenis()
  const reducedMotion = useReducedMotion()

  const loadImageOnCanvas = useCallback((index: number) => {
    if (index !== frameRef.current)
      directionRef.current = Math.sign(index - frameRef.current)
    frameRef.current = index
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const images = imagesRef.current

    if (index >= 0 && index <= lastFrame && canvas && context) {
      const { mobile, interpolate } = canvasModeRef.current
      let frame = interpolate ? index : Math.round(index)
      if (!images[Math.floor(frame)] || !images[Math.ceil(frame)]) {
        const direction = directionRef.current
        let nearest = -1
        // Follow the gesture with prepared poses instead of waiting on one frame.
        for (let i = direction > 0 ? Math.floor(frame) : Math.ceil(frame); i >= 0 && i <= lastFrame; i -= direction) {
          if (images[i]) {
            nearest = i
            break
          }
        }
        if (nearest < 0) {
          for (let i = 0; i < images.length; i++) {
            if (images[i] && (nearest < 0 || Math.abs(i - frame) < Math.abs(nearest - frame)))
              nearest = i
          }
        }
        frame = nearest
      }
      if (frame < 0 || frame === drawnFrameRef.current)
        return

      const img = images[Math.floor(frame)]
      const next = images[Math.ceil(frame)]
      const blend = frame % 1
      drawnFrameRef.current = frame
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const x = (canvas.width - drawWidth) / 2
      const y = mobile ? (canvas.height - drawHeight) / 2 : canvas.height - drawHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.globalAlpha = 1 - blend
      context.drawImage(img, x, y, drawWidth, drawHeight)
      if (blend) {
        // Add premultiplied pixels so transparent edges keep their opacity.
        context.globalCompositeOperation = 'lighter'
        context.globalAlpha = blend
        context.drawImage(next, x, y, drawWidth, drawHeight)
        context.globalCompositeOperation = 'source-over'
      }
      context.globalAlpha = 1
    }
  }, [])

  // Mobile scroll
  useGSAP(() => {
    if (reducedMotion)
      return

    const mm = gsap.matchMedia()

    mm.add('(max-width: 767px)', () => {
      const playhead = { frame: 0 }
      gsap.to(playhead, {
        frame: lastFrame,
        ease: 'none',
        onUpdate: () => loadImageOnCanvas(playhead.frame),
        scrollTrigger: {
          trigger: modelsRef.current,
          endTrigger: '.memberDescriptionEnd',
          start: `top +=${mobileGap}px`,
          end: () => `bottom ${(modelsRef.current?.clientHeight || 0) + mobileGap}px`,
          pinSpacing: false,
          pin: true,
          scrub: mobileScrub,
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
            scrub: mobileScrub,
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

    mm.add('(min-width: 768px)', () => {
      const teamSection = sectionRef.current
      const teamContent = contentRef.current
      const teamDescription = descriptionsRef.current

      if (!teamSection || !teamContent || !teamDescription || !smoother)
        return

      const itemWidth = () => teamDescription.firstElementChild?.getBoundingClientRect().width || 0
      const endPosition = () => itemWidth() * (team.length - 1)
      const descriptions = Array.from(teamDescription.children).slice(0, -1) as HTMLElement[]

      const animation = gsap.to(teamDescription, {
        x: () => -endPosition(),
        ease: 'none',
        onUpdate() {
          const progress = this.progress()
          setActiveMemberIndex(Math.min(Math.floor(progress * team.length), team.length - 1))
          loadImageOnCanvas(progress * lastFrame)
          descriptions.forEach((description, index) => {
            const fade = Math.min(1, Math.max(0, progress * (team.length - 1) - index))
            description.style.opacity = String(1 - fade * 0.95)
            description.style.setProperty('--value', String(fade * 75))
          })
        },
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
        onRefresh: self => animation.progress(self.progress),
      })

      return () => descriptions.forEach((description) => {
        description.style.removeProperty('opacity')
        description.style.removeProperty('--value')
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
    let loading = 0
    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const pending: number[] = []
    const requested = new Set<number>()
    const lightweight = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
    imagesRef.current = []
    drawnFrameRef.current = -1

    const prepareFrames = () => {
      if (disposed)
        return
      // Prepare the current pair first, then cover the rest of the sequence.
      const target = frameRef.current
      pending.sort((a, b) => {
        const targetPriority = Number(Math.abs(b - target) < 1) - Number(Math.abs(a - target) < 1)
        const previewPriority = Number(previewFrames.has(b)) - Number(previewFrames.has(a))
        return targetPriority || previewPriority || (previewFrames.has(a) ? 0 : Math.abs(a - target) - Math.abs(b - target))
      })
      while (loading < 4 && pending.length) {
        const index = pending.shift()!
        const img = new Image()
        img.decoding = 'async'
        img.fetchPriority = index === 0 ? 'auto' : 'low'
        img.src = lightweight ? `/images/team-mobile/v3/${index}.avif` : `/images/team/${index}.avif`
        loading++
        img.decode().catch(() => {
          if (!lightweight || disposed)
            throw new Error('Portrait unavailable')
          img.src = `/images/team/${index}.avif`
          return img.decode()
        }).then(() => {
          if (disposed)
            return
          imagesRef.current[index] = img
          loadImageOnCanvas(frameRef.current)
        }).catch(() => {
          // Keep a prepared portrait visible if a frame cannot load.
        }).finally(() => {
          loading--
          prepareFrames()
        })
      }
    }
    const loadFrame = (index: number) => {
      if (requested.has(index))
        return
      requested.add(index)
      pending.push(index)
    }

    frameRef.current = 0
    directionRef.current = 1
    loadFrame(0)
    prepareFrames()

    const loadSequence = () => {
      if (disposed || reducedMotion)
        return
      for (let index = 1; index <= lastFrame; index++)
        loadFrame(index)
      prepareFrames()
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || reducedMotion)
        return
      loadSequence()
      observer.disconnect()
    }, { rootMargin: `${Math.max(window.innerHeight, 800)}px` })

    const preloadWhenIdle = () => {
      if ('requestIdleCallback' in window)
        idle = window.requestIdleCallback(loadSequence, { timeout: 1500 })
      else
        timer = setTimeout(loadSequence, 200)
    }

    document.fonts.ready.then(() => {
      if (disposed || reducedMotion)
        return
      previewFrames.forEach(loadFrame)
      prepareFrames()
      if (modelsRef.current)
        observer.observe(modelsRef.current)
      if (!lightweight)
        return
      // Keep page assets ahead of the full sequence on the initial visit.
      if (document.readyState === 'complete')
        preloadWhenIdle()
      else
        window.addEventListener('load', preloadWhenIdle, { once: true })
    })

    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas)
        return
      const mobile = window.innerWidth < 768
      const interpolate = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      canvasModeRef.current = { mobile, interpolate }
      const pixelRatio = Math.min(window.devicePixelRatio, interpolate ? 1.5 : 2)
      canvas.width = Math.round(canvas.clientWidth * pixelRatio)
      canvas.height = Math.round(canvas.clientHeight * pixelRatio)
      drawnFrameRef.current = -1
      loadImageOnCanvas(frameRef.current)
    }
    resizeCanvas()
    const resize = new ResizeObserver(resizeCanvas)
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
      if (idle !== undefined)
        window.cancelIdleCallback(idle)
      clearTimeout(timer)
      window.removeEventListener('load', preloadWhenIdle)
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', restore)
      window.removeEventListener('pageshow', restore)
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
            <canvas ref={canvasRef} className="absolute left-1/2 bottom-0 h-[calc(100%/0.86)] max-h-[calc(100vw_-_20px)] md:max-h-none aspect-square -translate-x-1/2" />
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
