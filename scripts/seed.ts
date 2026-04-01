import mongoose from "mongoose";
import { samplePosts } from "../lib/data";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lumyn";

// Redefine models inline to avoid Next.js import issues in script context
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

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✓ Connected to MongoDB");

  console.log("🗑  Clearing existing posts...");
  await Post.deleteMany({});

  console.log("📝 Seeding sample blog posts...");
  for (const post of samplePosts) {
    await Post.create({ ...post, published: true });
    console.log(`  ✓ Created: "${post.title}"`);
  }

  console.log("\n✅ Database seeded successfully!");
  console.log(`   ${samplePosts.length} posts created\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
