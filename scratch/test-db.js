const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function test() {
  console.log('Testing connection to:', process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Successfully connected!');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
