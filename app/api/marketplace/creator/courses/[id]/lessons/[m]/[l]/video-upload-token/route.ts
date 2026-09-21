import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { createBunnyVideo, createTusUploadCredentials, deleteBunnyVideo, isBunnyStreamConfigured } from "@/lib/bunny-stream";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

type RouteContext = { params: Promise<{ id: string; m: string; l: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
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
    if (!["draft", "rejected"].includes(course.status)) {
      return NextResponse.json({ error: "This course can't be edited right now." }, { status: 400 });
    }
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex];
    if (!lesson) {
      return NextResponse.json({ error: "Lesson was not found." }, { status: 404 });
    }

    if (lesson.videoGuid) {
      await deleteBunnyVideo(lesson.videoGuid).catch((error) => console.error("[video-upload-token] cleanup", error));
    }

    const videoGuid = await createBunnyVideo({ title: `${course.title} — ${lesson.title}` });
    lesson.videoGuid = videoGuid;
    lesson.videoStatus = "uploading";
    await course.save();

    const credentials = createTusUploadCredentials({ videoGuid });
    return NextResponse.json({ success: true, ...credentials });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[POST /video-upload-token]", error);
    return NextResponse.json({ error: "Could not start the video upload." }, { status: 500 });
  }
}
