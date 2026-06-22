import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import {
  adminAcademyTools,
  academyFaqs,
  academyPlans,
  academyTestimonials,
} from "@/lib/academy";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";
import MentorshipApplication from "@/models/MentorshipApplication";
import AcademyAccessManager from "@/components/admin/AcademyAccessManager";
import { hasCourseGenerationExemption } from "@/lib/academy-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academy Management | Admin",
};

export default async function AcademyAdminPage() {
  await connectDB();

  const [
    students,
    courses,
    applications,
    studentCount,
    courseCount,
    applicationCount,
    subscriptionCount,
    exemptionCount,
    courseCountsByStudent,
  ] = await Promise.all([
    AcademyStudent.find().sort({ createdAt: -1 }).limit(100).lean(),
    AcademyCourse.find().sort({ createdAt: -1 }).limit(8).lean(),
    MentorshipApplication.find().sort({ createdAt: -1 }).limit(8).lean(),
    AcademyStudent.countDocuments(),
    AcademyCourse.countDocuments(),
    MentorshipApplication.countDocuments(),
    AcademyStudent.countDocuments({ "subscription.status": "active" }),
    AcademyStudent.countDocuments({ courseGenerationExempt: true }),
    AcademyCourse.aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$studentEmail", count: { $sum: 1 } } },
    ]),
  ]);

  const studentCourseCounts = new Map(
    courseCountsByStudent.map((item) => [item._id?.toLowerCase(), item.count])
  );
  const accessStudents = students.map((student) => ({
    id: student._id.toString(),
    name: student.name,
    email: student.email,
    subscriptionStatus: student.subscription?.status ?? "inactive",
    courseGenerationExempt: hasCourseGenerationExemption(student),
    courseCount: studentCourseCounts.get(student.email.toLowerCase()) ?? 0,
  }));
  const configuredOnlyExemptions = students.filter((student) =>
    student.courseGenerationExempt === undefined && hasCourseGenerationExemption(student)
  ).length;

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{stat.label}</p>
            <p className="mt-4 text-4xl font-bold tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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

        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-white">Admin Tools</h2>
          <div className="grid grid-cols-2 gap-3">
            {adminAcademyTools.map((tool) => (
              <div key={tool} className="rounded-xl border border-[#222] bg-[#050505] p-3 text-sm text-neutral-400">
                {tool}
              </div>
            ))}
          </div>
        </section>
      </div>

      <AcademyAccessManager initialStudents={accessStudents} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a]">
          <div className="border-b border-[#222] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Generated Courses</h2>
          </div>
          <div className="divide-y divide-[#222]">
            {courses.length ? (
              courses.map((course) => (
                <div key={course._id.toString()} className="p-5">
                  <p className="font-medium text-white">{course.course.courseTitle}</p>
                  <p className="mt-1 text-sm text-neutral-500">{course.studentEmail}</p>
                  <p className="mt-2 text-xs text-neutral-600">{course.progressPercent}% progress</p>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-neutral-600">No generated courses yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#222] bg-[#0a0a0a]">
          <div className="border-b border-[#222] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Mentorship</h2>
          </div>
          <div className="divide-y divide-[#222]">
            {applications.length ? (
              applications.map((application) => (
                <div key={application._id.toString()} className="p-5">
                  <p className="font-medium text-white">{application.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{application.goal}</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-[#7c6cf6]">
                    {application.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-neutral-600">No applications yet.</p>
            )}
          </div>
        </section>
      </div>

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
