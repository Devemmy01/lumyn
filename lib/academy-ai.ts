import {
  ACADEMY_TUTOR_NAME,
  ACADEMY_TUTOR_ROLE,
  ensureInSystemFinalProject,
  ensureModulePractice,
  ensureModuleQuizQuestions,
  isGeneratedQuizQuestion,
  MIN_MODULE_QUIZ_QUESTIONS,
  type GeneratedCourse,
  type SubmissionEvaluation,
} from "@/lib/academy";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-3.6-flash";

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

type AcademyAICompleteOptions = {
  lengthErrorMessage?: string;
  thinkingLevel?: "minimal" | "low" | "medium" | "high";
  transientRetries?: number;
};

export class AcademyAIError extends Error {
  constructor(
    message: string,
    public readonly status: number = 503,
    public readonly reason?: "max_tokens",
  ) {
    super(message);
    this.name = "AcademyAIError";
  }
}

function geminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;
  return { apiKey, model: GEMINI_MODEL };
}

function outputTokenLimit() {
  const configured = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? 8000);
  if (!Number.isFinite(configured) || configured <= 0) return 8000;
  return Math.min(Math.max(Math.floor(configured), 2000), 12000);
}

function courseOutputTokenLimit() {
  const configured = Number(
    process.env.GEMINI_COURSE_MAX_OUTPUT_TOKENS ?? 8_000,
  );
  if (!Number.isFinite(configured) || configured <= 0) return 8_000;
  return Math.min(Math.max(Math.floor(configured), 6_000), 16_000);
}

function transientRetryLimit() {
  const configured = Number(process.env.GEMINI_TRANSIENT_RETRIES ?? 4);
  if (!Number.isFinite(configured)) return 4;
  return Math.min(Math.max(Math.floor(configured), 0), 6);
}

function isTransientGeminiStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

function retryDelay(attempt: number, response?: Response) {
  const retryAfter = response?.headers.get("retry-after")?.trim();
  if (retryAfter) {
    const seconds = Number(retryAfter);
    const retryAt = Date.parse(retryAfter);
    const requestedDelay = Number.isFinite(seconds)
      ? seconds * 1000
      : Number.isFinite(retryAt)
        ? retryAt - Date.now()
        : 0;
    if (requestedDelay > 0) return Math.min(requestedDelay, 15_000);
  }

  const exponentialDelay = Math.min(1200 * 2 ** attempt, 12_000);
  const jitter = Math.floor(Math.random() * 500);
  return exponentialDelay + jitter;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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

function buildGeminiRequest(
  rawBody: Record<string, unknown>,
  options: AcademyAICompleteOptions = {},
  streaming = false,
) {
  const body = normalizeAIRequestBody(rawBody);
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

  const modelPath = `${GEMINI_URL}/models/${encodeURIComponent(config.model)}`;
  const encodedKey = encodeURIComponent(config.apiKey);
  const requestUrl = streaming
    ? `${modelPath}:streamGenerateContent?alt=sse&key=${encodedKey}`
    : `${modelPath}:generateContent?key=${encodedKey}`;
  const requestBody = JSON.stringify({
    ...(systemText
      ? {
          systemInstruction: {
            parts: [{ text: systemText }],
          },
        }
      : {}),
    contents,
    generationConfig: {
      maxOutputTokens: body.max_tokens ?? outputTokenLimit(),
      ...(typeof body.temperature === "number"
        ? { temperature: body.temperature }
        : {}),
      ...(options.thinkingLevel
        ? { thinkingConfig: { thinkingLevel: options.thinkingLevel } }
        : {}),
      ...(body.response_format?.type === "json_schema"
        ? { responseMimeType: "application/json" }
        : {}),
    },
  });

  return {
    model: config.model,
    requestUrl,
    requestBody,
    retries: options.transientRetries ?? transientRetryLimit(),
  };
}

async function requestGemini(
  rawBody: Record<string, unknown>,
  options: AcademyAICompleteOptions = {},
  streaming = false,
) {
  const request = buildGeminiRequest(rawBody, options, streaming);
  let response: Response | null = null;

  for (let attempt = 0; attempt <= request.retries; attempt += 1) {
    try {
      response = await fetch(request.requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: request.requestBody,
      });
    } catch (error) {
      if (attempt >= request.retries) {
        console.error("[Gemini network]", {
          model: request.model,
          attempts: attempt + 1,
          message: error instanceof Error ? error.message : "Network request failed",
        });
        throw new AcademyAIError("Gemini is temporarily unavailable.");
      }
      const delay = retryDelay(attempt);
      console.warn("[Gemini retry]", {
        model: request.model,
        reason: "network",
        attempt: attempt + 1,
        retryInMs: delay,
      });
      await wait(delay);
      continue;
    }

    if (
      response.ok ||
      !isTransientGeminiStatus(response.status) ||
      attempt >= request.retries
    ) {
      break;
    }

    const delay = retryDelay(attempt, response);
    console.warn("[Gemini retry]", {
      model: request.model,
      status: response.status,
      attempt: attempt + 1,
      retryInMs: delay,
    });
    await response.text().catch(() => "");
    await wait(delay);
  }

  if (!response) {
    throw new AcademyAIError(
      "Gemini is still busy after retrying. Please wait a moment and try again.",
    );
  }

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as
      | { error?: { message?: string; status?: string; code?: number } }
      | null;
    const failureDetails = {
      status: response.status,
      model: request.model,
      code: failure?.error?.code,
      errorStatus: failure?.error?.status,
      message: failure?.error?.message,
    };
    if (isTransientGeminiStatus(response.status)) {
      console.warn("[Gemini unavailable after retries]", failureDetails);
    } else {
      console.error("[Gemini]", failureDetails);
    }
    if (response.status === 429) {
      throw new AcademyAIError("The learning AI is busy. Please wait a moment and try again.", 429);
    }
    if (response.status === 400) {
      throw new AcademyAIError("Gemini could not generate this request. Please try a narrower topic.", 400);
    }
    throw new AcademyAIError(
      "Gemini is still busy after retrying. Please wait a moment and try again.",
    );
  }

  return { response, model: request.model };
}

