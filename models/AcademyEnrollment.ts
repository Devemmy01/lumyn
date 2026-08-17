import mongoose, { Document, Model, Schema } from "mongoose";
import type {
  AssignmentSubmission,
  LearningActivity,
  LearningCursor,
  QuizAttempt,
  SubmissionEvaluation,
} from "@/lib/academy";

export type AcademyCertificateUnlockMethod =
  | "subscription"
  | "payment"
  | "diamonds";

export interface IAcademyEnrollmentDocument extends Document {
  studentUid: string;
  studentEmail: string;
  catalogCourseId: mongoose.Types.ObjectId;
  catalogCourseSlug: string;
  contentVersion: number;
  status: "active" | "completed" | "archived";
  progressPercent: number;
  lessonCompletions: Array<{
    moduleIndex: number;
    lessonIndex: number;
    completedAt: string;
  }>;
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
  finalProjectSubmission?: {
    content: string;
    status: "submitted" | "reviewed" | "needs_revision";
    submittedAt: string;
    evaluation?: SubmissionEvaluation;
  };
  activityLog: LearningActivity[];
  learningCursor?: LearningCursor;
  certificate?: {
    certificateId: string;
    issuedAt: string;
    certificateName?: string;
    unlockMethod: AcademyCertificateUnlockMethod;
    unlockedAt: string;
  };
  tutorMessages: Array<{
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const LessonCompletionSchema = new Schema(
  { moduleIndex: Number, lessonIndex: Number, completedAt: String },
  { _id: false },
);
const QuizAttemptSchema = new Schema(
  { moduleIndex: Number, answers: [Number], score: Number, passed: Boolean, completedAt: String },
  { _id: false },
);
const AssignmentSubmissionSchema = new Schema(
  { moduleIndex: Number, content: String, status: String, submittedAt: String, evaluation: Schema.Types.Mixed },
  { _id: false },
);
const ActivitySchema = new Schema(
  { action: String, createdAt: String },
  { _id: false },
);
const TutorMessageSchema = new Schema(
  { role: String, content: String, createdAt: String },
  { _id: false },
);

const AcademyEnrollmentSchema = new Schema<IAcademyEnrollmentDocument>(
  {
    studentUid: {
      type: String,
      required: true,
      index: true,
    },
    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    catalogCourseId: {
      type: Schema.Types.ObjectId,
      ref: "AcademyCatalogCourse",
      required: true,
      index: true,
    },
    catalogCourseSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contentVersion: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lessonCompletions: {
      type: [LessonCompletionSchema],
      default: [],
    },
    quizAttempts: {
      type: [QuizAttemptSchema],
      default: [],
    },
    assignmentSubmissions: {
      type: [AssignmentSubmissionSchema],
      default: [],
    },
    finalProjectSubmission: Schema.Types.Mixed,
    activityLog: {
      type: [ActivitySchema],
      default: [],
    },
    learningCursor: Schema.Types.Mixed,
    certificate: Schema.Types.Mixed,
    tutorMessages: {
      type: [TutorMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

AcademyEnrollmentSchema.index({ studentUid: 1, createdAt: -1 });
AcademyEnrollmentSchema.index(
  { studentUid: 1, catalogCourseId: 1 },
  { unique: true },
);

const AcademyEnrollment: Model<IAcademyEnrollmentDocument> =
  mongoose.models.AcademyEnrollment ||
  mongoose.model<IAcademyEnrollmentDocument>(
    "AcademyEnrollment",
    AcademyEnrollmentSchema,
  );

export default AcademyEnrollment;
