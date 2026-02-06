import type { Metadata } from 'next'

import { CasePage } from '@/app/work/shareio/CasePage'

export const metadata: Metadata = {
  title: 'Shareio – Visual Identity, 3D & Web Redesign – KLAD',
  description: 'Design case study by Klad Syndicate. Branding, 3D/motion and web redesign for Shareio - a content monetization tool built around creator ownership, trust and a creative dimension identity.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
