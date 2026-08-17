"use client";

import Link from "next/link";
import AstraMascot from "@/components/academy/AstraMascot";
import {
  type AssignmentSubmission,
  type SubmissionEvaluation,
} from "@/lib/academy";
import { AwardIcon } from "@/components/academy/dashboard/icons";
import { openCertificate } from "@/components/academy/dashboard/utils";
import type {
  DashboardEnrollment,
  QuizResultState,
  ToastState,
} from "@/components/academy/dashboard/types";

type SubmissionFile = {
  name: string;
  language: string;
  code: string;
};

type SubmissionSummaryData = {
  content: string;
  status: string;
  submittedAt: string;
};

function extractSection(
  content: string,
  label: string,
  nextLabels: string[],
) {
  const escapedNextLabels = nextLabels
    .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const matcher = new RegExp(
    `${label}:\\s*([\\s\\S]*?)(?=\\n(?:${escapedNextLabels}):|\\n\\n(?:${escapedNextLabels}):|$)`,
  );
  return content.match(matcher)?.[1]?.trim() ?? "";
}

function parseSubmissionContent(content: string) {
  const files: SubmissionFile[] = [];
  const fileMatcher =
    /File:\s*([^\n]+)\n```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = fileMatcher.exec(content)) !== null) {
    files.push({
      name: match[1].trim(),
      language: match[2].trim() || "text",
      code: match[3].trim(),
    });
  }

  const assignment = extractSection(content, "Assignment", [
    "Mini project",
    "Notes",
    "Code workspace",
  ]);
  const finalProject = extractSection(content, "Final project", [
    "Project overview",
    "Implementation notes",
    "Code workspace",
  ]);
  const projectOverview = extractSection(content, "Project overview", [
    "Implementation notes",
    "Code workspace",
  ]);
  const miniProject = extractSection(content, "Mini project", [
    "Notes",
    "Code workspace",
  ]);
  const notes = extractSection(content, "Notes", ["Code workspace"]);
  const implementationNotes = extractSection(content, "Implementation notes", [
    "Code workspace",
  ]);
  const fallback = content
    .replace(/Assignment:\s*[\s\S]*?(?=\nMini project:|\n\nNotes:|\n\nCode workspace:|$)/, "")
    .replace(/Final project:\s*[\s\S]*?(?=\nProject overview:|\n\nImplementation notes:|\n\nCode workspace:|$)/, "")
    .replace(/Project overview:\s*[\s\S]*?(?=\nImplementation notes:|\n\nCode workspace:|$)/, "")
    .replace(/Mini project:\s*[\s\S]*?(?=\n\nNotes:|\n\nCode workspace:|$)/, "")
    .replace(/Notes:\s*[\s\S]*?(?=\n\nCode workspace:|$)/, "")
    .replace(/Implementation notes:\s*[\s\S]*?(?=\n\nCode workspace:|$)/, "")
    .replace(/Code workspace:\s*[\s\S]*$/, "")
    .trim();

  return {
    assignment,
    finalProject,
    projectOverview,
    miniProject,
    notes,
    implementationNotes,
    files,
    fallback,
  };
}

export function SubmissionSummary({
  submission,
}: {
  submission: AssignmentSubmission | SubmissionSummaryData;
}) {
  const parsed = parseSubmissionContent(submission.content);
  const submittedAt = new Date(submission.submittedAt).toLocaleDateString();
  const accepted = submission.status !== "needs_revision";

  return (
    <section
      className={`mt-5 rounded-2xl border p-4 text-sm ${accepted ? "border-emerald-500/20 bg-emerald-500/[0.08]" : "border-amber-500/20 bg-amber-500/[0.08]"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p
            className={`font-bold ${accepted ? "text-emerald-600 dark:text-emerald-300" : "text-amber-600 dark:text-amber-300"}`}
          >
            {accepted ? "Accepted" : "Needs revision"}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/45">
            Submitted {submittedAt}
          </p>
        </div>
        {parsed.files.length > 0 && (
          <span className="rounded-full border border-black/[0.08] bg-white/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:border-white/10 dark:bg-black/20 dark:text-white/45">
            {parsed.files.length} file{parsed.files.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {(parsed.assignment || parsed.miniProject) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {parsed.assignment && (
            <div className="rounded-xl border border-black/[0.06] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-black/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Assignment
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-600 dark:text-white/50">
                {parsed.assignment}
              </p>
            </div>
          )}
          {parsed.miniProject && (
            <div className="rounded-xl border border-black/[0.06] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-black/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Mini project
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-600 dark:text-white/50">
                {parsed.miniProject}
              </p>
            </div>
          )}
        </div>
      )}

      {(parsed.finalProject || parsed.projectOverview) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {parsed.finalProject && (
            <div className="rounded-xl border border-black/[0.06] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-black/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Final project
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-600 dark:text-white/50">
                {parsed.finalProject}
              </p>
            </div>
          )}
          {parsed.projectOverview && (
            <div className="rounded-xl border border-black/[0.06] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-black/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Project overview
              </p>
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-600 dark:text-white/50">
                {parsed.projectOverview}
              </p>
            </div>
          )}
        </div>
      )}

      {(parsed.notes || parsed.implementationNotes) && (
        <div className="mt-3 rounded-xl border border-black/[0.06] bg-white/55 p-3 dark:border-white/[0.08] dark:bg-black/15">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {parsed.implementationNotes ? "Implementation notes" : "Notes"}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-neutral-600 dark:text-white/50">
            {parsed.implementationNotes || parsed.notes}
          </p>
        </div>
      )}

      {parsed.files.length > 0 ? (
        <div className="mt-3 space-y-3">
          {parsed.files.map((file) => (
            <details
              key={`${file.name}-${file.language}`}
              className="overflow-hidden rounded-xl border border-black/[0.08] bg-[#08090c] text-white dark:border-white/10"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-white/[0.06] px-4 py-3 text-xs font-bold [&::-webkit-details-marker]:hidden">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[9px] uppercase tracking-widest text-white/50">
                  {file.language}
                </span>
              </summary>
              <pre className="max-h-72 overflow-auto p-4 text-xs leading-6 text-[#d9d6ff]">
                <code>{file.code}</code>
              </pre>
            </details>
          ))}
        </div>
      ) : (
        parsed.fallback && (
          <p className="mt-3 whitespace-pre-wrap rounded-xl border border-black/[0.06] bg-white/55 p-3 text-xs leading-5 text-neutral-600 dark:border-white/[0.08] dark:bg-black/15 dark:text-white/50">
            {parsed.fallback}
          </p>
        )
      )}
    </section>
  );
}

export function EvaluationFeedback({
  evaluation,
}: {
  evaluation: SubmissionEvaluation;
}) {
  return (
    <div
      className={`mt-5 rounded-2xl border p-5 ${evaluation.passed ? "border-emerald-500/20 bg-emerald-500/[0.07]" : "border-amber-500/20 bg-amber-500/[0.07]"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold">AI assessment</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${evaluation.passed ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}
        >
          {evaluation.score}% ·{" "}
          {evaluation.passed ? "Passed" : "Needs revision"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-white/55">
        {evaluation.summary}
      </p>
      {evaluation.strengths.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-emerald-600">What worked</p>
          <ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-white/50">
            {evaluation.strengths.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>
      )}
      {evaluation.improvements.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-amber-600">Improve next</p>
          <ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-white/50">
            {evaluation.improvements.map((item) => (
              <li key={item}>→ {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastState;
  onClose: () => void;
}) {
  const colors = {
    success: "border-emerald-500/25 bg-emerald-950 text-emerald-50",
    error: "border-red-500/25 bg-red-950 text-red-50",
    warning: "border-amber-500/25 bg-amber-950 text-amber-50",
    info: "border-[#7c6cf6]/25 bg-[#17142b] text-white",
  };
  const icons = { success: "✓", error: "!", warning: "!", info: "i" };
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-20 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl ${colors[toast.type]}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-sm leading-6">{toast.message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-lg opacity-50 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export function QuizResultModal({
  result,
  title,
  onClose,
}: {
  result: QuizResultState;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-result-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-[#111218] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-white shadow-2xl sm:rounded-[2rem] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold sm:h-20 sm:w-20 sm:text-2xl ${result.passed ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
        >
          {result.score}%
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a99eff] sm:mt-6">
          Quiz result
        </p>
        <h2 id="quiz-result-title" className="mt-2 text-xl font-semibold sm:text-2xl">
          {result.passed
            ? "Excellent!\nmodule quiz passed!"
            : "Good attempt. Review and retry."}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/50">
          {title}.{" "}
          {result.passed
            ? "Your result is saved and the quiz is complete."
            : "Correct answers and explanations are now highlighted below."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-11 w-full rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white sm:mt-6"
        >
          Review answers
        </button>
      </div>
    </div>
  );
}

export function CelebrationModal({
  courseTitle,
  onClose,
}: {
  courseTitle: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center overflow-hidden bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 28 }, (_, index) => (
          <i
            key={index}
            className="academy-confetti"
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${(index % 8) * 0.14}s`,
              backgroundColor: [
                "#7c6cf6",
                "#f59e0b",
                "#10b981",
                "#38bdf8",
                "#f472b6",
              ][index % 5],
            }}
          />
        ))}
      </div>
      <div
        className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-[#111218] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-white shadow-2xl sm:rounded-[2.25rem] sm:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/[0.06] sm:h-28 sm:w-28 sm:rounded-[2rem]">
          <AstraMascot
            expression="celebrating"
            className="h-24 w-24 translate-y-1 sm:h-32 sm:w-32"
          />
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9b1ff] sm:mt-6">
          Course complete
        </p>
        <h2 className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">You did it!</h2>
        <p className="mt-3 text-sm leading-6 text-white/55">
          You completed <strong className="text-white">{courseTitle}</strong>.
          Your certificate is ready to view and print.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-3 text-xs font-semibold sm:px-5 sm:text-sm"
          >
            Stay here
          </button>
          <Link
            href="/academy/dashboard/certificates"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7c6cf6] px-3 text-xs font-bold text-white sm:px-5 sm:text-sm"
          >
            View certificate
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ModuleCelebrationModal({
  title,
  message,
  xp,
  onClose,
}: {
  title: string;
  message: string;
  xp: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[94] flex items-end justify-center overflow-hidden bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 32 }, (_, index) => (
          <i
            key={index}
            className="academy-confetti"
            style={{
              left: `${(index * 29) % 100}%`,
              animationDelay: `${(index % 10) * 0.09}s`,
              animationDuration: `${2.4 + (index % 5) * 0.22}s`,
              backgroundColor: [
                "#7c6cf6",
                "#f59e0b",
                "#10b981",
                "#38bdf8",
                "#f472b6",
              ][index % 5],
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="academy-confetti-burst"
            style={{
              rotate: `${index * 20}deg`,
              animationDelay: `${(index % 4) * 0.04}s`,
              backgroundColor: [
                "#b9b1ff",
                "#fbbf24",
                "#34d399",
                "#38bdf8",
                "#fb7185",
              ][index % 5],
            }}
          />
        ))}
      </div>
      <div
        className="relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-[#111218] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-white shadow-2xl sm:rounded-[2rem] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_center,rgba(124,108,246,0.34),transparent_68%)]" />
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[#7c6cf6]/15 text-2xl font-black text-[#d8d3ff] ring-1 ring-[#b9b1ff]/25 shadow-[0_0_70px_rgba(124,108,246,0.36)] sm:h-24 sm:w-24 sm:rounded-[1.75rem] sm:text-3xl">
          +{xp}
        </div>
        <p className="relative mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#b9b1ff] sm:mt-6">
          Module complete
        </p>
        <h2 className="relative mt-2 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          {title}
        </h2>
        <p className="relative mt-3 text-sm leading-6 text-white/58">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="relative mt-5 h-11 w-full rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6b5bdd] sm:mt-7"
        >
          Keep learning
        </button>
      </div>
    </div>
  );
}

