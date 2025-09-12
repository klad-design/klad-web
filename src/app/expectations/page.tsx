import Link from "next/link";
import type { Metadata } from 'next'

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