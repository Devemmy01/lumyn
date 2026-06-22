"use client";

import { useMemo, useState, type FormEvent } from "react";

export type AcademyAccessStudent = {
  id: string;
  name?: string;
  email: string;
  subscriptionStatus: string;
  courseGenerationExempt: boolean;
  courseCount: number;
};

type Notice = { type: "success" | "error"; message: string };

export default function AcademyAccessManager({ initialStudents }: { initialStudents: AcademyAccessStudent[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const visibleStudents = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      `${student.name ?? ""} ${student.email}`.toLowerCase().includes(term)
    );
  }, [query, students]);

  async function updateAccess(targetEmail: string, exempt: boolean) {
    const normalizedEmail = targetEmail.trim().toLowerCase();
    if (!normalizedEmail) return false;
    setPendingEmail(normalizedEmail);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/academy/access", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, courseGenerationExempt: exempt }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Access could not be updated.");

      setStudents((current) => {
        const existing = current.find((student) => student.email === normalizedEmail);
        if (existing) {
          return current.map((student) => student.email === normalizedEmail
            ? { ...student, courseGenerationExempt: exempt }
            : student
          );
        }
        return [{
          id: payload.student.id,
          name: payload.student.name,
          email: payload.student.email,
          subscriptionStatus: "inactive",
          courseGenerationExempt: exempt,
          courseCount: 0,
        }, ...current];
      });
      setNotice({
        type: "success",
        message: exempt
          ? `${normalizedEmail} can now generate unlimited Academy courses.`
          : `Unlimited course access was removed from ${normalizedEmail}.`,
      });
      return true;
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Access could not be updated.",
      });
      return false;
    } finally {
      setPendingEmail(null);
    }
  }

  async function grantByEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await updateAccess(email, true)) setEmail("");
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#242424] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="border-b border-[#222] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f82ff]">Access control</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Student course exemptions</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-500">
              Grant selected accounts unlimited course generation and tutor access without changing their subscription.
            </p>
          </div>
          <form onSubmit={grantByEmail} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              required
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#2a2a2a] bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-neutral-700 focus:border-[#7c6cf6]"
            />
            <button
              type="submit"
              disabled={Boolean(pendingEmail)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6959df] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {pendingEmail === email.trim().toLowerCase() && <Spinner />}
              Grant unlimited
            </button>
          </form>
        </div>
        {notice && (
          <div role={notice.type === "error" ? "alert" : "status"} className={`mt-4 rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
            {notice.message}
          </div>
        )}
      </div>

      <div className="border-b border-[#222] p-4 sm:px-6">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search students by name or email…"
          className="h-10 w-full rounded-xl border border-[#222] bg-[#050505] px-4 text-sm text-white outline-none placeholder:text-neutral-700 focus:border-[#7c6cf6]"
        />
      </div>

      <div className="divide-y divide-[#1f1f1f]">
        {visibleStudents.length ? visibleStudents.map((student) => (
          <div key={student.id} className="flex flex-col justify-between gap-4 p-5 transition hover:bg-white/[0.018] sm:flex-row sm:items-center sm:px-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium text-white">{student.name || student.email}</p>
                {student.courseGenerationExempt && <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">Unlimited</span>}
              </div>
              <p className="mt-1 truncate text-sm text-neutral-500">{student.email}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">{student.courseCount} courses · {student.subscriptionStatus}</p>
            </div>
            <button
              type="button"
              disabled={pendingEmail === student.email}
              onClick={() => updateAccess(student.email, !student.courseGenerationExempt)}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition disabled:opacity-50 ${student.courseGenerationExempt ? "border-red-500/20 bg-red-500/[0.06] text-red-300 hover:bg-red-500/10" : "border-[#7c6cf6]/30 bg-[#7c6cf6]/10 text-[#b8b0ff] hover:bg-[#7c6cf6]/20"}`}
            >
              {pendingEmail === student.email && <Spinner />}
              {student.courseGenerationExempt ? "Revoke exemption" : "Grant unlimited"}
            </button>
          </div>
        )) : <p className="p-10 text-center text-sm text-neutral-600">No matching Academy students.</p>}
      </div>
    </section>
  );
}

function Spinner() {
  return <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />;
}
