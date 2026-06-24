"use client";

import { useState } from "react";

const statuses = ["received", "reviewing", "approved", "declined"] as const;
type MentorshipStatus = (typeof statuses)[number];

export type AdminMentorshipApplication = {
  id: string;
  name: string;
  email: string;
  goal: string;
  level: string;
  availability: string;
  status: MentorshipStatus;
};

export default function MentorshipApplications({
  initialApplications,
}: {
  initialApplications: AdminMentorshipApplication[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function updateStatus(id: string, status: MentorshipStatus) {
    const previous = applications.find((application) => application.id === id)?.status;
    setApplications((current) => current.map((application) => application.id === id ? { ...application, status } : application));
    setPendingId(id);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/academy/mentorship/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error ?? "The status could not be updated.");
      setNotice({ type: "success", message: "Mentorship status updated." });
    } catch (error) {
      if (previous) {
        setApplications((current) => current.map((application) => application.id === id ? { ...application, status: previous } : application));
      }
      setNotice({ type: "error", message: error instanceof Error ? error.message : "The status could not be updated." });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-end sm:p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#998dff]">Mentorship pipeline</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Applications</h2>
          <p className="mt-1 text-sm text-white/35">Review applicants and keep their status current.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/40">{applications.length} applications</span>
      </div>

      {notice && (
        <div role={notice.type === "error" ? "alert" : "status"} className={`mx-5 mt-5 rounded-xl border px-4 py-3 text-sm sm:mx-6 ${notice.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
          {notice.message}
        </div>
      )}

      <div className="divide-y divide-white/[0.06]">
        {applications.length ? applications.map((application) => (
          <article key={application.id} className="grid gap-5 p-5 transition hover:bg-white/[0.015] sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-semibold text-white">{application.name}</h3>
                <a href={`mailto:${application.email}`} className="text-xs text-[#a99eff] hover:text-white">{application.email}</a>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/45">{application.goal}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">{application.level} · {application.availability}</p>
            </div>
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">Application status</span>
              <div className="relative">
                <select
                  value={application.status}
                  disabled={pendingId === application.id}
                  onChange={(event) => updateStatus(application.id, event.target.value as MentorshipStatus)}
                  className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0a0a0d] px-4 pr-10 text-sm text-white outline-none transition focus:border-[#7c6cf6] disabled:cursor-wait disabled:opacity-60"
                >
                  {statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">⌄</span>
              </div>
            </label>
          </article>
        )) : <p className="p-10 text-center text-sm text-white/25">No mentorship applications yet.</p>}
      </div>
    </section>
  );
}
