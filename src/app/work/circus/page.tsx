import type { Metadata } from 'next'

import { CasePage } from '@/app/work/shareio/CasePage'

export const metadata: Metadata = {
  title: 'Circus Group – 3D Product Website Design & Webflow Development – KLAD',
  description: 'A product-driven website by Klad Syndicate featuring high-fidelity 3D models, interactive look insid functionality and motion design built for Webflow.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
