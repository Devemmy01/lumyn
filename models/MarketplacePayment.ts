import mongoose, { Document, Model, Schema } from "mongoose";

export type MarketplacePaymentKind = "course_purchase" | "listing_fee";

export interface IMarketplacePaymentDocument extends Document {
  reference: string;
  studentUid: string;
  studentEmail: string;
  kind: MarketplacePaymentKind;
  /** Populated only for kind: "course_purchase". */
  courseId?: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  provider: "paystack";
  providerTransactionId?: string;
  splitSnapshot?: {
    subaccountCode?: string;
    splitCode?: string;
    platformSharePercent?: number;
  };
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplacePaymentSchema = new Schema<IMarketplacePaymentDocument>(
  {
    reference: { type: String, required: true, unique: true, index: true },
    studentUid: { type: String, required: true, index: true },
    studentEmail: { type: String, required: true, lowercase: true },
    kind: { type: String, enum: ["course_purchase", "listing_fee"], required: true },
    courseId: { type: String, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, uppercase: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    provider: { type: String, enum: ["paystack"], default: "paystack" },
    providerTransactionId: String,
    splitSnapshot: {
      subaccountCode: String,
      splitCode: String,
      platformSharePercent: Number,
    },
    paidAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const MarketplacePayment: Model<IMarketplacePaymentDocument> =
  mongoose.models.MarketplacePayment ||
  mongoose.model<IMarketplacePaymentDocument>("MarketplacePayment", MarketplacePaymentSchema);

export default MarketplacePayment;
