/**
 * Uploads a guide PDF into GridFS for a product slug.
 *
 *   npm run store:upload -- --slug getting-paid --file ~/Desktop/getting-paid.pdf
 *
 * Requires MONGODB_URI to be exported in the shell first (same as
 * `npm run seed`). Re-running for the same slug replaces the existing file.
 */
import { readFileSync } from "fs";
import mongoose from "mongoose";
import { uploadGuideFile, guideFilename } from "../lib/store/files";
import { isProductSlug, SINGLE_PRODUCT_SLUGS } from "../lib/store/products";

const MONGODB_URI = process.env.MONGODB_URI;

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  return { slug: get("--slug"), file: get("--file") };
}

async function main() {
  if (!MONGODB_URI) {
    console.error("Set MONGODB_URI before running this script.");
    process.exit(1);
  }

  const { slug, file } = parseArgs();
  if (!slug || !file) {
    console.error("Usage: npm run store:upload -- --slug <product-slug> --file <path-to-pdf>");
    console.error(`Known single-guide slugs: ${SINGLE_PRODUCT_SLUGS.join(", ")}`);
    process.exit(1);
  }
  if (!isProductSlug(slug) || slug === "bundle-all") {
    console.error(`"${slug}" isn't a single-guide product slug. Known slugs: ${SINGLE_PRODUCT_SLUGS.join(", ")}`);
    process.exit(1);
  }

  const buffer = readFileSync(file);
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI);

  console.log(`Uploading ${file} (${(buffer.length / 1024).toFixed(0)} KB) as ${guideFilename(slug)}...`);
  await uploadGuideFile(guideFilename(slug), buffer, { uploadedAt: new Date().toISOString() });

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
