import {
  ACADEMY_TUTOR_NAME,
  ACADEMY_TUTOR_ROLE,
  ensureModulePractice,
  ensureModuleQuizQuestions,
  isGeneratedQuizQuestion,
  MIN_MODULE_QUIZ_QUESTIONS,
  type GeneratedCourse,
  type SubmissionEvaluation,
} from "@/lib/academy";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta";

type AcademyAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AcademyAIRequestBody = {
  temperature?: number;
  max_tokens?: number;
  response_format?: {
    type?: string;
    json_schema?: {
      name?: string;
      schema?: unknown;
    };
  };
  messages?: AcademyAIMessage[];
};

export class AcademyAIError extends Error {
  constructor(message: string, public readonly status: number = 503) {
    super(message);
    this.name = "AcademyAIError";
  }
}

function openRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPEN_ROUTER_KEY;
  if (!apiKey) return null;
  return { apiKey, model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini" };
}

function geminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  return { apiKey, model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite" };
}

function outputTokenLimit() {
  const configured = Number(process.env.OPENROUTER_MAX_TOKENS ?? 8000);
  if (!Number.isFinite(configured) || configured <= 0) return 8000;
  return Math.min(Math.max(Math.floor(configured), 2000), 12000);
}

function jsonResponseInstruction(body: AcademyAIRequestBody) {
  const jsonSchema = body.response_format?.json_schema;
  if (body.response_format?.type !== "json_schema" || !jsonSchema) return "";

  return [
    "Return only valid JSON. Do not include markdown fences, commentary, or extra text.",
    jsonSchema.name
      ? `The JSON object must satisfy the ${jsonSchema.name} schema.`
      : "The JSON object must satisfy the requested schema.",
    jsonSchema.schema
      ? `Schema:\n${JSON.stringify(jsonSchema.schema)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeAIRequestBody(body: Record<string, unknown>): AcademyAIRequestBody {
  return body as AcademyAIRequestBody;
}

function shouldTryFallback(error: unknown) {
  if (!(error instanceof AcademyAIError)) return false;
  return [429, 503].includes(error.status);
}

async function completeWithOpenRouter(
  body: AcademyAIRequestBody,
  options: { lengthErrorMessage?: string } = {},
) {
  const config = openRouterConfig();
  if (!config) {
    throw new AcademyAIError("OpenRouter is not configured.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
      "X-Title": "Lumyn Academy",
    },
    body: JSON.stringify({ model: config.model, ...body }),
  });

  if (!response.ok) {
    const failure = await response.json().catch(() => null) as
      | { error?: { message?: string; code?: number } }
      | null;
    console.error("[OpenRouter]", {
      status: response.status,
      model: config.model,
      code: failure?.error?.code,
      message: failure?.error?.message,
    });
    if (response.status === 402) {
      throw new AcademyAIError(
        "AI generation credits are currently insufficient for this request. Please lower OPENROUTER_MAX_TOKENS or top up the OpenRouter balance and try again.",
        503
      );
    }
    if (response.status === 429) {
      throw new AcademyAIError("The learning AI is busy. Please wait a moment and try again.", 429);
    }
    throw new AcademyAIError("The learning AI is temporarily unavailable.");
  }

  const payload = await response.json();
  const choice = payload?.choices?.[0];
  const content = choice?.message?.content;
  if (choice?.finish_reason === "length") {
    throw new AcademyAIError(
      options.lengthErrorMessage ??
        "The learning path was too large to finish. Please try a narrower topic or lower course detail.",
      503,
    );
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The learning AI returned an empty response.");
  }
  return content;
}

async function completeWithGemini(
  body: AcademyAIRequestBody,
  options: { lengthErrorMessage?: string } = {},
) {
  const config = geminiConfig();
  if (!config) {
    throw new AcademyAIError("Gemini is not configured.");
  }

  const messages = body.messages ?? [];
  const jsonInstruction = jsonResponseInstruction(body);
  const systemText = [
    ...messages
      .filter((message) => message.role === "system")
      .map((message) => message.content),
    jsonInstruction,
  ]
    .filter((part) => part.trim().length > 0)
    .join("\n\n");
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const response = await fetch(
    `${GEMINI_URL}/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(systemText
          ? {
              systemInstruction: {
                parts: [{ text: systemText }],
              },
            }
          : {}),
        contents,
        generationConfig: {
          temperature: body.temperature ?? 0.35,
          maxOutputTokens: body.max_tokens ?? outputTokenLimit(),
          ...(body.response_format?.type === "json_schema"
            ? { responseMimeType: "application/json" }
            : {}),
        },
      }),
    },
  );

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as
      | { error?: { message?: string; status?: string; code?: number } }
      | null;
    console.error("[Gemini]", {
      status: response.status,
      model: config.model,
      code: failure?.error?.code,
      errorStatus: failure?.error?.status,
      message: failure?.error?.message,
    });
    if (response.status === 429) {
      throw new AcademyAIError("The learning AI is busy. Please wait a moment and try again.", 429);
    }
    if (response.status === 400) {
      throw new AcademyAIError("Gemini could not generate this request. Please try a narrower topic.", 503);
    }
    throw new AcademyAIError("The Gemini fallback is temporarily unavailable.");
  }

  const payload = await response.json();
  const candidate = payload?.candidates?.[0];
  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new AcademyAIError(
      options.lengthErrorMessage ??
        "The learning path was too large to finish. Please try a narrower topic or lower course detail.",
      503,
    );
  }

  const content = candidate?.content?.parts
    ?.map((part: { text?: unknown }) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
  if (!content) {
    throw new Error("The Gemini fallback returned an empty response.");
  }
  return content;
}

