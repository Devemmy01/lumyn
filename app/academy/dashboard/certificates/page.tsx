import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import StudentDashboard from "@/components/academy/StudentDashboard";
import connectDB from "@/lib/mongodb";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";

export const metadata: Metadata = { title: "Certificates | Lumyn Academy" };
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AcademyCertificatesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  if (!params.id) return <StudentDashboard />;

  await connectDB();
  const course = await AcademyCourse.findOne({ "certificate.certificateId": params.id }).lean();
  if (!course || !course.certificate) notFound();

  const student = await AcademyStudent.findOne({ firebaseUid: course.studentUid }).lean();
  const certificateName =
    course.certificate.certificateName?.trim() ||
    student?.certificateName?.trim() ||
    student?.name?.trim() ||
    "Lumyn Academy Student";
  const issuedAt = new Date(course.certificate.issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const publicOrigin = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio").replace(/\/$/, "");
  const verificationUrl = `${publicOrigin}/academy/dashboard/certificates?id=${encodeURIComponent(course.certificate.certificateId)}`;
  const qrCode = await QRCode.toString(verificationUrl, {
    type: "svg",
    margin: 1,
    width: 168,
    color: { dark: "#07111f", light: "#ffffff" },
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
          <div className="relative grid h-full gap-8 px-8 py-10 sm:px-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-16 lg:py-14">
            <section>
              <Image src="/logomain.png" alt="Lumyn" width={180} height={48} priority />
              <p className="mt-8 text-[10px] font-black uppercase tracking-[0.28em] text-[#b9b1ff] lg:mt-12">
                Verified certificate of completion
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.96] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
                {certificateName}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                This certificate verifies completion of{" "}
                <strong className="text-white">{course.course.courseTitle}</strong>{" "}
                by Lumyn Academy.
              </p>
              <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/12 bg-white/[0.045] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Certificate ID
                  </p>
                  <p className="mt-2 break-all font-mono text-sm font-semibold text-[#d7d0ff]">
                    {course.certificate.certificateId}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/[0.045] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
                    Date issued
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{issuedAt}</p>
                </div>
              </div>
              <p className="mt-8 max-w-2xl break-all font-mono text-[11px] leading-5 text-white/55">
                {verificationUrl}
              </p>
            </section>
            <aside className="relative border-white/15 lg:border-l lg:pl-8">
              <div className="pointer-events-none absolute -right-28 top-8 hidden h-72 w-72 opacity-75 lg:block">
                <div className="absolute inset-0 rotate-45 border-[13px] border-b-0 border-l-0 border-[#5f7cff]" />
                <div className="absolute inset-12 rotate-45 border-[13px] border-b-0 border-l-0 border-[#7c6cf6] opacity-75" />
              </div>
              <div className="relative mt-2 rounded-2xl border border-white/18 bg-[#0d1122]/45 p-5 backdrop-blur lg:mt-28">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b9b1ff]">
                  Verification
                </p>
                <h2 className="mt-2 text-lg font-black uppercase tracking-[0.05em] text-white">
                  Public certificate link
                </h2>
                <div
                  className="mx-auto mt-5 flex w-fit rounded-lg bg-white p-2 [&_svg]:h-40 [&_svg]:w-40"
                  aria-label="Certificate verification QR code"
                  dangerouslySetInnerHTML={{ __html: qrCode }}
                />
                <Link
                  href={verificationUrl}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-[#7c6cf6]/35 bg-[#7c6cf6]/16 px-4 py-3 text-sm font-bold text-[#efeaff] transition hover:bg-[#7c6cf6]/24"
                >
                  Open verification link
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
