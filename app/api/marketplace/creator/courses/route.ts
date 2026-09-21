import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { marketplaceCurrency } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uniqueSlug(base: string) {
  const root = slugify(base) || "course";
  let candidate = root;
  let suffix = 1;
  while (await CreatorCourse.exists({ slug: candidate })) {
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
  return candidate;
}

export async function GET(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const courses = await CreatorCourse.find({ creatorUid: decoded.uid })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/courses]", error);
    return NextResponse.json({ error: "Could not load your courses." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as {
      title?: string;
      subtitle?: string;
      description?: string;
      category?: string;
      level?: string;
      priceCents?: number;
    } | null;

    const title = body?.title?.trim();
    const description = body?.description?.trim();
    if (!title || !description) {
      return NextResponse.json({ error: "A title and description are required." }, { status: 400 });
    }
    const priceCents = Number(body?.priceCents ?? 0);
    if (!Number.isInteger(priceCents) || priceCents <= 0) {
      return NextResponse.json({ error: "A valid price is required." }, { status: 400 });
    }

    await connectDB();
    const slug = await uniqueSlug(title);
    const course = await CreatorCourse.create({
      creatorUid: decoded.uid,
      creatorEmail: student.email,
      slug,
      title,
      subtitle: body?.subtitle?.trim(),
      description,
      category: body?.category?.trim(),
      level: ["beginner", "intermediate", "advanced"].includes(body?.level ?? "")
        ? body?.level
        : "beginner",
      priceCents,
      currency: marketplaceCurrency(),
      status: "draft",
      modules: [],
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[POST /api/marketplace/creator/courses]", error);
    return NextResponse.json({ error: "Could not create the course." }, { status: 500 });
  }
}