async function complete(
  rawBody: Record<string, unknown>,
  options: AcademyAICompleteOptions = {},
) {
  const { response, model } = await requestGemini(rawBody, options);

  const payload = await response.json();
  const usage = payload?.usageMetadata;
  if (usage) {
    console.info("[Gemini usage]", {
      model,
      inputTokens: usage.promptTokenCount ?? 0,
      outputTokens: usage.candidatesTokenCount ?? 0,
      thinkingTokens: usage.thoughtsTokenCount ?? 0,
      cachedTokens: usage.cachedContentTokenCount ?? 0,
      totalTokens: usage.totalTokenCount ?? 0,
    });
  }
  const candidate = payload?.candidates?.[0];
  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new AcademyAIError(
      options.lengthErrorMessage ??
        "The learning path was too large to finish. Please try a narrower topic or lower course detail.",
      422,
      "max_tokens",
    );
  }

  const content = candidate?.content?.parts
    ?.map((part: { text?: unknown }) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }
  return content;
}

type GeminiStreamPayload = {
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: unknown; thought?: boolean }> };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    cachedContentTokenCount?: number;
    totalTokenCount?: number;
  };
};

function parseGeminiStreamEvent(event: string) {
  const data = event
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
    .trim();
  if (!data || data === "[DONE]") return null;
  return JSON.parse(data) as GeminiStreamPayload;
}

