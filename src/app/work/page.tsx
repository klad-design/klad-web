import type { Metadata } from 'next'

import WorkPage from '@/app/work/WorkPage'

export const metadata: Metadata = {
  title: 'Our Work – KLAD',
  description: 'A selection of work by Klad Syndicate – partnering with ambitious teams, from global brands to early-stage startups, at defining moments of growth.',
}

export default function Work() {
  return <WorkPage />
}
