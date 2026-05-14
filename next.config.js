/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: 'steamcdn-a.akamaihd.net' },
      { protocol: 'https', hostname: '**.imgur.com' },
    ],
  },
  serverExternalPackages: ['mongoose'],
}

module.exports = nextConfig
