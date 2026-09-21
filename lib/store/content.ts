import websiteCosts from "@/content/store/website-costs.json";
import foundOnGoogle from "@/content/store/found-on-google.json";
import gettingPaid from "@/content/store/getting-paid.json";
import bundleAll from "@/content/store/bundle-all.json";
import type { ProductSlug } from "@/lib/store/products";

export interface ProductContent {
  slug: ProductSlug;
  tagline: string;
  coverImage: string;
  sampleFile: string;
  whatsInside: string[];
  whoFor: string;
  faq: Array<{ q: string; a: string }>;
}

const CONTENT: Record<ProductSlug, ProductContent> = {
  "website-costs": websiteCosts as ProductContent,
  "found-on-google": foundOnGoogle as ProductContent,
  "getting-paid": gettingPaid as ProductContent,
  "bundle-all": bundleAll as ProductContent,
};

export function getProductContent(slug: ProductSlug): ProductContent {
  return CONTENT[slug];
}

export function getAllProductContent(): ProductContent[] {
  return Object.values(CONTENT);
}
