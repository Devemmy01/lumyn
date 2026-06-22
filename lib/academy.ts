export type AcademyPlanId = "ai-learning-path" | "guided-mentorship";

export type AcademyRole = "student" | "mentor" | "admin";

export type SubscriptionStatus =
  | "inactive"
  | "pending"
  | "active"
  | "past_due"
  | "cancelled";

export type GeneratedLesson = {
  title: string;
  notes: string;
  practicalTask: string;
  realWorldExample?: {
    title: string;
    scenario: string;
    takeaway: string;
  };
  codeExample?: {
    language: string;
    code: string;
    explanation: string;
  };
  visualAid?: {
    title: string;
    type: "flow" | "comparison" | "sequence";
    items: string[];
  };
  completionStatus: "locked" | "not_started" | "in_progress" | "completed";
};

export type GeneratedQuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type GeneratedModule = {
  title: string;
  description: string;
  lessons: GeneratedLesson[];
  quiz: {
    title: string;
    questions: GeneratedQuizQuestion[];
  };
  assignment: string;
  miniProject: string;
  completionStatus: "locked" | "not_started" | "in_progress" | "completed";
};

export type GeneratedCourse = {
  courseTitle: string;
  courseDescription: string;
  difficulty: string;
  modules: GeneratedModule[];
  finalProject: string;
  progressStructure: string[];
  certificateEligible: boolean;
};

export type QuizAttempt = {
  moduleIndex: number;
  answers: number[];
  score: number;
  passed: boolean;
  completedAt: string;
};

export type AssignmentSubmission = {
  moduleIndex: number;
  content: string;
  status: "submitted" | "reviewed" | "needs_revision";
  submittedAt: string;
  evaluation?: SubmissionEvaluation;
};

export type SubmissionEvaluation = {
  score: number;
  passed: boolean;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export type LearningActivity = {
  action: "lesson_completed" | "quiz_completed" | "assignment_submitted" | "final_project_submitted";
  createdAt: string;
};

export const academyPlans = [
  {
    id: "ai-learning-path" as const,
    name: "AI Learning Path",
    price: "$5",
    cadence: "monthly",
    description:
      "Generate your first complete course free, then continue with unlimited personalized paths, quizzes, projects, progress, and certificates.",
    cta: "Generate Your Free Course",
    href: "/academy/sign-in?plan=ai-learning-path",
    includes: [
      "AI-generated courses",
      "Personalized learning paths",
      "Quizzes",
      "Assignments",
      "Progress dashboard",
      "Certificates",
      "Saved courses",
      "Learning history",
    ],
  },
  {
    id: "guided-mentorship" as const,
    name: "Guided Mentorship",
    price: "$25",
    cadence: "monthly",
    description:
      "A high-touch mentorship track for students who want direct guidance, accountability, and career support.",
    cta: "Apply for Mentorship",
    href: "/academy#mentorship-application",
    includes: [
      "Everything in AI Learning Path",
      "Weekly mentorship session",
      "Project reviews",
      "Code reviews",
      "Personal roadmap",
      "Accountability check-ins",
      "Portfolio guidance",
      "Career support",
    ],
  },
];

export const academySkillExamples = [
  "Frontend Development",
  "Backend APIs",
  "React",
  "TailwindCSS",
  "AI Engineering",
  "Portfolio Projects",
];

export const learningPathModules = [
  "HTML & CSS Foundations",
  "JavaScript Basics",
  "DOM Manipulation",
  "React Basics",
  "TailwindCSS",
  "API Integration",
  "Portfolio Project",
  "Final Assessment",
];

export const howAcademyWorks = [
  "Tell the AI what you want to learn",
  "Choose your current level and career goal",
  "Get a complete structured course",
  "Learn through modules, quizzes, and assignments",
  "Complete a final project",
  "Earn your certificate",
];

export const dashboardSections = [
  "Welcome section",
  "Active learning path",
  "Generated courses",
  "Course progress",
  "Completed modules",
  "Pending assignments",
  "Quiz scores",
  "Certificates",
  "Saved courses",
  "Mentorship status",
  "Notifications",
  "Profile settings",
];

export const mentorshipBenefits = [
  "Live weekly sessions",
  "Roadmap guidance",
  "Project reviews",
  "Code reviews",
  "Career advice",
  "Portfolio guidance",
  "Accountability",
  "Interview preparation",
  "Weekly check-ins",
];

export const mentorshipSteps = [
  {
    title: "Apply",
    description:
      "Share your current skill level, goals, availability, and the kind of support you need.",
  },
  {
    title: "Get matched",
    description:
      "Lumyn reviews your application and confirms the right roadmap, cadence, and expectations.",
  },
  {
    title: "Build weekly",
    description:
      "You meet, ship assignments, get feedback, improve your portfolio, and stay accountable.",
  },
];

export const mentorshipAudience = [
  "Beginners who want structure instead of random tutorials",
  "Students building real projects for a portfolio",
  "Developers who need review, accountability, and direction",
  "Career switchers preparing for interviews and internships",
];

export const academyTestimonials = [
  {
    name: "Ada M.",
    role: "Frontend student",
    quote:
      "The path felt personal. I stopped jumping between tutorials and finally had weekly proof that I was improving.",
  },
  {
    name: "Daniel O.",
    role: "Fullstack learner",
    quote:
      "The assignments and reviews made the difference. I built a project I could actually explain in interviews.",
  },
  {
    name: "Kemi A.",
    role: "Mentorship student",
    quote:
      "The mentorship gave me structure, feedback, and confidence. It felt practical from the first week.",
  },
];

export const academyFaqs = [
  {
    question: "Is Lumyn Academy beginner-friendly?",
    answer:
      "Yes. Students choose their level before generating a path, so the system can start from fundamentals or move faster for experienced learners.",
  },
  {
    question: "Is the AI Learning Path a fixed course?",
    answer:
      "No. It generates a structured course around the student's goal, level, timeline, and desired outcome.",
  },
  {
    question: "What makes mentorship different?",
    answer:
      "Mentorship adds direct human guidance: live sessions, reviews, accountability, portfolio support, career advice, and interview preparation.",
  },
  {
    question: "Do students receive certificates?",
    answer:
      "Yes. Certificates can be issued after course completion, final project submission, and required assessments.",
  },
  
];

export const adminAcademyTools = [
  "View students",
  "View generated courses",
  "Manage mentorship applications",
  "Approve mentorship students",
  "View payments and subscriptions",
  "Issue certificates",
  "Send emails",
  "View student progress",
  "Manage pricing",
  "Manage testimonials",
  "Manage FAQs",
];
