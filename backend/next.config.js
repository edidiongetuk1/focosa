/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig