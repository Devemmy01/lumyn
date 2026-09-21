import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { generateEmbedPlaybackUrl, isBunnyStreamConfigured } from "@/lib/bunny-stream";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import CreatorCoursePurchase from "@/models/CreatorCoursePurchase";

type RouteContext = { params: Promise<{ courseId: string; m: string; l: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    if (!isBunnyStreamConfigured()) {
      return NextResponse.json({ error: "Video playback is temporarily unavailable." }, { status: 503 });
    }

    const { courseId, m, l } = await params;
    const moduleIndex = Number(m);
    const lessonIndex = Number(l);
    const { decoded, student } = await getVerifiedAcademyStudent(request);

    await connectDB();
    const course = await CreatorCourse.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex];
    if (!lesson?.videoGuid || lesson.videoStatus !== "ready") {
      return NextResponse.json({ error: "This lesson's video isn't ready yet." }, { status: 404 });
    }

    const isOwner = course.creatorUid === decoded.uid;
    const isPreview = Boolean(lesson.previewEligible);
    let hasAccess = isOwner || isPreview;
    if (!hasAccess) {
      const purchase = await CreatorCoursePurchase.exists({
        studentUid: decoded.uid,
        courseId: course._id,
        status: "active",
      });
      hasAccess = Boolean(purchase);
    }
    if (!hasAccess) {
      return NextResponse.json({ error: "You don't have access to this lesson." }, { status: 403 });
    }

    const { embedUrl, expires } = generateEmbedPlaybackUrl({ videoGuid: lesson.videoGuid });
    return NextResponse.json({
      success: true,
      embedUrl,
      expires,
      watermarkText: student.email,
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /lessons/playback]", error);
    return NextResponse.json({ error: "Could not load this lesson's video." }, { status: 500 });
  }
}
