import { NextRequest, NextResponse } from "next/server";
import { AcademyAIError, generateAcademyCourse } from "@/lib/academy-ai";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent, hasCourseGenerationExemption } from "@/lib/academy-access";
import { POINTS_PER_GENERATION } from "@/lib/academy";
import { refundGenerationPoints, reserveGenerationPoints } from "@/lib/academy-points";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { attachYouTubeVideos } from "@/lib/youtube";
import AcademyCourse from "@/models/AcademyCourse";

// Safety ceiling only. The compact first-path response should normally finish
// far sooner; deeper assessments are generated just in time.
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  let reservedPoints = false;
  let reservedStudentUid: string | null = null;

  try {
    const { prompt, level, goal, generationId: rawGenerationId } = (await request.json()) as {
      prompt?: string;
      level?: string;
      goal?: string;
      generationId?: string;
    };

    if (!prompt || !level || !goal) {
      return NextResponse.json(
        { success: false, error: "prompt, level, and goal are required." },
        { status: 400 }
      );
    }

    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const generationId =
      typeof rawGenerationId === "string" &&
      /^[a-zA-Z0-9_-]{12,120}$/.test(rawGenerationId)
        ? rawGenerationId
        : undefined;

    const hasExemption = hasCourseGenerationExemption(student);
    let pointsBalance = student.pointsBalance ?? 0;

    if (generationId) {
      const existingCourse = await AcademyCourse.findOne({
        studentUid: decoded.uid,
        generationId,
      });
      if (existingCourse) {
        return NextResponse.json({
          success: true,
          courseId: existingCourse._id.toString(),
          course: existingCourse.course,
          accessType: hasExemption ? "exemption" : "points",
          pointsSpent: hasExemption ? 0 : POINTS_PER_GENERATION,
          pointsBalance,
          recovered: true,
        });
      }
    }

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
      generationId,
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
    if (error instanceof Error && error.message.includes("points")) {
      console.error("[POST /api/academy/generate]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 402 }
      );
    }
    if (error instanceof AcademyAIError) {
      const retryable = error.status === 429 || error.status === 503;
      if (retryable) {
        console.warn("[academy/generate recovery]", {
          status: error.status,
          message: error.message,
        });
      } else {
        console.error("[POST /api/academy/generate]", error);
      }
      return NextResponse.json(
        {
          success: false,
          error: retryable
            ? "Lumyn is handling unusually high demand. Your request is safe and will retry automatically."
            : error.message,
          retryable,
          retryAfterMs: retryable ? 4_000 : undefined,
        },
        { status: error.status }
      );
    }
    if (error instanceof AcademyDatabaseUnavailableError) {
      console.error("[POST /api/academy/generate]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 503 }
      );
    }
    console.error("[POST /api/academy/generate]", error);
    return NextResponse.json(
      { success: false, error: "Could not generate the learning path." },
      { status: 500 }
    );
  }
}
