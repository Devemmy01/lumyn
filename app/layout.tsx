import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import ThemeProvider from "@/components/ThemeProvider";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import { Analytics } from "@vercel/analytics/react";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  serializeJsonLd,
  SOCIAL_PROFILES,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lumyn | Product & Software Development Studio",
    template: "%s | Lumyn",
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Lumyn | Product & Software Development Studio",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: "Lumyn | Modern Product Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumyn | Product & Software Development Studio",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
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
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: SITE_LEGAL_NAME,
      alternateName: ["Lumyn Studio", "Lumyn Product Studio", "Lumyn Academy"],
      slogan: SITE_TAGLINE,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/android-chrome-512x512.png"),
        width: 512,
        height: 512,
      },
      description: SITE_DESCRIPTION,
      foundingDate: "2026",
      sameAs: SOCIAL_PROFILES,
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales and customer support",
        url: absoluteUrl("/contact"),
        availableLanguage: "English",
      },
      knowsAbout: [
        "Product strategy",
        "Product design",
        "Software engineering",
        "Web application development",
        "Applied AI",
        "AI education",
        "Learning products",
        "Digital reflection products",
      ],
      brand: [
        {
          "@type": "Brand",
          name: "Lumyn Academy",
          url: absoluteUrl("/academy"),
        },
        {
          "@type": "Brand",
          name: "MindFuel",
          url: absoluteUrl("/mindfuel"),
        },
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-strategy`,
            name: "Product Strategy Consulting",
            serviceType: "Product strategy consulting",
            description:
              "Clarifying the product, the system, and the path to market before expensive code gets written.",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Worldwide",
            url: absoluteUrl("/#capabilities"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-design`,
            name: "Product Design",
            serviceType: "Digital product design",
            description:
              "Design systems and interfaces that feel coherent at every size, built on foundations a product can grow on.",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Worldwide",
            url: absoluteUrl("/#capabilities"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-engineering`,
            name: "Custom Software Development",
            serviceType: "Custom software engineering",
            description:
              "Fast, durable web applications and MVPs built with modern technology and careful technical judgment.",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Worldwide",
            url: absoluteUrl("/#capabilities"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-ai`,
            name: "Applied AI Integration",
            serviceType: "Applied AI product development",
            description:
              "Useful AI woven into real product workflows, integrated with intent rather than added as a decoration.",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: "Worldwide",
            url: absoluteUrl("/#capabilities"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "SoftwareApplication",
            name: "Lumyn Academy",
            applicationCategory: "EducationalApplication",
            url: absoluteUrl("/academy"),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "SoftwareApplication",
            name: "MindFuel",
            applicationCategory: "LifestyleApplication",
            url: absoluteUrl("/mindfuel"),
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ["Lumyn Product Studio", "Lumyn Academy", "MindFuel"],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/journal?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="Lumyn AI-readable site summary"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
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
