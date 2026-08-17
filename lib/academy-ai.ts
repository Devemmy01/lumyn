import {
  ACADEMY_TUTOR_NAME,
  ACADEMY_TUTOR_ROLE,
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
      throw new AcademyAIError("Gemini could not generate this request. Please try again.", 400);
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
        "The response was too large to finish. Please try a shorter request.",
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
- If asked what to do next, recommend one small action from the current module that can be finished in 10 to 15 minutes.
- Prefer recall and application over passive summaries. Use short paragraphs, bullets, and occasional numbered steps.
- Keep the response under 220 words unless the student explicitly requests code or a deeper explanation.
- Never use em dashes or en dashes (—, –) in your responses. Use periods, commas, or colons instead.

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
