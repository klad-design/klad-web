import type { Metadata } from 'next'

import { CasePage } from '@/app/work/chainviz/CasePage'

export const metadata: Metadata = {
  title: 'Chainviz – Blockchain Analytics UI, Branding & Web App Design – KLAD',
  description: 'A data-driven UI/UX and branding project by Klad Syndicate for Chainviz, turning complex blockchain validator data into clear interfaces.',
}

export default function Case() {
  return (
    <CasePage />
  )
}
