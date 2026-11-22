import type { Metadata } from 'next'

import WorkPage from '@/app/work/WorkPage'

export const metadata: Metadata = {
  alternates: { canonical: '/work' },
  title: 'Our Work – KLAD',
  description: 'Selected branding, web design, UI/UX, 3D and motion projects by Klad Syndicate, with case studies covering the brief, design decisions and deliverables.',
}

export default async function Work({ searchParams }: PageProps<'/work'>) {
  const { case: project } = await searchParams
  return <WorkPage initialCase={Array.isArray(project) ? project[0] : project} />
}
