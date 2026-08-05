import type { Metadata } from 'next'

import { CasePage } from '@/app/work/datalane/CasePage'

export const metadata: Metadata = {
  title: 'DataLane – Data-driven Brand Design & Web Implementation – KLAD',
  description: 'Brand identity, website implementation and data visualisation for DataLane, a GTM engineering platform helping enterprise teams reach local businesses.',
  openGraph: {
    images: [
      {
        url: '/images/datalane/1.avif',
        width: 3840,
        height: 2456,
        alt: 'DataLane website with a cobalt-blue network graphic and the headline “Scraping the mess isn’t enough.”',
      },
    ],
  },
}

export default function Case() {
  return (
    <CasePage />
  )
}
