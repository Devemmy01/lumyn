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

export type DashboardCertificate = {
  certificateId: string;
  issuedAt: string;
  certificateName?: string;
  unlockMethod?: "subscription" | "payment" | "diamonds";
  unlockedAt?: string;
};

/** Summary row from GET /api/academy/enrollments — one per enrollment, no course content. */
export type DashboardEnrollment = {
  id: string;
  catalogCourseId?: string;
  slug: string;
  language?: string;
  level?: string;
  courseTitle?: string;
  status: string;
  progressPercent: number;
  certificate?: DashboardCertificate;
  createdAt: string;
};

/** Full hydrated detail from GET /api/academy/enrollments/[id]. */
export type DashboardCourse = {
  id: string;
  slug: string;
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
  certificate?: DashboardCertificate;
  tutorMessages: TutorMessage[];
  createdAt?: string;
};

export type DashboardBadge = { badgeId: string; earnedAt: string; contextSlug?: string };

export type DashboardGamification = {
  xpTotal: number;
  streakCurrent: number;
  streakLongest: number;
  activeDates: string[];
  badges: DashboardBadge[];
};

export type DashboardPayload = {
  student: {
    name?: string;
    email: string;
    avatarUrl?: string;
    certificateName?: string;
    role: string;
    vipAccess?: boolean;
    diamondsBalance: number;
    gamification: DashboardGamification;
    referralCode?: string;
    referralsCount?: number;
    subscription?: {
      planId?: string;
      status?: SubscriptionStatus;
      provider?: string;
      currentPeriodEnd?: string;
      cancelAtPeriodEnd?: boolean;
    };
    mentorshipStatus?: string;
  };
  enrollments: DashboardEnrollment[];
  metrics: {
    quizAverage: number | null;
    pendingAssignments: number;
    activityDates: string[];
    certificateCount: number;
  };
};
