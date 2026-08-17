import mongoose, { Document, Model, Schema } from "mongoose";
import type {
  AcademyLanguageId,
  AcademyLevel,
  GeneratedCourse,
} from "@/lib/academy";

export type AcademyCatalogCourseStatus =
  | "coming_soon"
  | "draft"
  | "published"
  | "archived";

export interface IAcademyCatalogCourseDocument extends Document {
  slug: string;
  language: AcademyLanguageId;
  level: AcademyLevel;
  status: AcademyCatalogCourseStatus;
  content?: GeneratedCourse;
  contentVersion: number;
  generationModel?: string;
  generatedAt?: Date;
  order: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyCatalogCourseSchema = new Schema<IAcademyCatalogCourseDocument>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    status: {
      type: String,
      enum: ["coming_soon", "draft", "published", "archived"],
      default: "coming_soon",
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
    },
    contentVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    generationModel: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    generatedAt: Date,
    order: {
      type: Number,
      default: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

AcademyCatalogCourseSchema.index({ language: 1, level: 1 });

const AcademyCatalogCourse: Model<IAcademyCatalogCourseDocument> =
  mongoose.models.AcademyCatalogCourse ||
  mongoose.model<IAcademyCatalogCourseDocument>(
    "AcademyCatalogCourse",
    AcademyCatalogCourseSchema,
  );

export default AcademyCatalogCourse;