async function complete(
  rawBody: Record<string, unknown>,
  options: { lengthErrorMessage?: string } = {},
) {
  const body = normalizeAIRequestBody(rawBody);
  const preferredProvider = process.env.ACADEMY_AI_PROVIDER?.trim().toLowerCase();
  const openRouter = openRouterConfig();
  const gemini = geminiConfig();

  if (preferredProvider === "gemini") {
    return completeWithGemini(body, options);
  }

  if (preferredProvider === "openrouter") {
    return completeWithOpenRouter(body, options);
  }

  if (openRouter) {
    try {
      return await completeWithOpenRouter(body, options);
    } catch (error) {
      if (!gemini || !shouldTryFallback(error)) throw error;
      console.warn("[Academy AI] OpenRouter failed; retrying with Gemini fallback.");
    }
  }

  if (gemini) {
    return completeWithGemini(body, options);
  }

  throw new AcademyAIError(
    "No Academy AI provider is configured. Add OPENROUTER_API_KEY or GEMINI_API_KEY.",
    503,
  );
}

const stringProperty = { type: "string", maxLength: 180 } as const;
const conciseTextProperty = { type: "string", minLength: 30, maxLength: 180 } as const;
const paragraphTextProperty = { type: "string", minLength: 60, maxLength: 220 } as const;
const shortTextArrayProperty = { type: "array", minItems: 2, maxItems: 3, items: stringProperty } as const;
const lessonAssessmentProperty = {
  type: "array",
  minItems: 2,
  maxItems: 2,
  items: {
    type: "object",
    additionalProperties: false,
    required: ["question", "options", "correctAnswerIndex", "explanation"],
    properties: {
      question: stringProperty,
      options: { type: "array", minItems: 4, maxItems: 4, items: stringProperty },
      correctAnswerIndex: { type: "integer", minimum: 0, maximum: 3 },
      explanation: stringProperty,
    },
  },
} as const;
const courseSchema = {
  name: "academy_course",
  strict: false,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["courseTitle", "courseDescription", "difficulty", "modules", "finalProject", "finalProjectPlan", "progressStructure", "certificateEligible"],
    properties: {
      courseTitle: stringProperty,
      courseDescription: stringProperty,
      difficulty: stringProperty,
      modules: {
        type: "array", minItems: 3, maxItems: 3,
        items: {
          type: "object", additionalProperties: false,
          required: ["title", "description", "lessons", "quiz", "assignment", "assignmentDeliverables", "assignmentAssessmentCriteria", "miniProject", "miniProjectDeliverables", "miniProjectAssessmentCriteria", "labEnvironment", "safetyNotes"],
          properties: {
            title: stringProperty,
            description: paragraphTextProperty,
            lessons: {
              type: "array", minItems: 2, maxItems: 2,
              items: {
                type: "object", additionalProperties: false,
                required: ["title", "goal", "videoTitle", "videoSearchQuery", "videoLearningGoal", "recommendedChannels", "keyTakeaways", "notes", "practicalTask", "challenge", "expectedResult", "tests", "lessonAssessment", "deliverables", "assessmentCriteria", "safetyNotes", "estimatedTime"],
                properties: {
                  title: stringProperty,
                  goal: conciseTextProperty,
                  videoTitle: stringProperty,
                  videoSearchQuery: stringProperty,
                  videoLearningGoal: conciseTextProperty,
                  recommendedChannels: shortTextArrayProperty,
                  keyTakeaways: shortTextArrayProperty,
                  explanation: conciseTextProperty,
                  example: conciseTextProperty,
                  notes: paragraphTextProperty,
                  conceptExplanation: paragraphTextProperty,
                  whyItMatters: conciseTextProperty,
                  prerequisites: { type: "array", minItems: 1, maxItems: 2, items: stringProperty },
                  practicalTask: paragraphTextProperty,
                  challenge: conciseTextProperty,
                  starterCode: { type: "string", maxLength: 360 },
                  expectedResult: conciseTextProperty,
                  tests: { type: "array", minItems: 2, maxItems: 3, items: stringProperty },
                  hint: conciseTextProperty,
                  lessonAssessment: lessonAssessmentProperty,
                  stepByStepLab: { type: "array", minItems: 2, maxItems: 3, items: stringProperty },
                  commonMistakes: { type: "array", minItems: 1, maxItems: 2, items: stringProperty },
                  deliverables: { type: "array", minItems: 1, maxItems: 2, items: stringProperty },
                  assessmentCriteria: { type: "array", minItems: 1, maxItems: 2, items: stringProperty },
                  safetyNotes: conciseTextProperty,
                  estimatedTime: stringProperty,
                  realWorldExample: {
                    type: "object", additionalProperties: false,
                    required: ["title", "scenario", "takeaway"],
                    properties: { title: stringProperty, scenario: stringProperty, takeaway: stringProperty },
                  },
                  codeExample: {
                    type: "object", additionalProperties: false,
                    required: ["language", "code", "explanation"],
                    properties: {
                      language: stringProperty,
                      code: { type: "string", maxLength: 360 },
                      explanation: conciseTextProperty,
                    },
                  },
                  visualAid: {
                    type: "object", additionalProperties: false,
                    required: ["title", "type", "items"],
                    properties: {
                      title: stringProperty,
                      type: { type: "string", enum: ["flow", "comparison", "sequence"] },
                      items: { type: "array", minItems: 2, maxItems: 4, items: stringProperty },
                    },
                  },
                },
              },
            },
            quiz: {
              type: "object", additionalProperties: false, required: ["title", "questions"],
              properties: {
                title: stringProperty,
                questions: {
                  type: "array", minItems: 10, maxItems: 12,
                  items: {
                    type: "object", additionalProperties: false,
                    required: ["question", "options", "correctAnswerIndex", "explanation"],
                    properties: {
                      question: stringProperty,
                      options: { type: "array", minItems: 4, maxItems: 4, items: stringProperty },
                      correctAnswerIndex: { type: "integer", minimum: 0, maximum: 3 },
                      explanation: stringProperty,
                    },
                  },
                },
              },
            },
            assignment: paragraphTextProperty,
            assignmentDeliverables: shortTextArrayProperty,
            assignmentAssessmentCriteria: shortTextArrayProperty,
            miniProject: paragraphTextProperty,
            miniProjectDeliverables: shortTextArrayProperty,
            miniProjectAssessmentCriteria: shortTextArrayProperty,
            labEnvironment: paragraphTextProperty,
            safetyNotes: paragraphTextProperty,
          },
        },
      },
      finalProject: paragraphTextProperty,
      finalProjectPlan: {
        type: "object", additionalProperties: false,
        required: ["overview", "labEnvironment", "phases", "deliverables", "assessmentCriteria", "safetyNotes"],
        properties: {
          overview: paragraphTextProperty,
          labEnvironment: paragraphTextProperty,
          phases: {
            type: "array", minItems: 2, maxItems: 3,
            items: {
              type: "object", additionalProperties: false,
              required: ["title", "instructions", "evidence"],
              properties: {
                title: stringProperty,
                instructions: paragraphTextProperty,
                evidence: shortTextArrayProperty,
              },
            },
          },
          deliverables: shortTextArrayProperty,
          assessmentCriteria: shortTextArrayProperty,
          safetyNotes: paragraphTextProperty,
        },
      },
      progressStructure: { type: "array", minItems: 3, maxItems: 5, items: stringProperty },
      certificateEligible: { type: "boolean" },
    },
  },
};

