import fs from "fs/promises";
import path from "path";
import readingTime from "reading-time";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lumyn";
const DRAFT_DIR = path.join(process.cwd(), "scratch/seo-drafts");

const PostSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    tags: [String],
    coverImage: String,
    published: { type: Boolean, default: false },
    readingTime: Number,
  },
  { timestamps: true }
);

const Post = (mongoose.models.Post as mongoose.Model<any>) || mongoose.model<any>("Post", PostSchema);

interface DraftFrontmatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  coverImage?: string;
}

interface DraftFile extends DraftFrontmatter {
  content?: string;
}

async function publishDrafts() {
  console.log("📚 Reading generated SEO drafts...");
  const entries = await fs.readdir(DRAFT_DIR, { withFileTypes: true });
  const draftFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
    .map((entry) => path.join(DRAFT_DIR, entry.name));

  if (draftFiles.length === 0) {
    console.log("No draft JSON files found.");
    return;
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✓ Connected to MongoDB");

  let created = 0;
  let updated = 0;

  for (const filePath of draftFiles) {
    const raw = await fs.readFile(filePath, "utf8");
    const draft = JSON.parse(raw) as DraftFile;
    const slug = draft.slug ?? path.basename(filePath, ".json");
    const title = draft.title ?? slug.replace(/-/g, " ");
    const excerpt = draft.excerpt ?? "";
    const tags = Array.isArray(draft.tags) ? draft.tags : [];
    const coverImage = draft.coverImage;
    const content = draft.content ?? "";
    const stats = readingTime(content);

    const existed = await Post.exists({ slug });

    await Post.findOneAndUpdate(
      { slug },
      {
        title,
        slug,
        excerpt,
        content,
        tags,
        coverImage,
        published: true,
        readingTime: Math.max(1, Math.round(stats.minutes)),
      },
      { upsert: true, new: true }
    );

    if (existed) {
      updated += 1;
    } else {
      created += 1;
    }

    console.log(`  ✓ Published: ${title}`);
  }

  console.log(`\n✅ Published ${created + updated} SEO drafts (${created} new, ${updated} updated).`);
  await mongoose.disconnect();
}

publishDrafts().catch((error) => {
  console.error("❌ Publishing failed:", error);
  process.exit(1);
});
