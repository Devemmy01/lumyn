import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAcademyToken } from "@/lib/firebase/admin";
import { sendAcademyEmail } from "@/lib/academy-emails";
import AcademyStudent from "@/models/AcademyStudent";

export async function POST(request: NextRequest) {
  try {
    const { idToken, planId } = (await request.json()) as {
      idToken?: string;
      planId?: string;
    };

    const decoded = await verifyAcademyToken(idToken);
    await connectDB();

    const existing = await AcademyStudent.findOne({ firebaseUid: decoded.uid });
    const student = await AcademyStudent.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          name: decoded.name,
          email: decoded.email,
        },
        $setOnInsert: {
          role: "student",
          subscription: {
            planId: planId === "guided-mentorship" ? "guided-mentorship" : "ai-learning-path",
            status: "pending",
            provider: "manual",
          },
          mentorshipStatus: "none",
        },
      },
      { new: true, upsert: true }
    );

    const cookieStore = await cookies();
    cookieStore.set("lumyn_academy_session", idToken ?? "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    if (!existing && decoded.email) {
      sendAcademyEmail({
        event: "welcome",
        to: decoded.email,
      }).catch((error) => console.error("[academy/session email]", error));
    }

    return NextResponse.json({
      success: true,
      student: {
        email: student.email,
        name: student.name,
        role: student.role,
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
      },
    });
  } catch (error) {
    console.error("[POST /api/academy/session]", error);
    return NextResponse.json(
      { success: false, error: "Could not create academy session." },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("lumyn_academy_session");

  return NextResponse.json({ success: true });
}