const moduleQuizSchema = {
  name: "academy_module_quiz",
  strict: false,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "questions"],
    properties: {
      title: stringProperty,
      questions: {
        type: "array",
        minItems: 10,
        maxItems: 12,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["question", "options", "correctAnswerIndex", "explanation"],
          properties: {
            question: stringProperty,
            options: { type: "array", minItems: 4, maxItems: 4, items: stringProperty },
            correctAnswerIndex: { type: "integer", minimum: 0, maximum: 3 },
            explanation: stringProperty,
          },
        },
      },
    },
  },
};

function normalizeCourseDescription(description: string) {
  let text = description.trim().replace(/\s+/g, " ");

  if (/\band a$/i.test(text)) {
    text = text.replace(/\band a$/i, "and a final project");
  }

  if (!/[.!?]$/.test(text)) {
    text += ".";
  }

  return text;
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
  return items.length ? items : fallback;
}

function parseCourse(content: string): GeneratedCourse {
  let parsed: Partial<GeneratedCourse>;
  try {
    parsed = JSON.parse(content) as Partial<GeneratedCourse>;
  } catch {
    throw new AcademyAIError(
      "The learning AI returned an incomplete course. Please try again with a narrower topic.",
      503,
    );
  }

  if (!Array.isArray(parsed.modules) || !parsed.modules.length) {
    throw new AcademyAIError("The learning AI returned an invalid course.", 503);
  }

  const modules = parsed.modules.map((module, moduleIndex) => {
    if (!module?.title || !Array.isArray(module.lessons) || !module.lessons.length) {
      throw new AcademyAIError("The learning AI returned an invalid module.", 503);
    }
    const lessons = module.lessons.map((lesson, lessonIndex) => {
      const title = stringValue(lesson.title, `Lesson ${lessonIndex + 1}`);
      const goal = stringValue(lesson.goal, `Understand and apply ${title}.`);
      const lessonAssessment = Array.isArray(lesson.lessonAssessment)
        ? lesson.lessonAssessment.filter(isGeneratedQuizQuestion)
        : [];
      if (lessonAssessment.length < 2) {
        throw new AcademyAIError(
          "The learning AI returned an invalid lesson assessment. Please regenerate the course.",
          503,
        );
      }
      return {
        ...lesson,
        title,
        goal,
        videoTitle: stringValue(lesson.videoTitle, `${title} tutorial`),
        videoSearchQuery: stringValue(lesson.videoSearchQuery, `${title} ${module.title} tutorial`),
        videoLearningGoal: stringValue(lesson.videoLearningGoal, goal),
        recommendedChannels: stringArray(lesson.recommendedChannels, ["freeCodeCamp", "Traversy Media"]),
        keyTakeaways: stringArray(lesson.keyTakeaways, [goal, `How ${title} is used in practice`]),
        notes: stringValue(lesson.notes, `Watch the recommended video, take notes on ${title}, and connect it to the module goal.`),
        practicalTask: stringValue(lesson.practicalTask, `Complete a small practice task that demonstrates ${title}.`),
        challenge: stringValue(lesson.challenge, `Build or explain one example of ${title}.`),
        expectedResult: stringValue(lesson.expectedResult, `You can explain ${title} and show evidence of a completed practice task.`),
        tests: stringArray(lesson.tests, [`Explain ${title} in your own words`, "Complete the practice task"]),
        lessonAssessment,
        deliverables: stringArray(lesson.deliverables, ["Practice notes", "Completed task evidence"]),
        assessmentCriteria: stringArray(lesson.assessmentCriteria, ["Clear explanation", "Working evidence"]),
        safetyNotes: stringValue(lesson.safetyNotes, "Use only safe, authorized, and appropriate learning environments."),
        estimatedTime: stringValue(lesson.estimatedTime, "30-45 minutes"),
        completionStatus: moduleIndex === 0 && lessonIndex === 0 ? "in_progress" as const : "not_started" as const,
      };
    });
    const quizQuestions = ensureModuleQuizQuestions({
      ...module,
      title: stringValue(module.title, `Module ${moduleIndex + 1}`),
      lessons,
    });
    if (quizQuestions.length < MIN_MODULE_QUIZ_QUESTIONS) {
      throw new AcademyAIError(
        `The learning AI returned only ${quizQuestions.length} usable quiz questions for "${module.title}". Each module needs at least ${MIN_MODULE_QUIZ_QUESTIONS}. Please regenerate the course.`,
        503,
      );
    }
    const practice = ensureModulePractice({
      ...module,
      title: stringValue(module.title, `Module ${moduleIndex + 1}`),
      lessons,
    });
    return {
      ...module,
      title: stringValue(module.title, `Module ${moduleIndex + 1}`),
      description: stringValue(module.description, `Build practical understanding through video study, practice, and assessment.`),
      lessons,
      quiz: {
        title: stringValue(module.quiz?.title, `${module.title} assessment`),
        questions: quizQuestions,
      },
      assignment: practice.assignment,
      assignmentDeliverables: practice.assignmentDeliverables,
      assignmentAssessmentCriteria: practice.assignmentAssessmentCriteria,
      miniProject: practice.miniProject,
      miniProjectDeliverables: practice.miniProjectDeliverables,
      miniProjectAssessmentCriteria: practice.miniProjectAssessmentCriteria,
      labEnvironment: practice.labEnvironment,
      safetyNotes: practice.safetyNotes,
      completionStatus: moduleIndex === 0 ? "in_progress" as const : "locked" as const,
    };
  });
  const courseTitle = stringValue(parsed.courseTitle, "Personalized Lumyn Academy Learning Path");

  return {
    courseTitle,
    courseDescription: normalizeCourseDescription(stringValue(
      parsed.courseDescription,
      `${courseTitle} uses curated video study, practice tasks, assessments, and a final project.`,
    )),
    difficulty: stringValue(parsed.difficulty, "Beginner-friendly"),
    modules,
    finalProject: stringValue(parsed.finalProject, `Build a final project inside the Lumyn Academy browser workspace that demonstrates the core skills from ${courseTitle}.`),
    finalProjectPlan: parsed.finalProjectPlan ?? {
      overview: `Build a final artifact that proves your understanding of ${courseTitle}.`,
      labEnvironment: "Use the Lumyn Academy in-browser workspace. Keep the project self-contained with files, notes, and previewable evidence that can be submitted inside the system.",
      phases: [
        {
          title: "Plan and build",
          instructions: "Define a compact scope, then build the core version in the Academy workspace using the course concepts.",
          evidence: ["Workspace files", "Previewable working artifact"],
        },
        {
          title: "Review and submit",
          instructions: "Test the work in the preview, explain key decisions, and submit the workspace for assessment.",
          evidence: ["Test notes", "Implementation summary"],
        },
      ],
      deliverables: ["Academy workspace files", "Implementation explanation", "Preview/test notes"],
      assessmentCriteria: ["Applies course concepts", "Provides clear evidence"],
      safetyNotes: "Use only safe, authorized, and appropriate learning environments.",
    },
    progressStructure: stringArray(parsed.progressStructure, ["Watch lesson videos", "Complete practice tasks", "Pass assessments", "Submit final project"]),
    certificateEligible: parsed.certificateEligible !== false,
  };
}

