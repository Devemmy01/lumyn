"use client";

import { useState } from "react";
import type { GeneratedCourse } from "@/lib/academy";

export type AcademyCatalogEntry = {
  slug: string;
  language: string;
  level: string;
  status: "draft" | "published" | "archived";
  courseTitle?: string;
  moduleCount: number;
  generatedAt?: string;
};

type Notice = { type: "success" | "error"; message: string };

type PreviewState = {
  slug: string;
  loading: boolean;
  error: string | null;
  content: GeneratedCourse | null;
};

const statusStyles: Record<AcademyCatalogEntry["status"], string> = {
  draft: "border-amber-500/25 bg-amber-500/10 text-amber-200",
  published: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  archived: "border-neutral-600/30 bg-neutral-600/10 text-neutral-400",
};

export default function AcademyCatalogManager({ initialCourses }: { initialCourses: AcademyCatalogEntry[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  async function openPreview(slug: string) {
    setPreview({ slug, loading: true, error: null, content: null });
    try {
      const response = await fetch(`/api/admin/academy/catalog?slug=${encodeURIComponent(slug)}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not load this course's content.");
      setPreview({ slug, loading: false, error: null, content: payload.course?.content ?? null });
    } catch (error) {
      setPreview({
        slug,
        loading: false,
        error: error instanceof Error ? error.message : "Could not load this course's content.",
        content: null,
      });
    }
  }

  async function setStatus(slug: string, status: AcademyCatalogEntry["status"]) {
    setPendingSlug(slug);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/academy/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Catalog course could not be updated.");

      setCourses((current) => current.map((course) => (course.slug === slug ? { ...course, status } : course)));
      setNotice({ type: "success", message: `${slug} is now ${status}.` });
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Catalog course could not be updated.",
      });
    } finally {
      setPendingSlug(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#242424] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="border-b border-[#222] p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f82ff]">Course catalog</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Generated courses</h2>
        <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-400">
          Generated via <code className="text-neutral-300">npm run generate:catalog</code>. Review a draft, then
          publish it so it appears in the student-facing catalog.
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
            <div
              key={course.slug}
              className="flex flex-col justify-between gap-4 p-5 transition hover:bg-white/[0.018] sm:flex-row sm:items-center sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium text-white">{course.courseTitle || course.slug}</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${statusStyles[course.status]}`}>
                    {course.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  {course.language} · {course.level} · {course.moduleCount} modules
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openPreview(course.slug)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-white/[0.03] px-4 text-xs font-bold text-neutral-300 transition hover:bg-white/[0.07]"
                >
                  Preview
                </button>
                {course.status !== "published" && (
                  <button
                    type="button"
                    disabled={pendingSlug === course.slug}
                    onClick={() => setStatus(course.slug, "published")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#7c6cf6]/30 bg-[#7c6cf6]/10 px-4 text-xs font-bold text-[#b8b0ff] transition hover:bg-[#7c6cf6]/20 disabled:opacity-50"
                  >
                    {pendingSlug === course.slug && <Spinner />}
                    Publish
                  </button>
                )}
                {course.status === "published" && (
                  <button
                    type="button"
                    disabled={pendingSlug === course.slug}
                    onClick={() => setStatus(course.slug, "draft")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 text-xs font-bold text-amber-200 transition hover:bg-amber-500/15 disabled:opacity-50"
                  >
                    {pendingSlug === course.slug && <Spinner />}
                    Unpublish
                  </button>
                )}
                {course.status !== "archived" && (
                  <button
                    type="button"
                    disabled={pendingSlug === course.slug}
                    onClick={() => setStatus(course.slug, "archived")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="p-10 text-center text-sm text-neutral-500">
            No catalog courses yet. Run <code className="text-neutral-300">npm run generate:catalog</code> to create one.
          </p>
        )}
      </div>

      {preview && <CoursePreviewModal preview={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}

function CoursePreviewModal({ preview, onClose }: { preview: PreviewState; onClose: () => void }) {
  const [openModule, setOpenModule] = useState(0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#242424] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#222] p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f82ff]">Draft preview</p>
            <h2 className="mt-1 truncate text-lg font-semibold text-white">
              {preview.content?.courseTitle ?? preview.slug}
            </h2>
            {preview.content && (
              <p className="mt-1 text-xs text-neutral-400">
                {preview.content.difficulty} · {preview.content.modules.length} modules
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs font-semibold text-neutral-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          {preview.loading && <p className="text-sm text-neutral-400">Loading content…</p>}
          {preview.error && (
            <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {preview.error}
            </p>
          )}
          {!preview.loading && !preview.error && !preview.content && (
            <p className="text-sm text-neutral-400">This catalog course has no content saved yet.</p>
          )}

          {preview.content && (
            <div className="space-y-3">
              {preview.content.modules.map((courseModule, index) => (
                <div key={courseModule.title} className="overflow-hidden rounded-2xl border border-[#1f1f1f] bg-white/[0.02]">
                  <button
                    type="button"
                    onClick={() => setOpenModule(openModule === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Module {index + 1}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-white">{courseModule.title}</p>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {courseModule.lessons.length} lessons · {courseModule.quiz.questions.length} quiz Qs {openModule === index ? "▲" : "▼"}
                    </span>
                  </button>

                  {openModule === index && (
                    <div className="space-y-4 border-t border-[#1f1f1f] px-4 py-4">
                      <p className="text-sm leading-6 text-neutral-400">{courseModule.description}</p>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Lessons</p>
                        <ol className="space-y-2">
                          {courseModule.lessons.map((lesson, lessonIndex) => (
                            <li key={lesson.title} className="rounded-xl border border-[#1f1f1f] bg-black/20 px-3 py-2.5">
                              <p className="text-sm font-medium text-white">{lessonIndex + 1}. {lesson.title}</p>
                              {lesson.goal && <p className="mt-1 text-xs leading-5 text-neutral-400">{lesson.goal}</p>}
                              {lesson.videoTitle && (
                                <p className="mt-1 text-[11px] text-neutral-500">Video: {lesson.videoTitle}</p>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                          Module quiz ({courseModule.quiz.questions.length} questions)
                        </p>
                        <ol className="space-y-2">
                          {courseModule.quiz.questions.map((question, questionIndex) => (
                            <li key={questionIndex} className="rounded-xl border border-[#1f1f1f] bg-black/20 px-3 py-2.5">
                              <p className="text-sm text-neutral-200">{questionIndex + 1}. {question.question}</p>
                              <ul className="mt-1.5 space-y-1">
                                {question.options.map((option, optionIndex) => (
                                  <li
                                    key={optionIndex}
                                    className={`text-xs ${optionIndex === question.correctAnswerIndex ? "font-semibold text-emerald-400" : "text-neutral-400"}`}
                                  >
                                    {optionIndex === question.correctAnswerIndex ? "✓ " : "· "}
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#1f1f1f] bg-black/20 px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Assignment</p>
                          <p className="mt-1 text-xs leading-5 text-neutral-400">{courseModule.assignment}</p>
                        </div>
                        <div className="rounded-xl border border-[#1f1f1f] bg-black/20 px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Mini project</p>
                          <p className="mt-1 text-xs leading-5 text-neutral-400">{courseModule.miniProject}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.06] px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8b0ff]">Final project</p>
                <p className="mt-1 text-sm leading-6 text-neutral-300">{preview.content.finalProject}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />;
}
