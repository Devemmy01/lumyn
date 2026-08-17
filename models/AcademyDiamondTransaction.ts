import mongoose, { Document, Model, Schema } from "mongoose";

export type AcademyDiamondTransactionType =
  | "referral_earn"
  | "certificate_unlock_spend"
  | "certificate_unlock_refund"
  | "admin_grant"
  | "admin_adjustment";

export interface IAcademyDiamondTransactionDocument extends Document {
  studentUid: string;
  studentEmail: string;
  type: AcademyDiamondTransactionType;
  diamonds: number;
  balanceAfter: number;
  reference?: string;
  note?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyDiamondTransactionSchema = new Schema<IAcademyDiamondTransactionDocument>(
  {
    studentUid: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true, index: true },
    type: {
      type: String,
      required: true,
      enum: [
        "referral_earn",
        "certificate_unlock_spend",
        "certificate_unlock_refund",
        "admin_grant",
        "admin_adjustment",
      ],
      index: true,
    },
    diamonds: { type: Number, required: true },
    balanceAfter: { type: Number, required: true, min: 0 },
    reference: { type: String, index: true },
    note: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

AcademyDiamondTransactionSchema.index({ studentUid: 1, createdAt: -1 });

const AcademyDiamondTransaction: Model<IAcademyDiamondTransactionDocument> =
  mongoose.models.AcademyDiamondTransaction ||
  mongoose.model<IAcademyDiamondTransactionDocument>(
    "AcademyDiamondTransaction",
    AcademyDiamondTransactionSchema,
  );

export default AcademyDiamondTransaction;
