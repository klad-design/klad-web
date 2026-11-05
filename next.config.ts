import type { NextConfig } from 'next'

import process from 'node:process'

const nextConfig: NextConfig = {
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
    {
      source: '/images/team/:frame.avif',
      destination: '/images/team/v1/:frame.avif',
      permanent: true,
    },
    {
      source: '/projects',
      destination: '/work',
      permanent: true,
    },
  ],
}

export default nextConfig
