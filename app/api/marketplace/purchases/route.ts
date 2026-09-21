import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import connectDB from "@/lib/mongodb";
import CreatorCoursePurchase from "@/models/CreatorCoursePurchase";

export async function GET(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const purchases = await CreatorCoursePurchase.find({ studentUid: decoded.uid, status: "active" })
      .populate("courseId", "title slug coverImage")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, purchases });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/purchases]", error);
    return NextResponse.json({ error: "Could not load your purchases." }, { status: 500 });
  }
}
