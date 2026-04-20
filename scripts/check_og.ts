import mongoose from 'mongoose';
import Post from '../models/Post.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const post = await Post.findOne({ slug: "why-your-business-software-is-quietly-destroying-your-teams-productivity" }).lean();
  console.log("coverImage: ", post?.coverImage);
  process.exit(0);
}
check();
