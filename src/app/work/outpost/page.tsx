import type { Metadata } from 'next'

import { CasePage } from '@/app/work/outpost/CasePage'

export const metadata: Metadata = {
  title: 'Outpost – Branding, 3D & Web Design – KLAD',
  description: 'Brand identity, 3D visuals and web design for Outpost by Klad Syndicate.',
  robots: { index: false, follow: false },
}

export default function Case() {
  return <CasePage />
}