export async function generateAcademyCourse(input: { prompt: string; level: string; goal: string }) {
  const content = await complete({
    temperature: 0.35,
    max_tokens: outputTokenLimit(),
    response_format: { type: "json_schema", json_schema: courseSchema },
    messages: [
      {
        role: "system",
        content: "You are Lumyn Academy's curriculum architect. Build a serious video-supported curriculum, not a generated textbook. The AI's job is to design the learning path, choose the learning sequence, create precise YouTube search targets, define what the student should watch for, add compact notes, set practice work, and assess understanding. Each lesson must have a specific videoTitle, videoSearchQuery, videoLearningGoal, recommendedChannels, keyTakeaways, concise notes, a practical task, and a short lessonAssessment. Use YouTube search queries that are likely to surface strong educational videos from channels such as freeCodeCamp, Traversy Media, The Net Ninja, Web Dev Simplified, Fireship, CrashCourse, Simplilearn, IBM Technology, NetworkChuck, or other topic-appropriate reputable channels. Do not invent exact YouTube URLs or claim a video exists at a specific URL. Lesson titles must sound like concrete learning milestones, for example 'Build Your First Page Structure' instead of 'HTML Basics' or 'Turn Events Into Interactive UI' instead of 'JavaScript Basics'. Avoid generic lessons like 'Introduction to X' unless the lesson outcome is specific and measurable. Each module quiz must contain at least 10 technical multiple-choice questions that directly test the module's concepts, syntax, debugging decisions, outputs, tradeoffs, and edge cases. Never fill module quizzes with effort, motivation, evidence, submission, or reflection questions such as 'what proves you understood this?' or 'what should you check before submitting?'. Assignments and mini projects must produce real evidence, not vague reflection. The final project must be broken into concise phases with instructions and evidence for each phase, and it must be possible to complete and submit inside Lumyn Academy's in-browser workspace using self-contained files, notes, preview output, and written evidence. Do not require external deployments, paid tools, local databases, cloud accounts, real production systems, or repository-only submissions for the final project. For cybersecurity, all offensive techniques must be framed for owned, authorized, or simulated labs only; include rules of engagement, scope, evidence handling, and mitigation expectations. The courseDescription field must be a complete sentence and should clearly explain that the path uses curated video study, practice tasks, assessments, and a final project. Never include external URLs, never require attacking real systems, and never claim a certificate has already been earned.",
      },
      { role: "user", content: `Learning request: ${input.prompt}\nCurrent level: ${input.level}\nDesired outcome: ${input.goal}` },
    ],
  });
  return parseCourse(content);
}

