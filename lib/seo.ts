import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedAt?: string;
  tags?: string[];
}

export function buildMetadata({
  title,
  description,
  keywords = [],
  path = "",
  ogImage = "/og-image.png",
  type = "website",
  publishedAt,
  tags = [],
}: SEOProps): Metadata {
  const url = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  
  // Detect base64/data URLs which are invalid for OG images on most platforms
  const isDataUrl = ogImage.startsWith("data:");
  const finalOgImage = isDataUrl ? "/og-image.png" : ogImage;
  const fullOgImage = finalOgImage.startsWith("http") ? finalOgImage : `${siteUrl}${finalOgImage.startsWith("/") ? "" : "/"}${finalOgImage}`;



  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      ...keywords,
      "lumyn",
      "product studio",
      "software development services",
      "custom software development",
      "web application development",
      "hire software development agency",
      "outsourced development",
      "startup MVP development",
      "build MVP",
      "PWA development",
      "problem solving",
      "impactful design",
      "efficiency",
    ],
    openGraph: {
      title: `${title} — Lumyn`,
      description,
      url,
      type,
      ...(type === "article" && {
        publishedTime: publishedAt,
        tags,
      }),
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Lumyn`,
      description,
      images: [fullOgImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: "Lumyn",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Lumyn",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: publishedAt,
    keywords: tags.join(", "),
    url: `${siteUrl}/journal/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/journal/${slug}`,
    },
  };
}
