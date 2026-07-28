import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    "/api/",
    "/admin/",
    "/academy/dashboard/",
    "/academy/sign-in",
    "/academy/payment/",
  ];
  const aiAndSearchCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Googlebot",
    "Bingbot",
    "DuckDuckBot",
    "Applebot",
    "Bytespider",
    "CCBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      ...aiAndSearchCrawlers.map((userAgent) => ({
        userAgent,
        allow: ["/", "/llms.txt", "/ai.txt"],
        disallow: privatePaths,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
