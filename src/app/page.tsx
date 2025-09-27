import type { Metadata } from 'next'
import { DarkSections } from '@/components/DarkSections'
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
      <DarkSections>
        <Hero />
        <Services />
        <Team />
        <Call />
      </DarkSections>
    </>
  )
}
