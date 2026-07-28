import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { grantAcademyPoints } from "@/lib/academy-points";
import connectDB from "@/lib/mongodb";
import AcademyStudent from "@/models/AcademyStudent";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json() as {
      email?: string;
      courseGenerationExempt?: boolean;
      pointsToGrant?: number;
      note?: string;
    };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "A valid student email is required." },
        { status: 400 }
      );
    }

    if (body.pointsToGrant !== undefined) {
      const points = Number(body.pointsToGrant);
      if (!Number.isInteger(points) || points < 1 || points > 500) {
        return NextResponse.json({ error: "Grant between 1 and 500 points." }, { status: 400 });
      }

      const student = await grantAcademyPoints({
        email,
        points,
        note: body.note,
        createdBy: session.user?.email ?? "admin",
      });

      return NextResponse.json({
        success: true,
        student: {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          pointsBalance: student.pointsBalance,
          courseGenerationExempt: student.courseGenerationExempt === true,
        },
      });
    }

    if (typeof body.courseGenerationExempt !== "boolean") {
      return NextResponse.json(
        { error: "An exemption state or point grant is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await AcademyStudent.findOneAndUpdate(
      { email },
      { $set: { courseGenerationExempt: body.courseGenerationExempt } },
      { new: true, runValidators: true }
    ).lean();

    if (!student) {
      return NextResponse.json(
        { error: "No Academy account exists for that email yet." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        pointsBalance: student.pointsBalance ?? 0,
        courseGenerationExempt: student.courseGenerationExempt === true,
      },
    });
  } catch (error) {
    console.error("[PATCH /api/admin/academy/access]", error);
    return NextResponse.json(
      { error: "The Academy access exemption could not be updated." },
      { status: 500 }
    );
  }
}
