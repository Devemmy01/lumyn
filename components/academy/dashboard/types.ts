import type {
  AssignmentSubmission,
  GeneratedCourse,
  LearningActivity,
  LearningCursor,
  QuizAttempt,
  SubmissionEvaluation,
  SubscriptionStatus,
} from "@/lib/academy";

export type TutorMessage = { role: "user" | "assistant"; content: string; createdAt: string };
export type ToastState = { type: "success" | "error" | "warning" | "info"; message: string };
export type QuizResultState = { score: number; passed: boolean; answers: number[] };

export type DashboardCourse = {
  id: string;
  course: GeneratedCourse;
  status: string;
  progressPercent: number;
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
  finalProjectSubmission?: {
    content: string;
    status: string;
    submittedAt: string;
    evaluation?: SubmissionEvaluation;
  };
  activityLog: LearningActivity[];
  learningCursor?: LearningCursor;
  certificate?: { certificateId: string; issuedAt: string; certificateName?: string };
  tutorMessages: TutorMessage[];
  createdAt: string;
};

export type DashboardPayload = {
  student: {
    name?: string;
    email: string;
    avatarUrl?: string;
    certificateName?: string;
    role: string;
    pointsBalance: number;
    referralCode?: string;
    referralsCount?: number;
    courseGenerationExempt?: boolean;
    subscription?: {
      planId?: string;
      status?: SubscriptionStatus;
      currentPeriodEnd?: string;
      cancelAtPeriodEnd?: boolean;
    };
    mentorshipStatus?: string;
    trial?: {
      available: boolean;
      usedAt?: string;
      courseId?: string;
    };
  };
  courses: DashboardCourse[];
  metrics: {
    quizAverage: number | null;
    pendingAssignments: number;
    activityDates: string[];
    certificateCount: number;
  };
};
