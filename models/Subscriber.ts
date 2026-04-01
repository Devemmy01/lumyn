import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscriberDocument extends Document {
  email: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// email already indexed via unique: true

const Subscriber: Model<ISubscriberDocument> =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriberDocument>("Subscriber", SubscriberSchema);

export default Subscriber;
