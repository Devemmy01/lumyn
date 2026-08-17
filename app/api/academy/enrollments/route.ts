import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import connectDB from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";
import AcademyEnrollment from "@/models/AcademyEnrollment";

type PopulatedCatalogCourse = {
  _id: { toString(): string };
  slug: string;
  language: string;
  level: string;
  content?: { courseTitle?: string; modules?: unknown[] };
};

export async function GET(request: NextRequest) {
  try {
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const enrollments = await AcademyEnrollment.find({ studentUid: decoded.uid })
      .sort({ createdAt: -1 })
      .populate("catalogCourseId")
      .lean();

    const quizScores = enrollments.flatMap((enrollment) => (enrollment.quizAttempts ?? []).map((attempt) => attempt.score));
    const pendingAssignments = enrollments.reduce((total, enrollment) => {
      if (enrollment.status !== "active") return total;
      const submitted = new Set((enrollment.assignmentSubmissions ?? []).map((item) => item.moduleIndex));
      const catalogCourse = enrollment.catalogCourseId as unknown as PopulatedCatalogCourse | null;
      const moduleCount = catalogCourse?.content?.modules?.length ?? 0;
      return total + Math.max(0, moduleCount - submitted.size);
    }, 0);
    const activityDates = [
      ...new Set(
        enrollments.flatMap((enrollment) =>
          (enrollment.activityLog ?? []).map((item) => new Date(item.createdAt).toISOString().slice(0, 10)),
        ),
      ),
    ];

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        email: student.email,
        avatarUrl: student.avatarUrl,
        certificateName: student.certificateName,
        role: student.role,
        vipAccess: Boolean(student.vipAccess),
        diamondsBalance: student.diamondsBalance ?? 0,
        gamification: student.gamification,
        referralCode: student.referralCode,
        referralsCount: student.referralsCount ?? 0,
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
      },
      enrollments: enrollments.map((enrollment) => {
        const catalogCourse = enrollment.catalogCourseId as unknown as PopulatedCatalogCourse | null;
        return {
          id: enrollment._id.toString(),
          catalogCourseId: catalogCourse?._id?.toString(),
          slug: enrollment.catalogCourseSlug,
          language: catalogCourse?.language,
          level: catalogCourse?.level,
          courseTitle: catalogCourse?.content?.courseTitle,
          status: enrollment.status,
          progressPercent: enrollment.progressPercent,
          certificate: enrollment.certificate,
          createdAt: enrollment.createdAt,
        };
      }),
      metrics: {
        quizAverage: quizScores.length
          ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
          : null,
        pendingAssignments,
        activityDates,
        certificateCount: enrollments.filter((enrollment) => Boolean(enrollment.certificate)).length,
      },
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 503 });
    }
    console.error("[GET /api/academy/enrollments]", error);
    return NextResponse.json({ success: false, error: "Could not load your enrollments." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as { slug?: string } | null;
    const slug = body?.slug?.trim().toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: "A course is required." }, { status: 400 });
    }

    await connectDB();
    const catalogCourse = await AcademyCatalogCourse.findOne({ slug, status: "published" });
    if (!catalogCourse) {
      return NextResponse.json({ error: "This course is not available yet." }, { status: 404 });
    }

    const existing = await AcademyEnrollment.findOne({
      studentUid: decoded.uid,
      catalogCourseId: catalogCourse._id,
    });
    if (existing) {
      return NextResponse.json({ success: true, enrollmentId: existing._id.toString(), alreadyEnrolled: true });
    }

    const enrollment = await AcademyEnrollment.create({
      studentUid: decoded.uid,
      studentEmail: decoded.email,
      catalogCourseId: catalogCourse._id,
      catalogCourseSlug: catalogCourse.slug,
      contentVersion: catalogCourse.contentVersion,
      learningCursor: {
        moduleIndex: 0,
        lessonIndex: 0,
        step: "lessons",
        section: "overview",
        updatedAt: new Date().toISOString(),
      },
    });
    await AcademyCatalogCourse.updateOne({ _id: catalogCourse._id }, { $inc: { enrollmentCount: 1 } });

    return NextResponse.json({ success: true, enrollmentId: enrollment._id.toString(), alreadyEnrolled: false });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[POST /api/academy/enrollments]", error);
    return NextResponse.json({ error: "Could not enroll in this course." }, { status: 500 });
  }
}
