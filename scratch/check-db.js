const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const posts = await mongoose.model('Post', new mongoose.Schema({
    title: String,
    coverImage: String
  })).find({});
  
  posts.forEach(p => {
    console.log(`Title: ${p.title}`);
    console.log(`Cover: ${p.coverImage ? p.coverImage.substring(0, 50) + '...' : 'NONE'}`);
    console.log('---');
  });
  process.exit(0);
}

check();
