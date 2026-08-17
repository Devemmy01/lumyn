import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { hydrateCourseForEnrollment } from "@/lib/academy-catalog";
import { maybeAutoIssueCertificate } from "@/lib/academy-certificates";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { AcademyAIError, evaluateAcademySubmission } from "@/lib/academy-ai";
import { awardBadge, awardXp, recordActivity } from "@/lib/academy-gamification";
import { containsExternalProjectLink, type LearningCursor } from "@/lib/academy";
import { recalculateEnrollmentProgress } from "@/lib/academy-progress";
import connectDB from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";
import AcademyEnrollment from "@/models/AcademyEnrollment";

type RouteContext = { params: Promise<{ id: string }> };

function evidenceLength(content: string) {
  return content
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim().length;
}

function projectNarrative(content: string) {
  return content.split(/\n\nCode workspace:\s*/i, 1)[0] ?? "";
}

function hasAcademyWorkspaceEvidence(content: string) {
  const workspace = content.match(/(?:^|\n\n)Code workspace:\s*([\s\S]+)$/i)?.[1];
  return Boolean(workspace && /(?:^|\n)File:\s*[^\n]+\n```/i.test(workspace));
}

function validateInSystemProject(content: string) {
  if (!hasAcademyWorkspaceEvidence(content)) {
    return "Build and submit the project using the Lumyn Academy workspace files. External work cannot be assessed.";
  }
  if (containsExternalProjectLink(projectNarrative(content))) {
    return "External project, repository, deployment, and demo links are not accepted. Submit only the files, preview evidence, terminal evidence, and notes created inside Lumyn Academy.";
  }
  return null;
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
    return { step: "final_project", section: body.section ?? "overview", updatedAt };
  }

  const moduleIndex = Number(body.moduleIndex);
  const learningModule = course.modules[moduleIndex];
  if (!Number.isInteger(moduleIndex) || moduleIndex < 0 || !learningModule) {
    return null;
  }

  const lessonIndex = Number(body.lessonIndex ?? 0);
  if (
    body.step === "lessons" &&
    (!Number.isInteger(lessonIndex) || lessonIndex < 0 || !learningModule.lessons?.[lessonIndex])
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
  course: { modules: Array<{ lessons: Array<{ completionStatus?: string }> }> },
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

  return { moduleIndex, step: "quiz", section: "overview", updatedAt: new Date().toISOString() };
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

  return { step: "final_project", section: "overview", updatedAt: new Date().toISOString() };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const enrollment = await AcademyEnrollment.findOne({ _id: id, studentUid: decoded.uid });
    if (!enrollment) return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });

    const catalogCourse = await AcademyCatalogCourse.findById(enrollment.catalogCourseId).lean();
    if (!catalogCourse?.content) {
      return NextResponse.json({ error: "Course content is not available." }, { status: 404 });
    }

    const hydrated = hydrateCourseForEnrollment(catalogCourse.content, enrollment);
    recalculateEnrollmentProgress(hydrated, enrollment);

    return NextResponse.json({
      success: true,
      id: enrollment._id.toString(),
      slug: enrollment.catalogCourseSlug,
      course: hydrated,
      status: enrollment.status,
      progressPercent: enrollment.progressPercent,
      quizAttempts: enrollment.quizAttempts,
      assignmentSubmissions: enrollment.assignmentSubmissions,
      finalProjectSubmission: enrollment.finalProjectSubmission,
      learningCursor: enrollment.learningCursor,
      certificate: enrollment.certificate
        ? {
            ...enrollment.certificate,
            certificateName:
              enrollment.certificate.certificateName?.trim() ||
              student.certificateName?.trim() ||
              student.name?.trim() ||
              undefined,
          }
        : enrollment.certificate,
      activityLog: enrollment.activityLog,
      tutorMessages: enrollment.tutorMessages,
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/academy/enrollments/:id]", error);
    return NextResponse.json({ error: "Could not load this course." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const enrollment = await AcademyEnrollment.findOne({ _id: id, studentUid: decoded.uid });
    if (!enrollment) return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });

    const catalogCourse = await AcademyCatalogCourse.findById(enrollment.catalogCourseId).lean();
    if (!catalogCourse?.content) {
      return NextResponse.json({ error: "Course content is not available." }, { status: 404 });
    }

    const body = (await request.json()) as {
      action?: "lesson" | "quiz" | "assignment" | "final_project" | "archive" | "cursor";
      moduleIndex?: number;
      lessonIndex?: number;
      completed?: boolean;
      answers?: number[];
      content?: string;
      step?: LearningCursor["step"];
      section?: LearningCursor["section"];
    };

    const hydrated = hydrateCourseForEnrollment(catalogCourse.content, enrollment);

    if (body.action === "cursor") {
      const learningCursor = normaliseLearningCursor(body, hydrated);
      if (!learningCursor) {
        return NextResponse.json({ error: "Learning position is not available." }, { status: 400 });
      }
      enrollment.learningCursor = learningCursor;
      enrollment.markModified("learningCursor");
      await enrollment.save();
      return NextResponse.json({ success: true, learningCursor: enrollment.learningCursor });
    }

    const moduleIndex = Number(body.moduleIndex);
    const learningModule = hydrated.modules[moduleIndex];
    let xpAwarded = 0;
    let moduleJustCompleted = false;
    const newBadgeIds: string[] = [];

    if (body.action === "archive") {
      enrollment.status = "archived";
    } else if (!learningModule && body.action !== "final_project") {
      return NextResponse.json({ error: "Module not found." }, { status: 400 });
    } else if (body.action === "lesson") {
      const lessonIndex = Number(body.lessonIndex);
      const lesson = learningModule.lessons[lessonIndex];
      if (!lesson) {
        return NextResponse.json({ error: "Lesson is not available." }, { status: 400 });
      }
      const alreadyCompleted = enrollment.lessonCompletions.some(
        (item) => item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex,
      );
      if (body.completed === false) {
        enrollment.lessonCompletions = enrollment.lessonCompletions.filter(
          (item) => !(item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex),
        );
        enrollment.learningCursor = {
          moduleIndex,
          lessonIndex,
          step: "lessons",
          section: "overview",
          updatedAt: new Date().toISOString(),
        };
      } else {
        if (!alreadyCompleted) {
          enrollment.lessonCompletions.push({
            moduleIndex,
            lessonIndex,
            completedAt: new Date().toISOString(),
          });
          lesson.completionStatus = "completed";
          enrollment.activityLog.push({ action: "lesson_completed", createdAt: new Date().toISOString() });
          xpAwarded += 50;
        }
        enrollment.learningCursor = nextCursorAfterStep(hydrated, moduleIndex, lessonIndex);
      }
      enrollment.markModified("lessonCompletions");
    } else if (body.action === "quiz") {
      if (!Array.isArray(body.answers)) {
        return NextResponse.json({ error: "Quiz is not available." }, { status: 400 });
      }
      const questions = learningModule.quiz?.questions ?? [];
      if (!questions.length) {
        return NextResponse.json({ error: "This module's quiz is not available yet." }, { status: 400 });
      }
      const correct = questions.reduce(
        (total, question, index) => total + (body.answers?.[index] === question.correctAnswerIndex ? 1 : 0),
        0,
      );
      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= 70;
      const alreadyPassed = enrollment.quizAttempts.some((a) => a.moduleIndex === moduleIndex && a.passed);
      const attempt = { moduleIndex, answers: body.answers, score, passed, completedAt: new Date().toISOString() };
      enrollment.quizAttempts.push(attempt);
      enrollment.activityLog.push({ action: "quiz_completed", createdAt: attempt.completedAt });
      enrollment.learningCursor = {
        moduleIndex,
        step: passed ? "assignment" : "quiz",
        section: "overview",
        updatedAt: attempt.completedAt,
      };
      if (passed && !alreadyPassed) xpAwarded += 100;
      if (score >= 100) {
        const result = await awardBadge(decoded.uid, "quiz_perfectionist", enrollment.catalogCourseSlug);
        if (result.awarded) newBadgeIds.push("quiz_perfectionist");
      }
      sendAcademyEmail({
        event: "quiz_completion",
        to: student.email,
        details: `${learningModule.quiz.title}: ${score}% (${passed ? "passed" : "try again"}).`,
      }).catch((error) => console.error("[academy quiz email]", error));
    } else if (body.action === "assignment") {
      const content = body.content?.trim();
      const projectError = content ? validateInSystemProject(content) : null;
      if (projectError) return NextResponse.json({ error: projectError }, { status: 400 });
      if (!content || evidenceLength(content) < 80) {
        return NextResponse.json(
          { error: "Build the assignment in the Academy workspace and include enough file and preview evidence for assessment." },
          { status: 400 },
        );
      }
      const evaluation = await evaluateAcademySubmission({
        courseTitle: hydrated.courseTitle,
        task: `${learningModule.assignment}\nMini project: ${learningModule.miniProject}`,
        submission: content,
        kind: "assignment",
      });
      const alreadyPassed = enrollment.assignmentSubmissions.some(
        (item) => item.moduleIndex === moduleIndex && item.status !== "needs_revision",
      );
      const existing = enrollment.assignmentSubmissions.find((item) => item.moduleIndex === moduleIndex);
      const submission = {
        moduleIndex,
        content,
        status: evaluation.passed ? ("submitted" as const) : ("needs_revision" as const),
        submittedAt: new Date().toISOString(),
        evaluation,
      };
      if (existing) Object.assign(existing, submission);
      else enrollment.assignmentSubmissions.push(submission);
      if (evaluation.passed) {
        enrollment.activityLog.push({ action: "assignment_submitted", createdAt: submission.submittedAt });
        enrollment.learningCursor = nextCursorAfterModule(hydrated, moduleIndex);
        if (!alreadyPassed) xpAwarded += 150;
      } else {
        enrollment.learningCursor = {
          moduleIndex,
          step: "assignment",
          section: "submission",
          updatedAt: submission.submittedAt,
        };
      }
    } else if (body.action === "final_project") {
      const content = body.content?.trim();
      const projectError = content ? validateInSystemProject(content) : null;
      if (projectError) return NextResponse.json({ error: projectError }, { status: 400 });
      if (!content || evidenceLength(content) < 120) {
        return NextResponse.json(
          { error: "Build the capstone in the Academy workspace and include enough file, preview, and implementation evidence for assessment." },
          { status: 400 },
        );
      }
      const alreadyPassed = enrollment.finalProjectSubmission?.status === "submitted";
      const evaluation = await evaluateAcademySubmission({
        courseTitle: hydrated.courseTitle,
        task: hydrated.finalProject,
        submission: content,
        kind: "final_project",
      });
      enrollment.finalProjectSubmission = {
        content,
        status: evaluation.passed ? "submitted" : "needs_revision",
        submittedAt: new Date().toISOString(),
        evaluation,
      };
      if (evaluation.passed) {
        enrollment.activityLog.push({ action: "final_project_submitted", createdAt: enrollment.finalProjectSubmission.submittedAt });
        if (!alreadyPassed) xpAwarded += 350;
      }
      enrollment.learningCursor = {
        step: "final_project",
        section: "submission",
        updatedAt: enrollment.finalProjectSubmission.submittedAt,
      };
    } else {
      return NextResponse.json({ error: "Unknown progress action." }, { status: 400 });
    }

    const previousModuleStatus = learningModule?.completionStatus;
    const { progressPercent, status } = recalculateEnrollmentProgress(hydrated, enrollment);
    enrollment.progressPercent = progressPercent;
    enrollment.status = status;
    moduleJustCompleted = Boolean(
      learningModule &&
        previousModuleStatus !== "completed" &&
        hydrated.modules[moduleIndex]?.completionStatus === "completed",
    );
    if (moduleJustCompleted) xpAwarded += 300;

    const wasCertified = Boolean(enrollment.certificate);
    const certificateJustIssued = maybeAutoIssueCertificate(enrollment, student);
    if (certificateJustIssued) xpAwarded += 500;

    await enrollment.save();

    let streakJustIncreased = false;
    let streakCurrent = 0;
    if (xpAwarded > 0) {
      try {
        const [, activityResult] = await Promise.all([
          xpAwarded >= 50 ? awardXp(decoded.uid, "lesson") : Promise.resolve(null),
          recordActivity(decoded.uid),
        ]);
        streakJustIncreased = activityResult.streakIncreased;
        streakCurrent = activityResult.streakCurrent;
        if (activityResult.newBadgeId) newBadgeIds.push(activityResult.newBadgeId);
      } catch (error) {
        console.error("[academy gamification]", error);
      }
    }
    if (certificateJustIssued) {
      const result = await awardBadge(decoded.uid, "first_certificate", enrollment.catalogCourseSlug).catch(
        () => ({ student: null, awarded: false }),
      );
      if (result.awarded) newBadgeIds.push("first_certificate");
    }
    if (!wasCertified && enrollment.status === "completed") {
      const result = await awardBadge(decoded.uid, "first_course_completed", enrollment.catalogCourseSlug).catch(
        () => ({ student: null, awarded: false }),
      );
      if (result.awarded) newBadgeIds.push("first_course_completed");
    }

    if (!wasCertified && enrollment.certificate) {
      sendAcademyEmail({
        event: "certificate_issued",
        to: student.email,
        details: `Your certificate for ${hydrated.courseTitle} has been issued.`,
      }).catch((error) => console.error("[academy certificate email]", error));
    }

    return NextResponse.json({
      success: true,
      course: hydrated,
      status: enrollment.status,
      progressPercent: enrollment.progressPercent,
      quizAttempts: enrollment.quizAttempts,
      assignmentSubmissions: enrollment.assignmentSubmissions,
      finalProjectSubmission: enrollment.finalProjectSubmission,
      learningCursor: enrollment.learningCursor,
      certificate: enrollment.certificate
        ? {
            ...enrollment.certificate,
            certificateName:
              enrollment.certificate.certificateName?.trim() ||
              student.certificateName?.trim() ||
              student.name?.trim() ||
              undefined,
          }
        : enrollment.certificate,
      activityLog: enrollment.activityLog,
      xpAwarded,
      newBadgeIds,
      streakJustIncreased,
      streakCurrent,
      moduleCelebration: moduleJustCompleted
        ? {
            title: learningModule.title,
            message: moduleCompletionMessage(learningModule.title, moduleIndex),
            xp: 300,
          }
        : undefined,
    });
  } catch (error) {
    console.error("[PATCH /api/academy/enrollments/:id]", error);
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
    await connectDB();
    const deleted = await AcademyEnrollment.findOneAndDelete({ _id: id, studentUid: decoded.uid });
    if (!deleted) return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
    return NextResponse.json({ success: true, deletedEnrollmentId: id });
  } catch (error) {
    console.error("[DELETE /api/academy/enrollments/:id]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not remove this enrollment." }, { status: 500 });
  }
}
