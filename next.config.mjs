/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "everz-digital.site" },
      { protocol: "http", hostname: "43.157.197.145", port: "8090" },
    ],
  },
};

export default nextConfig;
