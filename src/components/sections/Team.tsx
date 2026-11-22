'use client'

import type { JSX } from 'react'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
import NextImage from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import dasha from '@/assets/team-fav/dasha.png'
import egor from '@/assets/team-fav/egor.png'
import ksusha from '@/assets/team-fav/ksusha.png'
import lenar from '@/assets/team-fav/lenar.png'
import lenas from '@/assets/team-fav/lenas.png'
import { Button } from '@/components/ui/Button'
import { TextBlur } from '@/components/ui/TextBlur'
import { useMediaQuery } from '@/components/useMediaQuery'
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
        <p>Web designer and UI/UX specialist with 11 years of experience. Co-founder. Prefers digital minimalism, clear structure and simple solutions that last.</p>
        <p>Works with existing branding or develops the visual direction from scratch. Understands how websites are built and keeps implementation in mind.</p>
        <p>
          Clients can follow the work in Figma from the start.
          {' '}
          <Button
            data-member={3}
            aria-label="Go to Egor"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Egor
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={egor} unoptimized alt="Egor 3d model preview" width={11} height={14} />
              </>
            )}
          />
          {' '}
          handles communication and project management.
        </p>
      </>
    ),
  },
  {
    name: 'Lena S.',
    role: 'motion',
    description: () => (
      <>
        <p>Motion designer and 3D generalist with 8 years of experience and formal training. Co-founder. Works across product animation, brand motion and 3D visuals.</p>
        <p>Can lead a project independently or work as part of a larger team. Chooses tools for the task and is comfortable working within an existing brand system.</p>
        <p>
          Prefers artistic interpretations over standard approaches. Handles projects together with
          {' '}
          <Button
            data-member={4}
            aria-label="Go to Dasha"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Dasha
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={dasha} unoptimized alt="Dasha 3d model preview" width={11} height={14} />
              </>
            )}
          />
          .
        </p>
      </>
    ),
  },
  {
    name: 'Lena R.',
    role: 'branding',
    description: () => (
      <>
        <p>Brand designer working with physical products and digital businesses, from established retail brands to early-stage startups. Experienced in both B2B and B2C.</p>
        <p>Builds new identities and develops existing ones. Her work covers the core brand system and its use across packaging, print and digital materials.</p>
        <p>
          Usually leads the creative work on branding projects, with
          {' '}
          <Button
            data-member={3}
            aria-label="Go to Egor"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Egor
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={egor} unoptimized alt="Egor 3d model preview" width={11} height={14} />
              </>
            )}
          />
          {' '}
          managing the project and client communication.
        </p>
      </>
    ),
  },
  {
    name: 'Egor',
    role: 'MGMT',
    description: () => (
      <>
        <p>Project lead for web and branding. Co-founder with 8 years in B2B marketing and analytics. Particular interest in data visualisation and naming.</p>
        <p>Keeps calls short and involves the people who make decisions. Brings the client’s needs into design discussions and explains the team’s decisions to the client.</p>
        <p>
          Main point of contact for projects with
          {' '}
          <Button
            data-member={0}
            aria-label="Go to Ksusha"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Ksusha
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={ksusha} unoptimized alt="Ksusha 3d model preview" width={11} height={14} />
              </>
            )}
          />
          {' '}
          and
          {' '}
          <Button
            data-member={2}
            aria-label="Go to Lena R"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Lena R
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={lenar} unoptimized alt="Lena Ryazantseva 3d model preview" width={11} height={14} />
              </>
            )}
          />
          . Sets expectations, manages communication and keeps the work moving.
        </p>
      </>
    ),
  },
  {
    name: 'Dasha',
    role: 'MGMT',
    description: () => (
      <>
        <p>Project lead for motion and 3D. Co-founder with 6 years in account management and legal, and a background in conflict management.</p>
        <p>Manages short-turnaround work and longer collaborations. Handles schedules, feedback and client communication so the designers can focus on the work.</p>
        <p>
          Main point of contact for projects with
          {' '}
          <Button
            data-member={1}
            aria-label="Go to Lena S"
            className="underline decoration-dotted text-nowrap"
            isInherit
            label={(
              <>
                Lena S
                <NextImage className="inline ml-0.5 align-text-bottom w-[11px]" src={lenas} unoptimized alt="Lena Sivakova 3d model preview" width={11} height={14} />
              </>
            )}
          />
          . Sets expectations at the start and stays involved throughout the project.
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
  const prepareFramesRef = useRef<(index: number) => void>(() => {})

  const [activeMemberIndex, setActiveMemberIndex] = useState(0)

  const smoother = useLenis()
  const reducedMotion = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')

  const loadImageOnCanvas = useCallback((index: number) => {
    const previousFrame = drawnFrameRef.current < 0 ? frameRef.current : drawnFrameRef.current
    if (index !== previousFrame)
      directionRef.current = Math.sign(index - previousFrame)
    frameRef.current = index
    prepareFramesRef.current(index)
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
    if (reducedMotion || desktop !== false)
      return

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
        invalidateOnRefresh: true,
        pinSpacing: false,
        pin: true,
        scrub: mobileScrub,
        // Refresh can restore the playhead without calling onUpdate.
        onRefresh: () => loadImageOnCanvas(playhead.frame),
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
          invalidateOnRefresh: true,
          scrub: mobileScrub,
        })
      }
    })
  }, { scope: sectionRef, dependencies: [reducedMotion, desktop], revertOnUpdate: true })

  // Desktop scroll
  useGSAP(() => {
    if (reducedMotion || !desktop)
      return

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
  }, { dependencies: [smoother, reducedMotion, desktop], scope: sectionRef, revertOnUpdate: true })

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
    const pending: number[] = []
    const requested = new Set<number>()
    const pendingImages = new Set<HTMLImageElement>()
    const mobileFrames = window.innerWidth < 768
    const images: HTMLImageElement[] = []
    let wanted = new Set([0])
    let center = -1
    let sequenceReady = false
    let refreshing = false
    imagesRef.current = images
    drawnFrameRef.current = -1

    const prepareFrame = async (index: number, mobileSource: boolean) => {
      const size = mobileSource ? 832 : 1080
      const source = mobileSource ? `/images/team-mobile/v5/${index}.avif` : `/images/team/v1/${index}.avif`
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = index === 0 ? 'auto' : 'low'
      pendingImages.add(image)
      image.src = source
      try {
        await image.decode()
        if (disposed || image.naturalWidth !== size || image.naturalHeight !== size)
          throw new Error('Portrait unavailable')
        return image
      }
      finally {
        pendingImages.delete(image)
      }
    }

    const prepareFrames = () => {
      if (disposed || document.visibilityState !== 'visible')
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
        loading++
        prepareFrame(index, mobileFrames).catch(() => {
          if (!mobileFrames || disposed)
            throw new Error('Portrait unavailable')
          return prepareFrame(index, false)
        }).then((image) => {
          if (disposed) {
            image.src = ''
            return
          }
          if (wanted.has(index)) {
            images[index] = image
            loadImageOnCanvas(frameRef.current)
          }
          else {
            image.src = ''
            requested.delete(index)
          }
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

    const prepareWindow = (frame: number) => {
      if (disposed || refreshing || !sequenceReady || center === Math.floor(frame))
        return
      center = Math.floor(frame)
      wanted = new Set(previewFrames)
      for (let index = Math.max(0, center - 12); index <= Math.min(lastFrame, center + 12); index++)
        wanted.add(index)
      images.forEach((image, index) => {
        if (image && !wanted.has(index)) {
          image.src = ''
          delete images[index]
          requested.delete(index)
        }
      })
      for (let index = pending.length - 1; index >= 0; index--) {
        if (!wanted.has(pending[index])) {
          requested.delete(pending[index])
          pending.splice(index, 1)
        }
      }
      wanted.forEach(loadFrame)
      prepareFrames()
    }
    prepareFramesRef.current = prepareWindow

    // Refresh temporarily resets playheads; keep their prepared neighborhood until it settles.
    const beginRefresh = () => {
      refreshing = true
    }
    const endRefresh = () => {
      refreshing = false
      prepareWindow(frameRef.current)
    }
    ScrollTrigger.addEventListener('refreshInit', beginRefresh)
    ScrollTrigger.addEventListener('refresh', endRefresh)

    frameRef.current = 0
    directionRef.current = 1
    loadFrame(0)
    prepareFrames()

    const loadSequence = () => {
      if (disposed || reducedMotion)
        return
      sequenceReady = true
      center = -1
      prepareWindow(frameRef.current)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || reducedMotion)
        return
      loadSequence()
      observer.disconnect()
    }, { rootMargin: `${Math.max(window.innerHeight, 800)}px` })

    document.fonts.ready.then(() => {
      if (disposed || reducedMotion)
        return
      if (modelsRef.current)
        observer.observe(modelsRef.current)
    })

    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (disposed || !canvas)
        return
      const mobile = window.innerWidth < 768
      const interpolate = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      canvasModeRef.current = { mobile, interpolate }
      const pixelRatio = Math.min(window.devicePixelRatio, 2)
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
      if (disposed || document.visibilityState !== 'visible')
        return
      prepareFrames()
      drawnFrameRef.current = -1
      ScrollTrigger.refresh()
      loadImageOnCanvas(frameRef.current)
    }
    document.addEventListener('visibilitychange', restore)
    window.addEventListener('pageshow', restore)

    return () => {
      disposed = true
      prepareFramesRef.current = () => {}
      pendingImages.forEach(image => image.src = '')
      for (const image of images) {
        if (image)
          image.src = ''
      }
      images.length = 0
      observer.disconnect()
      resize.disconnect()
      ScrollTrigger.removeEventListener('refreshInit', beginRefresh)
      ScrollTrigger.removeEventListener('refresh', endRefresh)
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
