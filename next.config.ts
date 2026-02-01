import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/projects',
      destination: '/work',
      permanent: true,
    },
  ],
}

export default nextConfig
