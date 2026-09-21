import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (q) filter.title = { $regex: q, $options: "i" };

    await connectDB();
    const [courses, total] = await Promise.all([
      CreatorCourse.find(filter)
        .select("slug title subtitle description category level coverImage priceCents currency purchaseCount publishedAt")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      CreatorCourse.countDocuments(filter),
    ]);

    return NextResponse.json({ success: true, courses, total, page, pageSize: PAGE_SIZE });
  } catch (error) {
    console.error("[GET /api/marketplace/courses]", error);
    return NextResponse.json({ error: "Could not load the marketplace." }, { status: 500 });
  }
}
