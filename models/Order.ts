import mongoose, { Document, Model, Schema } from "mongoose";
import type { ProductSlug } from "@/lib/store/products";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  reference: string;
  email: string;
  productSlug: ProductSlug;
  amountKobo: number;
  currency: string;
  status: OrderStatus;
  paystackReference?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    reference: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    productSlug: { type: String, required: true },
    amountKobo: { type: Number, required: true },
    currency: { type: String, required: true, default: "NGN", uppercase: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paystackReference: String,
    paidAt: Date,
  },
  { timestamps: true, versionKey: false },
);

OrderSchema.index({ email: 1 });
// reference already indexed via unique: true

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
