import Link from "next/link";
import type { Metadata } from 'next'

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