/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => 'build',
}

module.exports = nextConfig