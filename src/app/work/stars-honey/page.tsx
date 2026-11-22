import type { Metadata } from 'next'

import { CasePage } from '@/app/work/stars-honey/CasePage'

export const metadata: Metadata = {
  alternates: { canonical: '/work/stars-honey' },
  title: 'Stars+Honey – 3D Product Visualization – KLAD',
  description: '3D product renders, packaging and ingredient animations for Stars+Honey collagen bars, built as a reusable library for campaigns and new flavors.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
