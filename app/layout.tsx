import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Analytics } from "@vercel/analytics/react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio";
const siteName = "Lumyn";
const siteDescription =
  "Lumyn is an independent product studio building high-performance digital tools and custom web applications that solve real-world problems with precision and impact.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lumyn — Impactful Products, Engineered for Results.",
    template: "%s — Lumyn",
  },
  description: siteDescription,
  keywords: [
    "product studio",
    "software development services",
    "custom software development",
    "web application development",
    "PWA development",
    "React development agency",
    "Next.js developers",
    "full-stack development studio",
    "software engineering studio",
    "problem solving software",
    "impactful digital tools",
    "web agency",
    "web development services",
    "mobile app development services",
    "website developer",
    "web developer"
  ],
  authors: [{ name: "Lumyn", url: siteUrl }],
  creator: "Lumyn",
  publisher: "Lumyn",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Lumyn — Impactful Products, Engineered for Results.",
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Lumyn | Modern Product Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumyn — Impactful Products, Engineered for Results.",
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@lumynstudio",
    site: "@lumynstudio",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lumyn",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: siteDescription,
  sameAs: [
    "https://twitter.com/lumynstudio",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/contact`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lumyn" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js'); }); }`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
