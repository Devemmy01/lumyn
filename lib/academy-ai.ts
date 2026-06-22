import type { GeneratedCourse, GeneratedQuizQuestion, SubmissionEvaluation } from "@/lib/academy";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export class AcademyAIError extends Error {
  constructor(message: string, public readonly status: number = 503) {
    super(message);
    this.name = "AcademyAIError";
  }
}

function config() {
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPEN_ROUTER_KEY;
  if (!apiKey) throw new Error("OpenRouter is not configured.");
  return { apiKey, model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini" };
}

async function complete(body: Record<string, unknown>) {
  const { apiKey, model } = config();
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
      "X-Title": "Lumyn Academy",
    },
    body: JSON.stringify({ model, ...body }),
  });

  if (!response.ok) {
    const failure = await response.json().catch(() => null) as
      | { error?: { message?: string; code?: number } }
      | null;
    console.error("[OpenRouter]", {
      status: response.status,
      code: failure?.error?.code,
      message: failure?.error?.message,
    });
    if (response.status === 402) {
      throw new AcademyAIError(
        "AI generation credits are currently insufficient. Please top up the OpenRouter balance and try again.",
        503
      );
    }
    if (response.status === 429) {
      throw new AcademyAIError("The learning AI is busy. Please wait a moment and try again.", 429);
    }
    throw new AcademyAIError("The learning AI is temporarily unavailable.");
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The learning AI returned an empty response.");
  }
  return content;
}

const stringProperty = { type: "string" } as const;
const courseSchema = {
  name: "academy_course",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["courseTitle", "courseDescription", "difficulty", "modules", "finalProject", "progressStructure", "certificateEligible"],
    properties: {
      courseTitle: stringProperty,
      courseDescription: stringProperty,
      difficulty: stringProperty,
      modules: {
        type: "array", minItems: 4, maxItems: 8,
        items: {
          type: "object", additionalProperties: false,
          required: ["title", "description", "lessons", "quiz", "assignment", "miniProject"],
          properties: {
            title: stringProperty,
            description: stringProperty,
            lessons: {
              type: "array", minItems: 2, maxItems: 4,
              items: {
                type: "object", additionalProperties: false,
                required: ["title", "notes", "practicalTask", "realWorldExample", "codeExample", "visualAid"],
                properties: {
                  title: stringProperty,
                  notes: stringProperty,
                  practicalTask: stringProperty,
                  realWorldExample: {
                    type: "object", additionalProperties: false,
                    required: ["title", "scenario", "takeaway"],
                    properties: { title: stringProperty, scenario: stringProperty, takeaway: stringProperty },
                  },
                  codeExample: {
                    type: "object", additionalProperties: false,
                    required: ["language", "code", "explanation"],
                    properties: { language: stringProperty, code: stringProperty, explanation: stringProperty },
                  },
                  visualAid: {
                    type: "object", additionalProperties: false,
                    required: ["title", "type", "items"],
                    properties: {
                      title: stringProperty,
                      type: { type: "string", enum: ["flow", "comparison", "sequence"] },
                      items: { type: "array", minItems: 2, maxItems: 5, items: stringProperty },
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
                  type: "array", minItems: 3, maxItems: 6,
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
            assignment: stringProperty,
            miniProject: stringProperty,
          },
        },
      },
      finalProject: stringProperty,
      progressStructure: { type: "array", minItems: 3, items: stringProperty },
      certificateEligible: { type: "boolean" },
    },
  },
};

function isQuestion(value: unknown): value is GeneratedQuizQuestion {
  if (!value || typeof value !== "object") return false;
  const question = value as Record<string, unknown>;
  return typeof question.question === "string" &&
    Array.isArray(question.options) && question.options.length === 4 &&
    question.options.every((option) => typeof option === "string") &&
    Number.isInteger(question.correctAnswerIndex) && Number(question.correctAnswerIndex) >= 0 &&
    Number(question.correctAnswerIndex) < 4 && typeof question.explanation === "string";
}

function parseCourse(content: string): GeneratedCourse {
  const parsed = JSON.parse(content) as Partial<GeneratedCourse>;
  if (!parsed.courseTitle || !parsed.courseDescription || !parsed.difficulty ||
      !Array.isArray(parsed.modules) || !parsed.modules.length || !parsed.finalProject ||
      !Array.isArray(parsed.progressStructure)) {
    throw new Error("The learning AI returned an invalid course.");
  }

  const modules = parsed.modules.map((module, moduleIndex) => {
    if (!module?.title || !Array.isArray(module.lessons) || !module.lessons.length ||
        !module.quiz || !Array.isArray(module.quiz.questions) ||
        !module.quiz.questions.every(isQuestion)) {
      throw new Error("The learning AI returned an invalid module.");
    }
    return {
      ...module,
      completionStatus: moduleIndex === 0 ? "in_progress" as const : "locked" as const,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        completionStatus: moduleIndex === 0 && lessonIndex === 0 ? "in_progress" as const : "not_started" as const,
      })),
    };
  });

  return {
    courseTitle: parsed.courseTitle,
    courseDescription: parsed.courseDescription,
    difficulty: parsed.difficulty,
    modules,
    finalProject: parsed.finalProject,
    progressStructure: parsed.progressStructure,
    certificateEligible: parsed.certificateEligible !== false,
  };
}

export async function generateAcademyCourse(input: { prompt: string; level: string; goal: string }) {
  const content = await complete({
    temperature: 0.35,
    max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS ?? 8000),
    response_format: { type: "json_schema", json_schema: courseSchema },
    messages: [
      {
        role: "system",
        content: "You are Lumyn Academy's curriculum architect. Create a rigorous, practical, self-contained learning path. Every lesson must teach in clear prose, include a relatable real-world scenario, a concise runnable or illustrative code example, and a simple visual flow/comparison/sequence. Use HTML/CSS/JavaScript examples when the topic is web development so the built-in playground can run them. Quizzes must be answerable from the lessons. Assignments and the final project must define concrete deliverables that can be evaluated. Never include URLs or claim a certificate has already been earned.",
      },
      { role: "user", content: `Learning request: ${input.prompt}\nCurrent level: ${input.level}\nDesired outcome: ${input.goal}` },
    ],
  });
  return parseCourse(content);
}

