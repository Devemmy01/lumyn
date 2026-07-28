"use client";

import Link from "next/link";
import { POINTS_PER_GENERATION } from "@/lib/academy";
import type { DashboardCourse, DashboardPayload } from "@/components/academy/dashboard/types";

export type AcademyNotification = {
  id: string;
  title: string;
  message: string;
  href: string;
  actionLabel: string;
  createdAt: string;
  tone: "info" | "success" | "warning" | "urgent";
};

export type BrowserNotificationPermission =
  | NotificationPermission
  | "unsupported";

export function buildAcademyNotifications(
  dashboard: DashboardPayload | null,
  selected: DashboardCourse | undefined,
): AcademyNotification[] {
  const now = new Date().toISOString();
  if (!dashboard) return [];

  const notifications: AcademyNotification[] = [];
  const pointsBalance = dashboard.student.pointsBalance ?? 0;
  const hasPointExemption = dashboard.student.courseGenerationExempt === true;

  if (!dashboard.courses.length) {
    notifications.push({
      id: "start-first-path",
      title: "Build your first learning path",
      message:
        "Tell Astra what you want to learn and Lumyn will generate a structured course for you.",
      href: "/academy/dashboard/generate",
      actionLabel: "Build path",
      createdAt: now,
      tone: "info",
    });
  }

  if (!hasPointExemption && pointsBalance < POINTS_PER_GENERATION) {
    notifications.push({
      id: "points-low",
      title: "Points are running low",
      message: `${POINTS_PER_GENERATION} points are required to generate a new path. You currently have ${pointsBalance}.`,
      href: "/academy/dashboard/billing",
      actionLabel: "Top up",
      createdAt: now,
      tone: "warning",
    });
  }

  if (dashboard.metrics.pendingAssignments > 0) {
    notifications.push({
      id: `pending-assignments-${dashboard.metrics.pendingAssignments}`,
      title: "Practice work is waiting",
      message: `${dashboard.metrics.pendingAssignments} assignment${dashboard.metrics.pendingAssignments === 1 ? "" : "s"} still need your submission.`,
      href: "/academy/dashboard/assignments",
      actionLabel: "Open work",
      createdAt: now,
      tone: "urgent",
    });
  }

  if (selected && selected.progressPercent < 100) {
    const nextModuleIndex = selected.course.modules.findIndex(
      (module) =>
        module.completionStatus !== "locked" &&
        module.completionStatus !== "completed",
    );
    const moduleIndex = nextModuleIndex >= 0 ? nextModuleIndex : 0;
    const learningModule = selected.course.modules[moduleIndex];
    if (learningModule) {
      notifications.push({
        id: `resume-${selected.id}-${moduleIndex}-${learningModule.completionStatus}`,
        title: "Continue your active path",
        message: `Next up: ${learningModule.title}. Keep the streak warm while the idea is still fresh.`,
        href: "/academy/dashboard/learning",
        actionLabel: "Resume",
        createdAt: selected.createdAt,
        tone: "info",
      });
    }
  }

  dashboard.courses.forEach((course) => {
    const passedQuizModules = new Set(
      course.quizAttempts
        .filter((attempt) => attempt.passed)
        .map((attempt) => attempt.moduleIndex),
    );
    const quizReadyModule = course.course.modules.findIndex(
      (module, index) =>
        module.completionStatus !== "locked" &&
        module.lessons.every(
          (lesson) => lesson.completionStatus === "completed",
        ) &&
        !passedQuizModules.has(index),
    );
    if (quizReadyModule >= 0) {
      notifications.push({
        id: `quiz-ready-${course.id}-${quizReadyModule}`,
        title: "Quiz gate is ready",
        message: `${course.course.modules[quizReadyModule].title} is ready for a quick knowledge check.`,
        href: "/academy/dashboard/learning",
        actionLabel: "Take quiz",
        createdAt: now,
        tone: "info",
      });
    }

    const revision = course.assignmentSubmissions.find(
      (submission) =>
        submission.status === "needs_revision" ||
        submission.evaluation?.passed === false,
    );
    if (revision) {
      notifications.push({
        id: `assignment-revision-${course.id}-${revision.moduleIndex}-${revision.submittedAt}`,
        title: "Assignment needs revision",
        message: `${course.course.modules[revision.moduleIndex]?.title ?? "A module"} needs another pass before it is cleared.`,
        href: "/academy/dashboard/assignments",
        actionLabel: "Review",
        createdAt: revision.submittedAt,
        tone: "warning",
      });
    }

    if (course.certificate) {
      notifications.push({
        id: `certificate-${course.certificate.certificateId}`,
        title: "Certificate is ready",
        message: `Your certificate for ${course.course.courseTitle} is ready to view, print, or verify.`,
        href: `/academy/dashboard/certificates?id=${encodeURIComponent(course.certificate.certificateId)}`,
        actionLabel: "View certificate",
        createdAt: course.certificate.issuedAt,
        tone: "success",
      });
    }
  });

  const latestCourse = dashboard.courses[0];
  if (latestCourse) {
    notifications.push({
      id: `course-created-${latestCourse.id}`,
      title: "Learning path saved",
      message: `${latestCourse.course.courseTitle} is saved to your workspace and ready when you are.`,
      href: "/academy/dashboard/learning",
      actionLabel: "Open path",
      createdAt: latestCourse.createdAt,
      tone: "success",
    });
  }

  const uniqueNotifications = notifications.filter(
    (notification, index, list) =>
      list.findIndex((item) => item.id === notification.id) === index,
  );

  return uniqueNotifications
    .sort((first, second) => {
      const toneWeight = { urgent: 4, warning: 3, success: 2, info: 1 };
      const priority = toneWeight[second.tone] - toneWeight[first.tone];
      if (priority !== 0) return priority;
      return (
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
      );
    })
    .slice(0, 12);
}

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function showBrowserNotification(notification: AcademyNotification) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }

  const url = new URL(notification.href, window.location.origin).toString();
  const options: NotificationOptions = {
    body: notification.message,
    tag: `lumyn-academy-${notification.id}`,
    icon: "/android-chrome-192x192.png",
    badge: "/android-chrome-192x192.png",
    data: { url },
  };

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      const academyRegistration =
        registrations.find((registration) =>
          registration.scope.includes("/academy/dashboard"),
        ) ??
        (await navigator.serviceWorker.getRegistration("/academy/dashboard"));

      if (academyRegistration?.showNotification) {
        await academyRegistration.showNotification(
          `Lumyn Academy: ${notification.title}`,
          options,
        );
        return true;
      }
    }
  } catch {
    // Local development intentionally unregisters the Academy worker, so fall back below.
  }

  const browserNotification = new Notification(
    `Lumyn Academy: ${notification.title}`,
    options,
  );
  browserNotification.onclick = () => {
    window.focus();
    window.location.assign(url);
    browserNotification.close();
  };
  return true;
}

