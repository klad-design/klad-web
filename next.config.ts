import type { NextConfig } from 'next'

import process from 'node:process'

const legacyPortfolioPaths = [
  '/projects',
  '/projects/',
  '/portfolio2023.pdf',
  '/storage/app/uploads/public/65a/fee/a80/65afeea8008db691085313.pdf',
  '/storage/app/uploads/public/64f/74e/f96/64f74ef969321270668268.pdf',
]

const nextConfig: NextConfig = {
  // Resolve legacy paths before removing their trailing slash to avoid two redirects.
  skipTrailingSlashRedirect: true,
  // Avoid reusing stale compiled styles in previews and builds.
  experimental: { turbopackFileSystemCacheForBuild: false, turbopackFileSystemCacheForDev: false },
  headers: async () => [
    { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
    { source: '/fonts/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' }] },
    { source: '/images/team/v1/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/images/team-mobile/v5/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ...(process.env.STAGING === '1'
      ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
      : []),
  ],
  redirects: async () => [
    ...legacyPortfolioPaths.flatMap(source => [
      {
        source,
        has: [{ type: 'host' as const, value: 'www.klad.design' }],
        destination: 'https://klad.design/work',
        permanent: true,
      },
      { source, destination: '/work', permanent: true },
    ]),
    {
      source: '/:path+/',
      has: [{ type: 'host', value: 'www.klad.design' }],
      destination: 'https://klad.design/:path*',
      permanent: true,
    },
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'www.klad.design' }],
      destination: 'https://klad.design/:path*',
      permanent: true,
    },
    {
      source: '/images/team/:frame.avif',
      destination: '/images/team/v1/:frame.avif',
      permanent: true,
    },
    {
      source: '/:path+/',
      destination: '/:path*',
      permanent: true,
    },
  ],
}

export default nextConfig
