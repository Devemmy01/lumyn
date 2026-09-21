import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import CreatorCoursePurchase from "@/models/CreatorCoursePurchase";

type ByCourseFacet = {
  _id: string;
  courseSlug: string;
  earningsCents: number;
  sales: number;
};

type RecentFacet = {
  _id: string;
  courseId: string;
  courseSlug: string;
  creatorEarningsCents: number;
  currency: string;
  createdAt: string;
};

type TotalsFacet = {
  totalEarningsCents: number;
  totalSales: number;
  currency: string;
};

export async function GET(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    await connectDB();

    const [result] = await CreatorCoursePurchase.aggregate<{
      totals: TotalsFacet[];
      byCourse: ByCourseFacet[];
      recent: RecentFacet[];
    }>([
      { $match: { creatorUid: decoded.uid, status: "active" } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalEarningsCents: { $sum: "$creatorEarningsCents" },
                totalSales: { $sum: 1 },
                currency: { $first: "$currency" },
              },
            },
          ],
          byCourse: [
            {
              $group: {
                _id: "$courseId",
                courseSlug: { $first: "$courseSlug" },
                earningsCents: { $sum: "$creatorEarningsCents" },
                sales: { $sum: 1 },
              },
            },
            { $sort: { earningsCents: -1 } },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
            {
              $project: {
                courseId: 1,
                courseSlug: 1,
                creatorEarningsCents: 1,
                currency: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const courseIds = [
      ...new Set([
        ...result.byCourse.map((entry) => entry._id.toString()),
        ...result.recent.map((entry) => entry.courseId.toString()),
      ]),
    ];
    const courses = await CreatorCourse.find({ _id: { $in: courseIds } })
      .select("title")
      .lean();
    const titleById = new Map(courses.map((course) => [course._id.toString(), course.title]));

    return NextResponse.json({
      success: true,
      totals: result.totals[0] ?? { totalEarningsCents: 0, totalSales: 0, currency: null },
      byCourse: result.byCourse.map((entry) => ({
        courseId: entry._id.toString(),
        courseTitle: titleById.get(entry._id.toString()) ?? entry.courseSlug,
        earningsCents: entry.earningsCents,
        sales: entry.sales,
      })),
      recent: result.recent.map((entry) => ({
        courseId: entry.courseId.toString(),
        courseTitle: titleById.get(entry.courseId.toString()) ?? entry.courseSlug,
        earningsCents: entry.creatorEarningsCents,
        currency: entry.currency,
        createdAt: entry.createdAt,
      })),
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/earnings]", error);
    return NextResponse.json({ error: "Could not load your earnings." }, { status: 500 });
  }
}
