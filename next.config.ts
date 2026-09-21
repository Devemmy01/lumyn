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
    const adsOrigin = process.env.NEXT_PUBLIC_ADS_ORIGIN;
    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL;
    // frame-src: what THIS site's pages are allowed to embed as an iframe.
    // Only 'self' plus the dedicated ads subdomain, if configured — nothing
    // else on the site ever needs to frame third-party content.
    const frameSrc = ["'self'", adsOrigin].filter(Boolean).join(" ");

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
        value: `base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src ${frameSrc};`,
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
    // The ad-frame route is meant to be embedded cross-origin — from the ads
    // subdomain into the main site — the opposite of every other route,
    // which should never be framed by anyone. It gets its own narrower
    // header set instead of the site-wide X-Frame-Options/frame-ancestors
    // rules, which would otherwise block the main site from framing it.
    const adFrameHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Content-Security-Policy",
        value: `frame-ancestors 'self'${siteOrigin ? ` ${siteOrigin}` : ""};`,
      },
    ];

    return [
      { source: "/((?!ad-frame).*)", headers: securityHeaders },
      { source: "/ad-frame/:path*", headers: adFrameHeaders },
      { source: "/admin/:path*", headers: privateRouteHeaders },
      { source: "/academy/dashboard/:path*", headers: privateRouteHeaders },
      { source: "/academy/sign-in", headers: privateRouteHeaders },
      { source: "/academy/payment/:path*", headers: privateRouteHeaders },
      { source: "/guides/checkout/:path*", headers: privateRouteHeaders },
      { source: "/guides/success", headers: privateRouteHeaders },
      { source: "/guides/download/:path*", headers: privateRouteHeaders },
      { source: "/guides/resend", headers: privateRouteHeaders },
    ];
  },
};

export default nextConfig;
