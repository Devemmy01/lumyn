import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { decryptField } from "@/lib/crypto";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import AcademyStudent from "@/models/AcademyStudent";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status") ?? "pending_review";
    await connectDB();
    const courses = await CreatorCourse.find(
      status === "all" ? {} : { status },
    )
      .select("creatorUid creatorEmail slug title level priceCents currency status submittedAt publishedAt purchaseCount modules")
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();

    const creatorUids = [...new Set(courses.map((course) => course.creatorUid))];
    const creators = await AcademyStudent.find({ firebaseUid: { $in: creatorUids } })
      .select("firebaseUid creatorProfile")
      .lean();
    const creatorByUid = new Map(creators.map((creator) => [creator.firebaseUid, creator.creatorProfile]));

    const withCounts = courses.map((course) => {
      const creatorProfile = creatorByUid.get(course.creatorUid);
      return {
        ...course,
        moduleCount: course.modules?.length ?? 0,
        lessonCount: course.modules?.reduce((sum, module) => sum + (module.lessons?.length ?? 0), 0) ?? 0,
        modules: undefined,
        creatorPayoutStatus: creatorProfile?.payoutStatus ?? "unpaid",
        creatorIdentity: creatorProfile?.identity
          ? {
              legalName: decryptField(creatorProfile.identity.legalName),
              idType: creatorProfile.identity.idType,
              idNumber: decryptField(creatorProfile.identity.idNumber),
            }
          : null,
        creatorGuidelinesAcceptedAt: creatorProfile?.guidelinesAcceptedAt ?? null,
      };
    });

    return NextResponse.json({ success: true, courses: withCounts });
  } catch (error) {
    console.error("[GET /api/admin/marketplace/courses]", error);
    return NextResponse.json({ error: "Could not load courses." }, { status: 500 });
  }
}
