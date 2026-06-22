import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInboundEmailDocument extends Document {
  emailId: string;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  messageId?: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
  attachments: Array<{
    id: string;
    filename: string;
    contentType: string;
    contentDisposition?: string;
    contentId?: string;
  }>;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema(
  {
    id: String,
    filename: String,
    contentType: String,
    contentDisposition: String,
    contentId: String,
  },
  { _id: false }
);

const InboundEmailSchema = new Schema<IInboundEmailDocument>(
  {
    emailId: { type: String, required: true, unique: true, index: true },
    from: { type: String, required: true, trim: true },
    to: { type: [String], default: [] },
    cc: { type: [String], default: [] },
    bcc: { type: [String], default: [] },
    subject: { type: String, default: "(no subject)", trim: true },
    messageId: String,
    text: String,
    html: String,
    headers: Schema.Types.Mixed,
    attachments: { type: [AttachmentSchema], default: [] },
    receivedAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

const InboundEmail: Model<IInboundEmailDocument> =
  mongoose.models.InboundEmail ||
  mongoose.model<IInboundEmailDocument>("InboundEmail", InboundEmailSchema);

export default InboundEmail;