export async function generateAcademyModuleQuiz(input: {
  courseTitle: string;
  moduleTitle: string;
  moduleDescription: string;
  lessons: Array<{
    title: string;
    goal?: string;
    notes: string;
    practicalTask: string;
    keyTakeaways?: string[];
    tests?: string[];
  }>;
}) {
  const content = await complete({
    temperature: 0.25,
    max_tokens: 3500,
    response_format: { type: "json_schema", json_schema: moduleQuizSchema },
    messages: [
      {
        role: "system",
        content:
          "You repair Lumyn Academy module quizzes. Generate only a rigorous technical multiple-choice assessment for the provided module. The quiz must contain at least 10 questions. Every question must test concrete module knowledge: concepts, syntax, debugging choices, expected outputs, tradeoffs, edge cases, or implementation decisions. Do not ask effort, motivation, reflection, submission, evidence, or generic learning-process questions. Use four plausible options per question, exactly one correct answer, and a concise explanation. Return only valid JSON.",
      },
      {
        role: "user",
        content: `Course: ${input.courseTitle}\nModule: ${input.moduleTitle}\nDescription: ${input.moduleDescription}\n\nLessons:\n${input.lessons
          .map((lesson, index) =>
            `${index + 1}. ${lesson.title}\nGoal: ${lesson.goal ?? ""}\nNotes: ${lesson.notes}\nKey takeaways: ${(lesson.keyTakeaways ?? []).join(" | ")}\nPractice: ${lesson.practicalTask}\nTests: ${(lesson.tests ?? []).join(" | ")}`,
          )
          .join("\n\n")}`,
      },
    ],
  });

  let parsed: { title?: unknown; questions?: unknown };
  try {
    parsed = JSON.parse(content) as { title?: unknown; questions?: unknown };
  } catch {
    throw new AcademyAIError("The learning AI returned an invalid quiz repair response.", 503);
  }

  const quiz = {
    title: stringValue(parsed.title, `${input.moduleTitle} assessment`),
    questions: Array.isArray(parsed.questions)
      ? parsed.questions.filter(isGeneratedQuizQuestion)
      : [],
  };
  const questions = ensureModuleQuizQuestions({ quiz });
  if (questions.length < MIN_MODULE_QUIZ_QUESTIONS) {
    throw new AcademyAIError(
      `The learning AI repaired only ${questions.length} usable quiz questions. Please try again.`,
      503,
    );
  }

  return {
    title: quiz.title,
    questions,
  };
}

