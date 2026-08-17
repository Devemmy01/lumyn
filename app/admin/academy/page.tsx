import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import {
  academySubscriptionPlan,
  ACADEMY_CERTIFICATE_PRICE_CENTS,
} from "@/lib/academy";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";
import AcademyAccessManager from "@/components/admin/AcademyAccessManager";
import AcademyCatalogManager, { type AcademyCatalogEntry } from "@/components/admin/AcademyCatalogManager";
import { hasVipAccess } from "@/lib/academy-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academy Management | Admin",
};

type AdminStudentRecord = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  subscription?: { status?: string };
  diamondsBalance?: number;
  vipAccess?: boolean;
};

type AdminCourseRecord = {
  _id: { toString(): string };
  studentEmail?: string;
  course?: { courseTitle?: string };
  progressPercent?: number;
};

async function loadAcademyAdminData() {
  const empty = {
    students: [] as AdminStudentRecord[],
    courses: [] as AdminCourseRecord[],
    studentCount: 0,
    courseCount: 0,
    diamondBalanceTotal: 0,
    vipCount: 0,
    courseCountsByStudent: [] as Array<{ _id?: string; count: number }>,
    catalogCourseCount: 0,
    catalogPublishedCount: 0,
    catalogCourses: [] as AcademyCatalogEntry[],
    healthy: false,
  };

  try {
    await connectDB();
    const results = await Promise.allSettled([
      AcademyStudent.aggregate<{
        students: AdminStudentRecord[];
        total: Array<{ value: number }>;
        active: Array<{ value: number }>;
        vip: Array<{ value: number }>;
      }>([
        {
          $facet: {
            students: [
              { $sort: { createdAt: -1 } },
              { $limit: 100 },
              { $project: { name: 1, email: 1, subscription: 1, diamondsBalance: 1, vipAccess: 1 } },
            ],
            total: [{ $count: "value" }],
            diamonds: [{ $group: { _id: null, value: { $sum: { $ifNull: ["$diamondsBalance", 0] } } } }],
            vip: [{ $match: { vipAccess: true } }, { $count: "value" }],
          },
        },
      ]),
      AcademyCourse.aggregate<{
        courses: AdminCourseRecord[];
        total: Array<{ value: number }>;
        byStudent: Array<{ _id?: string; count: number }>;
      }>([
        {
          $facet: {
            courses: [
              { $sort: { createdAt: -1 } },
              { $limit: 8 },
              { $project: { studentEmail: 1, course: 1, progressPercent: 1 } },
            ],
            total: [{ $count: "value" }],
            byStudent: [
              { $match: { studentEmail: { $type: "string" } } },
              { $group: { _id: "$studentEmail", count: { $sum: 1 } } },
            ],
          },
        },
      ]),
      AcademyCatalogCourse.aggregate<{
        total: Array<{ value: number }>;
        published: Array<{ value: number }>;
        list: Array<{
          slug: string;
          language: string;
          level: string;
          status: AcademyCatalogEntry["status"];
          generatedAt?: string;
          courseTitle?: string;
          moduleCount: number;
        }>;
      }>([
        {
          $facet: {
            total: [{ $count: "value" }],
            published: [{ $match: { status: "published" } }, { $count: "value" }],
            list: [
              { $sort: { updatedAt: -1 } },
              { $limit: 50 },
              {
                $project: {
                  _id: 0,
                  slug: 1,
                  language: 1,
                  level: 1,
                  status: 1,
                  generatedAt: 1,
                  courseTitle: "$content.courseTitle",
                  moduleCount: { $size: { $ifNull: ["$content.modules", []] } },
                },
              },
            ],
          },
        },
      ]),
    ]);

    const value = <T,>(index: number, fallback: T): T =>
      results[index].status === "fulfilled"
        ? (results[index] as PromiseFulfilledResult<T>).value
        : fallback;

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`[admin academy] Query ${index + 1} failed`, result.reason);
      }
    });

    const studentData = value<Array<{
      students: AdminStudentRecord[];
      total: Array<{ value: number }>;
      diamonds: Array<{ value: number }>;
      vip: Array<{ value: number }>;
    }>>(0, [])[0];
    const courseData = value<Array<{
      courses: AdminCourseRecord[];
      total: Array<{ value: number }>;
      byStudent: Array<{ _id?: string; count: number }>;
    }>>(1, [])[0];
    const catalogData = value<Array<{
      total: Array<{ value: number }>;
      published: Array<{ value: number }>;
      list: AcademyCatalogEntry[];
    }>>(2, [])[0];
    return {
      students: studentData?.students ?? [],
      courses: courseData?.courses ?? [],
      studentCount: studentData?.total[0]?.value ?? 0,
      courseCount: courseData?.total[0]?.value ?? 0,
      diamondBalanceTotal: studentData?.diamonds[0]?.value ?? 0,
      vipCount: studentData?.vip[0]?.value ?? 0,
      courseCountsByStudent: courseData?.byStudent ?? [],
      catalogCourseCount: catalogData?.total[0]?.value ?? 0,
      catalogPublishedCount: catalogData?.published[0]?.value ?? 0,
      catalogCourses: catalogData?.list ?? [],
      healthy: results.every((result) => result.status === "fulfilled"),
    };
  } catch (error) {
    console.error("[admin academy] Unable to connect or load data", error);
    return empty;
  }
}

