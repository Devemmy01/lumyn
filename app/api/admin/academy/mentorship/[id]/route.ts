import { getServerSession } from "next-auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import MentorshipApplication from "@/models/MentorshipApplication";

const allowedStatuses = new Set(["received", "reviewing", "approved", "declined"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!isValidObjectId(id) || !body.status || !allowedStatuses.has(body.status)) {
      return NextResponse.json({ error: "A valid application and status are required." }, { status: 400 });
    }

    await connectDB();
    const application = await MentorshipApplication.findByIdAndUpdate(
      id,
      { $set: { status: body.status } },
      { new: true, runValidators: true },
    ).lean();

    if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
    return NextResponse.json({ success: true, status: application.status });
  } catch (error) {
    console.error("[PATCH /api/admin/academy/mentorship/:id]", error);
    return NextResponse.json({ error: "The mentorship status could not be updated." }, { status: 500 });
  }
}
