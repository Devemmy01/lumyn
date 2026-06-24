import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAcademyToken } from "@/lib/firebase/admin";
import { sendAcademyEmail } from "@/lib/academy-emails";
import AcademyStudent from "@/models/AcademyStudent";

export const runtime = "nodejs";

const SESSION_MAX_AGE_SECONDS = 60 * 60;

export async function POST(request: NextRequest) {
  let body: { idToken?: string; planId?: string };

  try {
    body = (await request.json()) as { idToken?: string; planId?: string };
  } catch {
    return NextResponse.json(
      { success: false, error: "The sign-in request was invalid." },
      { status: 400 },
    );
  }

  if (!body.idToken) {
    return NextResponse.json(
      { success: false, error: "Your sign-in token was missing. Please sign in again." },
      { status: 400 },
    );
  }

  let decoded: Awaited<ReturnType<typeof verifyAcademyToken>>;

  try {
    decoded = await verifyAcademyToken(body.idToken);
  } catch (error) {
    console.error("[academy/session] Firebase token verification failed", error);
    return NextResponse.json(
      {
        success: false,
        error: "We could not verify your sign-in. Please sign out and try again.",
      },
      { status: 401 },
    );
  }

  if (!decoded.email) {
    return NextResponse.json(
      {
        success: false,
        error: "Your Firebase account does not have an email address.",
      },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const existing = await AcademyStudent.exists({ firebaseUid: decoded.uid });
    const student = await AcademyStudent.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          name: decoded.name || decoded.email.split("@")[0],
          email: decoded.email,
        },
        $setOnInsert: {
          role: "student",
          subscription: {
            planId: body.planId === "guided-mentorship"
              ? "guided-mentorship"
              : "ai-learning-path",
            status: "pending",
            provider: "manual",
          },
          mentorshipStatus: "none",
        },
      },
      { new: true, upsert: true, runValidators: true },
    ).lean();

    if (!student) {
      throw new Error("Student upsert returned no record.");
    }

    const response = NextResponse.json({
      success: true,
      student: {
        email: student.email,
        name: student.name,
        role: student.role,
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
      },
    });

    response.cookies.set("lumyn_academy_session", body.idToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    if (!existing) {
      sendAcademyEmail({
        event: "welcome",
        to: decoded.email,
      }).catch((error) => console.error("[academy/session email]", error));
    }

    return response;
  } catch (error) {
    console.error("[academy/session] Student session persistence failed", error);
    return NextResponse.json(
      {
        success: false,
        error: "Your account was verified, but your workspace could not be opened. Please try again shortly.",
      },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("lumyn_academy_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
