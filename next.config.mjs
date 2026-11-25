/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Security headers are configured in public/_headers for Cloudflare static hosting.
};

export default nextConfig;
