import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import {
  academyFaqs,
  academyPlans,
  academyTestimonials,
} from "@/lib/academy";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";
import MentorshipApplication from "@/models/MentorshipApplication";
import AcademyAccessManager from "@/components/admin/AcademyAccessManager";
import { hasCourseGenerationExemption } from "@/lib/academy-access";
import MentorshipApplications, { type AdminMentorshipApplication } from "@/components/admin/MentorshipApplications";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academy Management | Admin",
};

type AdminStudentRecord = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  subscription?: { status?: string };
  courseGenerationExempt?: boolean;
};

type AdminCourseRecord = {
  _id: { toString(): string };
  studentEmail?: string;
  course?: { courseTitle?: string };
  progressPercent?: number;
};

type AdminApplicationRecord = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  goal?: string;
  level?: string;
  availability?: string;
  status?: string;
};

async function loadAcademyAdminData() {
  const empty = {
    students: [] as AdminStudentRecord[],
    courses: [] as AdminCourseRecord[],
    applications: [] as AdminApplicationRecord[],
    studentCount: 0,
    courseCount: 0,
    applicationCount: 0,
    subscriptionCount: 0,
    exemptionCount: 0,
    courseCountsByStudent: [] as Array<{ _id?: string; count: number }>,
    healthy: false,
  };

  try {
    await connectDB();
    const results = await Promise.allSettled([
      AcademyStudent.aggregate<{
        students: AdminStudentRecord[];
        total: Array<{ value: number }>;
        active: Array<{ value: number }>;
        exempt: Array<{ value: number }>;
      }>([
        {
          $facet: {
            students: [
              { $sort: { createdAt: -1 } },
              { $limit: 100 },
              { $project: { name: 1, email: 1, subscription: 1, courseGenerationExempt: 1 } },
            ],
            total: [{ $count: "value" }],
            active: [{ $match: { "subscription.status": "active" } }, { $count: "value" }],
            exempt: [{ $match: { courseGenerationExempt: true } }, { $count: "value" }],
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
      MentorshipApplication.aggregate<{
        applications: AdminApplicationRecord[];
        total: Array<{ value: number }>;
      }>([
        {
          $facet: {
            applications: [
              { $sort: { createdAt: -1 } },
              { $limit: 50 },
              { $project: { name: 1, email: 1, goal: 1, level: 1, availability: 1, status: 1 } },
            ],
            total: [{ $count: "value" }],
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
      active: Array<{ value: number }>;
      exempt: Array<{ value: number }>;
    }>>(0, [])[0];
    const courseData = value<Array<{
      courses: AdminCourseRecord[];
      total: Array<{ value: number }>;
      byStudent: Array<{ _id?: string; count: number }>;
    }>>(1, [])[0];
    const applicationData = value<Array<{
      applications: AdminApplicationRecord[];
      total: Array<{ value: number }>;
    }>>(2, [])[0];

    return {
      students: studentData?.students ?? [],
      courses: courseData?.courses ?? [],
      applications: applicationData?.applications ?? [],
      studentCount: studentData?.total[0]?.value ?? 0,
      courseCount: courseData?.total[0]?.value ?? 0,
      applicationCount: applicationData?.total[0]?.value ?? 0,
      subscriptionCount: studentData?.active[0]?.value ?? 0,
      exemptionCount: studentData?.exempt[0]?.value ?? 0,
      courseCountsByStudent: courseData?.byStudent ?? [],
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
    applications,
    studentCount,
    courseCount,
    applicationCount,
    subscriptionCount,
    exemptionCount,
    courseCountsByStudent,
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
    courseGenerationExempt: hasCourseGenerationExemption(student),
    courseCount: studentCourseCounts.get(student.email!.toLowerCase()) ?? 0,
  }));
  const configuredOnlyExemptions = students.filter((student) =>
    student.courseGenerationExempt === undefined && hasCourseGenerationExemption(student)
  ).length;
  const mentorshipApplications = applications
    .filter((application) => application.email)
    .map((application) => ({
      id: application._id.toString(),
      name: application.name || "Unnamed applicant",
      email: application.email!,
      goal: application.goal || "No goal provided",
      level: application.level || "Level not provided",
      availability: application.availability || "Availability not provided",
      status: (["received", "reviewing", "approved", "declined"].includes(application.status || "")
        ? application.status
        : "received") as AdminMentorshipApplication["status"],
    }));

  const stats = [
    { label: "Students", value: studentCount },
    { label: "Generated courses", value: courseCount },
    { label: "Active subscriptions", value: subscriptionCount },
    { label: "Access exemptions", value: exemptionCount + configuredOnlyExemptions },
    { label: "Mentorship applications", value: applicationCount },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#242424] bg-gradient-to-br from-[#11101a] via-[#0a0a0a] to-[#080808] p-7 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[90px]" />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#998dff]">Lumyn operations</p>
        <h1 className="relative mt-3 text-3xl font-bold tracking-tighter text-white sm:text-4xl">Academy command center</h1>
        <p className="relative mt-3 max-w-3xl text-sm leading-6 text-neutral-500">
          Manage students, AI learning paths, mentorship applications, subscriptions,
          certificates, pricing, testimonials, FAQs, and emails.
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
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Pricing</h2>
          <div className="space-y-3">
            {academyPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-[#222] bg-[#050505] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-white">{plan.name}</p>
                  <p className="text-sm font-bold text-[#7c6cf6]">{plan.price}/month</p>
                </div>
                <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <AcademyAccessManager initialStudents={accessStudents} />

      <div className="grid gap-6">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a]">
          <div className="border-b border-[#222] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Generated Courses</h2>
          </div>
          <div className="divide-y divide-[#222]">
            {courses.length ? (
              courses.map((course) => (
                <div key={course._id.toString()} className="p-5">
                  <p className="font-medium text-white">{course.course?.courseTitle || "Untitled course"}</p>
                  <p className="mt-1 text-sm text-neutral-500">{course.studentEmail || "Unknown student"}</p>
                  <p className="mt-2 text-xs text-neutral-600">{Number(course.progressPercent ?? 0)}% progress</p>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-neutral-600">No generated courses yet.</p>
            )}
          </div>
        </section>

      </div>

      <MentorshipApplications initialApplications={mentorshipApplications} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Testimonials</h2>
          <div className="space-y-3">
            {academyTestimonials.map((item) => (
              <div key={item.name} className="rounded-xl border border-[#222] bg-[#050505] p-4">
                <p className="text-sm text-neutral-400">"{item.quote}"</p>
                <p className="mt-3 text-sm font-semibold text-white">{item.name}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">FAQs</h2>
          <div className="space-y-3">
            {academyFaqs.map((item) => (
              <div key={item.question} className="rounded-xl border border-[#222] bg-[#050505] p-4">
                <p className="text-sm font-semibold text-white">{item.question}</p>
                <p className="mt-2 text-sm text-neutral-500">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
