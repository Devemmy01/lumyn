import { NextRequest, NextResponse } from "next/server";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";
import { AcademyAIError, askAcademyTutor } from "@/lib/academy-ai";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import AcademyCourse from "@/models/AcademyCourse";

export async function POST(request: NextRequest) {
  try {
    const { courseId, moduleIndex, message, studentName } = await request.json() as {
      courseId?: string;
      moduleIndex?: number;
      message?: string;
      studentName?: string;
    };
    if (!courseId || !message?.trim() || message.length > 1500) {
      return NextResponse.json({ error: "A valid course and question are required." }, { status: 400 });
    }

    const { decoded } = await getVerifiedAcademyStudent(request);
    const course = await AcademyCourse.findOne({ _id: courseId, studentUid: decoded.uid });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    const answer = await askAcademyTutor({
      course: course.course,
      moduleIndex: Number(moduleIndex) || 0,
      message: message.trim(),
      studentName: typeof studentName === "string" && studentName.length <= 80 ? studentName : undefined,
      history: (course.tutorMessages ?? []).map(({ role, content }) => ({ role, content })),
    });
    const now = new Date().toISOString();
    course.tutorMessages.push(
      { role: "user", content: message.trim(), createdAt: now },
      { role: "assistant", content: answer, createdAt: now }
    );
    if (course.tutorMessages.length > 40) course.tutorMessages = course.tutorMessages.slice(-40);
    await course.save();

    return NextResponse.json({ success: true, answer, messages: course.tutorMessages });
  } catch (error) {
    console.error("[POST /api/academy/tutor]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof AcademyAIError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: `${ACADEMY_TUTOR_NAME} could not answer right now.` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "Course is required." }, { status: 400 });
    }

    const { decoded } = await getVerifiedAcademyStudent(request);
    const course = await AcademyCourse.findOne({ _id: courseId, studentUid: decoded.uid });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

    course.tutorMessages = [];
    await course.save();

    return NextResponse.json({ success: true, messages: [] });
  } catch (error) {
    console.error("[DELETE /api/academy/tutor]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: `${ACADEMY_TUTOR_NAME} chat could not be reset right now.` }, { status: 500 });
  }
}
