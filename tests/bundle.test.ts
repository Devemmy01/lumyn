import test from "node:test";
import assert from "node:assert/strict";
import { resolveEntitlementSlugs, PRODUCTS, SINGLE_PRODUCT_SLUGS } from "@/lib/store/products";

test("bundle resolves to all three individual product slugs", () => {
  const resolved = resolveEntitlementSlugs("bundle-all");
  assert.equal(resolved.length, 3);
  assert.deepEqual(new Set(resolved), new Set(SINGLE_PRODUCT_SLUGS));
});

test("a single product resolves to itself", () => {
  assert.deepEqual(resolveEntitlementSlugs("getting-paid"), ["getting-paid"]);
});

test("bundle price is defined in kobo, no float math", () => {
  assert.equal(PRODUCTS["bundle-all"].priceKobo, 4_000_000);
  assert.equal(Number.isInteger(PRODUCTS["bundle-all"].priceKobo), true);
  for (const slug of SINGLE_PRODUCT_SLUGS) {
    assert.equal(Number.isInteger(PRODUCTS[slug].priceKobo), true);
  }
});
