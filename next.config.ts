import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_CF_PAGES_BRANCH: process.env.CF_PAGES_BRANCH,
  },
}

export default nextConfig
