import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the long-running dev cache isolated from `next build`. Sharing `.next`
  // lets a production build replace module manifests underneath the dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: ["10.157.26.118"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {},
};

export default nextConfig;
