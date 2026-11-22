import type { Metadata } from 'next'

import { CasePage } from '@/app/work/shareio/CasePage'

export const metadata: Metadata = {
  alternates: { canonical: '/work/shareio' },
  title: 'Shareio – Visual Identity, 3D & Web Redesign – KLAD',
  description: 'Brand identity, parametric 3D assets, motion, website and product interface design for Shareio, a tool for selling access to content in cloud storage.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
