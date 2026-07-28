import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent, hasCourseGenerationExemption } from "@/lib/academy-access";
import { ensureModulePractice, ensureModuleQuizQuestions, type GeneratedCourse } from "@/lib/academy";
import AcademyCourse from "@/models/AcademyCourse";

function courseWithQuizGuard(course: GeneratedCourse): GeneratedCourse {
  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      ...ensureModulePractice(module),
      quiz: {
        ...module.quiz,
        questions: ensureModuleQuizQuestions(module),
      },
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const courses = await AcademyCourse.find({ studentUid: decoded.uid })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    const quizScores = courses.flatMap((course) => (course.quizAttempts ?? []).map((attempt) => attempt.score));
    const pendingAssignments = courses.reduce((total, course) => {
      if (course.status !== "active") return total;
      const submitted = new Set((course.assignmentSubmissions ?? []).map((item) => item.moduleIndex));
      return total + course.course.modules.filter((module, index) =>
        module.completionStatus !== "locked" && !submitted.has(index)
      ).length;
    }, 0);
    const activityDates = [...new Set(courses.flatMap((course) =>
      (course.activityLog ?? []).map((item) => new Date(item.createdAt).toISOString().slice(0, 10))
    ))];

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        email: student.email,
        avatarUrl: student.avatarUrl,
        certificateName: student.certificateName,
        role: student.role,
        pointsBalance: student.pointsBalance ?? 0,
        referralCode: student.referralCode,
        referralsCount: student.referralsCount ?? 0,
        courseGenerationExempt: hasCourseGenerationExemption(student),
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
        trial: {
          available: !student.freeCourseUsedAt,
          usedAt: student.freeCourseUsedAt,
          courseId: student.freeCourseId,
        },
      },
      courses: courses.map((item) => ({
        id: item._id.toString(),
        course: courseWithQuizGuard(item.course),
        status: item.status,
        progressPercent: item.progressPercent,
        quizAttempts: item.quizAttempts ?? [],
        assignmentSubmissions: item.assignmentSubmissions ?? [],
        finalProjectSubmission: item.finalProjectSubmission,
        activityLog: item.activityLog ?? [],
        learningCursor: item.learningCursor,
        certificate: item.certificate
          ? {
              ...item.certificate,
              certificateName:
                item.certificate.certificateName?.trim() ||
                student.certificateName?.trim() ||
                student.name?.trim() ||
                undefined,
            }
          : item.certificate,
        tutorMessages: item.tutorMessages ?? [],
        createdAt: item.createdAt,
      })),
      metrics: {
        quizAverage: quizScores.length
          ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
          : null,
        pendingAssignments,
        activityDates,
        certificateCount: courses.filter((course) => Boolean(course.certificate)).length,
      },
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      console.warn("[GET /api/academy/courses]", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 503 }
      );
    }
    console.error("[GET /api/academy/courses]", error);
    return NextResponse.json(
      { success: false, error: "Could not load academy courses." },
      { status: 500 }
    );
  }
}
