import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAcademyStudent } from "@/lib/academy-access";
import { recalculateCourseProgress } from "@/lib/academy-progress";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { AcademyAIError, evaluateAcademySubmission } from "@/lib/academy-ai";
import AcademyCourse from "@/models/AcademyCourse";

type RouteContext = { params: Promise<{ id: string }> };

function evidenceLength(content: string) {
  return content
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim().length;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const course = await AcademyCourse.findOne({ _id: id, studentUid: decoded.uid });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const body = await request.json() as {
      action?: "lesson" | "quiz" | "assignment" | "final_project" | "archive";
      moduleIndex?: number;
      lessonIndex?: number;
      completed?: boolean;
      answers?: number[];
      content?: string;
    };

    const moduleIndex = Number(body.moduleIndex);
    const learningModule = course.course.modules[moduleIndex];

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
      }
    } else if (body.action === "quiz") {
      if (learningModule.completionStatus === "locked" || !Array.isArray(body.answers)) {
        return NextResponse.json({ error: "Quiz is not available." }, { status: 400 });
      }
      const questions = learningModule.quiz.questions;
      if (!questions.length || questions.some((question) => typeof question === "string")) {
        return NextResponse.json({ error: "Regenerate this legacy course to use graded quizzes." }, { status: 400 });
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
    } else {
      return NextResponse.json({ error: "Unknown progress action." }, { status: 400 });
    }

    const wasCertified = Boolean(course.certificate);
    recalculateCourseProgress(course);
    if (course.status === "completed" && course.course.certificateEligible && !course.certificate) {
      course.certificate = {
        certificateId: `LUMYN-${randomUUID().slice(0, 8).toUpperCase()}`,
        issuedAt: new Date().toISOString(),
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
      certificate: course.certificate,
      activityLog: course.activityLog,
    });
  } catch (error) {
    console.error("[PATCH /api/academy/courses/:id]", error);
    if (error instanceof AcademyAIError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Could not save learning progress." }, { status: 500 });
  }
}
