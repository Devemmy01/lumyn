import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMentorshipApplicationDocument extends Document {
  name: string;
  email: string;
  level: string;
  goal: string;
  availability: string;
  message?: string;
  status: "received" | "reviewing" | "approved" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipApplicationSchema = new Schema<IMentorshipApplicationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    level: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    availability: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1200,
    },
    status: {
      type: String,
      enum: ["received", "reviewing", "approved", "declined"],
      default: "received",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MentorshipApplicationSchema.index({ createdAt: -1 });

const MentorshipApplication: Model<IMentorshipApplicationDocument> =
  mongoose.models.MentorshipApplication ||
  mongoose.model<IMentorshipApplicationDocument>(
    "MentorshipApplication",
    MentorshipApplicationSchema
  );

export default MentorshipApplication;
