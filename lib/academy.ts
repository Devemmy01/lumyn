export type AcademyPlanId = "ai-learning-path";

export type AcademyRole = "student" | "mentor" | "admin";

export type SubscriptionStatus =
  | "inactive"
  | "pending"
  | "active"
  | "past_due"
  | "cancelled";

export const STARTER_ACADEMY_POINTS = 10;
export const POINTS_PER_GENERATION = 10;
export const ACADEMY_POINT_PRICE_CENTS = 50;
export const MIN_POINT_PURCHASE = 1;
export const MAX_POINT_PURCHASE = 500;
export const ACADEMY_TUTOR_NAME = "Astra";
export const ACADEMY_TUTOR_ROLE = "Lumyn Academy learning agent";

export type YouTubeLessonVideo = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  watchUrl: string;
  embedUrl: string;
  duration?: string;
  durationLabel?: string;
  publishedAt?: string;
  viewCount?: number;
};

export type GeneratedLesson = {
  title: string;
  goal?: string;
  videoTitle?: string;
  videoSearchQuery?: string;
  videoLearningGoal?: string;
  recommendedChannels?: string[];
  keyTakeaways?: string[];
  youtubeVideo?: YouTubeLessonVideo;
  explanation?: string;
  example?: string;
  notes: string;
  conceptExplanation?: string;
  whyItMatters?: string;
  prerequisites?: string[];
  practicalTask: string;
  challenge?: string;
  starterCode?: string;
  expectedResult?: string;
  tests?: string[];
  hint?: string;
  lessonAssessment?: GeneratedQuizQuestion[];
  stepByStepLab?: string[];
  commonMistakes?: string[];
  deliverables?: string[];
  assessmentCriteria?: string[];
  safetyNotes?: string;
  estimatedTime?: string;
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
  assignmentDeliverables?: string[];
  assignmentAssessmentCriteria?: string[];
  miniProject: string;
  miniProjectDeliverables?: string[];
  miniProjectAssessmentCriteria?: string[];
  labEnvironment?: string;
  safetyNotes?: string;
  completionStatus: "locked" | "not_started" | "in_progress" | "completed";
};

export type ModulePracticePlan = {
  assignment: string;
  assignmentDeliverables: string[];
  assignmentAssessmentCriteria: string[];
  miniProject: string;
  miniProjectDeliverables: string[];
  miniProjectAssessmentCriteria: string[];
  labEnvironment: string;
  safetyNotes: string;
};

export const MIN_MODULE_QUIZ_QUESTIONS = 10;

function isVaguePracticeText(value: unknown) {
  if (typeof value !== "string") return true;
  const text = value.trim().toLowerCase();
  if (text.length < 70) return true;
  return [
    "submit evidence",
    "completed the module practice work",
    "compact project that applies",
    "module's core ideas",
    "create a compact project",
    "practice evidence",
    "short implementation notes",
  ].some((phrase) => text.includes(phrase));
}

function isVaguePracticeItem(value: string) {
  const text = value.trim().toLowerCase();
  return [
    "practice evidence",
    "short implementation notes",
    "matches the task",
    "explains the work clearly",
    "project artifact",
    "brief walkthrough",
    "applies module concepts",
    "includes clear evidence",
  ].some((phrase) => text === phrase || text.includes(phrase));
}

function practiceItems(value: unknown, fallback: string[]) {
  const values = Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .map((item) => item.trim())
        .filter((item) => !isVaguePracticeItem(item))
    : [];
  return values.length ? values : fallback;
}

