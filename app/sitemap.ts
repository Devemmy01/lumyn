import type { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import { SITE_URL } from "@/lib/seo";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

const CONTENT_UPDATED_AT = new Date("2026-06-23T00:00:00.000Z");
const LEGAL_UPDATED_AT = new Date("2026-06-22T00:00:00.000Z");

const publicPages: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/products", changeFrequency: "monthly", priority: 0.85 },
  { path: "/mindfuel", changeFrequency: "monthly", priority: 0.85 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.9 },
  { path: "/journal", changeFrequency: "weekly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/philosophy", changeFrequency: "monthly", priority: 0.65 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.65 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_UPDATED_AT },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_UPDATED_AT },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3, lastModified: LEGAL_UPDATED_AT },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    ...publicPages.map((page) => ({
      url: `${SITE_URL}${page.path}`,
      lastModified: page.lastModified ?? CONTENT_UPDATED_AT,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  ];

  type SitemapPost = {
    slug: string;
    updatedAt?: Date;
    createdAt?: Date;
  };

  let posts: SitemapPost[] = [];

  try {
    await dbConnect();
    posts =
      ((await Post.find({ published: true })
        .select("slug updatedAt createdAt")
        .lean()) as SitemapPost[]) || [];
  } catch (error) {
    console.warn("Sitemap generated without journal posts.", error);
  }

  const articlePages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt || CONTENT_UPDATED_AT,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
