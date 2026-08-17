import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { grantAcademyDiamonds } from "@/lib/academy-diamonds";
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
      vipAccess?: boolean;
      diamondsToGrant?: number;
      note?: string;
    };
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "A valid student email is required." },
        { status: 400 }
      );
    }

    if (body.diamondsToGrant !== undefined) {
      const diamonds = Number(body.diamondsToGrant);
      if (!Number.isInteger(diamonds) || diamonds < 1 || diamonds > 100) {
        return NextResponse.json({ error: "Grant between 1 and 100 diamonds." }, { status: 400 });
      }

      const student = await grantAcademyDiamonds({
        email,
        diamonds,
        note: body.note,
        createdBy: session.user?.email ?? "admin",
      });

      return NextResponse.json({
        success: true,
        student: {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          diamondsBalance: student.diamondsBalance,
          vipAccess: student.vipAccess === true,
        },
      });
    }

    if (typeof body.vipAccess !== "boolean") {
      return NextResponse.json(
        { error: "A VIP state or diamond grant is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await AcademyStudent.findOneAndUpdate(
      { email },
      { $set: { vipAccess: body.vipAccess } },
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
        diamondsBalance: student.diamondsBalance ?? 0,
        vipAccess: student.vipAccess === true,
      },
    });
  } catch (error) {
    console.error("[PATCH /api/admin/academy/access]", error);
    return NextResponse.json(
      { error: "The Academy access grant could not be updated." },
      { status: 500 }
    );
  }
}
