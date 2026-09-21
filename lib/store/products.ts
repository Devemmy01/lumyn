/**
 * The one place product identity and price live. Adding a fourth guide is an
 * entry here plus a content file and a GridFS upload — never a code change
 * anywhere else. All money is stored and passed as integer kobo; never do
 * float arithmetic on these values.
 */
export type ProductSlug =
  | "website-costs"
  | "found-on-google"
  | "getting-paid"
  | "bundle-all";

export interface Product {
  slug: ProductSlug;
  title: string;
  priceKobo: number;
  currency: "NGN";
  /** True for products that unlock more than one download on payment. */
  isBundle: boolean;
  /** For a bundle, the individual product slugs it resolves to. */
  includes?: Exclude<ProductSlug, "bundle-all">[];
}

export const PRODUCTS: Record<ProductSlug, Product> = {
  "website-costs": {
    slug: "website-costs",
    title: "What a Website Actually Costs in Nigeria",
    priceKobo: 1_500_000,
    currency: "NGN",
    isBundle: false,
  },
  "found-on-google": {
    slug: "found-on-google",
    title: "Found on Google in Nigeria",
    priceKobo: 1_500_000,
    currency: "NGN",
    isBundle: false,
  },
  "getting-paid": {
    slug: "getting-paid",
    title: "Getting Paid in Nigeria",
    priceKobo: 2_000_000,
    currency: "NGN",
    isBundle: false,
  },
  "bundle-all": {
    slug: "bundle-all",
    title: "All Three Field Guides",
    priceKobo: 4_000_000,
    currency: "NGN",
    isBundle: true,
    includes: ["website-costs", "found-on-google", "getting-paid"],
  },
};

export const PRODUCT_SLUGS = Object.keys(PRODUCTS) as ProductSlug[];
export const SINGLE_PRODUCT_SLUGS = PRODUCT_SLUGS.filter(
  (slug) => !PRODUCTS[slug].isBundle,
);

export function isProductSlug(value: string): value is ProductSlug {
  return value in PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  return isProductSlug(slug) ? PRODUCTS[slug] : undefined;
}

/** A bundle resolves to the individual product slugs it entitles the buyer
 * to; a single product resolves to itself. Every entitlement/fulfilment
 * codepath should go through this so bundle-vs-single is never special-cased
 * twice. */
export function resolveEntitlementSlugs(
  slug: ProductSlug,
): Exclude<ProductSlug, "bundle-all">[] {
  const product = PRODUCTS[slug];
  if (product.isBundle && product.includes) return product.includes;
  return [slug as Exclude<ProductSlug, "bundle-all">];
}
