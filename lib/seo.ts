import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"
).replace(/\/+$/, "");

export const SITE_NAME = "Lumyn";
export const SITE_LEGAL_NAME = "Lumyn Product Studio";
export const DEFAULT_OG_IMAGE = "/og-image.png";
export const SITE_DESCRIPTION =
  "Lumyn is an independent product studio building thoughtful digital products, applied AI experiences, modern web software, Lumyn Academy, and MindFuel.";
export const SITE_TAGLINE =
  "Independent product studio for thoughtful software, applied AI, learning, and reflection products.";
export const SITE_KEYWORDS = [
  "Lumyn",
  "Lumyn product studio",
  "independent product studio",
  "digital product studio",
  "software product studio",
  "applied AI product studio",
  "Lumyn Academy",
  "MindFuel",
  "AI software engineering courses",
  "personalized coding course",
  "reflection app",
];
export const SOCIAL_PROFILES = ["https://x.com/lumynstudio"];

export function absoluteUrl(path = ""): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  keywords = [],
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  imageAlt,
  type = "website",
  publishedAt,
  modifiedAt,
  tags = [],
  noIndex = false,
}: SEOProps): Metadata {
  const url = absoluteUrl(path);
  const usableImage = ogImage.startsWith("data:") ? DEFAULT_OG_IMAGE : ogImage;
  const fullOgImage = absoluteUrl(usableImage);
  const socialTitle = `${title} — ${SITE_NAME}`;
  const combinedKeywords = Array.from(new Set([...keywords, ...SITE_KEYWORDS]));

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: combinedKeywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(type === "article" && {
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        authors: [SITE_URL],
        tags,
      }),
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [fullOgImage],
      creator: "@lumynstudio",
      site: "@lumynstudio",
    },
  };
}

export function buildWebPageJsonLd({
  path,
  name,
  description,
  pageType = "WebPage",
  dateModified,
  keywords = [],
}: {
  path: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "Blog";
  dateModified?: string;
  keywords?: string[];
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${url}#webpage`,
    name,
    headline: name,
    description,
    url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    ...(dateModified ? { dateModified } : {}),
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
  };
}

export function buildProductJsonLd({
  name,
  path,
  description,
  image = DEFAULT_OG_IMAGE,
  applicationCategory,
  operatingSystem = "Web",
  sameAs,
  offers,
}: {
  name: string;
  path: string;
  description: string;
  image?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  sameAs?: string;
  offers?: Array<{
    name: string;
    price?: string;
    priceCurrency?: string;
    url?: string;
  }>;
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#softwareapplication`,
    name,
    applicationCategory,
    operatingSystem,
    description,
    url,
    image: absoluteUrl(image),
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(sameAs ? { sameAs } : {}),
    ...(offers?.length
      ? {
          offers: offers.map((offer) => ({
            "@type": "Offer",
            name: offer.name,
            price: offer.price ?? "0",
            priceCurrency: offer.priceCurrency ?? "USD",
            availability: "https://schema.org/InStock",
            url: offer.url ? absoluteUrl(offer.url) : url,
          })),
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  tags,
  image,
  wordCount,
  readingTime,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  tags: string[];
  image?: string;
  wordCount?: number;
  readingTime?: number;
}) {
  const articleUrl = absoluteUrl(`/journal/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: title,
    description,
    image: [absoluteUrl(image?.startsWith("data:") ? DEFAULT_OG_IMAGE : image ?? DEFAULT_OG_IMAGE)],
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/android-chrome-512x512.png"),
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt ?? publishedAt,
    keywords: tags.join(", "),
    articleSection: tags[0] ?? "Journal",
    isPartOf: { "@id": `${SITE_URL}/journal#webpage` },
    inLanguage: "en",
    url: articleUrl,
    ...(wordCount ? { wordCount } : {}),
    ...(readingTime
      ? { timeRequired: `PT${Math.max(1, Math.round(readingTime))}M` }
      : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
