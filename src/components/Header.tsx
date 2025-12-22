'use client'

import { useGSAP } from '@gsap/react'
import * as Dialog from '@radix-ui/react-dialog'
import { gsap } from 'gsap'
import { useLenis } from 'lenis/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'

const cities = [
  { name: 'TBILISI', timeZone: 'Asia/Tbilisi' },
  { name: 'DA NANG', timeZone: 'Asia/Ho_Chi_Minh' },
  { name: 'HELSINKI', timeZone: 'Europe/Helsinki' },
]

const menu = [
  { title: 'About', link: '/' },
  { title: 'Cases', link: '#' },
  { title: 'Process', link: '/process' },
  { title: 'Expectations', link: '/expectations' },
  { title: 'Pricing', link: '/pricing' },
  { title: 'Express', link: '#' },
]

export function Header() {
  const menuRef = useRef<HTMLDivElement | null>(null)

  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [time, setTime] = useState<Record<string, string>>({})

  const smoother = useLenis()
  const pathname = usePathname()

  // Menu items animation
  const { contextSafe } = useGSAP({ scope: menuRef })
  const handleOpenAutoFocus = contextSafe(() => {
    if (!menuRef.current)
      return

    const ctx = gsap.context(() => {
      gsap.from('.menuItem', {
        filter: 'blur(10px)',
        autoAlpha: 0,
        duration: 0.3,
        yPercent: 40,
        stagger: 0.1,
        delay: 0.1,
        onComplete: () => ctx.revert(),
      })
    })
  })

  // Close menu when screen size >= 768
  useEffect(() => {
    isOpenMenu ? smoother?.stop() : smoother?.start()

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (isOpenMenu) {
        setIsOpenMenu(false)
      }
    })

    return () => mm.revert()
  }, [isOpenMenu])

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted: Record<string, string> = {}

      cities.forEach((city) => {
        formatted[city.name] = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: city.timeZone,
          hour12: true,
        }).format(now)
      })

      setTime(formatted)
    }

    updateTime()

    const interval = setInterval(updateTime, 1000 * 60)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="fixed z-20 top-0 right-0 lg:bottom-0 w-full lg:w-auto pt-[3px] pr-[3px] pl-2.5 md:px-2.5 md:pt-2.5 lg:px-2.5 lg:pb-2.5 lg:pt-[60px]">
      <div className="relative flex lg:flex-col-reverse justify-between items-start lg:h-full lg:w-[130px]">
        <Dialog.Root open={isOpenMenu} onOpenChange={setIsOpenMenu}>
          <Dialog.Trigger asChild>
            <Button className="md:hidden mt-1.5" label="Menu" />
          </Dialog.Trigger>
          <Dialog.Portal container={container}>
            <Dialog.Overlay className="fixed inset-0 bg-gray/95 dark:bg-black/95 animate-opacity z-10" />
            <Dialog.Content onOpenAutoFocus={handleOpenAutoFocus} className="fixed inset-0 z-20 flex flex-col items-start pt-[70px] px-2.5 pb-2.5 overflow-auto">
              <Dialog.Title className="hidden">Menu</Dialog.Title>
              <Dialog.Close asChild>
                <Button className="fixed top-[9px]" label="Close" />
              </Dialog.Close>
              <Image
                className="fixed top-[3px] right-[3px] md:size-[70px] lg:size-[80px] blur-[0.6px] dark:invert transform-gpu"
                src="/images/logotype.svg"
                alt="logotype"
                width={60}
                height={60}
              />
              <nav ref={menuRef} className="w-full grow flex flex-col items-center gap-8 text-p1">
                {menu.map(({ title, link }) => (
                  <div key={title} className="menuItem -rotate-2">
                    <Button
                      as="a"
                      href={link}
                      onClick={() => setIsOpenMenu(false)}
                      label={title}
                      className="text-p1 [&>span]:blur-[0.75px] before:blur-[5px] after:blur-[2px]"
                      isActive
                    />
                  </div>
                ))}
                <div className="menuItem -rotate-2 mt-auto">
                  <Button
                    as="a"
                    href="https://cal.com/klad-design/discovery"
                    target="_blank"
                    label="Book a call"
                    className="text-p1 [&>span]:blur-[0.75px] before:blur-[5px] after:blur-[2px]"
                    isActive
                  />
                </div>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <div className="hidden md:grid grid-cols-4 lg:flex lg:flex-col-reverse gap-2.5 lg:gap-[30px] grow">
          <div className="hidden lg:flex flex-col items-start mt-6 text-[12px] leading-none uppercase">
            <div className="-rotate-2 blurred blurred--active" data-label="© Klad syndicate.">
              <span>© Klad syndicate.</span>
            </div>
            <ul className="flex flex-col gap-[3px] mt-2">
              <li className="blurred blurred--active" data-label="All Rights Reserved.">
                <span>All Rights Reserved.</span>
              </li>
              <li className="blurred blurred--active" data-label="Remote, Worldwide">
                <span>Remote, Worldwide</span>
              </li>
              <li>
                <Button as="a" href="mailto:info@klad.design" label="info@klad.design" isActive />
              </li>
              <li>
                <Button as="a" href="https://t.me/klad_syndicate" target="_blank" label="995.591.017.066" isActive />
              </li>
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            {menu.map(({ title, link }) => (
              <Button
                key={title}
                as="a"
                href={link}
                className="button button--xs"
                label={title}
                isActive={pathname === link}
              />
            ))}
            <Button
              as="a"
              href="https://cal.com/klad-design/discovery"
              className="button button--xs mt-1.5"
              target="_blank"
              label="Book a call"
            />
          </nav>
          <div className="text-[12px] leading-none uppercase">
            <div className="blurred blurred--active" data-label="Our time at">
              <span>Our time at</span>
            </div>
            <ul className="flex flex-col items-start gap-[3px] mt-2">
              {cities.map(city => (
                <li key={city.name} className="flex gap-1.5 justify-between text-nowrap">
                  <span className="min-w-[65px] blurred blurred--active" data-label={city.name}>
                    <span>{city.name}</span>
                  </span>
                  <span className="inline-flex justify-end min-w-[55px]">
                    <span className="blurred blurred--active" data-label={time[city.name]}>
                      <span>{time[city.name]}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            <Button
              as="a"
              href="https://www.behance.net/klad_design"
              className="button button--xs"
              target="_blank"
              label="Behance"
            />
            <Button
              as="a"
              href="https://www.instagram.com/klad_syndicate"
              className="button button--xs"
              target="_blank"
              label="Instagram"
            />
            <Button
              as="a"
              href="https://www.linkedin.com/company/klad"
              className="button button--xs"
              target="_blank"
              label="LinkedIn"
            />
          </nav>
        </div>
        <Link href="/" className="relative md:absolute md:right-0 lg:static z-10">
          <Image
            className="md:size-[70px] lg:size-[80px] blur-[0.6px] dark:invert transform-gpu"
            src="/images/logotype.svg"
            alt="logotype"
            width={60}
            height={60}
          />
        </Link>
      </div>
      <div ref={setContainer} />
    </header>
  )
}