async function* readGeminiTextStream(
  response: Response,
  model: string,
  options: AcademyAICompleteOptions,
) {
  if (!response.body) {
    throw new AcademyAIError("Gemini returned an empty response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedText = false;

  const processPayload = function* (payload: GeminiStreamPayload) {
    const usage = payload.usageMetadata;
    if (usage) {
      console.info("[Gemini usage]", {
        model,
        inputTokens: usage.promptTokenCount ?? 0,
        outputTokens: usage.candidatesTokenCount ?? 0,
        thinkingTokens: usage.thoughtsTokenCount ?? 0,
        cachedTokens: usage.cachedContentTokenCount ?? 0,
        totalTokens: usage.totalTokenCount ?? 0,
      });
    }

    const candidate = payload.candidates?.[0];
    if (candidate?.finishReason === "MAX_TOKENS") {
      throw new AcademyAIError(
        options.lengthErrorMessage ??
          "The response was too large to finish. Please request a shorter answer.",
      );
    }

    for (const part of candidate?.content?.parts ?? []) {
      if (part.thought === true || typeof part.text !== "string" || !part.text) {
        continue;
      }
      receivedText = true;
      yield part.text;
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      buffer = buffer.replace(/\r\n/g, "\n");
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const payload = parseGeminiStreamEvent(event);
        if (!payload) continue;
        yield* processPayload(payload);
      }

      if (done) break;
    }

    if (buffer.trim()) {
      const payload = parseGeminiStreamEvent(buffer);
      if (payload) yield* processPayload(payload);
    }
  } finally {
    reader.releaseLock();
  }

  if (!receivedText) {
    throw new AcademyAIError("Gemini returned an empty response stream.");
  }
}

async function openGeminiTextStream(
  rawBody: Record<string, unknown>,
  options: AcademyAICompleteOptions = {},
) {
  const { response, model } = await requestGemini(rawBody, options, true);
  return readGeminiTextStream(response, model, options);
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
    required: ["courseTitle", "courseDescription", "difficulty", "modules", "finalProject", "progressStructure", "certificateEligible"],
    properties: {
      courseTitle: stringProperty,
      courseDescription: stringProperty,
      difficulty: stringProperty,
      modules: {
        type: "array", minItems: 3, maxItems: 3,
        items: {
          type: "object", additionalProperties: false,
          required: ["title", "description", "lessons", "quiz", "assignment", "miniProject", "safetyNotes"],
          properties: {
            title: stringProperty,
            description: paragraphTextProperty,
            lessons: {
              type: "array", minItems: 2, maxItems: 2,
              items: {
                type: "object", additionalProperties: false,
                required: ["title", "goal", "videoTitle", "videoSearchQuery", "videoLearningGoal", "keyTakeaways", "notes", "practicalTask", "challenge", "expectedResult", "lessonAssessment", "safetyNotes", "estimatedTime"],
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
                  type: "array", maxItems: 0,
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

  return ensureInSystemFinalProject({
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
  });
}

export async function generateAcademyCourse(input: { prompt: string; level: string; goal: string }) {
  const buildRequest = (maxTokens: number) => ({
    temperature: 0.35,
    max_tokens: maxTokens,
    response_format: { type: "json_schema", json_schema: courseSchema },
    messages: [
      {
        role: "system",
        content: "You are Lumyn Academy's curriculum architect. Build a serious video-supported curriculum, not a generated textbook. Return a compact, immediately usable learning path and populate only the required schema fields; omit optional properties so the learner receives the path quickly. The AI's job is to design the learning sequence, create precise YouTube search targets, add concise notes, set practical work, and assess lesson understanding. Each lesson must have a specific videoTitle, videoSearchQuery, videoLearningGoal, keyTakeaways, compact notes, a practical task, and a short lessonAssessment. Use YouTube search queries likely to surface strong educational videos from reputable, topic-appropriate channels. Do not invent exact YouTube URLs or claim a video exists at a specific URL. Lesson titles must be concrete learning milestones, such as 'Build Your First Page Structure' instead of 'HTML Basics'. For each module, return a descriptive quiz title and an empty questions array; Lumyn generates the full technical assessment just before the learner reaches it. Every practical task, assignment, mini project, and final project must be completed entirely inside Lumyn Academy's built-in workspace using self-contained files, preview or terminal evidence, and in-system notes. Never require or suggest a local editor, external sandbox, GitHub repository, deployment, hosted demo, cloud account, or pasted project URL. For cybersecurity, all offensive techniques must be limited to owned, authorized, or simulated labs and must include appropriate safety boundaries. The courseDescription must be a complete sentence explaining that the path uses curated video study, practice tasks, assessments, and a final project. Never include external URLs, require attacking real systems, or claim a certificate has already been earned.",
      },
      { role: "user", content: `Learning request: ${input.prompt}\nCurrent level: ${input.level}\nDesired outcome: ${input.goal}` },
    ],
  });
  const tokenLimit = courseOutputTokenLimit();
  let content: string;

  try {
    content = await complete(buildRequest(tokenLimit), {
      transientRetries: 3,
      thinkingLevel: "minimal",
      lengthErrorMessage:
        "Lumyn needs a larger response budget to finish this path.",
    });
  } catch (error) {
    if (!(error instanceof AcademyAIError) || error.reason !== "max_tokens") {
      throw error;
    }

    const recoveryTokenLimit = Math.min(
      Math.max(Math.ceil(tokenLimit * 1.5), tokenLimit + 6_000),
      16_000,
    );
    console.warn("[Gemini course overflow recovery]", {
      model: GEMINI_MODEL,
      previousTokenLimit: tokenLimit,
      recoveryTokenLimit,
    });
    try {
      content = await complete(buildRequest(recoveryTokenLimit), {
        transientRetries: 3,
        thinkingLevel: "minimal",
        lengthErrorMessage:
          "Lumyn is automatically restructuring this learning path.",
      });
    } catch (recoveryError) {
      if (
        recoveryError instanceof AcademyAIError &&
        recoveryError.reason === "max_tokens"
      ) {
        throw new AcademyAIError(
          "Lumyn is automatically restructuring this learning path.",
          503,
          "max_tokens",
        );
      }
      throw recoveryError;
    }
  }
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
  const content = await complete(
    {
      temperature: 0.25,
      max_tokens: 4000,
      response_format: { type: "json_schema", json_schema: moduleQuizSchema },
      messages: [
        {
          role: "system",
          content:
            "You prepare Lumyn Academy module quizzes. Generate only a rigorous technical multiple-choice assessment for the provided module. The quiz must contain at least 10 questions. Every question must test concrete module knowledge: concepts, syntax, debugging choices, expected outputs, tradeoffs, edge cases, or implementation decisions. Do not ask effort, motivation, reflection, submission, evidence, or generic learning-process questions. Use four plausible options per question, exactly one correct answer, and a concise explanation. Return only valid JSON.",
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
    },
    { thinkingLevel: "minimal", transientRetries: 4 },
  );

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

type AcademyTutorInput = {
  course: GeneratedCourse;
  moduleIndex: number;
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  studentName?: string;
};

function academyTutorRequest(input: AcademyTutorInput) {
  const courseModule = input.course.modules[input.moduleIndex];
  if (!courseModule) throw new Error("The selected module does not exist.");
  const studentName = input.studentName?.trim();

  return {
    body: {
      temperature: 0.25,
      max_tokens: 1600,
      messages: [
        {
          role: "system",
          content: `You are ${ACADEMY_TUTOR_NAME}, the student's adaptive ${ACADEMY_TUTOR_ROLE}, for "${input.course.courseTitle}". They are studying "${courseModule.title}". ${studentName ? `Address the student naturally as ${studentName}, but do not overuse their name.` : "Address the student warmly and directly."}

Act like a patient coach, not an answer machine. Keep responses compact and interactive:
- For explanations, use one plain-language idea, one concrete example, then one quick check question.
- When asked for a hint, use a three-level hint ladder and give only the first useful hint unless the student asks for more.
- When asked to be quizzed, ask exactly one question at a time and wait for the student's answer before giving feedback.
- If the learner is wrong, identify the misconception without shaming them and let them retry.
- If asked what to do next, recommend one small action from the current module that can be finished in 10–15 minutes.
- Prefer recall and application over passive summaries. Use short paragraphs, bullets, and occasional numbered steps.
- Keep the response under 220 words unless the student explicitly requests code or a deeper explanation.

Do not complete graded assignments, perform unsafe actions, or reveal quiz answer keys. If the topic is cybersecurity, keep guidance inside authorized labs, simulations, and defensive learning.

Lesson material:
${courseModule.lessons.map((lesson) => `${lesson.title}\nNotes: ${lesson.notes}\nConcept: ${lesson.conceptExplanation ?? ""}\nWhy it matters: ${lesson.whyItMatters ?? ""}\nLab: ${(lesson.stepByStepLab ?? []).join(" | ")}\nDeliverables: ${(lesson.deliverables ?? []).join(" | ")}\nSafety: ${lesson.safetyNotes ?? ""}`).join("\n\n")}`,
        },
        ...input.history.slice(-6),
        { role: "user", content: input.message },
      ],
    },
    options: {
      thinkingLevel: "minimal",
      transientRetries: 2,
      lengthErrorMessage: `${ACADEMY_TUTOR_NAME}'s answer was cut short. Please ask again or request a shorter explanation.`,
    } satisfies AcademyAICompleteOptions,
  };
}

export async function askAcademyTutor(input: AcademyTutorInput) {
  const request = academyTutorRequest(input);
  return complete(request.body, request.options);
}

export async function openAcademyTutorStream(input: AcademyTutorInput) {
  const request = academyTutorRequest(input);
  return openGeminiTextStream(request.body, request.options);
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
            "You are a strict but constructive software education assessor. Return only the requested compact JSON. Keep summary, strengths, and improvements brief. Evaluate only the Lumyn Academy workspace files, built-in preview or terminal evidence, and in-system notes present in the submission. External project, repository, deployment, and demo links are forbidden and must never count as evidence. Require a clear explanation of the implementation, relevant workspace file details, and how each requested deliverable was met. Set passed=true only for a score of 70 or higher.",
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
