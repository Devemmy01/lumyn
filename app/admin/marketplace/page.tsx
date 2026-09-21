import { Metadata } from "next";
import { decryptField } from "@/lib/crypto";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import AcademyStudent from "@/models/AcademyStudent";
import MarketplaceCourseManager, {
  type MarketplaceCourseEntry,
} from "@/components/admin/MarketplaceCourseManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Marketplace | Admin",
};

async function loadMarketplaceAdminData() {
  const empty = {
    courses: [] as MarketplaceCourseEntry[],
    pendingCount: 0,
    publishedCount: 0,
    healthy: false,
  };

  try {
    await connectDB();
    const [pendingCount, publishedCount, courses] = await Promise.all([
      CreatorCourse.countDocuments({ status: "pending_review" }),
      CreatorCourse.countDocuments({ status: "published" }),
      CreatorCourse.find({ status: { $in: ["pending_review", "published"] } })
        .select("creatorUid creatorEmail slug title level priceCents currency status submittedAt publishedAt purchaseCount modules")
        .sort({ updatedAt: -1 })
        .limit(100)
        .lean(),
    ]);

    const creatorUids = [...new Set(courses.map((course) => course.creatorUid))];
    const creators = await AcademyStudent.find({ firebaseUid: { $in: creatorUids } })
      .select("firebaseUid creatorProfile")
      .lean();
    const creatorByUid = new Map(creators.map((creator) => [creator.firebaseUid, creator.creatorProfile]));

    return {
      courses: courses.map((course) => {
        const creatorProfile = creatorByUid.get(course.creatorUid);
        return {
          _id: course._id.toString(),
          creatorEmail: course.creatorEmail,
          slug: course.slug,
          title: course.title,
          level: course.level,
          priceCents: course.priceCents,
          currency: course.currency,
          status: course.status,
          submittedAt: course.submittedAt?.toISOString(),
          publishedAt: course.publishedAt?.toISOString(),
          purchaseCount: course.purchaseCount,
          moduleCount: course.modules?.length ?? 0,
          lessonCount: course.modules?.reduce((sum, courseModule) => sum + (courseModule.lessons?.length ?? 0), 0) ?? 0,
          creatorPayoutStatus: creatorProfile?.payoutStatus ?? "unpaid",
          creatorIdentity: creatorProfile?.identity
            ? {
                legalName: decryptField(creatorProfile.identity.legalName),
                idType: creatorProfile.identity.idType,
                idNumber: decryptField(creatorProfile.identity.idNumber),
              }
            : null,
          creatorGuidelinesAcceptedAt: creatorProfile?.guidelinesAcceptedAt?.toISOString() ?? null,
        };
      }),
      pendingCount,
      publishedCount,
      healthy: true,
    };
  } catch (error) {
    console.error("[admin marketplace] Unable to load data", error);
    return empty;
  }
}

export default async function MarketplaceAdminPage() {
  const { courses, pendingCount, publishedCount, healthy } = await loadMarketplaceAdminData();

  const stats = [
    { label: "Pending review", value: pendingCount },
    { label: "Published", value: publishedCount },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#242424] bg-gradient-to-br from-[#11101a] via-[#0a0a0a] to-[#080808] p-7 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[90px]" />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#998dff]">Lumyn operations</p>
        <h1 className="relative mt-3 text-3xl font-bold tracking-tighter text-white sm:text-4xl">Creator marketplace</h1>
        <p className="relative mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
          Review courses submitted by creators before they go live.
        </p>
      </div>

      {!healthy && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-5 py-4 text-sm text-amber-100/80" role="status">
          Marketplace data loaded with partial data. Refresh in a moment.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <MarketplaceCourseManager initialCourses={courses} />
    </div>
  );
}
