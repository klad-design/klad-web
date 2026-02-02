import type { Metadata } from 'next'

import { CasePage } from '@/app/work/another-case/CasePage'

export const metadata: Metadata = {
  title: 'Another case page',
  description: 'Another case page description',
}

export default function Case() {
  return (
    <CasePage />
  )
}
