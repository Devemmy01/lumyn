import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import connectDB from "@/lib/mongodb";
import AcademyStudent from "@/models/AcademyStudent";

export async function POST(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const student = await AcademyStudent.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      { $set: { "subscription.cancelAtPeriodEnd": true } },
      { new: true },
    );
    if (!student) return NextResponse.json({ error: "Academy student account was not found." }, { status: 404 });

    return NextResponse.json({
      success: true,
      subscription: student.subscription,
    });
  } catch (error) {
    console.error("[POST /api/academy/subscription/cancel]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not cancel your subscription." }, { status: 500 });
  }
}
