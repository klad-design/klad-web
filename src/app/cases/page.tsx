import type { Metadata } from 'next'

import CasesPage from '@/app/cases/CasesPage'

export const metadata: Metadata = {
  title: 'Cases page',
}

export default function Cases() {
  return <CasesPage />
}
