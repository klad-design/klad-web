import type { NextConfig } from 'next'

import process from 'node:process'

const nextConfig: NextConfig = {
  // Avoid reusing stale compiled styles across deployments.
  experimental: { turbopackFileSystemCacheForBuild: false },
  headers: async () => [
    { source: '/images/team-mobile/v1/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/images/team-mobile/v2/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ...(process.env.STAGING === '1'
      ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
      : []),
  ],
  redirects: async () => [
    {
      source: '/projects',
      destination: '/work',
      permanent: true,
    },
  ],
}

export default nextConfig
