import type { Metadata } from 'next'

import { Call, Hero, Services, Team } from '@/components/sections'

export const metadata: Metadata = {
  title: 'Home page',
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Team />
      <Call />
    </>
  )
}