export default async function AcademyAdminPage() {
  const {
    students,
    courses,
    studentCount,
    courseCount,
    diamondBalanceTotal,
    vipCount,
    courseCountsByStudent,
    catalogCourseCount,
    catalogPublishedCount,
    catalogCourses,
    healthy,
  } = await loadAcademyAdminData();

  const studentCourseCounts = new Map(
    courseCountsByStudent
      .filter((item) => typeof item._id === "string")
      .map((item) => [item._id!.toLowerCase(), item.count])
  );
  const accessStudents = students.filter((student) => Boolean(student.email)).map((student) => ({
    id: student._id.toString(),
    name: student.name,
    email: student.email!,
    subscriptionStatus: student.subscription?.status ?? "inactive",
    diamondsBalance: student.diamondsBalance ?? 0,
    vipAccess: hasVipAccess(student),
    courseCount: studentCourseCounts.get(student.email!.toLowerCase()) ?? 0,
  }));
  const configuredOnlyVip = students.filter((student) =>
    student.vipAccess === undefined && hasVipAccess(student)
  ).length;
  const stats = [
    { label: "Students", value: studentCount },
    { label: "Generated courses (legacy)", value: courseCount },
    { label: "Catalog courses", value: `${catalogPublishedCount}/${catalogCourseCount} published` },
    { label: "Student diamonds", value: diamondBalanceTotal },
    { label: "VIP access", value: vipCount + configuredOnlyVip },
    { label: "Subscription / certificate", value: `${academySubscriptionPlan.price}/mo · $${(ACADEMY_CERTIFICATE_PRICE_CENTS / 100).toFixed(2)}` },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#242424] bg-gradient-to-br from-[#11101a] via-[#0a0a0a] to-[#080808] p-7 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[90px]" />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#998dff]">Lumyn operations</p>
        <h1 className="relative mt-3 text-3xl font-bold tracking-tighter text-white sm:text-4xl">Academy command center</h1>
        <p className="relative mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
          Manage students, the course catalog, diamonds, certificates, and pricing.
        </p>
      </div>

      {!healthy && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-5 py-4 text-sm text-amber-100/80" role="status">
          Academy management loaded with partial data. Refresh in a moment; available controls remain safe to use.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Pricing</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-[#222] bg-[#050505] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">{academySubscriptionPlan.name}</p>
                <p className="text-sm font-bold text-[#7c6cf6]">{academySubscriptionPlan.price}/{academySubscriptionPlan.cadence}</p>
              </div>
              <p className="mt-2 text-sm text-neutral-400">{academySubscriptionPlan.description}</p>
            </div>
            <div className="rounded-xl border border-[#222] bg-[#050505] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">Certificate unlock</p>
                <p className="text-sm font-bold text-[#7c6cf6]">${(ACADEMY_CERTIFICATE_PRICE_CENTS / 100).toFixed(2)}</p>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                Free for active subscribers or with 2 diamonds; otherwise a one-time ${(ACADEMY_CERTIFICATE_PRICE_CENTS / 100).toFixed(2)} payment unlocks a completed course&apos;s certificate.
              </p>
            </div>
          </div>
        </section>

      </div>

      <AcademyAccessManager initialStudents={accessStudents} />

      <AcademyCatalogManager initialCourses={catalogCourses} />

      <div className="grid gap-6">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a]">
          <div className="border-b border-[#222] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Legacy Generated Courses</h2>
            <p className="mt-1 text-xs text-neutral-500">Per-student courses generated before the shared catalog. Frozen and read-only.</p>
          </div>
          <div className="divide-y divide-[#222]">
            {courses.length ? (
              courses.map((course) => (
                <div key={course._id.toString()} className="p-5">
                  <p className="font-medium text-white">{course.course?.courseTitle || "Untitled course"}</p>
                  <p className="mt-1 text-sm text-neutral-400">{course.studentEmail || "Unknown student"}</p>
                  <p className="mt-2 text-xs text-neutral-500">{Number(course.progressPercent ?? 0)}% progress</p>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-neutral-500">No legacy generated courses.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
