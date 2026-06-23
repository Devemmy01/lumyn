import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"
).replace(/\/+$/, "");

export const SITE_NAME = "Lumyn";
export const DEFAULT_OG_IMAGE = "/og-image.png";
export const SITE_DESCRIPTION =
  "Lumyn is an independent product and software development studio building thoughtful digital products, custom web applications, and practical learning experiences.";

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

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
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
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  tags: string[];
  image?: string;
}) {
  const articleUrl = absoluteUrl(`/journal/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
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
    inLanguage: "en",
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
