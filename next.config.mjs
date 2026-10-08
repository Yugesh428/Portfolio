/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },
  // Next.js 14 key for server-side native packages
  experimental: {
    serverComponentsExternalPackages: ["pg", "pg-hstore", "sequelize", "bcryptjs", "ioredis"],
  },
};

export default nextConfig;
