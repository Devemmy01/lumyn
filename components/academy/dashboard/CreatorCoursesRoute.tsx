"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { DashboardIcon } from "@/components/academy/dashboard/icons";
import { LessonVideoPlayer } from "@/components/academy/dashboard/LessonVideoPlayer";
import { ListingFeeModal } from "@/components/academy/dashboard/ListingFeeModal";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import { VideoUploadWidget } from "@/components/academy/dashboard/VideoUploadWidget";

type LessonDraft = {
  title: string;
  description?: string;
  videoStatus: "not_uploaded" | "uploading" | "processing" | "ready" | "failed";
  previewEligible?: boolean;
};

type ModuleDraft = {
  title: string;
  description?: string;
  lessons: LessonDraft[];
};

type CourseSummary = {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  slug: string;
  level: string;
  priceCents: number;
  currency: string;
  status: "draft" | "pending_review" | "published" | "rejected" | "archived";
  rejectionReason?: string;
  purchaseCount: number;
  modules: ModuleDraft[];
};

type CreatorProfile = {
  payoutStatus: "unpaid" | "pending_first_approval" | "active";
  listingFee: { status: "unpaid" | "paid" };
};

type PricingInfo = {
  listingFeeCents: number;
  platformSharePercent: number;
  currency: string;
};

const statusStyles: Record<CourseSummary["status"], string> = {
  draft: "border-neutral-400/30 bg-neutral-400/10 text-neutral-500 dark:text-neutral-300",
  pending_review: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  published: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  rejected: "border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300",
  archived: "border-neutral-500/25 bg-neutral-500/10 text-neutral-500",
};

function useAuthToken() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);
  return useMemo(
    () => async () => (user ? user.getIdToken() : null),
    [user],
  );
}

