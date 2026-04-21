import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.aliyuncs.com',
      },
    ],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

export default withPayload(nextConfig)
