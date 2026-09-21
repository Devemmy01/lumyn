import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    await connectDB();

    const course = await CreatorCourse.findOne({ _id: id, creatorUid: decoded.uid });
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    if (!["draft", "rejected"].includes(course.status)) {
      return NextResponse.json({ error: "Only a draft or rejected course can be submitted." }, { status: 400 });
    }

    const hasReadyLesson = course.modules.some((module) =>
      module.lessons.some((lesson) => lesson.videoStatus === "ready"),
    );
    if (!hasReadyLesson) {
      return NextResponse.json(
        { error: "Add at least one lesson with a ready video before submitting for review." },
        { status: 400 },
      );
    }

    const listingFeePaid = student.creatorProfile?.listingFee?.status === "paid";
    if (!listingFeePaid && process.env.MARKETPLACE_SKIP_LISTING_FEE !== "true") {
      return NextResponse.json(
        { error: "Pay the one-time creator listing fee before submitting your first course.", requiresListingFee: true },
        { status: 402 },
      );
    }

    course.status = "pending_review";
    course.submittedAt = new Date();
    course.rejectionReason = undefined;
    await course.save();

    return NextResponse.json({ success: true, course });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[POST /api/marketplace/creator/courses/:id/submit]", error);
    return NextResponse.json({ error: "Could not submit this course for review." }, { status: 500 });
  }
}
