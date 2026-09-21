import mongoose, { Document, Model, Schema } from "mongoose";
import type { ProductSlug } from "@/lib/store/products";

export interface IEntitlement {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  email: string;
  productSlug: ProductSlug;
  downloadToken: string;
  tokenExpiresAt: Date;
  downloadCount: number;
  lastDownloadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEntitlementDocument extends IEntitlement, Document {}

const EntitlementSchema = new Schema<IEntitlementDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, required: true, ref: "Order" },
    email: { type: String, required: true, lowercase: true, trim: true },
    productSlug: { type: String, required: true },
    downloadToken: { type: String, required: true, unique: true },
    tokenExpiresAt: { type: Date, required: true },
    downloadCount: { type: Number, default: 0 },
    lastDownloadedAt: Date,
  },
  { timestamps: true, versionKey: false },
);

EntitlementSchema.index({ email: 1 });
// downloadToken already indexed via unique: true
// One entitlement per (order, product) keeps fulfilment idempotent even if
// the same paid order is activated more than once (callback + webhook race).
EntitlementSchema.index({ orderId: 1, productSlug: 1 }, { unique: true });

const Entitlement: Model<IEntitlementDocument> =
  mongoose.models.Entitlement ||
  mongoose.model<IEntitlementDocument>("Entitlement", EntitlementSchema);

export default Entitlement;
