import { NextRequest, NextResponse } from "next/server";
import connectDB, { MongoConnectionUnavailableError } from "@/lib/mongodb";
import { ACADEMY_SESSION_MAX_AGE_SECONDS, createAcademySessionToken } from "@/lib/academy-session";
import { FirebaseCertificatesUnavailableError, verifyAcademyToken } from "@/lib/firebase/admin";
import { sendAcademyEmail } from "@/lib/academy-emails";
import { creditAcademyReferral, ensureAcademyReferralCode } from "@/lib/academy-referrals";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { idToken?: string; planId?: string; referralCode?: string };

  try {
    body = (await request.json()) as { idToken?: string; planId?: string; referralCode?: string };
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
    if (error instanceof FirebaseCertificatesUnavailableError) {
      console.warn("[academy/session] Firebase token verification temporarily unavailable", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Academy authentication is temporarily unavailable. Please try again in a moment.",
        },
        { status: 503 },
      );
    }
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
    let student = await AcademyStudent.findOneAndUpdate<IAcademyStudentDocument>(
      { firebaseUid: decoded.uid },
      {
        $set: {
          name: decoded.name || decoded.email.split("@")[0],
          email: decoded.email,
        },
        $setOnInsert: {
          role: "student",
          subscription: {
            status: "inactive",
          },
          mentorshipStatus: "none",
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    if (!student) {
      throw new Error("Student upsert returned no record.");
    }

    student = await ensureAcademyReferralCode(student);

    const response = NextResponse.json({
      success: true,
      student: {
        email: student.email,
        name: student.name,
        avatarUrl: student.avatarUrl,
        certificateName: student.certificateName,
        role: student.role,
        diamondsBalance: student.diamondsBalance ?? 0,
        referralCode: student.referralCode,
        referralsCount: student.referralsCount ?? 0,
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
      },
    });

    const academySessionToken = await createAcademySessionToken({
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    });

    response.cookies.set("lumyn_academy_session", academySessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACADEMY_SESSION_MAX_AGE_SECONDS,
    });

    if (!existing) {
      await creditAcademyReferral({
        newStudentUid: decoded.uid,
        newStudentEmail: decoded.email,
        referralCode: body.referralCode,
      });
      sendAcademyEmail({
        event: "welcome",
        to: decoded.email,
      }).catch((error) => console.error("[academy/session email]", error));
    }

    return response;
  } catch (error) {
    if (error instanceof MongoConnectionUnavailableError) {
      console.warn("[academy/session] Student session persistence temporarily unavailable", error.message);
      return NextResponse.json(
        {
          success: false,
          error: "Your account was verified, but your workspace could not be opened. Please try again shortly.",
        },
        { status: 503 },
      );
    }
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
