/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
    }
    return config
  },
}

// Payload CMS integration
const withPayload = require('@payloadcms/next/withPayload').default

module.exports = withPayload(nextConfig)
