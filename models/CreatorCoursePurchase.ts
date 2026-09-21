import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICreatorCoursePurchaseDocument extends Document {
  studentUid: string;
  studentEmail: string;
  courseId: mongoose.Types.ObjectId;
  courseSlug: string;
  creatorUid: string;
  priceCentsPaid: number;
  currency: string;
  platformFeeCents: number;
  creatorEarningsCents: number;
  paymentReference: string;
  status: "active" | "revoked";
  lastWatched?: {
    moduleIndex: number;
    lessonIndex: number;
    positionSeconds: number;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CreatorCoursePurchaseSchema = new Schema<ICreatorCoursePurchaseDocument>(
  {
    studentUid: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, trim: true, lowercase: true },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "CreatorCourse",
      required: true,
      index: true,
    },
    courseSlug: { type: String, required: true, trim: true, lowercase: true },
    creatorUid: { type: String, required: true, index: true },
    priceCentsPaid: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
    platformFeeCents: { type: Number, required: true, min: 0 },
    creatorEarningsCents: { type: Number, required: true, min: 0 },
    paymentReference: { type: String, required: true, index: true },
    status: { type: String, enum: ["active", "revoked"], default: "active" },
    lastWatched: {
      moduleIndex: Number,
      lessonIndex: Number,
      positionSeconds: Number,
      updatedAt: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CreatorCoursePurchaseSchema.index({ studentUid: 1, courseId: 1 }, { unique: true });
CreatorCoursePurchaseSchema.index({ creatorUid: 1, createdAt: -1 });

const CreatorCoursePurchase: Model<ICreatorCoursePurchaseDocument> =
  mongoose.models.CreatorCoursePurchase ||
  mongoose.model<ICreatorCoursePurchaseDocument>(
    "CreatorCoursePurchase",
    CreatorCoursePurchaseSchema,
  );

export default CreatorCoursePurchase;