function topicPracticePlan(moduleTitle: string, lessonTitles: string[]): ModulePracticePlan {
  const topicText = [moduleTitle, ...lessonTitles].join(" ").toLowerCase();

  if (/\bhtml\b|semantic|doctype|element|attribute|heading|tag/.test(topicText)) {
    return {
      assignment:
        "Create an index.html file for a simple personal profile page. It must include <!DOCTYPE html>, <html>, <head>, <title>, and <body>, then add a visible <h1>, at least one paragraph, one link, and one semantic section such as <main>, <section>, <nav>, or <footer>.",
      assignmentDeliverables: [
        "The full index.html code or a link to the file",
        "A short note naming the required tags you used",
        "A browser screenshot or preview description of the rendered page",
      ],
      assignmentAssessmentCriteria: [
        "Uses valid HTML document structure",
        "Includes visible body content, not only a <title>",
        "Uses at least one semantic HTML element correctly",
      ],
      miniProject:
        "Turn the same index.html file into a tiny landing page for yourself, a fictional product, or a local service. Add a header, main content area, two content sections, and a footer so the page has a clear structure.",
      miniProjectDeliverables: [
        "Completed index.html landing page",
        "Brief walkthrough of the page structure",
        "List of the semantic elements and attributes used",
      ],
      miniProjectAssessmentCriteria: [
        "Page structure is clear and readable",
        "Headings follow a sensible order",
        "Links, text, and sections render correctly in the browser",
      ],
      labEnvironment:
        "Use the practice playground, a local editor, or any browser-based HTML sandbox. Save the work as index.html if using your own editor.",
      safetyNotes:
        "Use your own text and safe placeholder links. Do not paste private personal information into the page.",
    };
  }

  if (/\bcss\b|style|layout|selector|flex|grid/.test(topicText)) {
    return {
      assignment:
        "Style a simple HTML card or profile section with CSS. Use selectors, color, spacing, border radius, and at least one layout technique such as flexbox or grid.",
      assignmentDeliverables: [
        "HTML and CSS code",
        "Screenshot or preview description",
        "Short note explaining three CSS rules you wrote",
      ],
      assignmentAssessmentCriteria: [
        "CSS selectors target the intended elements",
        "Spacing, color, and layout are visibly applied",
        "The result remains readable on a narrow screen",
      ],
      miniProject:
        "Build a small responsive landing section with a heading, text, button, and three feature items using your CSS file for all styling.",
      miniProjectDeliverables: [
        "index.html and style.css",
        "Responsive preview or screenshot",
        "Brief explanation of the layout choices",
      ],
      miniProjectAssessmentCriteria: [
        "Styles are organized in CSS",
        "Layout adapts at small widths",
        "Visual hierarchy is clear",
      ],
      labEnvironment:
        "Use the practice playground tabs or a local editor with index.html and style.css.",
      safetyNotes:
        "Use original or placeholder content and avoid external assets you do not have permission to use.",
    };
  }

  if (/javascript|\bjs\b|dom|function|variable|event/.test(topicText)) {
    return {
      assignment:
        "Add JavaScript behavior to a small page. Create one button, select it with JavaScript, listen for a click event, and update text on the page or print a useful value with console.log().",
      assignmentDeliverables: [
        "HTML and JavaScript code",
        "Explanation of the event and DOM update",
        "Screenshot or copied console output",
      ],
      assignmentAssessmentCriteria: [
        "JavaScript runs without errors",
        "A user action triggers a visible result",
        "The code uses clear variable or function names",
      ],
      miniProject:
        "Build a tiny interactive widget such as a counter, color changer, quote switcher, or show/hide panel using HTML, CSS, and JavaScript.",
      miniProjectDeliverables: [
        "index.html, style.css, and script.js",
        "Brief walkthrough of how the interaction works",
        "Evidence that the widget runs in the browser",
      ],
      miniProjectAssessmentCriteria: [
        "The interaction changes the page when used",
        "JavaScript is connected correctly",
        "The code is readable and organized",
      ],
      labEnvironment:
        "Use the practice playground tabs or a local editor with index.html, style.css, and script.js.",
      safetyNotes:
        "Run only your own learning code in the browser. Do not paste unknown scripts from untrusted sources.",
    };
  }

  return {
    assignment:
      `Build a small working example that demonstrates ${moduleTitle}. The work should apply the main lesson ideas and include enough detail for someone else to understand what you made.`,
    assignmentDeliverables: [
      "Working artifact or code",
      "Short explanation of the main decisions",
      "Evidence that the result works",
    ],
    assignmentAssessmentCriteria: [
      "Matches the module topic",
      "Includes a clear explanation",
      "Provides concrete evidence",
    ],
    miniProject:
      `Create a compact mini project that combines the key ideas from ${moduleTitle} into one usable example.`,
    miniProjectDeliverables: [
      "Completed mini project",
      "Brief walkthrough",
      "Notes about what you would improve next",
    ],
    miniProjectAssessmentCriteria: [
      "Applies module concepts",
      "Shows a complete attempt",
      "Includes clear evidence",
    ],
    labEnvironment:
      "Use the practice playground, local editor, browser, notebook, or a relevant safe practice environment.",
    safetyNotes:
      "Stay within authorized, safe, and appropriate learning environments.",
  };
}

