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
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      {
        key: "Content-Security-Policy",
        value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];
    const privateRouteHeaders = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
      { key: "Cache-Control", value: "private, no-store" },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: privateRouteHeaders },
      { source: "/academy/dashboard/:path*", headers: privateRouteHeaders },
      { source: "/academy/sign-in", headers: privateRouteHeaders },
      { source: "/academy/payment/:path*", headers: privateRouteHeaders },
    ];
  },
};

export default nextConfig;
