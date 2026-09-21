import mongoose, { Document, Model, Schema } from "mongoose";
import type { AcademyLevel } from "@/lib/academy";

export type CreatorCourseStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "archived";

export type CreatorLessonVideoStatus =
  | "not_uploaded"
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export interface ICreatorLesson {
  title: string;
  description?: string;
  videoGuid?: string;
  videoStatus: CreatorLessonVideoStatus;
  durationSeconds?: number;
  previewEligible?: boolean;
}

export interface ICreatorModule {
  title: string;
  description?: string;
  lessons: ICreatorLesson[];
}

export interface ICreatorCourseDocument extends Document {
  creatorUid: string;
  creatorEmail: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  tags?: string[];
  level: AcademyLevel;
  coverImage?: string;
  priceCents: number;
  currency: string;
  status: CreatorCourseStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  publishedAt?: Date;
  rejectionReason?: string;
  purchaseCount: number;
  modules: ICreatorModule[];
  createdAt: Date;
  updatedAt: Date;
}

const CreatorLessonSchema = new Schema<ICreatorLesson>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    videoGuid: { type: String, trim: true },
    videoStatus: {
      type: String,
      enum: ["not_uploaded", "uploading", "processing", "ready", "failed"],
      default: "not_uploaded",
    },
    durationSeconds: { type: Number, min: 0 },
    previewEligible: { type: Boolean, default: false },
  },
  { _id: false },
);

const CreatorModuleSchema = new Schema<ICreatorModule>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    lessons: { type: [CreatorLessonSchema], default: [] },
  },
  { _id: false },
);

const CreatorCourseSchema = new Schema<ICreatorCourseDocument>(
  {
    creatorUid: { type: String, required: true, index: true },
    creatorEmail: { type: String, required: true, trim: true, lowercase: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, trim: true, maxlength: 220 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    category: { type: String, trim: true, maxlength: 80 },
    tags: { type: [String], default: [] },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    coverImage: { type: String },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: "USD" },
    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "rejected", "archived"],
      default: "draft",
      index: true,
    },
    submittedAt: Date,
    reviewedAt: Date,
    publishedAt: Date,
    rejectionReason: { type: String, trim: true, maxlength: 1000 },
    purchaseCount: { type: Number, default: 0, min: 0 },
    modules: { type: [CreatorModuleSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CreatorCourseSchema.index({ creatorUid: 1, createdAt: -1 });
CreatorCourseSchema.index({ status: 1, publishedAt: -1 });

const CreatorCourse: Model<ICreatorCourseDocument> =
  mongoose.models.CreatorCourse ||
  mongoose.model<ICreatorCourseDocument>("CreatorCourse", CreatorCourseSchema);

export default CreatorCourse;
