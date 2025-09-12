'use client'

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

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
  const [time, setTime] = useState<Record<string, string>>({});

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
        <Button className="md:hidden mt-1.5" text="Menu" />
        <div className="hidden md:grid grid-cols-4 lg:flex lg:flex-col-reverse gap-2.5 lg:gap-[30px] grow">
          <div className="hidden lg:flex flex-col items-start mt-6 text-[12px] leading-none uppercase">
            <div className="-rotate-2">© Klad syndicate.</div>
            <ul className="flex flex-col gap-[3px] mt-2">
              <li>All Rights Reserved.</li>
              <li>Remote, Worldwide</li>
              <li><Link href="mailto:info@klad.design">info@klad.design</Link></li>
              <li><Link href="tel:+995-591-017-066">995.591.017.066</Link></li>
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            <Link className="button button--xs" href="#">About</Link>
            <Link className="button button--xs" href="#">Cases</Link>
            <Link className="button button--xs" href="#">Process</Link>
            <Link className="button button--xs" href="#">Expectations</Link>
            <Link className="button button--xs" href="#">Pricing</Link>
            <Link className="button button--xs" href="#">Express</Link>
            <Link className="button button--xs" href="#">Mockups</Link>
            <Link className="button button--xs mt-1.5" href="https://calendly.com/klad-design/discovery" target="_blank">Book a call</Link>
          </nav>
          <div className="text-[12px] leading-none uppercase">
            <div>Our time at</div>
            <ul className="flex flex-col items-start gap-[3px] mt-2">
              {cities.map(city => (
                <li key={city.name} className="flex gap-1.5 justify-between text-nowrap">
                  <span className="min-w-[65px]">{city.name}</span>
                  <span className="min-w-[55px] text-right">{time[city.name]}</span>
                </li>
              ))}
            </ul>
          </div>
          <nav className="flex flex-col items-start gap-[3px]">
            <Link className="button button--xs" href="https://www.behance.net/klad_design" target="_blank">Behance</Link>
            <Link className="button button--xs" href="https://www.instagram.com/klad_syndicate" target="_blank">Instagram</Link>
            <Link className="button button--xs" href="https://www.linkedin.com/company/klad" target="_blank">LinkedIn</Link>
          </nav>
        </div>
        <Link href="/" className="md:absolute md:right-0 lg:static">
          <Image className="md:size-[70px] lg:size-[80px]" src="/images/logotype.svg" alt="logotype" width={60} height={60} />
        </Link>
      </div>
    </header>
  )
}