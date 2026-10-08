/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // Do NOT externalize pg/sequelize — Vercel serverless needs them bundled
  serverExternalPackages: ["pg", "pg-hstore", "sequelize"],
};

export default nextConfig;
