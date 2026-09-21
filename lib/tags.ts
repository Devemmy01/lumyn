/** Lowercase, hyphenate, and strip punctuation so every spelling of a tag
 * ("Product Design", "product+design", "product-design") maps to one URL. */
export function slugifyTag(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
