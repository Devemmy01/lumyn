import { NextRequest, NextResponse } from "next/server";
import { AcademyAIError, askAcademyTutor } from "@/lib/academy-ai";
import { getVerifiedAcademyStudent, hasUnlimitedAcademyAccess } from "@/lib/academy-access";
import AcademyCourse from "@/models/AcademyCourse";

export async function POST(request: NextRequest) {
  try {
    const { courseId, moduleIndex, message } = await request.json() as {
      courseId?: string;
      moduleIndex?: number;
      message?: string;
    };
    if (!courseId || !message?.trim() || message.length > 1500) {
      return NextResponse.json({ error: "A valid course and question are required." }, { status: 400 });
    }

    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const course = await AcademyCourse.findOne({ _id: courseId, studentUid: decoded.uid });
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    const isFreeTrialCourse = student.freeCourseId === courseId;
    if (!hasUnlimitedAcademyAccess(student) && !isFreeTrialCourse) {
      return NextResponse.json(
        { error: "Subscribe to use the AI tutor on additional courses." },
        { status: 402 }
      );
    }

    const answer = await askAcademyTutor({
      course: course.course,
      moduleIndex: Number(moduleIndex) || 0,
      message: message.trim(),
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
    if (error instanceof AcademyAIError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "The AI tutor could not answer right now." }, { status: 500 });
  }
}
