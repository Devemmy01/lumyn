import mongoose, { Document, Model, Schema } from "mongoose";
import type { AcademyPlanId, AcademyRole, SubscriptionStatus } from "@/lib/academy";

export interface IAcademyStudentDocument extends Document {
  firebaseUid: string;
  name?: string;
  email: string;
  role: AcademyRole;
  subscription: {
    planId?: AcademyPlanId;
    status: SubscriptionStatus;
    provider?: "manual" | "paystack" | "flutterwave";
    currentPeriodEnd?: Date;
    customerCode?: string;
    subscriptionCode?: string;
    emailToken?: string;
    cancelAtPeriodEnd?: boolean;
  };
  mentorshipStatus: "none" | "applied" | "approved" | "active" | "completed";
  courseGenerationExempt?: boolean;
  freeCourseUsedAt?: Date;
  freeCourseId?: string;
  freeCourseClaimId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AcademyStudentSchema = new Schema<IAcademyStudentDocument>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    subscription: {
      planId: {
        type: String,
        enum: ["ai-learning-path", "guided-mentorship"],
      },
      status: {
        type: String,
        enum: ["inactive", "pending", "active", "past_due", "cancelled"],
        default: "inactive",
      },
      provider: {
        type: String,
        enum: ["manual", "paystack", "flutterwave"],
      },
      currentPeriodEnd: Date,
      customerCode: String,
      subscriptionCode: String,
      emailToken: String,
      cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
      },
    },
    mentorshipStatus: {
      type: String,
      enum: ["none", "applied", "approved", "active", "completed"],
      default: "none",
    },
    courseGenerationExempt: {
      type: Boolean,
      index: true,
    },
    freeCourseUsedAt: Date,
    freeCourseId: String,
    freeCourseClaimId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AcademyStudent: Model<IAcademyStudentDocument> =
  mongoose.models.AcademyStudent ||
  mongoose.model<IAcademyStudentDocument>("AcademyStudent", AcademyStudentSchema);

export default AcademyStudent;
