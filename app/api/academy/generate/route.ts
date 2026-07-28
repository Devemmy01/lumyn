import { NextRequest, NextResponse } from "next/server";
import { AcademyAIError, generateAcademyCourse } from "@/lib/academy-ai";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent, hasCourseGenerationExemption } from "@/lib/academy-access";
import { POINTS_PER_GENERATION } from "@/lib/academy";
import { refundGenerationPoints, reserveGenerationPoints } from "@/lib/academy-points";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { attachYouTubeVideos } from "@/lib/youtube";
import AcademyCourse from "@/models/AcademyCourse";

export async function POST(request: NextRequest) {
  let reservedPoints = false;
  let reservedStudentUid: string | null = null;

  try {
    const { prompt, level, goal } = (await request.json()) as {
      prompt?: string;
      level?: string;
      goal?: string;
    };

    if (!prompt || !level || !goal) {
      return NextResponse.json(
        { success: false, error: "prompt, level, and goal are required." },
        { status: 400 }
      );
    }

    const { decoded, student } = await getVerifiedAcademyStudent(request);

    const hasExemption = hasCourseGenerationExemption(student);
    let pointsBalance = student.pointsBalance ?? 0;

    if (!hasExemption) {
      const reservedStudent = await reserveGenerationPoints(decoded.uid);
      reservedPoints = true;
      reservedStudentUid = decoded.uid;
      pointsBalance = reservedStudent.pointsBalance;
    }

    const generatedCourse = await generateAcademyCourse({
      prompt: prompt.trim(),
      level: level.trim(),
      goal: goal.trim(),
    });
    const course = await attachYouTubeVideos(generatedCourse)
      .catch((error) => {
        console.error("[academy/youtube enrichment]", error);
        return generatedCourse;
      });

    const savedCourse = await AcademyCourse.create({
      studentUid: decoded.uid,
      studentEmail: student.email,
      prompt: prompt.trim(),
      level: level.trim(),
      goal: goal.trim(),
      course,
      status: "active",
      progressPercent: 0,
      quizAttempts: [],
      assignmentSubmissions: [],
      activityLog: [],
      tutorMessages: [],
    });

    sendAcademyEmail({
      event: "course_generated",
      to: student.email,
      details: `${course.courseTitle} is now saved in your dashboard.`,
    }).catch((error) => console.error("[academy/generate email]", error));

    return NextResponse.json({
      success: true,
      courseId: savedCourse._id.toString(),
      course,
      accessType: hasExemption ? "exemption" : "points",
      pointsSpent: hasExemption ? 0 : POINTS_PER_GENERATION,
      pointsBalance,
    });
  } catch (error) {
    if (reservedPoints && reservedStudentUid) {
      await refundGenerationPoints(reservedStudentUid)
        .catch((releaseError) => console.error("[academy point refund]", releaseError));
    }
    console.error("[POST /api/academy/generate]", error);
    if (error instanceof Error && error.message.includes("points")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 402 }
      );
    }
    if (error instanceof AcademyAIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Could not generate the learning path." },
      { status: 500 }
    );
  }
}
