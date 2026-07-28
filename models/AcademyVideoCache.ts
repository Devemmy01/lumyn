import mongoose, { Document, Model, Schema } from "mongoose";
import type { YouTubeLessonVideo } from "@/lib/academy";

export interface IAcademyVideoCacheDocument extends Document {
  query: string;
  normalizedQuery: string;
  selectedVideo?: YouTubeLessonVideo;
  candidates: YouTubeLessonVideo[];
  source: "youtube";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyVideoCacheSchema = new Schema<IAcademyVideoCacheDocument>(
  {
    query: { type: String, required: true, trim: true },
    normalizedQuery: { type: String, required: true, unique: true, index: true },
    selectedVideo: {
      videoId: String,
      title: String,
      channelTitle: String,
      thumbnailUrl: String,
      watchUrl: String,
      embedUrl: String,
      duration: String,
      durationLabel: String,
      publishedAt: String,
      viewCount: Number,
    },
    candidates: {
      type: [
        {
          videoId: String,
          title: String,
          channelTitle: String,
          thumbnailUrl: String,
          watchUrl: String,
          embedUrl: String,
          duration: String,
          durationLabel: String,
          publishedAt: String,
          viewCount: Number,
        },
      ],
      default: [],
    },
    source: { type: String, enum: ["youtube"], default: "youtube" },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

AcademyVideoCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AcademyVideoCache: Model<IAcademyVideoCacheDocument> =
  mongoose.models.AcademyVideoCache ||
  mongoose.model<IAcademyVideoCacheDocument>("AcademyVideoCache", AcademyVideoCacheSchema);

export default AcademyVideoCache;
