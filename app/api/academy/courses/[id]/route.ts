import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { recalculateCourseProgress } from "@/lib/academy-progress";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { AcademyAIError, evaluateAcademySubmission, generateAcademyModuleQuiz } from "@/lib/academy-ai";
import {
  ensureModulePractice,
  ensureModuleQuizQuestions,
  MIN_MODULE_QUIZ_QUESTIONS,
  type GeneratedCourse,
  type LearningCursor,
} from "@/lib/academy";
import AcademyCourse from "@/models/AcademyCourse";

type RouteContext = { params: Promise<{ id: string }> };

function evidenceLength(content: string) {
  return content
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim().length;
}

function moduleCompletionMessage(moduleTitle: string, moduleIndex: number) {
  const messages = [
    `Clean win. ${moduleTitle} is now in your toolkit.`,
    `Module ${moduleIndex + 1} cleared. That is real momentum.`,
    `Nice work. You turned ${moduleTitle} from theory into practice.`,
    `Checkpoint unlocked. ${moduleTitle} is complete.`,
  ];
  return messages[moduleIndex % messages.length];
}

function applyCourseLearningGuards(course: GeneratedCourse) {
  course.modules.forEach((module, index) => {
    Object.assign(module, ensureModulePractice(module));
    module.quiz = {
      ...(module.quiz ?? {
        title: `${module.title || `Module ${index + 1}`} assessment`,
      }),
      questions: ensureModuleQuizQuestions(module),
    };
  });
}

function normaliseLearningCursor(
  body: {
    moduleIndex?: number;
    lessonIndex?: number;
    step?: LearningCursor["step"];
    section?: LearningCursor["section"];
  },
  course: { modules: Array<{ lessons?: unknown[] }> },
  updatedAt = new Date().toISOString(),
): LearningCursor | null {
  if (
    body.step !== "lessons" &&
    body.step !== "quiz" &&
    body.step !== "assignment" &&
    body.step !== "final_project"
  ) {
    return null;
  }

  if (body.step === "final_project") {
    return {
      step: "final_project",
      section: body.section ?? "overview",
      updatedAt,
    };
  }

  const moduleIndex = Number(body.moduleIndex);
  const learningModule = course.modules[moduleIndex];
  if (!Number.isInteger(moduleIndex) || moduleIndex < 0 || !learningModule) {
    return null;
  }

  const lessonIndex = Number(body.lessonIndex ?? 0);
  if (
    body.step === "lessons" &&
    (!Number.isInteger(lessonIndex) ||
      lessonIndex < 0 ||
      !learningModule.lessons?.[lessonIndex])
  ) {
    return null;
  }

  return {
    moduleIndex,
    lessonIndex: body.step === "lessons" ? lessonIndex : undefined,
    step: body.step,
    section: body.section ?? "overview",
    updatedAt,
  };
}

