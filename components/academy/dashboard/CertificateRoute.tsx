"use client";

import Link from "next/link";
import { ACADEMY_CERTIFICATE_PRICE_CENTS, ACADEMY_TUTOR_NAME, DIAMONDS_TO_UNLOCK_CERTIFICATE } from "@/lib/academy";
import { AwardIcon } from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import { openCertificate } from "@/components/academy/dashboard/utils";
import type { DashboardEnrollment } from "@/components/academy/dashboard/types";

export function CertificateRoute({
  certificateDisplayName,
  enrollments,
  isSubscribed,
  diamondsBalance,
  pendingAction,
  onUnlockWithPayment,
  onUnlockWithDiamonds,
}: {
  certificateDisplayName: string;
  enrollments: DashboardEnrollment[];
  isSubscribed: boolean;
  diamondsBalance: number;
  pendingAction: string | null;
  onUnlockWithPayment: (enrollmentId: string) => void;
  onUnlockWithDiamonds: (enrollmentId: string) => void;
}) {
  const unlockable = enrollments.filter(
    (enrollment) => enrollment.status === "completed" && !enrollment.certificate,
  );
  const earnedCertificates = enrollments.filter((enrollment) => Boolean(enrollment.certificate));
  const certificatePrice = `$${(ACADEMY_CERTIFICATE_PRICE_CENTS / 100).toFixed(2)}`;

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
              Every completed course earns a verified Lumyn Academy credential.
              Subscribers and students with 2 diamonds unlock certificates for
              free. Everyone else can unlock one for {certificatePrice}.
            </p>
          </div>
          <div className="whitespace-nowrap rounded-2xl border border-black/[0.08] bg-black/[0.025] px-4 py-3 text-sm font-bold text-neutral-600 dark:border-white/10 dark:bg-white/[0.045] dark:text-white/65">
            {earnedCertificates.length} earned
          </div>
        </div>
      </section>

      {unlockable.length > 0 && (
        <section className="rounded-[1.75rem] border border-[#7c6cf6]/25 bg-[#7c6cf6]/[0.06] p-5 shadow-sm sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
            Ready to unlock
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            {unlockable.length} course{unlockable.length === 1 ? "" : "s"} completed
          </h2>
          <div className="mt-5 space-y-4">
            {unlockable.map((enrollment) => {
              const paymentPending = pendingAction === `unlock-payment-${enrollment.id}`;
              const diamondsPending = pendingAction === `unlock-diamonds-${enrollment.id}`;
              const canAffordDiamonds = diamondsBalance >= DIAMONDS_TO_UNLOCK_CERTIFICATE;
              return (
                <article
                  key={enrollment.id}
                  className="rounded-2xl border border-black/[0.08] bg-white/85 p-4 dark:border-white/[0.08] dark:bg-[#0d0e13] sm:p-5"
                >
                  <p className="font-bold">{enrollment.courseTitle ?? "Completed course"}</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-white/42">
                    100% complete. Choose how you&apos;d like to unlock this certificate.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {isSubscribed ? (
                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] p-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        Included with your subscription. Check back shortly.
                      </div>
                    ) : (
                      <Link
                        href="/academy/dashboard/billing"
                        className="flex flex-col items-center justify-center gap-1 rounded-xl border border-black/[0.08] px-3 py-3 text-center text-xs font-bold text-neutral-600 transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/60 dark:hover:text-[#b9b1ff]"
                      >
                        <span>Subscribe</span>
                        <span className="text-[10px] font-semibold text-neutral-400">Free while active</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={paymentPending || diamondsPending}
                      onClick={() => onUnlockWithPayment(enrollment.id)}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl border border-black/[0.08] px-3 py-3 text-center text-xs font-bold text-neutral-600 transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] disabled:cursor-not-allowed disabled:opacity-55 dark:border-white/10 dark:text-white/60 dark:hover:text-[#b9b1ff]"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {paymentPending && <LoadingSpinner />}
                        Pay {certificatePrice}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-400">One-time payment</span>
                    </button>
                    <button
                      type="button"
                      disabled={!canAffordDiamonds || paymentPending || diamondsPending}
                      onClick={() => onUnlockWithDiamonds(enrollment.id)}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#7c6cf6] px-3 py-3 text-center text-xs font-bold text-white transition hover:bg-[#6b5bdd] disabled:cursor-not-allowed disabled:bg-black/[0.06] disabled:text-neutral-400 dark:disabled:bg-white/[0.05] dark:disabled:text-white/30"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {diamondsPending && <LoadingSpinner />}
                        {DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds
                      </span>
                      <span className="text-[10px] font-semibold opacity-80">
                        {canAffordDiamonds ? "Use referral diamonds" : `You have ${diamondsBalance}`}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
              Credential library
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Earned certificates</h2>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <AwardIcon />
          </span>
        </div>

        {earnedCertificates.length ? (
          <div className="mt-5 grid gap-3">
            {earnedCertificates.map((enrollment) => (
              <article
                key={enrollment.id}
                className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-4 dark:border-white/[0.08] dark:bg-white/[0.035]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {enrollment.courseTitle}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-white/42">
                      Issued{" "}
                      {enrollment.certificate
                        ? new Date(
                            enrollment.certificate.issuedAt,
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                    <p className="mt-2 break-all font-mono text-[10px] text-neutral-400">
                      {enrollment.certificate?.certificateId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:w-44">
                    <button
                      type="button"
                      onClick={() =>
                        void openCertificate(certificateDisplayName, enrollment)
                      }
                      className="rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#6b5bdd]"
                    >
                      View / save PDF
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-black/[0.12] bg-black/[0.02] p-6 text-sm leading-6 text-neutral-500 dark:border-white/12 dark:bg-white/[0.025] dark:text-white/42">
            No certificates yet. Complete a course and its final project to
            unlock your first credential: free with a subscription, for{" "}
            {certificatePrice}, or with {DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds
            from referrals.
          </div>
        )}
      </section>

      {!isSubscribed && (
        <p className="text-center text-xs text-neutral-500 dark:text-white/40">
          Subscribe to {ACADEMY_TUTOR_NAME} to unlock certificates on every course, forever.{" "}
          <Link href="/academy/dashboard/billing" className="font-semibold text-[#6c5ce7] hover:underline dark:text-[#b9b1ff]">
            See plans
          </Link>
        </p>
      )}
    </div>
  );
}
