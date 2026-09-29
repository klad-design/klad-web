import type { Metadata } from 'next'

import { CasePage } from '@/app/work/datalane/CasePage'

export const metadata: Metadata = {
  title: 'Datalane – Brand Identity, Motion & Web – KLAD',
  description: 'We built Datalane’s identity around a dot: a data point and a business on a map. In nine weeks, it became a brand and website.',
  openGraph: {
    images: [
      {
        url: '/images/datalane/1.jpeg',
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
