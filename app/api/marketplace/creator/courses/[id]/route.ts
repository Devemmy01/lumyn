import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { deleteBunnyVideo } from "@/lib/bunny-stream";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

type RouteContext = { params: Promise<{ id: string }> };

const EDITABLE_STATUSES = new Set(["draft", "rejected"]);

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const course = await CreatorCourse.findOne({ _id: id, creatorUid: decoded.uid }).lean();
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/courses/:id]", error);
    return NextResponse.json({ error: "Could not load this course." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { decoded } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as {
      title?: string;
      subtitle?: string;
      description?: string;
      category?: string;
      level?: string;
      priceCents?: number;
      coverImage?: string;
      modules?: unknown;
    } | null;
    if (!body) {
      return NextResponse.json({ error: "A request body is required." }, { status: 400 });
    }

    await connectDB();
    const course = await CreatorCourse.findOne({ _id: id, creatorUid: decoded.uid });
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    if (!EDITABLE_STATUSES.has(course.status)) {
      return NextResponse.json(
        { error: "This course can't be edited while it's in review or published. Archive it first to make changes." },
        { status: 400 },
      );
    }

    if (typeof body.title === "string") course.title = body.title.trim();
    if (typeof body.subtitle === "string") course.subtitle = body.subtitle.trim();
    if (typeof body.description === "string") course.description = body.description.trim();
    if (typeof body.category === "string") course.category = body.category.trim();
    if (typeof body.coverImage === "string") course.coverImage = body.coverImage;
    if (body.level && ["beginner", "intermediate", "advanced"].includes(body.level)) {
      course.level = body.level as typeof course.level;
    }
    if (typeof body.priceCents === "number" && Number.isInteger(body.priceCents) && body.priceCents > 0) {
      course.priceCents = body.priceCents;
    }
    if (Array.isArray(body.modules)) {
      course.modules = body.modules as typeof course.modules;
    }
    if (course.status === "rejected") {
      course.status = "draft";
      course.rejectionReason = undefined;
    }

    await course.save();
    return NextResponse.json({ success: true, course });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[PATCH /api/marketplace/creator/courses/:id]", error);
    return NextResponse.json({ error: "Could not update this course." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const course = await CreatorCourse.findOne({ _id: id, creatorUid: decoded.uid });
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    if (course.status !== "draft") {
      return NextResponse.json({ error: "Only draft courses can be deleted." }, { status: 400 });
    }
    const videoGuids = course.modules.flatMap((courseModule) =>
      courseModule.lessons.map((lesson) => lesson.videoGuid).filter((guid): guid is string => Boolean(guid)),
    );
    await Promise.all(videoGuids.map((guid) => deleteBunnyVideo(guid).catch((error) => console.error("[DELETE course] video cleanup", error))));
    await course.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[DELETE /api/marketplace/creator/courses/:id]", error);
    return NextResponse.json({ error: "Could not delete this course." }, { status: 500 });
  }
}
