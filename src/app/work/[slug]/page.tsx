import type { Metadata } from 'next'

import { CasePage } from '@/app/work/[slug]/CasePage'

export const metadata: Metadata = {
  title: 'Case page',
}

export default function Case() {
  return (
    <CasePage />
  )
}
