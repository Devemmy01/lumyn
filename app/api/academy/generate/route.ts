import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { AcademyAIError, generateAcademyCourse } from "@/lib/academy-ai";
import { getVerifiedAcademyStudent, hasCourseGenerationExemption, hasPaidAcademyAccess, hasUnlimitedAcademyAccess } from "@/lib/academy-access";
import { sendAcademyEmail } from "@/lib/academy-emails";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";

export async function POST(request: NextRequest) {
  let trialClaimId: string | null = null;
  let trialStudentId: string | null = null;

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

    const hasSubscription = hasPaidAcademyAccess(student);
    const hasExemption = hasCourseGenerationExemption(student);
    const hasUnlimitedAccess = hasUnlimitedAcademyAccess(student);

    if (!hasUnlimitedAccess) {
      trialClaimId = randomUUID();
      trialStudentId = student._id.toString();
      const claimedTrial = await AcademyStudent.findOneAndUpdate(
        {
          _id: student._id,
          $or: [
            { freeCourseUsedAt: { $exists: false } },
            { freeCourseUsedAt: null },
          ],
        },
        {
          $set: {
            freeCourseUsedAt: new Date(),
            freeCourseClaimId: trialClaimId,
          },
        },
        { new: true }
      );

      if (!claimedTrial) {
        return NextResponse.json(
          {
            success: false,
            error: "Your free course has already been used. Subscribe to generate another learning path.",
          },
          { status: 402 }
        );
      }
    }

    const course = await generateAcademyCourse({
      prompt: prompt.trim(),
      level: level.trim(),
      goal: goal.trim(),
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

    if (trialClaimId) {
      await AcademyStudent.updateOne(
        { _id: student._id, freeCourseClaimId: trialClaimId },
        {
          $set: { freeCourseId: savedCourse._id.toString() },
          $unset: { freeCourseClaimId: 1 },
        }
      );
      trialClaimId = null;
    }

    sendAcademyEmail({
      event: "course_generated",
      to: student.email,
      details: `${course.courseTitle} is now saved in your dashboard.`,
    }).catch((error) => console.error("[academy/generate email]", error));

    return NextResponse.json({
      success: true,
      courseId: savedCourse._id.toString(),
      course,
      accessType: hasSubscription ? "subscription" : hasExemption ? "exemption" : "free_trial",
    });
  } catch (error) {
    if (trialClaimId && trialStudentId) {
      await AcademyStudent.updateOne(
        { _id: trialStudentId, freeCourseClaimId: trialClaimId },
        {
          $unset: {
            freeCourseUsedAt: 1,
            freeCourseClaimId: 1,
          },
        }
      ).catch((releaseError) => console.error("[academy trial release]", releaseError));
    }
    console.error("[POST /api/academy/generate]", error);
    if (error instanceof AcademyAIError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { success: false, error: "Could not generate the learning path." },
      { status: 500 }
    );
  }
}
