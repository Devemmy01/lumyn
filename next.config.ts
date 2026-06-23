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
  async headers() {
    const privateRouteHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Cache-Control", value: "private, no-store" },
    ];

    return [
      { source: "/admin/:path*", headers: privateRouteHeaders },
      { source: "/academy/dashboard/:path*", headers: privateRouteHeaders },
      { source: "/academy/sign-in", headers: privateRouteHeaders },
      { source: "/academy/payment/:path*", headers: privateRouteHeaders },
    ];
  },
};

export default nextConfig;
