import mongoose, { Document, Model, Schema } from "mongoose";
import type {
  AssignmentSubmission,
  GeneratedCourse,
  LearningActivity,
  QuizAttempt,
  SubmissionEvaluation,
} from "@/lib/academy";

export interface IAcademyCourseDocument extends Document {
  studentUid: string;
  studentEmail: string;
  prompt: string;
  level: string;
  goal: string;
  course: GeneratedCourse;
  status: "active" | "completed" | "archived";
  progressPercent: number;
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
  finalProjectSubmission?: {
    content: string;
    status: "submitted" | "reviewed" | "needs_revision";
    submittedAt: string;
    evaluation?: SubmissionEvaluation;
  };
  activityLog: LearningActivity[];
  certificate?: {
    certificateId: string;
    issuedAt: string;
  };
  tutorMessages: Array<{
    role: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema(
  { moduleIndex: Number, answers: [Number], score: Number, passed: Boolean, completedAt: String },
  { _id: false }
);
const AssignmentSubmissionSchema = new Schema(
  { moduleIndex: Number, content: String, status: String, submittedAt: String, evaluation: Schema.Types.Mixed },
  { _id: false }
);
const ActivitySchema = new Schema(
  { action: String, createdAt: String },
  { _id: false }
);
const TutorMessageSchema = new Schema(
  { role: String, content: String, createdAt: String },
  { _id: false }
);

const AcademyCourseSchema = new Schema<IAcademyCourseDocument>(
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
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.Mixed,
      required: true,
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
    certificate: Schema.Types.Mixed,
    tutorMessages: {
      type: [TutorMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AcademyCourseSchema.index({ studentUid: 1, createdAt: -1 });

const AcademyCourse: Model<IAcademyCourseDocument> =
  mongoose.models.AcademyCourse ||
  mongoose.model<IAcademyCourseDocument>("AcademyCourse", AcademyCourseSchema);

export default AcademyCourse;