export function CreatorCoursesRoute() {
  const getToken = useAuthToken();
  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<CourseSummary | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const token = await getToken();
    if (!token) return;
    try {
      const [coursesRes, profileRes] = await Promise.all([
        fetch("/api/marketplace/creator/courses", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/marketplace/creator/profile", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const coursesPayload = await coursesRes.json();
      const profilePayload = await profileRes.json();
      if (!coursesRes.ok) throw new Error(coursesPayload.error ?? "Could not load your courses.");
      setCourses(coursesPayload.courses ?? []);
      setProfile(profilePayload.creatorProfile ?? null);
      setPricing(profilePayload.pricing ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your courses.");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  if (selected) {
    return (
      <CourseEditor
        course={selected}
        getToken={getToken}
        listingFeePaid={profile?.listingFee.status === "paid"}
        pricing={pricing}
        onBack={() => {
          setSelected(null);
          void load();
        }}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-7">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/18 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              Creator studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Your courses</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-white/50">
              Build a course, submit it for review, and earn from every purchase once it's published.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href="/academy/dashboard/creator-earnings"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold text-neutral-600 transition hover:border-[#7c6cf6]/40 dark:border-white/10 dark:text-white/65"
            >
              View earnings
            </Link>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd]"
            >
              New course
            </button>
          </div>
        </div>
      </section>

      {pricing && (
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-4 dark:border-white/[0.08] dark:bg-[#111219]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">One-time listing fee</p>
            <p className="mt-1.5 text-xl font-semibold">
              {pricing.listingFeeCents > 0
                ? `${pricing.currency} ${(pricing.listingFeeCents / 100).toFixed(2)}`
                : "Not yet configured"}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {profile?.listingFee.status === "paid" ? "Paid — unlimited courses unlocked." : "Paid once, ever."}
            </p>
          </div>
          <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-4 dark:border-white/[0.08] dark:bg-[#111219]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Lumyn&apos;s cut per sale</p>
            <p className="mt-1.5 text-xl font-semibold">{pricing.platformSharePercent}%</p>
            <p className="mt-1 text-xs text-neutral-500">You keep {100 - pricing.platformSharePercent}% of every purchase.</p>
          </div>
          <div className="rounded-2xl border border-black/[0.08] bg-white/75 p-4 dark:border-white/[0.08] dark:bg-[#111219]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Payout status</p>
            <p className="mt-1.5 text-xl font-semibold capitalize">
              {profile?.payoutStatus === "active"
                ? "Active"
                : profile?.payoutStatus === "pending_first_approval"
                  ? "Pending review"
                  : "Not set up"}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {profile?.payoutStatus === "active"
                ? "Earnings settle to your bank on Paystack's normal schedule."
                : "Set up after your first course is approved."}
            </p>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Content guidelines</p>
        <p className="mt-1.5 text-sm leading-6 text-neutral-600 dark:text-white/60">
          Every course must be your own original work — no copyrighted video, music, code, text, or images you
          don&apos;t have rights to. Video and audio must be clear and watchable, and content must deliver on what it
          promises. Courses that don&apos;t meet this bar will be rejected.
        </p>
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300">
          {error}
        </div>
      )}

      {creating && (
        <CreateCourseCard
          getToken={getToken}
          onCancel={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            void load();
          }}
        />
      )}

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 dark:border-white/[0.08] dark:bg-[#111219]">
        {courses === null ? (
          <div className="flex items-center gap-3 p-8 text-sm text-neutral-500">
            <LoadingSpinner /> Loading your courses…
          </div>
        ) : courses.length === 0 ? (
          <p className="p-10 text-center text-sm text-neutral-500">
            You haven&apos;t created a course yet. Use &quot;New course&quot; to start your first one.
          </p>
        ) : (
          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {courses.map((course) => (
              <button
                key={course._id}
                type="button"
                onClick={() => setSelected(course)}
                className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-black/[0.02] dark:hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{course.title}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${statusStyles[course.status]}`}>
                      {course.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {course.modules.length} modules · {course.currency} {(course.priceCents / 100).toFixed(2)} · {course.purchaseCount} sold
                  </p>
                  {course.status === "rejected" && course.rejectionReason && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-300">Rejected: {course.rejectionReason}</p>
                  )}
                </div>
                <DashboardIcon type="briefcase" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CreateCourseCard({
  getToken,
  onCancel,
  onCreated,
}: {
  getToken: () => Promise<string | null>;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [priceCents, setPriceCents] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch("/api/marketplace/creator/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description,
          level,
          priceCents: Math.round(Number(priceCents) * 100),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not create the course.");
      onCreated();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create the course.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
      <h2 className="text-xl font-semibold">New course</h2>
      {error && <p className="mt-3 text-sm text-red-500 dark:text-red-300">{error}</p>}
      <div className="mt-5 space-y-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Course title"
          className="input-field"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What will students learn?"
          rows={3}
          className="textarea-field"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <select value={level} onChange={(event) => setLevel(event.target.value)} className="input-field">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            value={priceCents}
            onChange={(event) => setPriceCents(event.target.value)}
            placeholder="Price (e.g. 5000)"
            inputMode="decimal"
            className="input-field"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={submitting || !title.trim() || !description.trim() || !priceCents}
            onClick={() => void submit()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-50"
          >
            {submitting && <LoadingSpinner />}
            Create draft
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold text-neutral-600 dark:border-white/10 dark:text-white/65"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

function CourseEditor({
  course,
  getToken,
  listingFeePaid,
  pricing,
  onBack,
}: {
  course: CourseSummary;
  getToken: () => Promise<string | null>;
  listingFeePaid: boolean;
  pricing: PricingInfo | null;
  onBack: () => void;
}) {
  const [modules, setModules] = useState<ModuleDraft[]>(course.modules.length ? course.modules : []);
  const [title, setTitle] = useState(course.title);
  const [subtitle, setSubtitle] = useState(course.subtitle ?? "");
  const [description, setDescription] = useState(course.description);
  const [category, setCategory] = useState(course.category ?? "");
  const [level, setLevel] = useState(course.level);
  const [priceInput, setPriceInput] = useState(String(course.priceCents / 100));
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [showListingFeeModal, setShowListingFeeModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const editable = course.status === "draft" || course.status === "rejected";

  function addModule() {
    setModules((current) => [...current, { title: `Module ${current.length + 1}`, lessons: [] }]);
  }

  function addLesson(moduleIndex: number) {
    setModules((current) =>
      current.map((module, index) =>
        index === moduleIndex
          ? { ...module, lessons: [...module.lessons, { title: `Lesson ${module.lessons.length + 1}`, videoStatus: "not_uploaded" }] }
          : module,
      ),
    );
  }

  function updateModuleTitle(moduleIndex: number, title: string) {
    setModules((current) => current.map((module, index) => (index === moduleIndex ? { ...module, title } : module)));
  }

  function updateLessonTitle(moduleIndex: number, lessonIndex: number, title: string) {
    setModules((current) =>
      current.map((module, mIndex) =>
        mIndex === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIndex) => (lIndex === lessonIndex ? { ...lesson, title } : lesson)),
            }
          : module,
      ),
    );
  }

  function updateLessonVideoStatus(moduleIndex: number, lessonIndex: number, videoStatus: LessonDraft["videoStatus"]) {
    setModules((current) =>
      current.map((module, mIndex) =>
        mIndex === moduleIndex
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIndex) => (lIndex === lessonIndex ? { ...lesson, videoStatus } : lesson)),
            }
          : module,
      ),
    );
  }

  async function saveModules(): Promise<boolean> {
    setSaving(true);
    setNotice(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const priceCents = Math.round(Number(priceInput) * 100);
      if (!Number.isInteger(priceCents) || priceCents <= 0) {
        throw new Error("Enter a valid price.");
      }
      const response = await fetch(`/api/marketplace/creator/courses/${course._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, subtitle, description, category, level, priceCents, modules }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not save changes.");
      setNotice({ type: "success", message: "Saved." });
      return true;
    } catch (saveError) {
      setNotice({ type: "error", message: saveError instanceof Error ? saveError.message : "Could not save changes." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function submitForReview() {
    setSubmitting(true);
    setNotice(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch(`/api/marketplace/creator/courses/${course._id}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) {
        if (payload.requiresListingFee) {
          setShowListingFeeModal(true);
          return;
        }
        throw new Error(payload.error ?? "Could not submit for review.");
      }
      setNotice({ type: "success", message: "Submitted for review." });
      setTimeout(onBack, 900);
    } catch (submitError) {
      setNotice({ type: "error", message: submitError instanceof Error ? submitError.message : "Could not submit for review." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]">
        ← Back to your courses
      </button>

      <section className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">Course details</p>
          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${statusStyles[course.status]}`}>
            {course.status.replace("_", " ")}
          </span>
        </div>
        {!editable && (
          <p className="mt-2 text-sm text-neutral-500">
            This course can&apos;t be edited while it&apos;s {course.status.replace("_", " ")}. Archive it first if you need to make changes.
          </p>
        )}
        <div className="mt-4 space-y-3">
          <input
            value={title}
            disabled={!editable}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Course title"
            className="input-field text-xl font-semibold"
          />
          <input
            value={subtitle}
            disabled={!editable}
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Subtitle (optional)"
            className="input-field"
          />
          <textarea
            value={description}
            disabled={!editable}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What will students learn?"
            rows={3}
            className="textarea-field"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={category}
              disabled={!editable}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Category (optional)"
              className="input-field"
            />
            <select value={level} disabled={!editable} onChange={(event) => setLevel(event.target.value)} className="input-field">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                {course.currency}
              </span>
              <input
                value={priceInput}
                disabled={!editable}
                onChange={(event) => setPriceInput(event.target.value)}
                placeholder="Price"
                inputMode="decimal"
                className="input-field pl-14"
              />
            </div>
          </div>
        </div>
      </section>

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`rounded-2xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-300"}`}
        >
          {notice.message}
        </div>
      )}

      {!listingFeePaid && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-200">
          <span>
            You&apos;ll need to pay the one-time creator listing fee
            {pricing && pricing.listingFeeCents > 0 ? ` (${pricing.currency} ${(pricing.listingFeeCents / 100).toFixed(2)})` : ""}
            {" "}before this (or any) course can be submitted for review. Lumyn keeps {pricing?.platformSharePercent ?? 20}% of every sale after that.
          </span>
          <button
            type="button"
            onClick={() => setShowListingFeeModal(true)}
            className="whitespace-nowrap rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-bold transition hover:bg-amber-500/25"
          >
            Pay listing fee
          </button>
        </div>
      )}

      <section className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 dark:border-white/[0.08] dark:bg-[#111219]">
            <input
              value={module.title}
              disabled={!editable}
              onChange={(event) => updateModuleTitle(moduleIndex, event.target.value)}
              className="input-field font-semibold"
            />
            <div className="mt-3 space-y-2">
              {module.lessons.map((lesson, lessonIndex) => {
                const key = `${moduleIndex}-${lessonIndex}`;
                return (
                  <div key={lessonIndex} className="space-y-3 rounded-xl border border-black/[0.06] bg-black/[0.02] p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        value={lesson.title}
                        disabled={!editable}
                        onChange={(event) => updateLessonTitle(moduleIndex, lessonIndex, event.target.value)}
                        className="input-field flex-1"
                      />
                      {editable ? (
                        <VideoUploadWidget
                          courseId={course._id}
                          moduleIndex={moduleIndex}
                          lessonIndex={lessonIndex}
                          status={lesson.videoStatus}
                          getToken={getToken}
                          onBeforeUpload={saveModules}
                          onStatusChange={(status) => updateLessonVideoStatus(moduleIndex, lessonIndex, status)}
                        />
                      ) : (
                        <span className="whitespace-nowrap rounded-full border border-neutral-400/30 bg-neutral-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          {lesson.videoStatus === "not_uploaded" ? "No video yet" : lesson.videoStatus}
                        </span>
                      )}
                      {lesson.videoStatus === "ready" && (
                        <button
                          type="button"
                          onClick={() => setPreviewKey(previewKey === key ? null : key)}
                          className="text-xs font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]"
                        >
                          {previewKey === key ? "Hide preview" : "Preview"}
                        </button>
                      )}
                    </div>
                    {previewKey === key && (
                      <LessonVideoPlayer courseId={course._id} moduleIndex={moduleIndex} lessonIndex={lessonIndex} />
                    )}
                  </div>
                );
              })}
              {editable && (
                <button type="button" onClick={() => addLesson(moduleIndex)} className="text-xs font-semibold text-[#6c5ce7] dark:text-[#b9b1ff]">
                  + Add lesson
                </button>
              )}
            </div>
          </div>
        ))}
        {editable && (
          <button
            type="button"
            onClick={addModule}
            className="w-full rounded-[1.5rem] border border-dashed border-black/[0.15] p-5 text-sm font-semibold text-neutral-500 transition hover:border-[#7c6cf6]/40 hover:text-[#6c5ce7] dark:border-white/15"
          >
            + Add module
          </button>
        )}
      </section>

      {editable && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveModules()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold text-neutral-600 disabled:opacity-50 dark:border-white/10 dark:text-white/65"
          >
            {saving && <LoadingSpinner />}
            Save changes
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submitForReview()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-50"
          >
            {submitting && <LoadingSpinner />}
            Submit for review
          </button>
        </div>
      )}

      {showListingFeeModal && (
        <ListingFeeModal getToken={getToken} pricing={pricing} onClose={() => setShowListingFeeModal(false)} />
      )}
    </div>
  );
}