export function NotificationBell({
  notifications,
  unreadCount,
  open,
  onToggle,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onEnablePush,
  readNotificationIds,
  browserPermission,
  mobile = false,
}: {
  notifications: AcademyNotification[];
  unreadCount: number;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onEnablePush: () => void;
  readNotificationIds: string[];
  browserPermission: BrowserNotificationPermission;
  mobile?: boolean;
}) {
  const toneClasses = {
    info: "bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    urgent: "bg-red-500/10 text-red-600 dark:text-red-300",
  };
  const pushLabel =
    browserPermission === "granted"
      ? "Push on"
      : browserPermission === "denied"
        ? "Push blocked"
        : browserPermission === "unsupported"
          ? "No push"
          : "Enable push";

  return (
    <div className={mobile ? "relative lg:hidden" : "relative hidden lg:block"}>
      <button
        type="button"
        onClick={onToggle}
        className={
          mobile
            ? "relative grid size-11 place-items-center rounded-2xl bg-white/80 text-neutral-600 shadow-sm ring-1 ring-black/[0.06] transition hover:text-[#6c5ce7] dark:bg-white/[0.06] dark:text-white/60 dark:ring-white/10"
            : "relative hidden h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/60 text-neutral-500 transition hover:border-[#7c6cf6]/40 hover:text-[#6c5ce7] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 lg:flex"
        }
        aria-expanded={open}
        aria-label={`Academy notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#ff5c7a] px-1 text-[10px] font-black text-white ring-2 ring-[#f2f1ed] dark:ring-[#08090c]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M15.5 18.5a3.5 3.5 0 0 1-7 0M18 10.8c0-3.6-2.2-6.3-6-6.3s-6 2.7-6 6.3c0 4.7-2 5.2-2 6.2 0 .8.7 1.5 1.6 1.5h12.8c.9 0 1.6-.7 1.6-1.5 0-1-2-.5-2-6.2Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-[88] cursor-default bg-transparent"
            onClick={onClose}
          />
          <section
            className="fixed right-4 top-24 z-[110] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[1.55rem] border border-black/[0.08] bg-white text-[#18181b] shadow-[0_24px_80px_rgba(23,19,31,0.24)] dark:border-white/10 dark:bg-[#111219] dark:text-white lg:absolute lg:right-0 lg:top-12 lg:w-96"
            aria-label="Academy notification center"
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] p-4 dark:border-white/[0.08]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                  Notifications
                </p>
                <h2 className="mt-1 text-lg font-black tracking-[-0.02em]">
                  {unreadCount
                    ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`
                    : "All caught up"}
                </h2>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={onEnablePush}
                  disabled={
                    browserPermission === "granted" ||
                    browserPermission === "denied" ||
                    browserPermission === "unsupported"
                  }
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    browserPermission === "granted"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "border-black/[0.08] text-neutral-500 hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/45 dark:hover:text-[#b9b1ff]"
                  }`}
                >
                  {pushLabel}
                </button>
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  disabled={!notifications.length || unreadCount === 0}
                  className="rounded-full border border-black/[0.08] px-3 py-1.5 text-[10px] font-black text-neutral-500 transition hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/45 dark:hover:text-[#b9b1ff]"
                >
                  Mark all read
                </button>
              </div>
            </div>

            <div className="max-h-[28rem] space-y-3 overflow-y-auto p-3">
              {notifications.length ? (
                notifications.map((notification) => {
                  const read = readNotificationIds.includes(notification.id);
                  return (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      onClick={() => {
                        onMarkRead(notification.id);
                        onClose();
                      }}
                      className={`group block rounded-[1.25rem] border p-4 shadow-sm transition ${
                        read
                          ? "border-black/[0.05] bg-black/[0.018] hover:bg-black/[0.04] dark:border-white/[0.06] dark:bg-white/[0.025] dark:hover:bg-white/[0.05]"
                          : "border-[#7c6cf6]/25 bg-[#7c6cf6]/[0.07] shadow-[#7c6cf6]/10 hover:bg-[#7c6cf6]/[0.11]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span
                          className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-2xl ${toneClasses[notification.tone]}`}
                        >
                          {notification.tone === "success"
                            ? "✓"
                            : notification.tone === "info"
                              ? "i"
                              : "!"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className="text-sm font-black">
                              {notification.title}
                            </span>
                            {!read && (
                              <span className="mt-1 size-2 shrink-0 rounded-full bg-[#7c6cf6]" />
                            )}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-neutral-500 dark:text-white/45">
                            {notification.message}
                          </span>
                          <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                            {notification.actionLabel}
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]">
                    ✓
                  </div>
                  <p className="mt-3 text-sm font-bold">
                    No notifications yet.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/45">
                    New course, assignment, certificate, and point updates will
                    appear here.
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