export function ensureModulePractice(module: Partial<GeneratedModule>): ModulePracticePlan {
  const moduleTitle = module.title?.trim() || "this module";
  const lessonTitles =
    module.lessons
      ?.map((lesson) => lesson.title?.trim())
      .filter((title): title is string => Boolean(title)) ?? [];
  const fallback = topicPracticePlan(moduleTitle, lessonTitles);

  return {
    assignment: isVaguePracticeText(module.assignment)
      ? fallback.assignment
      : module.assignment!.trim(),
    assignmentDeliverables: practiceItems(
      module.assignmentDeliverables,
      fallback.assignmentDeliverables,
    ),
    assignmentAssessmentCriteria: practiceItems(
      module.assignmentAssessmentCriteria,
      fallback.assignmentAssessmentCriteria,
    ),
    miniProject: isVaguePracticeText(module.miniProject)
      ? fallback.miniProject
      : module.miniProject!.trim(),
    miniProjectDeliverables: practiceItems(
      module.miniProjectDeliverables,
      fallback.miniProjectDeliverables,
    ),
    miniProjectAssessmentCriteria: practiceItems(
      module.miniProjectAssessmentCriteria,
      fallback.miniProjectAssessmentCriteria,
    ),
    labEnvironment:
      typeof module.labEnvironment === "string" && module.labEnvironment.trim()
        ? module.labEnvironment.trim()
        : fallback.labEnvironment,
    safetyNotes:
      typeof module.safetyNotes === "string" && module.safetyNotes.trim()
        ? module.safetyNotes.trim()
        : fallback.safetyNotes,
  };
}

export function isGeneratedQuizQuestion(
  value: unknown,
): value is GeneratedQuizQuestion {
  if (!value || typeof value !== "object") return false;
  const question = value as Record<string, unknown>;
  return (
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    question.options.every((option) => typeof option === "string") &&
    Number.isInteger(question.correctAnswerIndex) &&
    Number(question.correctAnswerIndex) >= 0 &&
    Number(question.correctAnswerIndex) < 4 &&
    typeof question.explanation === "string"
  );
}

function isLikelyNonTechnicalQuizQuestion(question: GeneratedQuizQuestion) {
  const text = question.question.toLowerCase();
  const options = question.options.join(" ").toLowerCase();
  const combined = `${text} ${options}`;
  const hasTechnicalSignal =
    /[`<>{}()[\].:=]|\b(api|array|async|attribute|class|css|database|debug|dom|function|generic|html|http|interface|javascript|method|object|operator|property|query|runtime|selector|syntax|typescript|variable)\b/.test(
      combined,
    );
  const isMetaLearningPrompt =
    /\b(answer|assessment|evidence|feedback|learn|mistake|practice|reflection|submit|understand)\b/.test(
      text,
    );

  return isMetaLearningPrompt && !hasTechnicalSignal;
}

export function ensureModuleQuizQuestions(
  module: Partial<GeneratedModule>,
): GeneratedQuizQuestion[] {
  const existingQuestions = Array.isArray(module.quiz?.questions)
    ? module.quiz.questions.filter(isGeneratedQuizQuestion)
    : [];
  const seenQuestions = new Set<string>();

  return existingQuestions.filter((question) => {
    if (isLikelyNonTechnicalQuizQuestion(question)) return false;
    const normalizedQuestion = question.question.trim().toLowerCase();
    if (!normalizedQuestion || seenQuestions.has(normalizedQuestion)) return false;
    seenQuestions.add(normalizedQuestion);
    return true;
  });
}

export function hasMinimumModuleQuizQuestions(module: Partial<GeneratedModule>) {
  return ensureModuleQuizQuestions(module).length >= MIN_MODULE_QUIZ_QUESTIONS;
}

export type FinalProjectPlan = {
  overview: string;
  labEnvironment: string;
  phases: Array<{
    title: string;
    instructions: string;
    evidence: string[];
  }>;
  deliverables: string[];
  assessmentCriteria: string[];
  safetyNotes: string;
};

export type GeneratedCourse = {
  courseTitle: string;
  courseDescription: string;
  difficulty: string;
  modules: GeneratedModule[];
  finalProject: string;
  finalProjectPlan?: FinalProjectPlan;
  progressStructure: string[];
  certificateEligible: boolean;
};

export type LearningCursor = {
  moduleIndex?: number;
  lessonIndex?: number;
  step: "lessons" | "quiz" | "assignment" | "final_project";
  section?: "overview" | "video" | "notes" | "practice" | "submission";
  updatedAt: string;
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
    price: "$0.50",
    cadence: "per point",
    description:
      "New students receive 10 free points. Each AI-generated course costs 10 points, with video-supported lessons, assessments, projects, progress, and certificates.",
    cta: "Generate Your First Course",
    href: "/academy/dashboard?plan=ai-learning-path",
    includes: [
      "10 free starter points",
      "10 points per generation",
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
  "Point balance",
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
    role: "Academy student",
    quote:
      "The generated path gave me structure, feedback, and confidence. It felt practical from the first week.",
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
    question: "How do points work?",
    answer:
      "Every new student receives 10 free points. Each AI-generated learning path costs 10 points, and extra points can be purchased whenever needed.",
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
  "Grant student points",
  "View payments and point purchases",
  "Issue certificates",
  "Send emails",
  "View student progress",
  "Manage pricing",
  "Manage testimonials",
  "Manage FAQs",
];
