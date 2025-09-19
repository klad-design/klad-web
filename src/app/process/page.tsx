import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Process page',
}

export default function Process() {
  return (
    <div>
      <h1>Process</h1>
      <p>
        <Link href="/">Main</Link>
      </p>
    </div>
  )
}
