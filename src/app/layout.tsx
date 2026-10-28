import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import process from 'node:process'

import { ThemeProvider } from 'next-themes'
import Image from 'next/image'

import { CursorGhost } from '@/components/CursorGhost'
import { Header } from '@/components/Header'
import { PageImprints } from '@/components/PageImprints'
import { SmoothScroll } from '@/components/SmoothScroll'

import '@/styles/globals.css'
import 'lenis/dist/lenis.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://klad.design'),
  robots: process.env.STAGING === '1' ? { index: false, follow: false } : undefined,
  title: 'Klad Syndicate',
  description: 'Klad Syndicate',
  icons: {
    apple: '/images/favicon/apple-touch-icon.png',
    icon: [
      {
        rel: 'icon',
        type: 'image/ico',
        url: '/images/favicon/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/images/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/images/favicon/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/images/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/images/favicon/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/images/favicon/site.webmanifest',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-gray dark:bg-black transition-colors duration-200" suppressHydrationWarning>
      <body className="bg-gray dark:bg-black dark:text-gray transition-colors duration-200 selection:bg-[#ADADAD]/60">
        <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
          <defs>
            {/* Difference blending uses 231 against the brand backgrounds 1 and 230. */}
            <filter id="brand-inversion" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feComponentTransfer>
                <feFuncR type="linear" slope={231 / 229} intercept={-231 / (229 * 255)} />
                <feFuncG type="linear" slope={231 / 229} intercept={-231 / (229 * 255)} />
                <feFuncB type="linear" slope={231 / 229} intercept={-231 / (229 * 255)} />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>
        <Image
          data-header-logo-initial
          className="inverted-ui pointer-events-none fixed right-[3px] top-[3px] z-40 size-[60px] md:right-2.5 md:top-2.5 md:size-[70px] lg:right-[60px] lg:top-[60px] lg:size-[80px]"
          src="/images/logo-still.svg"
          alt=""
          width={60}
          height={60}
          loading="eager"
          aria-hidden="true"
        />
        <ThemeProvider enableSystem={false} defaultTheme="light">
          <CursorGhost />
          <PageImprints />
          <Header />

          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
