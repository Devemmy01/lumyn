import mongoose from 'mongoose';
import Post from '../models/Post.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function list() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const posts = await Post.find({}).lean();
  console.log(posts.map(p => ({ slug: p.slug, coverImage: p.coverImage })));
  process.exit(0);
}
list();
