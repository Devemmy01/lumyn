import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid subscriber ID." }, { status: 400 });
    }

    await connectDB();
    const subscriber = await Subscriber.findByIdAndDelete(id).lean();

    if (!subscriber) {
      return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/subscribers/:id]", error);
    return NextResponse.json(
      { error: "The subscriber could not be deleted." },
      { status: 500 },
    );
  }
}
