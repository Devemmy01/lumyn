import { NextRequest, NextResponse } from "next/server";
import { getVerifiedAcademyStudent, hasCourseGenerationExemption } from "@/lib/academy-access";
import AcademyCourse from "@/models/AcademyCourse";

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
        role: student.role,
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
        course: item.course,
        status: item.status,
        progressPercent: item.progressPercent,
        quizAttempts: item.quizAttempts ?? [],
        assignmentSubmissions: item.assignmentSubmissions ?? [],
        finalProjectSubmission: item.finalProjectSubmission,
        activityLog: item.activityLog ?? [],
        certificate: item.certificate,
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
    console.error("[GET /api/academy/courses]", error);
    return NextResponse.json(
      { success: false, error: "Could not load academy courses." },
      { status: 401 }
    );
  }
}
