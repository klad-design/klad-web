import type { Metadata } from 'next'

import { CasePage } from '@/app/work/stars-honey/CasePage'

export const metadata: Metadata = {
  title: 'Stars+Honey – 3D Product Visualization – KLAD',
  description: 'A 3D product visualization and packaging system by Klad Syndicate for Stars+Honey, designed to support daily content, seasonal drops and brand growth with a cohesive asset library.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
