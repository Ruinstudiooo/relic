/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@relic/schema"],
  poweredByHeader: false,
};

export default nextConfig;