export async function askAcademyTutor(input: {
  course: GeneratedCourse;
  moduleIndex: number;
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  studentName?: string;
}) {
  const courseModule = input.course.modules[input.moduleIndex];
  if (!courseModule) throw new Error("The selected module does not exist.");
  const studentName = input.studentName?.trim();

  return complete({
    temperature: 0.25,
    max_tokens: 900,
    messages: [
      {
        role: "system",
        content: `You are ${ACADEMY_TUTOR_NAME}, the student's ${ACADEMY_TUTOR_ROLE}, for "${input.course.courseTitle}". They are studying "${courseModule.title}". ${studentName ? `Address the student naturally as ${studentName}, but do not overuse their name.` : "Address the student warmly and directly."} Explain clearly with short sections and compact examples. Prefer plain markdown with short paragraphs, bullets, and occasional numbered steps. Do not complete graded assignments, perform unsafe actions, or reveal quiz answer keys. If the topic is cybersecurity, keep guidance inside authorized labs, simulations, and defensive learning. Lesson material:\n${courseModule.lessons.map((lesson) => `${lesson.title}\nNotes: ${lesson.notes}\nConcept: ${lesson.conceptExplanation ?? ""}\nWhy it matters: ${lesson.whyItMatters ?? ""}\nLab: ${(lesson.stepByStepLab ?? []).join(" | ")}\nDeliverables: ${(lesson.deliverables ?? []).join(" | ")}\nSafety: ${lesson.safetyNotes ?? ""}`).join("\n\n")}`,
      },
      ...input.history.slice(-8),
      { role: "user", content: input.message },
    ],
  });
}

