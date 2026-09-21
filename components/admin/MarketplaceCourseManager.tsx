"use client";

import { useState } from "react";

export type MarketplaceCourseEntry = {
  _id: string;
  creatorEmail: string;
  slug: string;
  title: string;
  level: string;
  priceCents: number;
  currency: string;
  status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  submittedAt?: string;
  publishedAt?: string;
  purchaseCount: number;
  moduleCount: number;
  lessonCount: number;
  creatorPayoutStatus: "unpaid" | "pending_first_approval" | "active";
  creatorIdentity: { legalName: string; idType: string; idNumber: string } | null;
  creatorGuidelinesAcceptedAt: string | null;
};

const idTypeLabels: Record<string, string> = {
  nin: "NIN",
  bvn: "BVN",
  passport: "Passport",
  drivers_license: "Driver's License",
  voters_card: "Voter's Card",
};

type Notice = { type: "success" | "error"; message: string };

const statusStyles: Record<MarketplaceCourseEntry["status"], string> = {
  draft: "border-neutral-600/30 bg-neutral-600/10 text-neutral-400",
  pending_review: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  rejected: "border-red-500/20 bg-red-500/10 text-red-300",
  archived: "border-neutral-600/30 bg-neutral-600/10 text-neutral-400",
};

export default function MarketplaceCourseManager({ initialCourses }: { initialCourses: MarketplaceCourseEntry[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);

  async function setStatus(id: string, status: "published" | "rejected" | "archived", reason?: string) {
    setPendingId(id);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/marketplace/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Course could not be updated.");

      setCourses((current) => current.map((course) => (course._id === id ? { ...course, status } : course)));
      setNotice({ type: "success", message: `Course is now ${status.replace("_", " ")}.` });
      setRejectingId(null);
      setRejectionReason("");
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Course could not be updated." });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#242424] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="border-b border-[#222] p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f82ff]">Creator marketplace</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Course moderation</h2>
        <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-400">
          Review a creator&apos;s submitted course, then publish it or reject it with a reason.
        </p>
        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}
          >
            {notice.message}
          </div>
        )}
      </div>

      <div className="divide-y divide-[#1f1f1f]">
        {courses.length ? (
          courses.map((course) => (
            <div key={course._id} className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.018] sm:px-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-white">{course.title}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${statusStyles[course.status]}`}>
                      {course.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    {course.creatorEmail} · {course.level} · {course.moduleCount} modules · {course.lessonCount} lessons · {course.currency} {(course.priceCents / 100).toFixed(2)} · {course.purchaseCount} sold
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {course.status === "pending_review" && (
                    <>
                      <button
                        type="button"
                        disabled={pendingId === course._id}
                        onClick={() => void setStatus(course._id, "published")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#7c6cf6]/30 bg-[#7c6cf6]/10 px-4 text-xs font-bold text-[#b8b0ff] transition hover:bg-[#7c6cf6]/20 disabled:opacity-50"
                      >
                        Publish
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingId(rejectingId === course._id ? null : course._id)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {course.status === "published" && (
                    <button
                      type="button"
                      disabled={pendingId === course._id}
                      onClick={() => void setStatus(course._id, "archived")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>

              {course.status === "pending_review" && course.creatorPayoutStatus !== "active" && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-amber-300">
                    First submission — verify identity before publishing
                  </p>
                  {course.creatorIdentity ? (
                    <p className="mt-2 text-sm text-neutral-300">
                      {course.creatorIdentity.legalName} · {idTypeLabels[course.creatorIdentity.idType] ?? course.creatorIdentity.idType}{" "}
                      {course.creatorIdentity.idNumber} · Guidelines accepted{" "}
                      {course.creatorGuidelinesAcceptedAt
                        ? new Date(course.creatorGuidelinesAcceptedAt).toLocaleDateString()
                        : "no"}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-red-300">
                      No identity information on file — do not publish until this creator submits it.
                    </p>
                  )}
                </div>
              )}

              {rejectingId === course._id && (
                <div className="rounded-xl border border-[#2a2a2a] bg-black/20 p-4">
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Why is this course being rejected? The creator will see this."
                    rows={2}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#7c6cf6]"
                  />
                  <button
                    type="button"
                    disabled={pendingId === course._id || !rejectionReason.trim()}
                    onClick={() => void setStatus(course._id, "rejected", rejectionReason)}
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-red-500/15 px-4 text-xs font-bold text-red-300 transition hover:bg-red-500/25 disabled:opacity-50"
                  >
                    Confirm rejection
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="p-10 text-center text-sm text-neutral-500">No courses are pending review.</p>
        )}
      </div>
    </section>
  );
}
