import { NextRequest, NextResponse } from "next/server";
import { ACADEMY_TUTOR_NAME } from "@/lib/academy";
import { AcademyAIError, openAcademyTutorStream } from "@/lib/academy-ai";
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

    const submittedQuestion = message.trim();
    const geminiStream = await openAcademyTutorStream({
      course: course.course,
      moduleIndex: Number(moduleIndex) || 0,
      message: submittedQuestion,
      studentName: typeof studentName === "string" && studentName.length <= 80 ? studentName : undefined,
      history: (course.tutorMessages ?? []).map(({ role, content }) => ({ role, content })),
    });
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };
        let answer = "";

        try {
          send({ type: "status", status: "thinking" });
          for await (const text of geminiStream) {
            answer += text;
            send({ type: "delta", text });
          }

          const completedAnswer = answer.trim();
          if (!completedAnswer) {
            throw new AcademyAIError(`${ACADEMY_TUTOR_NAME} returned an empty answer.`);
          }

          const now = new Date().toISOString();
          course.tutorMessages.push(
            { role: "user", content: submittedQuestion, createdAt: now },
            { role: "assistant", content: completedAnswer, createdAt: now },
          );
          if (course.tutorMessages.length > 40) {
            course.tutorMessages = course.tutorMessages.slice(-40);
          }
          await course.save();

          send({
            type: "done",
            messages: course.tutorMessages.map(({ role, content, createdAt }) => ({
              role,
              content,
              createdAt,
            })),
          });
        } catch (error) {
          console.error("[POST /api/academy/tutor stream]", error);
          const message =
            error instanceof AcademyAIError
              ? error.message
              : `${ACADEMY_TUTOR_NAME} could not finish that answer.`;
          try {
            send({ type: "error", error: message });
          } catch {
            // The browser closed the stream before Gemini finished.
          }
        } finally {
          try {
            controller.close();
          } catch {
            // The stream was already closed by the browser.
          }
        }
      },
    });

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[POST /api/academy/tutor]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof AcademyAIError) {
      return NextResponse.json(
        {
          error:
            error.status === 503
              ? `${ACADEMY_TUTOR_NAME} is still busy after retrying. Your question is still in the chat box—wait a moment, then tap Ask again.`
              : error.message,
          retryable: error.status === 503 || error.status === 429,
        },
        {
          status: error.status,
          headers: error.status === 503 ? { "Retry-After": "5" } : undefined,
        },
      );
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