const submissionEvaluationSchema = {
  name: "submission_evaluation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["score", "passed", "summary", "strengths", "improvements"],
    properties: {
      score: { type: "integer", minimum: 0, maximum: 100 },
      passed: { type: "boolean" },
      summary: stringProperty,
      strengths: { type: "array", maxItems: 4, items: stringProperty },
      improvements: { type: "array", maxItems: 4, items: stringProperty },
    },
  },
};

function compactAssessmentText(value: string, maxLength: number) {
  const text = value.trim();
  if (text.length <= maxLength) return text;
  const headLength = Math.floor(maxLength * 0.72);
  const tailLength = maxLength - headLength;
  return [
    text.slice(0, headLength).trimEnd(),
    `\n\n[...${text.length - maxLength} characters omitted for assessment length...]\n\n`,
    text.slice(-tailLength).trimStart(),
  ].join("");
}

async function requestSubmissionEvaluation(input: {
  courseTitle: string;
  task: string;
  submission: string;
  kind: "assignment" | "final_project";
  maxSubmissionLength: number;
}) {
  return complete(
    {
      temperature: 0.1,
      max_tokens: 650,
      response_format: { type: "json_schema", json_schema: submissionEvaluationSchema },
      messages: [
        {
          role: "system",
          content:
            "You are a strict but constructive software education assessor. Return only the requested compact JSON. Keep summary, strengths, and improvements brief. Evaluate only evidence actually present in the submission. A URL alone is never proof of satisfying the requirements. Require a clear explanation of the implementation, relevant code/file details, and how each requested deliverable was met. Set passed=true only for a score of 70 or higher. Do not invent facts about linked websites you cannot inspect.",
        },
        {
          role: "user",
          content: `Course: ${input.courseTitle}\nAssessment type: ${input.kind}\nTask:\n${compactAssessmentText(input.task, 1200)}\n\nStudent submission:\n${compactAssessmentText(input.submission, input.maxSubmissionLength)}`,
        },
      ],
    },
    {
      lengthErrorMessage:
        "The assessment response was too large to finish. Please submit a shorter explanation or fewer code details and try again.",
    },
  );
}

export async function evaluateAcademySubmission(input: {
  courseTitle: string;
  task: string;
  submission: string;
  kind: "assignment" | "final_project";
}): Promise<SubmissionEvaluation> {
  let content: string;
  try {
    content = await requestSubmissionEvaluation({
      ...input,
      maxSubmissionLength: input.kind === "final_project" ? 9000 : 7000,
    });
  } catch (error) {
    const canRetry =
      error instanceof AcademyAIError &&
      error.message.includes("assessment response was too large");
    if (!canRetry) throw error;
    content = await requestSubmissionEvaluation({
      ...input,
      maxSubmissionLength: input.kind === "final_project" ? 4500 : 3200,
    });
  }
  const evaluation = JSON.parse(content) as SubmissionEvaluation;
  const score = Math.max(0, Math.min(100, Math.round(Number(evaluation.score) || 0)));
  return {
    score,
    passed: score >= 70 && evaluation.passed === true,
    summary: evaluation.summary || "The submission could not be fully assessed.",
    strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
    improvements: Array.isArray(evaluation.improvements) ? evaluation.improvements : [],
  };
}
