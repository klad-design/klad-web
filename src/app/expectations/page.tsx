import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Expectations page',
}

export default function Expectations() {
  return (
    <div>
      <h1>Expectations</h1>
      <p>
        <Link href="/">Main</Link>
      </p>
    </div>
  )
}
