import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
  readingTime?: number;
  upvotes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISerializedPost extends Omit<IPost, "_id" | "createdAt" | "updatedAt"> {
  _id: string;
  createdAt: string | number;
  updatedAt: string | number;
}

export interface IPostDocument extends IPost, Document {}

const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// slug already indexed via unique: true
PostSchema.index({ published: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });

const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", PostSchema);

export default Post;
