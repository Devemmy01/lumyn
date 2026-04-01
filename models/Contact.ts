import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContact {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface IContactDocument extends IContact, Document {}

const ContactSchema = new Schema<IContactDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

ContactSchema.index({ createdAt: -1 });

const Contact: Model<IContactDocument> =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>("Contact", ContactSchema);

export default Contact;
