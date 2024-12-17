/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/supabase"],
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