export function CertificateCard({
  studentName,
  enrollment,
}: {
  studentName: string;
  enrollment?: DashboardEnrollment;
}) {
  return (
    <section
      id="certificates"
      className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"
    >
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            Certificate
          </p>
          <h2 className="mt-1 font-semibold">Completion proof</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
          <AwardIcon />
        </span>
      </div>
      {enrollment?.certificate ? (
        <>
          <div className="relative mt-5 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              {enrollment.certificate.certificateName?.trim() ||
                studentName ||
                "Lumyn Academy Student"}
            </p>
            <p className="mt-3 text-sm font-semibold">
              {enrollment.courseTitle}
            </p>
            <p className="mt-2 text-[10px] text-neutral-500">
              {enrollment.certificate.certificateId}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void openCertificate(studentName, enrollment)}
            className="relative mt-4 w-full rounded-xl border border-[#7c6cf6]/30 bg-[#7c6cf6]/10 p-3 text-sm font-semibold text-[#6c5ce7] transition hover:bg-[#7c6cf6]/15 dark:text-[#b9b1ff]"
          >
            View / save as PDF
          </button>
        </>
      ) : (
        <>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${enrollment?.progressPercent ?? 0}%` }}
            />
          </div>
          <p className="relative mt-3 text-xs leading-5 text-neutral-500 dark:text-white/40">
            {enrollment
              ? "Finish the path and final project, then unlock your certificate."
              : "Enroll in a course to start earning your first certificate."}
          </p>
        </>
      )}
    </section>
  );
}