export async function askAcademyTutor(input: {
  course: GeneratedCourse;
  moduleIndex: number;
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}) {
  const courseModule = input.course.modules[input.moduleIndex];
  if (!courseModule) throw new Error("The selected module does not exist.");

  return complete({
    temperature: 0.25,
    max_tokens: 900,
    messages: [
      {
        role: "system",
        content: `You are the student's Lumyn Academy tutor for "${input.course.courseTitle}". They are studying "${courseModule.title}". Explain clearly and give compact examples. Do not complete graded assignments or reveal quiz answer keys. Lesson material:\n${courseModule.lessons.map((lesson) => `${lesson.title}: ${lesson.notes}`).join("\n\n")}`,
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

export async function evaluateAcademySubmission(input: {
  courseTitle: string;
  task: string;
  submission: string;
  kind: "assignment" | "final_project";
}): Promise<SubmissionEvaluation> {
  const content = await complete({
    temperature: 0.1,
    max_tokens: 1200,
    response_format: { type: "json_schema", json_schema: submissionEvaluationSchema },
    messages: [
      {
        role: "system",
        content: "You are a strict but constructive software education assessor. Evaluate only evidence actually present in the submission. A URL alone is never proof of satisfying the requirements. Require a clear explanation of the implementation, relevant code/file details, and how each requested deliverable was met. Set passed=true only for a score of 70 or higher. Do not invent facts about linked websites you cannot inspect.",
      },
      {
        role: "user",
        content: `Course: ${input.courseTitle}\nAssessment type: ${input.kind}\nTask: ${input.task}\nStudent submission:\n${input.submission}`,
      },
    ],
  });
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
