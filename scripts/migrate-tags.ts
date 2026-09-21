import mongoose from "mongoose";
import { slugifyTag } from "../lib/tags";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lumyn";

type PostDoc = {
  _id: mongoose.Types.ObjectId;
  title: string;
  tags?: string[];
};

async function migrate() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  const posts = mongoose.connection.collection<PostDoc>("posts");
  const cursor = posts.find({}, { projection: { title: 1, tags: 1 } });
  let changed = 0;
  let total = 0;

  for await (const post of cursor) {
    total++;
    const rawTags: string[] = post.tags ?? [];
    const slugified = Array.from(new Set(rawTags.map(slugifyTag).filter(Boolean)));
    const isDifferent =
      slugified.length !== rawTags.length || slugified.some((tag, i) => tag !== rawTags[i]);

    if (isDifferent) {
      console.log(`"${post.title}"`);
      console.log(`  before: ${JSON.stringify(rawTags)}`);
      console.log(`  after:  ${JSON.stringify(slugified)}`);
      await posts.updateOne({ _id: post._id }, { $set: { tags: slugified } });
      changed++;
    }
  }

  console.log(`\nDone. ${changed} of ${total} posts updated.`);
  await mongoose.disconnect();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
