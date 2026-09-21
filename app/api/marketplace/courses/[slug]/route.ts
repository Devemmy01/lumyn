import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    await connectDB();
    const course = await CreatorCourse.findOne({ slug: slug.toLowerCase(), status: "published" })
      .select(
        "slug title subtitle description category level coverImage priceCents currency purchaseCount publishedAt modules.title modules.description modules.lessons.title modules.lessons.previewEligible modules.lessons.durationSeconds",
      )
      .lean();
    if (!course) {
      return NextResponse.json({ error: "This course was not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("[GET /api/marketplace/courses/:slug]", error);
    return NextResponse.json({ error: "Could not load this course." }, { status: 500 });
  }
}
