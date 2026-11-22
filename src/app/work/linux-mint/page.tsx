import type { Metadata } from 'next'

import { CasePage } from '@/app/work/linux-mint/CasePage'

export const metadata: Metadata = {
  alternates: { canonical: '/work/linux-mint' },
  title: 'Linux Mint – Brand Identity Redesign Concept – KLAD',
  description: 'An independent Linux Mint redesign concept by Klad: logo, colors, typography, motion, website and desktop UI. A proposal for a consistent visual identity.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
