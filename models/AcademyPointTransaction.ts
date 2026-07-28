import mongoose, { Document, Model, Schema } from "mongoose";

export type AcademyPointTransactionType =
  | "starter_grant"
  | "purchase"
  | "generation_debit"
  | "admin_grant"
  | "referral_credit"
  | "refund";

export interface IAcademyPointTransactionDocument extends Document {
  studentUid: string;
  studentEmail: string;
  type: AcademyPointTransactionType;
  points: number;
  balanceAfter: number;
  reference?: string;
  note?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyPointTransactionSchema = new Schema<IAcademyPointTransactionDocument>(
  {
    studentUid: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["starter_grant", "purchase", "generation_debit", "admin_grant", "referral_credit", "refund"],
      index: true,
    },
    points: { type: Number, required: true },
    balanceAfter: { type: Number, required: true, min: 0 },
    reference: { type: String, index: true },
    note: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

AcademyPointTransactionSchema.index({ studentUid: 1, createdAt: -1 });

const AcademyPointTransaction: Model<IAcademyPointTransactionDocument> =
  mongoose.models.AcademyPointTransaction ||
  mongoose.model<IAcademyPointTransactionDocument>("AcademyPointTransaction", AcademyPointTransactionSchema);

export default AcademyPointTransaction;
