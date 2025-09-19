'use client'

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {useEffect, useRef, useState} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import {TextBlur} from "@/components/ui/TextBlur";

type City = {
  name: string;
  timeZone: string;

};

const cities: City[] = [
  { name: "TBILISI", timeZone: "Asia/Tbilisi" },
  { name: "DA NANG", timeZone: "Asia/Ho_Chi_Minh" },
  { name: "HELSINKI", timeZone: "Europe/Helsinki" },
];

export function Header() {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [time, setTime] = useState<Record<string, string>>({});

  // Menu items animation
  const { contextSafe } = useGSAP({ scope: menuRef });
  const handleOpenAutoFocus = contextSafe(() => {
    if (!menuRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(".menuItem", {
        filter: 'blur(10px)',
        autoAlpha: 0,
        duration: 0.3,
        yPercent: 40,
        stagger: 0.1,
        delay: 0.1,
        onComplete: () => ctx.revert()
      });
    });
  });

  // Close menu when screen size >= 768
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (isOpenMenu) {
        setIsOpenMenu(false)
      }
    });

    return () => mm.revert()
  }, [isOpenMenu]);

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted: Record<string, string> = {};

      cities.forEach(city => {
        formatted[city.name] = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: city.timeZone,
          hour12: true,
        }).format(now);
      });

      setTime(formatted);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed z-10 top-0 right-0 lg:bottom-0 w-full lg:w-auto pt-[3px] pr-[3px] pl-2.5 md:px-2.5 md:pt-2.5 lg:px-2.5 lg:pb-2.5 lg:pt-[60px]">
      <div className="relative flex lg:flex-col-reverse justify-between items-start lg:h-full lg:w-[130px]">
        <Dialog.Root open={isOpenMenu} onOpenChange={setIsOpenMenu}>
          <Dialog.Trigger asChild>
            <Button blur="regular" className="md:hidden mt-1.5" text="Menu" />
          </Dialog.Trigger>
          <Dialog.Portal container={container}>
            <Dialog.Overlay className="fixed inset-0 bg-gray/95 animate-opacity" />
            <Dialog.Content onOpenAutoFocus={handleOpenAutoFocus} className="fixed inset-0 flex flex-col items-start pt-[70px] px-2.5 pb-2.5 overflow-auto">
              <Dialog.Title className="hidden">Menu</Dialog.Title>
              <Dialog.Close asChild>
                <Button blur="regular" className="fixed top-[9px]" text="Close" />
              </Dialog.Close>
              <nav ref={menuRef} className="w-full grow flex flex-col items-center gap-8">
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>About</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Cases</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Process</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Expectations</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Pricing</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Express</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2" href="#">
                  <TextBlur isBold>Mockups</TextBlur>
                </Link>
                <Link className="menuItem text-p1 uppercase -rotate-2 mt-auto" href="https://calendly.com/klad-design/discovery" target="_blank">
                  <TextBlur isBold>Book a call</TextBlur>
                </Link>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <div className="hidden md:grid grid-cols-4 lg:flex lg:flex-col-reverse gap-2.5 lg:gap-[30px] grow">
          <div className="hidden lg:flex flex-col items-start mt-6 text-[12px] leading-none uppercase">
            <div className="-rotate-2">
              <TextBlur isBold>© Klad syndicate.</TextBlur>
            </div>
            <ul className="flex flex-col gap-[3px] mt-2">
              <li>
                <TextBlur isBold>All Rights Reserved.</TextBlur>
              </li>
              <li>
                <TextBlur isBold>Remote, Worldwide</TextBlur>
              </li>
              <li>
                <Link href="mailto:info@klad.design">
                  <TextBlur isBold>info@klad.design</TextBlur>
                </Link>
              </li>
              <li>
                <Link href="tel:+995-591-017-066">
                  <TextBlur isBold>995.591.017.066</TextBlur>
                </Link>
              </li>
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            <Link className="button button--xs" href="#">
              <TextBlur isBold>About</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Cases</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Process</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Expectations</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Pricing</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Express</TextBlur>
            </Link>
            <Link className="button button--xs" href="#">
              <TextBlur>Mockups</TextBlur>
            </Link>
            <Link className="button button--xs mt-1.5" href="https://calendly.com/klad-design/discovery" target="_blank">
              <TextBlur>Book a call</TextBlur>
            </Link>
          </nav>
          <div className="text-[12px] leading-none uppercase">
            <div>
              <TextBlur isBold>Our time at</TextBlur>
            </div>
            <ul className="flex flex-col items-start gap-[3px] mt-2">
              {cities.map(city => (
                <li key={city.name} className="flex gap-1.5 justify-between text-nowrap">
                  <span className="min-w-[65px]">
                    <TextBlur isBold>{city.name}</TextBlur>
                  </span>
                  <span className="min-w-[55px] text-right">
                    <TextBlur isBold>{time[city.name]}</TextBlur>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            <Link className="button button--xs" href="https://www.behance.net/klad_design" target="_blank">
              <TextBlur isBold>Behance</TextBlur>
            </Link>
            <Link className="button button--xs" href="https://www.instagram.com/klad_syndicate" target="_blank">
              <TextBlur isBold>Instagram</TextBlur>
            </Link>
            <Link className="button button--xs" href="https://www.linkedin.com/company/klad" target="_blank">
              <TextBlur isBold>LinkedIn</TextBlur>
            </Link>
          </nav>
        </div>
        <Link href="/" className="relative md:absolute md:right-0 lg:static z-10">
          <Image className="md:size-[70px] lg:size-[80px] blur-[0.6px]" src="/images/logotype.svg" alt="logotype" width={60} height={60} />
        </Link>
      </div>
      <div ref={setContainer} />
    </header>
  )
}