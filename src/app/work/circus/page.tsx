import type { Metadata } from 'next'

import { CasePage } from '@/app/work/circus/CasePage'

export const metadata: Metadata = {
  alternates: { canonical: '/work/circus' },
  title: 'Circus Group – 3D Product Website Design & Webflow Development – KLAD',
  description: 'Website design, Webflow development and 3D animation for Circus Group’s robotic kitchen, including an interactive look inside the machine.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
