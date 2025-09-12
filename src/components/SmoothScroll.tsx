'use client'

import { ReactNode, useRef } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const smoother = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother.current = ScrollSmoother.create({
      smooth: 1
    });
  }, {
    dependencies: [pathname],
    revertOnUpdate: true,
  });

  return (
    <div id="smooth-wrapper" className="overflow-hidden">
      <div id="smooth-content">{children}</div>
    </div>
  )
}