function nextCursorAfterStep(
  course: {
    modules: Array<{
      lessons: Array<{ completionStatus?: string }>;
    }>;
  },
  moduleIndex: number,
  lessonIndex: number,
): LearningCursor {
  const nextLessonIndex = lessonIndex + 1;
  const learningModule = course.modules[moduleIndex];
  if (learningModule?.lessons[nextLessonIndex]) {
    return {
      moduleIndex,
      lessonIndex: nextLessonIndex,
      step: "lessons",
      section: "overview",
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    moduleIndex,
    step: "quiz",
    section: "overview",
    updatedAt: new Date().toISOString(),
  };
}

function nextCursorAfterModule(course: { modules: unknown[] }, moduleIndex: number): LearningCursor {
  const nextModuleIndex = moduleIndex + 1;
  if (course.modules[nextModuleIndex]) {
    return {
      moduleIndex: nextModuleIndex,
      lessonIndex: 0,
      step: "lessons",
      section: "overview",
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    step: "final_project",
    section: "overview",
    updatedAt: new Date().toISOString(),
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const course = await AcademyCourse.findOne({ _id: id, studentUid: decoded.uid });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const body = await request.json() as {
      action?: "lesson" | "quiz" | "repair_quiz" | "assignment" | "final_project" | "archive" | "cursor";
      moduleIndex?: number;
      lessonIndex?: number;
      completed?: boolean;
      answers?: number[];
      content?: string;
      step?: LearningCursor["step"];
      section?: LearningCursor["section"];
    };

    if (body.action === "cursor") {
      const learningCursor = normaliseLearningCursor(body, course.course);
      if (!learningCursor) {
        return NextResponse.json({ error: "Learning position is not available." }, { status: 400 });
      }

      course.learningCursor = learningCursor;
      course.markModified("learningCursor");
      await course.save();

      return NextResponse.json({
        success: true,
        learningCursor: course.learningCursor,
      });
    }

    const moduleIndex = Number(body.moduleIndex);
    const learningModule = course.course.modules[moduleIndex];
    const previousModuleStatus = learningModule?.completionStatus;
    if (learningModule) {
      Object.assign(learningModule, ensureModulePractice(learningModule));
    }

    if (body.action === "archive") {
      course.status = "archived";
    } else if (!learningModule && body.action !== "final_project") {
      return NextResponse.json({ error: "Module not found." }, { status: 400 });
    } else if (body.action === "lesson") {
      const lesson = learningModule.lessons[Number(body.lessonIndex)];
      if (!lesson || learningModule.completionStatus === "locked") {
        return NextResponse.json({ error: "Lesson is not available." }, { status: 400 });
      }
      lesson.completionStatus = body.completed === false ? "not_started" : "completed";
      if (body.completed !== false) {
        course.activityLog.push({ action: "lesson_completed", createdAt: new Date().toISOString() });
        course.learningCursor = nextCursorAfterStep(course.course, moduleIndex, Number(body.lessonIndex));
      } else {
        course.learningCursor = {
          moduleIndex,
          lessonIndex: Number(body.lessonIndex),
          step: "lessons",
          section: "overview",
          updatedAt: new Date().toISOString(),
        };
      }
    } else if (body.action === "repair_quiz") {
      if (learningModule.completionStatus === "locked") {
        return NextResponse.json({ error: "Quiz repair is not available for locked modules." }, { status: 400 });
      }
      const repairedQuiz = await generateAcademyModuleQuiz({
        courseTitle: course.course.courseTitle,
        moduleTitle: learningModule.title,
        moduleDescription: learningModule.description,
        lessons: learningModule.lessons.map((lesson) => ({
          title: lesson.title,
          goal: lesson.goal,
          notes: lesson.notes,
          practicalTask: lesson.practicalTask,
          keyTakeaways: lesson.keyTakeaways,
          tests: lesson.tests,
        })),
      });
      learningModule.quiz = repairedQuiz;
      course.learningCursor = {
        moduleIndex,
        step: "quiz",
        section: "overview",
        updatedAt: new Date().toISOString(),
      };
    } else if (body.action === "quiz") {
      if (learningModule.completionStatus === "locked" || !Array.isArray(body.answers)) {
        return NextResponse.json({ error: "Quiz is not available." }, { status: 400 });
      }
      const questions = ensureModuleQuizQuestions(learningModule);
      learningModule.quiz.questions = questions;
      if (questions.length < MIN_MODULE_QUIZ_QUESTIONS) {
        return NextResponse.json({
          error: `Repair this assessment for free to use AI-generated graded quizzes with at least ${MIN_MODULE_QUIZ_QUESTIONS} questions.`,
        }, { status: 400 });
      }
      const correct = questions.reduce(
        (total, question, index) => total + (body.answers?.[index] === question.correctAnswerIndex ? 1 : 0),
        0
      );
      const score = Math.round((correct / questions.length) * 100);
      const attempt = {
        moduleIndex,
        answers: body.answers,
        score,
        passed: score >= 70,
        completedAt: new Date().toISOString(),
      };
      course.quizAttempts.push(attempt);
      course.activityLog.push({ action: "quiz_completed", createdAt: attempt.completedAt });
      course.learningCursor = {
        moduleIndex,
        step: attempt.passed ? "assignment" : "quiz",
        section: "overview",
        updatedAt: attempt.completedAt,
      };
      sendAcademyEmail({
        event: "quiz_completion",
        to: student.email,
        details: `${learningModule.quiz.title}: ${score}% (${attempt.passed ? "passed" : "try again"}).`,
      }).catch((error) => console.error("[academy quiz email]", error));
    } else if (body.action === "assignment") {
      const content = body.content?.trim();
      if (!content || evidenceLength(content) < 80) {
        return NextResponse.json({
          error: "A link alone cannot be assessed. Explain what you built, how it meets each requirement, and include relevant code or file details.",
        }, { status: 400 });
      }
      const evaluation = await evaluateAcademySubmission({
        courseTitle: course.course.courseTitle,
        task: `${learningModule.assignment}\nMini project: ${learningModule.miniProject}`,
        submission: content,
        kind: "assignment",
      });
      const existing = course.assignmentSubmissions.find((item) => item.moduleIndex === moduleIndex);
      const submission = {
        moduleIndex,
        content,
        status: evaluation.passed ? "submitted" as const : "needs_revision" as const,
        submittedAt: new Date().toISOString(),
        evaluation,
      };
      if (existing) Object.assign(existing, submission);
      else course.assignmentSubmissions.push(submission);
      if (evaluation.passed) {
        course.activityLog.push({ action: "assignment_submitted", createdAt: submission.submittedAt });
        course.learningCursor = nextCursorAfterModule(course.course, moduleIndex);
      } else {
        course.learningCursor = {
          moduleIndex,
          step: "assignment",
          section: "submission",
          updatedAt: submission.submittedAt,
        };
      }
    } else if (body.action === "final_project") {
      const content = body.content?.trim();
      if (!content || evidenceLength(content) < 120) {
        return NextResponse.json({
          error: "Describe the implementation, decisions, completed requirements, and evidence. A repository or demo link alone is not enough.",
        }, { status: 400 });
      }
      const evaluation = await evaluateAcademySubmission({
        courseTitle: course.course.courseTitle,
        task: course.course.finalProject,
        submission: content,
        kind: "final_project",
      });
      course.finalProjectSubmission = {
        content,
        status: evaluation.passed ? "submitted" : "needs_revision",
        submittedAt: new Date().toISOString(),
        evaluation,
      };
      if (evaluation.passed) {
        course.activityLog.push({ action: "final_project_submitted", createdAt: course.finalProjectSubmission.submittedAt });
      }
      course.learningCursor = {
        step: "final_project",
        section: "submission",
        updatedAt: course.finalProjectSubmission.submittedAt,
      };
    } else {
      return NextResponse.json({ error: "Unknown progress action." }, { status: 400 });
    }

    const wasCertified = Boolean(course.certificate);
    applyCourseLearningGuards(course.course);
    course.markModified("course");
    course.markModified("learningCursor");
    recalculateCourseProgress(course);
    const moduleJustCompleted =
      learningModule &&
      previousModuleStatus !== "completed" &&
      learningModule.completionStatus === "completed";
    if (course.status === "completed" && course.course.certificateEligible && !course.certificate) {
      course.certificate = {
        certificateId: `LUMYN-${randomUUID().slice(0, 8).toUpperCase()}`,
        issuedAt: new Date().toISOString(),
        certificateName: student.certificateName?.trim() || student.name?.trim() || undefined,
      };
    }
    await course.save();

    if (!wasCertified && course.certificate) {
      sendAcademyEmail({
        event: "certificate_issued",
        to: student.email,
        details: `Your certificate for ${course.course.courseTitle} has been issued.`,
      }).catch((error) => console.error("[academy certificate email]", error));
    }

    return NextResponse.json({
      success: true,
      course: course.course,
      status: course.status,
      progressPercent: course.progressPercent,
      quizAttempts: course.quizAttempts,
      assignmentSubmissions: course.assignmentSubmissions,
      finalProjectSubmission: course.finalProjectSubmission,
      learningCursor: course.learningCursor,
      certificate: course.certificate
        ? {
            ...course.certificate,
            certificateName:
              course.certificate.certificateName?.trim() ||
              student.certificateName?.trim() ||
              student.name?.trim() ||
              undefined,
          }
        : course.certificate,
      activityLog: course.activityLog,
      moduleCelebration: moduleJustCompleted
        ? {
            title: learningModule.title,
            message: moduleCompletionMessage(learningModule.title, moduleIndex),
            xp: 300,
          }
        : undefined,
    });
  } catch (error) {
    console.error("[PATCH /api/academy/courses/:id]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof AcademyAIError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not save learning progress." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded } = await getVerifiedAcademyStudent(request);
    const deleted = await AcademyCourse.findOneAndDelete({
      _id: id,
      studentUid: decoded.uid,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedCourseId: id });
  } catch (error) {
    console.error("[DELETE /api/academy/courses/:id]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not delete this course." }, { status: 500 });
  }
}
