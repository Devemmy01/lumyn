import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";
import connectDB from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyEnrollment from "@/models/AcademyEnrollment";
import AcademyStudent from "@/models/AcademyStudent";

export const metadata: Metadata = { title: "Certificates | Lumyn Academy" };
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

async function findCertificateRecord(certificateId: string) {
  const enrollment = await AcademyEnrollment.findOne({
    "certificate.certificateId": certificateId,
  }).lean();
  if (enrollment?.certificate) {
    const catalogCourse = await AcademyCatalogCourse.findById(enrollment.catalogCourseId)
      .select("content.courseTitle")
      .lean();
    return {
      studentUid: enrollment.studentUid,
      certificate: enrollment.certificate,
      courseTitle: catalogCourse?.content?.courseTitle ?? "a Lumyn Academy course",
    };
  }

  const legacyCourse = await AcademyCourse.findOne({
    "certificate.certificateId": certificateId,
  }).lean();
  if (legacyCourse?.certificate) {
    return {
      studentUid: legacyCourse.studentUid,
      certificate: legacyCourse.certificate,
      courseTitle: legacyCourse.course?.courseTitle ?? "a Lumyn Academy course",
    };
  }

  return null;
}

export default async function AcademyCertificatesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  if (!params.id) return <StudentDashboard />;

  await connectDB();
  const record = await findCertificateRecord(params.id);
  if (!record) notFound();

  const student = await AcademyStudent.findOne({ firebaseUid: record.studentUid }).lean();
  const certificateName =
    record.certificate.certificateName?.trim() ||
    student?.certificateName?.trim() ||
    student?.name?.trim() ||
    "Lumyn Academy Student";
  const issuedAt = new Date(record.certificate.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#090712] px-4 py-8 text-white">
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        @media print {
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          html,
          body {
            background: #090712 !important;
          }
          main {
            min-height: 100vh !important;
            background: #090712 !important;
            padding: 0 !important;
          }
        }
      `}</style>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="relative aspect-[1120/680] w-full overflow-hidden bg-[#08070d] shadow-[0_30px_100px_rgba(0,0,0,0.5)] max-lg:aspect-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_13%,rgba(124,108,246,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(31,184,255,0.12),transparent_24%),linear-gradient(135deg,#090712_0%,#121329_47%,#062237_100%)]" />
          <div className="absolute left-0 top-0 h-20 w-48 bg-[#7c4dff] [clip-path:polygon(0_0,100%_0,70%_100%,0_100%)]" />
          <div className="absolute bottom-0 right-0 h-24 w-64 bg-gradient-to-r from-[#5f7cff] to-[#7c6cf6] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-5 border border-white/20 [clip-path:polygon(0_0,92%_0,100%_12%,100%_100%,8%_100%,0_88%)]" />
          <div className="relative grid h-full gap-8 px-8 py-10 sm:px-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:px-16 lg:py-14">
            <section>
              <Image src="/logomain.png" alt="Lumyn" width={180} height={48} priority />
              <p className="mt-8 text-[10px] font-black uppercase tracking-[0.28em] text-[#b9b1ff] lg:mt-12">
                Certificate of completion
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                {certificateName}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                This certificate recognizes successful completion of{" "}
                <strong className="text-white">{record.courseTitle}</strong>{" "}
                by Lumyn Academy.
              </p>
              <div className="mt-8 grid max-w-xs gap-4">
                <div className="rounded-2xl border border-white/12 bg-white/[0.045] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Date issued
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{issuedAt}</p>
                </div>
              </div>
            </section>
            <aside className="relative lg:pl-8">
              <div className="pointer-events-none absolute -right-28 top-8 hidden h-72 w-72 opacity-75 lg:block">
                <div className="absolute inset-0 rotate-45 border-[13px] border-b-0 border-l-0 border-[#5f7cff]" />
                <div className="absolute inset-12 rotate-45 border-[13px] border-b-0 border-l-0 border-[#7c6cf6] opacity-75" />
              </div>
              <div className="relative mt-2 rounded-2xl border border-white/18 bg-[#0d1122]/45 p-5 backdrop-blur lg:mt-28">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b9b1ff]">
                  Credential
                </p>
                <h2 className="mt-2 text-lg font-black uppercase tracking-[0.05em] text-white">
                  Lumyn Academy
                </h2>
                <p className="mt-4 text-sm leading-6 text-white/58">
                  Issued for completing the course requirements, practical work,
                  assessments, and final project.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
