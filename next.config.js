/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["media.solotodo.com"],
  },
}

module.exports = nextConfig

module.exports = {
  async redirects() {
    return [
      {
        source: '/tos',
        destination: '/legal_information?tab=0',
        permanent: true,
      },
      {
        source: '/privacy_policy',
        destination: '/legal_information?tab=2',
        permanent: true,
      }
    ]
  },
}