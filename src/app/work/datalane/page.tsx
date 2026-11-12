import type { Metadata } from 'next'

import { CasePage } from '@/app/work/datalane/CasePage'

export const metadata: Metadata = {
  title: 'Datalane – Brand Identity, Motion & Web – KLAD',
  description: 'Datalane’s complete brand identity, website, product design, motion and sound, designed and authored by Klad over 10 months.',
  openGraph: {
    images: [
      {
        url: '/images/datalane/1.avif',
        width: 3440,
        height: 2200,
        alt: 'Datalane website hero with a blue network and the headline “Scraping the mess isn’t enough.”',
      },
    ],
  },
}

export default function Case() {
  return (
    <CasePage />
  )
}
