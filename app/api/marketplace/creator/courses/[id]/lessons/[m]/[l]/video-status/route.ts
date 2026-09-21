import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { getBunnyVideoStatus, isBunnyStreamConfigured } from "@/lib/bunny-stream";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

type RouteContext = { params: Promise<{ id: string; m: string; l: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    if (!isBunnyStreamConfigured()) {
      return NextResponse.json({ error: "Video uploads are temporarily unavailable." }, { status: 503 });
    }

    const { id, m, l } = await params;
    const moduleIndex = Number(m);
    const lessonIndex = Number(l);
    const { decoded } = await getVerifiedAcademyStudent(request);

    await connectDB();
    const course = await CreatorCourse.findOne({ _id: id, creatorUid: decoded.uid });
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex];
    if (!lesson?.videoGuid) {
      return NextResponse.json({ error: "This lesson has no video yet." }, { status: 404 });
    }

    const status = await getBunnyVideoStatus(lesson.videoGuid);
    lesson.videoStatus = status.videoStatus;
    if (status.durationSeconds) lesson.durationSeconds = status.durationSeconds;
    await course.save();

    return NextResponse.json({ success: true, ...status });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /video-status]", error);
    return NextResponse.json({ error: "Could not check the video status." }, { status: 500 });
  }
}
