"use client";

import Link from "next/link";
import { CertificateCard } from "@/components/academy/dashboard/FeedbackParts";
import { AwardIcon } from "@/components/academy/dashboard/icons";
import { openCertificate } from "@/components/academy/dashboard/utils";
import type { DashboardCourse } from "@/components/academy/dashboard/types";

export function CertificateRoute({
  certificateDisplayName,
  selected,
  earnedCertificates,
}: {
  certificateDisplayName: string;
  selected?: DashboardCourse;
  earnedCertificates: DashboardCourse[];
}) {
  return (
    <div className="certificates-route min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-6 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              Your achievements
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Certificates
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
              Every completed path earns a verified Lumyn Academy credential.
              View it, save it as a PDF, or open the public verification page.
            </p>
          </div>
          <div className="whitespace-nowrap rounded-2xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm font-bold text-neutral-600 dark:border-white/10 dark:bg-white/[0.045] dark:text-white/65">
            {earnedCertificates.length} earned
          </div>
        </div>
      </section>

      <CertificateCard studentName={certificateDisplayName} course={selected} />

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Credential library
            </p>
            <h2 className="mt-1 text-2xl font-semibold">
              Earned certificates
            </h2>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AwardIcon />
          </span>
        </div>

        {earnedCertificates.length ? (
          <div className="mt-5 grid gap-3">
            {earnedCertificates.map((course) => (
              <article
                key={course.id}
                className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-4 dark:border-white/[0.08] dark:bg-white/[0.035]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {course.course.courseTitle}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-white/42">
                      Issued{" "}
                      {course.certificate
                        ? new Date(course.certificate.issuedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : ""}
                    </p>
                    <p className="mt-2 break-all font-mono text-[10px] text-neutral-400">
                      {course.certificate?.certificateId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:w-44">
                    <button
                      type="button"
                      onClick={() =>
                        void openCertificate(certificateDisplayName, course)
                      }
                      className="rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#6b5bdd]"
                    >
                      View / save PDF
                    </button>
                    {course.certificate && (
                      <Link
                        href={`/academy/dashboard/certificates?id=${encodeURIComponent(course.certificate.certificateId)}`}
                        className="rounded-xl border border-black/[0.08] px-4 py-2.5 text-center text-xs font-bold text-neutral-600 transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/55 dark:hover:text-[#b9b1ff]"
                      >
                        Verify link
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-black/[0.12] bg-black/[0.02] p-6 text-sm leading-6 text-neutral-500 dark:border-white/12 dark:bg-white/[0.025] dark:text-white/42">
            No certificates yet. Complete a learning path and submit the final
            project to unlock your first credential.
          </div>
        )}
      </section>
    </div>
  );
}
