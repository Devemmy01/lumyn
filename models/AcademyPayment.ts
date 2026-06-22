import mongoose, { Document, Model, Schema } from "mongoose";
import type { AcademyPlanId } from "@/lib/academy";

export interface IAcademyPaymentDocument extends Document {
  reference: string;
  studentUid: string;
  studentEmail: string;
  planId: AcademyPlanId;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  provider: "paystack";
  providerTransactionId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyPaymentSchema = new Schema<IAcademyPaymentDocument>(
  {
    reference: { type: String, required: true, unique: true, index: true },
    studentUid: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true },
    planId: { type: String, required: true, enum: ["ai-learning-path", "guided-mentorship"] },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, uppercase: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    provider: { type: String, enum: ["paystack"], default: "paystack" },
    providerTransactionId: String,
    paidAt: Date,
  },
  { timestamps: true, versionKey: false }
);

const AcademyPayment: Model<IAcademyPaymentDocument> =
  mongoose.models.AcademyPayment ||
  mongoose.model<IAcademyPaymentDocument>("AcademyPayment", AcademyPaymentSchema);

export default AcademyPayment;
