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
  // Ensure proper webpack configuration for native modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't resolve these modules on the server-side
      config.externals.push({
        'pg-native': 'pg-native',
        'pg': 'commonjs pg',
        'sequelize': 'commonjs sequelize',
      });
    }
    return config;
  },
};

export default nextConfig;
