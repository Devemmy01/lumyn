import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const slug = new URL(request.url).searchParams.get("slug")?.trim().toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: "A catalog course slug is required." }, { status: 400 });
    }

    await connectDB();
    const course = await AcademyCatalogCourse.findOne({ slug }).lean();
    if (!course) {
      return NextResponse.json({ error: "No catalog course exists with that slug." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: {
        slug: course.slug,
        language: course.language,
        level: course.level,
        status: course.status,
        contentVersion: course.contentVersion,
        generationModel: course.generationModel,
        generatedAt: course.generatedAt,
        content: course.content ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/academy/catalog]", error);
    return NextResponse.json({ error: "The catalog course could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      slug?: string;
      status?: "draft" | "published" | "archived";
    };
    const slug = body.slug?.trim().toLowerCase();
    if (!slug) {
      return NextResponse.json({ error: "A catalog course slug is required." }, { status: 400 });
    }
    if (!body.status || !["draft", "published", "archived"].includes(body.status)) {
      return NextResponse.json({ error: "A valid status is required." }, { status: 400 });
    }

    await connectDB();
    const course = await AcademyCatalogCourse.findOneAndUpdate(
      { slug },
      { $set: { status: body.status } },
      { new: true },
    ).lean();

    if (!course) {
      return NextResponse.json({ error: "No catalog course exists with that slug." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: {
        slug: course.slug,
        language: course.language,
        level: course.level,
        status: course.status,
      },
    });
  } catch (error) {
    console.error("[PATCH /api/admin/academy/catalog]", error);
    return NextResponse.json({ error: "The catalog course could not be updated." }, { status: 500 });
  }
}
