import type { Metadata } from 'next'

import { CasePage } from '@/app/work/case/CasePage'

export const metadata: Metadata = {
  title: 'Case page',
  description: 'Case page description',
}

export default function Case() {
  return (
    <CasePage />
  )
}
