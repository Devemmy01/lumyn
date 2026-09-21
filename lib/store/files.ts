import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

// Pulled from mongoose.mongo (Mongoose's own bundled mongodb driver) rather
// than importing the top-level "mongodb" package directly — the two are
// structurally similar but nominally different types, and mongoose.connection.db
// is only assignable to GridFSBucket's Db param when both come from the same
// driver instance.
const { GridFSBucket, ObjectId } = mongoose.mongo;
type ObjectId = InstanceType<typeof mongoose.mongo.ObjectId>;

const BUCKET_NAME = "store_guides";

/** Guide PDFs are never in /public and never at a guessable URL — they live
 * in MongoDB GridFS (the `mongodb` driver is already a dependency, so this
 * needs no new storage service or dependency) and only leave the server
 * through the token-gated download route. */
async function getBucket() {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection is not available.");
  return new GridFSBucket(db, { bucketName: BUCKET_NAME });
}

export async function uploadGuideFile(
  filename: string,
  buffer: Buffer,
  metadata: Record<string, unknown> = {},
): Promise<ObjectId> {
  const bucket = await getBucket();
  const existing = await bucket.find({ filename }).toArray();
  await Promise.all(existing.map((file) => bucket.delete(file._id)));

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { metadata });
    uploadStream.on("finish", () => resolve(uploadStream.id as ObjectId));
    uploadStream.on("error", reject);
    uploadStream.end(buffer);
  });
}

export async function findGuideFile(filename: string) {
  const bucket = await getBucket();
  const [file] = await bucket.find({ filename }).toArray();
  return file ?? null;
}

export async function openGuideDownloadStream(fileId: ObjectId) {
  const bucket = await getBucket();
  return bucket.openDownloadStream(fileId);
}

export function guideFilename(productSlug: string): string {
  return `${productSlug}.pdf`;
}
