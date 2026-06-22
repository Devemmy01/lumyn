import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@/app/globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import ThemeProvider from "@/components/ThemeProvider";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import { Analytics } from "@vercel/analytics/react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio";
const siteName = "Lumyn";
const siteDescription =
  "Lumyn is an independent product studio building thoughtful digital products and educational experiences for a calmer, more intentional internet.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lumyn - Building Thoughtful Digital Experiences.",
    template: "%s — Lumyn",
  },
  description: siteDescription,
  keywords: [
    "product studio",
    "product studio",
    "independent software studio",
    "MindFuel",
    "Lumyn Academy",
    "AI course generator",
    "AI learning platform",
    "engineering academy",
    "software engineering courses",
    "African technology brand",
    "software education",
    "thoughtful software",
    "intentional technology",
    "digital product studio",
    "modern web products",
    "founder-led studio",
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
    title: "Lumyn - Building Thoughtful Digital Experiences.",
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
    title: "Lumyn - Building Thoughtful Digital Experiences.",
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@lumynstudio",
    site: "@lumynstudio",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/lumyn-mark.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Lumyn",
  url: siteUrl,
  logo: `${siteUrl}/lumyn-mark.svg`,
  description: siteDescription,
  sameAs: [
    "https://twitter.com/lumynstudio",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/contact`,
  },
  makesOffer: [
    {
      "@type": "CreativeWork",
      name: "MindFuel",
      url: "https://www.mind-fuel.app",
      description:
        "A personal growth network where people document what they're learning from life and grow together through reflection.",
    },
    {
      "@type": "EducationalOrganization",
      name: "Lumyn Academy",
      url: `${siteUrl}/academy`,
      description:
        "A paid software engineering academy with AI-generated learning paths, guided mentorship, practical projects, progress tracking, and certificates.",
    },
  ],
  hasPart: [
    {
      "@type": "WebPage",
      name: "Products",
      url: `${siteUrl}/products`,
    },
    {
      "@type": "WebPage",
      name: "Academy",
      url: `${siteUrl}/academy`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('theme');var t=s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();",
          }}
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
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js'); }); }`}
        </Script>
          <FirebaseAnalytics />
          <AuthProvider>
            <ThemeProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </ThemeProvider>
          </AuthProvider>
        
        <Analytics />
      </body>
    </html>
  );
}
