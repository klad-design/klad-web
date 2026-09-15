import type { NextConfig } from 'next'

import process from 'node:process'

const nextConfig: NextConfig = {
  headers: async () => process.env.STAGING === '1'
    ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
    : [],
  redirects: async () => [
    {
      source: '/projects',
      destination: '/work',
      permanent: true,
    },
  ],
}

export default nextConfig
