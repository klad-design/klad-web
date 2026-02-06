import type { Metadata } from 'next'

import { CasePage } from '@/app/work/linux-mint/CasePage'

export const metadata: Metadata = {
  title: 'Linux Mint – Brand Identity Redesign Concept – KLAD',
  description: 'A modern visual identity, UI/UX system and brand motion direction for Linux Mint. Proving open-source can feel polished, friendly and consistent.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
