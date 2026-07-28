import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export class MongoConnectionUnavailableError extends Error {
  constructor(message = "The academy database is temporarily unavailable. Please try again in a moment.") {
    super(message);
    this.name = "MongoConnectionUnavailableError";
  }
}

export function isMongoConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.name === "MongooseServerSelectionError" ||
    /Could not connect to any servers in your MongoDB Atlas cluster/i.test(error.message) ||
    /IP that isn't whitelisted/i.test(error.message) ||
    /topology/i.test(error.message)
  );
}

async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    if (isMongoConnectionError(e)) {
      throw new MongoConnectionUnavailableError();
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB;
