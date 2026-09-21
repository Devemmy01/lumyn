/**
 * Requires a real MongoDB connection: export MONGODB_URI before running
 * `npm test`. Uses clearly-fake product slugs ("test-product-a/b") so it
 * never touches real uploaded guide files — uploadGuideFile() replaces any
 * existing file for a given filename, which would be destructive against a
 * real product slug.
 */
import test, { after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { PDFDocument } from "pdf-lib";
import connectDB from "@/lib/mongodb";
import Entitlement from "@/models/Entitlement";
import { uploadGuideFile, guideFilename } from "@/lib/store/files";
import { generateDownloadToken } from "@/lib/store/download-tokens";
import { GET } from "@/app/api/store/download/[token]/route";

const TEST_EMAIL = "test-download@lumyn-test.invalid";
const PRODUCT_A = "test-product-a";
const PRODUCT_B = "test-product-b";
const cleanupTokens: string[] = [];

async function makeTestPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

async function makeEntitlement(overrides: {
  productSlug: string;
  tokenExpiresAt?: Date;
  downloadCount?: number;
}) {
  await connectDB();
  const token = generateDownloadToken();
  cleanupTokens.push(token);
  await Entitlement.create({
    orderId: new mongoose.Types.ObjectId(),
    email: TEST_EMAIL,
    productSlug: overrides.productSlug,
    downloadToken: token,
    tokenExpiresAt: overrides.tokenExpiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    downloadCount: overrides.downloadCount ?? 0,
  });
  return token;
}

function callDownloadRoute(token: string) {
  const request = new NextRequest(`http://localhost/api/store/download/${token}`);
  return GET(request, { params: Promise.resolve({ token }) });
}

test("download: valid token streams the file for its own product", async () => {
  await connectDB();
  await uploadGuideFile(guideFilename(PRODUCT_A), await makeTestPdf());
  await uploadGuideFile(guideFilename(PRODUCT_B), await makeTestPdf());

  const tokenA = await makeEntitlement({ productSlug: PRODUCT_A });
  const response = await callDownloadRoute(tokenA);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-disposition") ?? "", new RegExp(PRODUCT_A));
  assert.doesNotMatch(response.headers.get("content-disposition") ?? "", new RegExp(PRODUCT_B));

  const entitlement = await Entitlement.findOne({ downloadToken: tokenA });
  assert.equal(entitlement?.downloadCount, 1);
});

test("download: a token only ever serves its own bound product, never another", async () => {
  const tokenB = await makeEntitlement({ productSlug: PRODUCT_B });
  const response = await callDownloadRoute(tokenB);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-disposition") ?? "", new RegExp(PRODUCT_B));
  assert.doesNotMatch(response.headers.get("content-disposition") ?? "", new RegExp(PRODUCT_A));
});

test("download: expired token is rejected with 410", async () => {
  const token = await makeEntitlement({
    productSlug: PRODUCT_A,
    tokenExpiresAt: new Date(Date.now() - 1000),
  });
  const response = await callDownloadRoute(token);
  assert.equal(response.status, 410);
});

test("download: token past its download cap is rejected with 429", async () => {
  const token = await makeEntitlement({ productSlug: PRODUCT_A, downloadCount: 5 });
  const response = await callDownloadRoute(token);
  assert.equal(response.status, 429);
});

test("download: unknown token is rejected with 404", async () => {
  const response = await callDownloadRoute("this-token-does-not-exist-at-all");
  assert.equal(response.status, 404);
});

after(async () => {
  await Entitlement.deleteMany({ downloadToken: { $in: cleanupTokens } });
  const db = mongoose.connection.db;
  if (db) {
    const filenames = [guideFilename(PRODUCT_A), guideFilename(PRODUCT_B)];
    const fileDocs = await db.collection("store_guides.files").find({ filename: { $in: filenames } }).toArray();
    const fileIds = fileDocs.map((f) => f._id);
    if (fileIds.length) {
      await db.collection("store_guides.chunks").deleteMany({ files_id: { $in: fileIds } });
    }
    await db.collection("store_guides.files").deleteMany({ filename: { $in: filenames } });
  }
  await mongoose.disconnect();
});
