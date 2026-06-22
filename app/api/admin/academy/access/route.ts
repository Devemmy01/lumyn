import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
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
    };
    const email = body.email?.trim().toLowerCase();

    if (!email || typeof body.courseGenerationExempt !== "boolean") {
      return NextResponse.json(
        { error: "A valid student email and exemption state are required." },
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
