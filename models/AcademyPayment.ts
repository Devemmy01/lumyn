import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAcademyPaymentDocument extends Document {
  reference: string;
  studentUid: string;
  studentEmail: string;
  kind: "point_purchase";
  points: number;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  provider: "flutterwave";
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
    kind: { type: String, enum: ["point_purchase"], default: "point_purchase" },
    points: { type: Number, required: true, min: 1 },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, uppercase: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    provider: { type: String, enum: ["flutterwave"], default: "flutterwave" },
    providerTransactionId: String,
    paidAt: Date,
  },
  { timestamps: true, versionKey: false }
);

const AcademyPayment: Model<IAcademyPaymentDocument> =
  mongoose.models.AcademyPayment ||
  mongoose.model<IAcademyPaymentDocument>("AcademyPayment", AcademyPaymentSchema);

export default AcademyPayment;
