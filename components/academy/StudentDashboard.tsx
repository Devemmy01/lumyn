"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import AcademyHomeLink from "@/components/academy/AcademyHomeLink";
import AcademyLogo from "@/components/academy/AcademyLogo";
import { useTheme } from "@/components/ThemeProvider";
import {
  ACADEMY_POINT_PRICE_CENTS,
  ACADEMY_TUTOR_NAME,
  MIN_MODULE_QUIZ_QUESTIONS,
  POINTS_PER_GENERATION,
  type AssignmentSubmission,
  type LearningCursor,
  type SubmissionEvaluation,
} from "@/lib/academy";
import {
  AccountPanel,
  CelebrationModal,
  CertificateRoute,
  DashboardAuthScreen,
  DashboardIcon,
  DashboardLoading,
  DashboardRightRail,
  FloatingAstraChat,
  LearningRoute,
  LoadingSpinner,
  MobileDashboardNav,
  ModuleCelebrationModal,
  ModulePathPicker,
  MoonIcon,
  NotificationBell,
  OverviewHero,
  OverviewJourney,
  OverviewMetricRail,
  PointTopUpRoute,
  QuizResultModal,
  SparkIcon,
  SunIcon,
  Toast,
  buildAcademyNotifications,
  formatWorkspaceFilesForSubmission,
  getBrowserNotificationPermission,
  showBrowserNotification,
  type BrowserNotificationPermission,
  type LearningStepId,
  type LearningStepItem,
  type PracticeCodeFileSnapshot,
} from "@/components/academy/dashboard/DashboardParts";
import type {
  DashboardCourse,
  DashboardPayload,
  QuizResultState,
  ToastState,
} from "@/components/academy/dashboard/types";
import { getFirebaseAuth } from "@/lib/firebase/client";

type ModuleCelebrationState = {
  title: string;
  message: string;
  xp: number;
};

type ModuleLearningStepId = Extract<
  LearningStepId,
  "lessons" | "quiz" | "assignment"
>;

function courseGamification(course?: DashboardCourse) {
  if (!course) {
    return {
      xp: 0,
      level: 1,
      nextLevelXp: 500,
      levelProgress: 0,
      completedModules: 0,
      totalModules: 0,
    };
  }

  const completedLessons = course.course.modules.reduce(
    (total, module) =>
      total +
      module.lessons.filter((lesson) => lesson.completionStatus === "completed")
        .length,
    0,
  );
  const passedQuizzes = new Set(
    course.quizAttempts
      .filter((attempt) => attempt.passed)
      .map((attempt) => attempt.moduleIndex),
  ).size;
  const passedAssignments = new Set(
    course.assignmentSubmissions
      .filter((submission) => submission.status !== "needs_revision")
      .map((submission) => submission.moduleIndex),
  ).size;
  const completedModules = course.course.modules.filter(
    (module) => module.completionStatus === "completed",
  ).length;
  const finalProjectXp =
    course.finalProjectSubmission?.status &&
    course.finalProjectSubmission.status !== "needs_revision"
      ? 350
      : 0;
  const certificateXp = course.certificate ? 500 : 0;
  const xp =
    completedLessons * 50 +
    passedQuizzes * 100 +
    passedAssignments * 150 +
    completedModules * 300 +
    finalProjectXp +
    certificateXp;
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;
  const currentLevelXp = (level - 1) * 500;
  const levelProgress = Math.min(
    100,
    Math.round(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100),
  );

  return {
    xp,
    level,
    nextLevelXp,
    levelProgress,
    completedModules,
    totalModules: course.course.modules.length,
  };
}

function hasPassedAssignment(course: DashboardCourse, moduleIndex: number) {
  const submission = course.assignmentSubmissions.find(
    (item) => item.moduleIndex === moduleIndex,
  );
  return submission?.evaluation?.passed === true || submission?.status === "reviewed";
}

function hasPassedQuiz(course: DashboardCourse, moduleIndex: number) {
  return course.quizAttempts.some(
    (attempt) => attempt.moduleIndex === moduleIndex && attempt.passed,
  );
}

function isCourseReadyForFinalProject(course: DashboardCourse) {
  return (
    course.course.modules.length > 0 &&
    course.course.modules.every(
      (module) => module.completionStatus === "completed",
    )
  );
}

function cursorIsAvailable(course: DashboardCourse, cursor?: LearningCursor) {
  if (!cursor) return false;
  if (cursor.step === "final_project") return isCourseReadyForFinalProject(course);

  const learningModule =
    typeof cursor.moduleIndex === "number"
      ? course.course.modules[cursor.moduleIndex]
      : undefined;
  if (!learningModule || learningModule.completionStatus === "locked") {
    return false;
  }
  if (cursor.step !== "lessons") return true;

  const lesson =
    typeof cursor.lessonIndex === "number"
      ? learningModule.lessons[cursor.lessonIndex]
      : learningModule.lessons[0];
  return Boolean(lesson && lesson.completionStatus !== "locked");
}

function fallbackLearningCursor(course: DashboardCourse): LearningCursor {
  const updatedAt = new Date().toISOString();
  for (const [moduleIndex, learningModule] of course.course.modules.entries()) {
    if (learningModule.completionStatus === "locked") continue;

    const lessonIndex = learningModule.lessons.findIndex(
      (lesson) => lesson.completionStatus !== "completed",
    );
    if (lessonIndex >= 0) {
      return {
        moduleIndex,
        lessonIndex,
        step: "lessons",
        section: "overview",
        updatedAt,
      };
    }

    if (!hasPassedQuiz(course, moduleIndex)) {
      return { moduleIndex, step: "quiz", section: "overview", updatedAt };
    }

    if (!hasPassedAssignment(course, moduleIndex)) {
      return {
        moduleIndex,
        step: "assignment",
        section: "overview",
        updatedAt,
      };
    }
  }

  return { step: "final_project", section: "overview", updatedAt };
}

function getResumeCursor(course: DashboardCourse): LearningCursor {
  return cursorIsAvailable(course, course.learningCursor)
    ? course.learningCursor!
    : fallbackLearningCursor(course);
}

export default function StudentDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paymentConfirmed = searchParams.get("payment") === "success";
  const { isDark, toggleTheme } = useTheme();
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [activeModule, setActiveModule] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [goal, setGoal] = useState("");
  const [phase, setPhase] = useState<
    "loading" | "auth" | "ready" | "working" | "error"
  >("loading");
  const [loadingDelayed, setLoadingDelayed] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultState | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [moduleCelebration, setModuleCelebration] =
    useState<ModuleCelebrationState | null>(null);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [pushedNotificationIds, setPushedNotificationIds] = useState<string[]>(
    [],
  );
  const [notificationsHydrated, setNotificationsHydrated] = useState(false);
  const [pushedNotificationsHydrated, setPushedNotificationsHydrated] =
    useState(false);
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState<BrowserNotificationPermission>("unsupported");
  const [accountPanel, setAccountPanel] = useState<
    "profile" | "settings" | null
  >(null);
  const [purchasePoints, setPurchasePoints] = useState(10);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [assignmentDraft, setAssignmentDraft] = useState("");
  const [assignmentWorkspaceFiles, setAssignmentWorkspaceFiles] = useState<
    PracticeCodeFileSnapshot[]
  >([]);
  const [finalDraft, setFinalDraft] = useState("");
  const [finalProjectWorkspaceFiles, setFinalProjectWorkspaceFiles] = useState<
    PracticeCodeFileSnapshot[]
  >([]);
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [activeLearningStep, setActiveLearningStep] =
    useState<LearningStepId>("lessons");
  const [preferredAstraName, setPreferredAstraName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [appOrigin, setAppOrigin] = useState("");

  const selected =
    dashboard?.courses.find((course) => course.id === selectedId) ??
    dashboard?.courses[0];

  const handleAssignmentFilesChange = useCallback(
    (files: PracticeCodeFileSnapshot[]) => {
      setAssignmentWorkspaceFiles(files);
    },
    [],
  );
  const handleFinalProjectFilesChange = useCallback(
    (files: PracticeCodeFileSnapshot[]) => {
      setFinalProjectWorkspaceFiles(files);
    },
    [],
  );
  const hasGenerationExemption =
    dashboard?.student.courseGenerationExempt === true;
  const pointsBalance = dashboard?.student.pointsBalance ?? 0;
  const hasGenerationAccess =
    hasGenerationExemption || pointsBalance >= POINTS_PER_GENERATION;
  const purchaseAmount =
    ((Number.isFinite(purchasePoints) ? purchasePoints : 0) *
      ACADEMY_POINT_PRICE_CENTS) /
    100;
  const currentView = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
  const dashboardView = currentView === "dashboard" ? "overview" : currentView;
  const showOverview = dashboardView === "overview";
  const showGenerate = dashboardView === "generate";
  const showLearning = dashboardView === "learning";
  const showAssignments = dashboardView === "assignments";
  const showCertificates = dashboardView === "certificates";
  const showBilling = dashboardView === "billing";
  const notificationStorageKey =
    user?.uid || dashboard?.student.email
      ? `lumyn_academy_notifications_read_${user?.uid ?? dashboard?.student.email}`
      : "";
  const pushedNotificationStorageKey =
    user?.uid || dashboard?.student.email
      ? `lumyn_academy_notifications_pushed_${user?.uid ?? dashboard?.student.email}`
      : "";
  const notifications = useMemo(
    () => buildAcademyNotifications(dashboard, selected),
    [dashboard, selected],
  );
  const unreadNotificationCount = notifications.filter(
    (notification) => !readNotificationIds.includes(notification.id),
  ).length;

  function notify(message: string, type: ToastState["type"] = "info") {
    setToast({ message, type });
  }

  function setLearningCursorState(courseId: string, learningCursor: LearningCursor) {
    setDashboard((current) =>
      current
        ? {
            ...current,
            courses: current.courses.map((course) =>
              course.id === courseId ? { ...course, learningCursor } : course,
            ),
          }
        : current,
    );
  }

  async function persistLearningCursor(cursor: LearningCursor) {
    if (!selected || !token) return;
    const courseId = selected.id;
    setLearningCursorState(courseId, cursor);
    try {
      const response = await fetch(`/api/academy/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cursor", ...cursor }),
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.learningCursor) {
        setLearningCursorState(courseId, payload.learningCursor);
      }
    } catch {
      // Re-entry state should never interrupt studying.
    }
  }

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    setQuizAnswers({});
    setQuizResult(null);
    setQuizModalOpen(false);
    setAssignmentDraft("");
    setFinalDraft("");
  }, [activeModule, selectedId]);

  useEffect(() => {
    setMobileMoreOpen(false);
    setNotificationOpen(false);
  }, [pathname]);

  useEffect(() => {
    setBrowserNotificationPermission(getBrowserNotificationPermission());
  }, []);

  useEffect(() => {
    if (!notificationStorageKey) return;
    setNotificationsHydrated(false);
    try {
      const saved = window.localStorage.getItem(notificationStorageKey);
      const parsed = saved ? (JSON.parse(saved) as unknown) : [];
      setReadNotificationIds(
        Array.isArray(parsed)
          ? parsed.filter((item): item is string => typeof item === "string")
          : [],
      );
    } catch {
      setReadNotificationIds([]);
    } finally {
      setNotificationsHydrated(true);
    }
  }, [notificationStorageKey]);

  useEffect(() => {
    if (!pushedNotificationStorageKey) return;
    setPushedNotificationsHydrated(false);
    try {
      const saved = window.localStorage.getItem(pushedNotificationStorageKey);
      const parsed = saved ? (JSON.parse(saved) as unknown) : [];
      setPushedNotificationIds(
        Array.isArray(parsed)
          ? parsed.filter((item): item is string => typeof item === "string")
          : [],
      );
    } catch {
      setPushedNotificationIds([]);
    } finally {
      setPushedNotificationsHydrated(true);
    }
  }, [pushedNotificationStorageKey]);

  useEffect(() => {
    if (!notificationStorageKey || !notificationsHydrated) return;
    window.localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(readNotificationIds),
    );
  }, [notificationStorageKey, notificationsHydrated, readNotificationIds]);

  useEffect(() => {
    if (!pushedNotificationStorageKey || !pushedNotificationsHydrated) return;
    window.localStorage.setItem(
      pushedNotificationStorageKey,
      JSON.stringify(pushedNotificationIds),
    );
  }, [
    pushedNotificationStorageKey,
    pushedNotificationsHydrated,
    pushedNotificationIds,
  ]);

  useEffect(() => {
    if (
      browserNotificationPermission !== "granted" ||
      !notificationsHydrated ||
      !pushedNotificationsHydrated
    ) {
      return;
    }

    const pendingPushes = notifications.filter(
      (notification) =>
        !readNotificationIds.includes(notification.id) &&
        !pushedNotificationIds.includes(notification.id),
    );
    if (!pendingPushes.length) return;

    let cancelled = false;
    async function pushPendingNotifications() {
      const deliveredIds: string[] = [];
      for (const notification of pendingPushes) {
        if (cancelled) return;
        const delivered = await showBrowserNotification(notification);
        if (delivered) deliveredIds.push(notification.id);
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      }
      if (!cancelled && deliveredIds.length) {
        setPushedNotificationIds((current) => [
          ...new Set([...current, ...deliveredIds]),
        ]);
      }
    }

    void pushPendingNotifications();
    return () => {
      cancelled = true;
    };
  }, [
    browserNotificationPermission,
    notifications,
    notificationsHydrated,
    pushedNotificationsHydrated,
    pushedNotificationIds,
    readNotificationIds,
  ]);

  useEffect(() => {
    setPreferredAstraName(
      window.localStorage.getItem("lumyn_academy_astra_name") ?? "",
    );
    setAppOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!dashboard?.student) return;
    setProfileName(
      dashboard.student.name || user?.displayName || dashboard.student.email,
    );
    setProfileAvatarUrl(dashboard.student.avatarUrl || "");
    setCertificateName(dashboard.student.certificateName || "");
  }, [dashboard?.student, user?.displayName]);

  useEffect(() => {
    if (showAssignments) {
      setActiveLearningStep("assignment");
    }
  }, [showAssignments]);

  useEffect(() => {
    let cancelled = false;
    const loadingTimeout = window.setTimeout(() => {
      if (!cancelled) {
        setLoadingDelayed(true);
      }
    }, 12000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (cancelled) return;
      if (!currentUser) {
        window.clearTimeout(loadingTimeout);
        setLoadingDelayed(false);
        setPhase("auth");
        return;
      }

      try {
        setUser(currentUser);
        const idToken = await currentUser.getIdToken();
        if (cancelled) return;
        setToken(idToken);
        const response = await fetch("/api/academy/courses", {
          headers: { Authorization: `Bearer ${idToken}` },
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok)
          throw new Error(
            payload.error ?? "Your dashboard could not be loaded.",
          );
        if (cancelled) return;
        setDashboard(payload);
        const firstCourse = payload.courses[0] as DashboardCourse | undefined;
        setSelectedId(firstCourse?.id ?? "");
        if (firstCourse) {
          const cursor = getResumeCursor(firstCourse);
          if (cursor.step === "final_project") {
            setActiveModule(Math.max(0, firstCourse.course.modules.length - 1));
          } else {
            setActiveModule(Math.max(0, cursor.moduleIndex ?? 0));
            setActiveLearningStep(cursor.step as ModuleLearningStepId);
          }
        }
        setLoadingDelayed(false);
        setPhase("ready");
        if (paymentConfirmed)
          setToast({
            type: "success",
            message: "Payment confirmed. Your points have been added.",
          });
      } catch (error) {
        if (!cancelled) {
          setLoadingDelayed(false);
          setPhase("error");
          setToast({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Your dashboard could not be loaded.",
          });
        }
      } finally {
        window.clearTimeout(loadingTimeout);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, [auth, paymentConfirmed, router]);

  function mergeCourse(update: Partial<DashboardCourse>) {
    if (!selected) return;
    setDashboard((current) =>
      current
        ? {
            ...current,
            courses: current.courses.map((course) =>
              course.id === selected.id ? { ...course, ...update } : course,
            ),
          }
        : current,
    );
  }

  async function patchCourse(
    body: Record<string, unknown>,
    actionKey = String(body.action ?? "course"),
  ) {
    if (!selected || !token) return;
    const previousProgress = selected.progressPercent;
    setPendingAction(actionKey);
    try {
      const response = await fetch(`/api/academy/courses/${selected.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error ?? "Progress could not be saved.");
      mergeCourse(payload);
      if (payload.moduleCelebration) {
        setModuleCelebration(payload.moduleCelebration);
      }
      setPhase("ready");
      if (payload.progressPercent === 100 && previousProgress < 100) {
        setShowCelebration(true);
      }
      if (body.action === "lesson") notify("Lesson progress saved.", "success");
      return payload;
    } catch (error) {
      setPhase("error");
      notify(
        error instanceof Error ? error.message : "Progress could not be saved.",
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function deleteSelectedCourse() {
    if (!selected || !token) return;

    setPendingAction("delete-course");
    setDeleteConfirmOpen(false);
    notify(`Deleting "${selected.course.courseTitle}"...`, "info");
    try {
      const response = await fetch(`/api/academy/courses/${selected.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Course could not be deleted.");
      }

      const remainingCourses =
        dashboard?.courses.filter((course) => course.id !== selected.id) ?? [];
      setDashboard((current) => {
        if (!current) return current;
        return {
          ...current,
          courses: remainingCourses,
          metrics: {
            ...current.metrics,
            certificateCount: remainingCourses.filter((course) =>
              Boolean(course.certificate),
            ).length,
          },
        };
      });
      setSelectedId(remainingCourses[0]?.id ?? "");
      if (remainingCourses[0]) {
        activateLearningCursor(getResumeCursor(remainingCourses[0]), {
          course: remainingCourses[0],
          scroll: false,
        });
      } else {
        setActiveModule(0);
      }
      setDeleteConfirmOpen(false);
      notify("Course deleted.", "success");
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Course could not be deleted.",
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function generateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setPendingAction("generate");
    try {
      const response = await fetch("/api/academy/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, level, goal }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error ?? "Course generation failed.");
      const newCourse: DashboardCourse = {
        id: payload.courseId,
        course: payload.course,
        status: "active",
        progressPercent: 0,
        quizAttempts: [],
        assignmentSubmissions: [],
        activityLog: [],
        tutorMessages: [],
        createdAt: new Date().toISOString(),
      };
      setDashboard((current) =>
        current
          ? {
              ...current,
              student: {
                ...current.student,
                pointsBalance:
                  typeof payload.pointsBalance === "number"
                    ? payload.pointsBalance
                    : current.student.pointsBalance,
              },
              courses: [newCourse, ...current.courses],
            }
          : current,
      );
      setSelectedId(payload.courseId);
      activateLearningCursor(getResumeCursor(newCourse), {
        course: newCourse,
        scroll: false,
      });
      setPrompt("");
      setGoal("");
      setPhase("ready");
      notify(
        payload.accessType === "exemption"
          ? "Your AI learning path is ready and saved."
          : `Your AI learning path is ready. ${payload.pointsSpent ?? POINTS_PER_GENERATION} points used.`,
        "success",
      );
    } catch (error) {
      setPhase("error");
      notify(
        error instanceof Error ? error.message : "Course generation failed.",
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function startPointCheckout(points = purchasePoints) {
    if (!token) return;
    setPendingAction("checkout-points");
    try {
      const response = await fetch("/api/academy/payment/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error ?? "Checkout could not be started.");
      window.location.assign(payload.authorizationUrl);
    } catch (error) {
      setPhase("error");
      notify(
        error instanceof Error
          ? error.message
          : "Checkout could not be started.",
        "error",
      );
      setPendingAction(null);
    }
  }

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const questions =
      selected?.course.modules[activeModule]?.quiz.questions ?? [];
    if (
      questions.length < MIN_MODULE_QUIZ_QUESTIONS ||
      questions.some((question) => typeof question === "string")
    ) {
      notify(
        `Repair this assessment for free to get at least ${MIN_MODULE_QUIZ_QUESTIONS} AI-generated quiz questions.`,
        "warning",
      );
      return;
    }
    if (questions.some((_, index) => quizAnswers[index] === undefined)) {
      notify("Answer every quiz question before submitting.", "warning");
      return;
    }
    const answers = questions.map((_, index) => quizAnswers[index]);
    const payload = await patchCourse(
      { action: "quiz", moduleIndex: activeModule, answers },
      `quiz-${activeModule}`,
    );
    const latest = payload?.quizAttempts?.at(-1);
    if (latest) {
      setQuizResult({ score: latest.score, passed: latest.passed, answers });
      setQuizModalOpen(true);
      notify(
        `Quiz complete: ${latest.score}%.`,
        latest.passed ? "success" : "warning",
      );
      if (latest.passed && payload?.learningCursor) {
        activateLearningCursor(payload.learningCursor, { scroll: true });
      }
    }
  }

  async function repairModuleQuiz() {
    if (!selected) return;
    const payload = await patchCourse(
      { action: "repair_quiz", moduleIndex: activeModule },
      `repair-quiz-${activeModule}`,
    );
    if (payload?.course) {
      setQuizAnswers({});
      setQuizResult(null);
      notify("Assessment repaired for free with AI-generated questions.", "success");
    }
  }

  async function toggleLessonCompletion(lessonIndex: number, completed: boolean) {
    const result = await patchCourse(
      {
        action: "lesson",
        moduleIndex: activeModule,
        lessonIndex,
        completed,
      },
      `lesson-${activeModule}-${lessonIndex}`,
    );
    if (completed && result?.learningCursor) {
      activateLearningCursor(result.learningCursor, { scroll: true });
    }
  }

  async function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const moduleForSubmission = selected?.course.modules[activeModule];
    const workspaceEvidence = formatWorkspaceFilesForSubmission(
      assignmentWorkspaceFiles,
    );
    if (!workspaceEvidence.trim()) {
      notify(
        "Build your assignment in the code workspace before submitting.",
        "warning",
      );
      return;
    }
    const content = [
      moduleForSubmission
        ? `Assignment: ${moduleForSubmission.assignment}\nMini project: ${moduleForSubmission.miniProject}`
        : "",
      assignmentDraft.trim() ? `Notes:\n${assignmentDraft.trim()}` : "",
      `Code workspace:\n${workspaceEvidence}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    const result = await patchCourse(
      {
        action: "assignment",
        moduleIndex: activeModule,
        content,
      },
      `assignment-${activeModule}`,
    );
    const evaluation = result?.assignmentSubmissions?.find(
      (item: AssignmentSubmission) => item.moduleIndex === activeModule,
    )?.evaluation;
    if (result && evaluation) {
      notify(
        evaluation.passed
          ? `Assignment passed with ${evaluation.score}%.`
          : `Assignment needs revision: ${evaluation.score}%.`,
        evaluation.passed ? "success" : "warning",
      );
      if (evaluation.passed) {
        setAssignmentDraft("");
        if (result.learningCursor) {
          activateLearningCursor(result.learningCursor, { scroll: true });
        }
      }
    }
  }

  async function submitFinalProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const workspaceEvidence = formatWorkspaceFilesForSubmission(
      finalProjectWorkspaceFiles,
    );
    if (!workspaceEvidence.trim()) {
      notify(
        "Build your capstone in the Academy workspace before submitting.",
        "warning",
      );
      return;
    }

    const content = [
      `Final project: ${selected.course.finalProject}`,
      selected.course.finalProjectPlan?.overview
        ? `Project overview:\n${selected.course.finalProjectPlan.overview}`
        : "",
      finalDraft.trim() ? `Implementation notes:\n${finalDraft.trim()}` : "",
      `Code workspace:\n${workspaceEvidence}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const result = await patchCourse(
      { action: "final_project", content },
      "final-project",
    );
    const evaluation = result?.finalProjectSubmission?.evaluation as
      | SubmissionEvaluation
      | undefined;
    if (evaluation) {
      notify(
        evaluation.passed
          ? `Final project passed with ${evaluation.score}%.`
          : `Final project needs revision: ${evaluation.score}%.`,
        evaluation.passed ? "success" : "warning",
      );
      if (evaluation.passed) setFinalDraft("");
    }
  }

  const updatePreferredAstraName = useCallback((value: string) => {
    setPreferredAstraName(value);
    window.localStorage.setItem("lumyn_academy_astra_name", value);
  }, []);

  async function askTutor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !tutorQuestion.trim()) return;
    setPendingAction("tutor");
    try {
      const response = await fetch("/api/academy/tutor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selected.id,
          moduleIndex: activeModule,
          message: tutorQuestion,
          studentName: preferredAstraName.trim() || name.split(" ")[0] || name,
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(
          payload.error ?? `${ACADEMY_TUTOR_NAME} could not answer.`,
        );
      mergeCourse({ tutorMessages: payload.messages });
      setTutorQuestion("");
      setPhase("ready");
    } catch (error) {
      setPhase("error");
      notify(
        error instanceof Error
          ? error.message
          : `${ACADEMY_TUTOR_NAME} could not answer.`,
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function startNewTutorChat() {
    if (!selected || !token) return;
    setPendingAction("tutor-reset");
    try {
      const response = await fetch(
        `/api/academy/tutor?courseId=${encodeURIComponent(selected.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.error ?? `${ACADEMY_TUTOR_NAME} chat could not be reset.`,
        );
      }
      mergeCourse({ tutorMessages: payload.messages ?? [] });
      setTutorQuestion("");
      notify("Started a fresh Astra chat.", "success");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : `${ACADEMY_TUTOR_NAME} chat could not be reset.`,
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  function markNotificationRead(id: string) {
    setReadNotificationIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function markAllNotificationsRead() {
    setReadNotificationIds((current) => {
      const merged = new Set(current);
      notifications.forEach((notification) => merged.add(notification.id));
      return [...merged];
    });
  }

  async function enableBrowserNotifications() {
    const permission = getBrowserNotificationPermission();
    if (permission === "unsupported") {
      notify("This browser does not support push notifications.", "warning");
      setBrowserNotificationPermission(permission);
      return;
    }
    if (permission === "denied") {
      notify(
        "Push notifications are blocked. Enable them from your browser site settings.",
        "warning",
      );
      setBrowserNotificationPermission(permission);
      return;
    }
    if (permission === "granted") {
      notify("Push notifications are already enabled.", "success");
      setBrowserNotificationPermission(permission);
      return;
    }

    const nextPermission = await Notification.requestPermission();
    setBrowserNotificationPermission(nextPermission);
    notify(
      nextPermission === "granted"
        ? "Push notifications enabled for Academy updates."
        : "Push notifications were not enabled.",
      nextPermission === "granted" ? "success" : "warning",
    );
  }

  function scrollToActiveModule() {
    window.setTimeout(() => {
      document
        .getElementById("active-module-work")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function scrollToFinalProject() {
    window.setTimeout(() => {
      document
        .getElementById("final-project")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function activateLearningCursor(
    cursor: LearningCursor,
    options: { course?: DashboardCourse; persist?: boolean; scroll?: boolean } = {},
  ) {
    const sourceCourse = options.course ?? selected;
    if (cursor.step === "final_project") {
      if (showAssignments) router.push("/academy/dashboard/learning");
      if (sourceCourse?.course.modules.length) {
        setActiveModule(Math.max(0, sourceCourse.course.modules.length - 1));
      }
      if (options.scroll !== false) scrollToFinalProject();
      if (options.persist) void persistLearningCursor(cursor);
      return;
    }

    const moduleIndex = Math.max(0, cursor.moduleIndex ?? 0);
    setActiveModule(moduleIndex);
    setActiveLearningStep(cursor.step as ModuleLearningStepId);
    if (showAssignments && cursor.step !== "assignment") {
      router.push("/academy/dashboard/learning");
    }
    if (options.scroll !== false) scrollToActiveModule();
    if (options.persist) void persistLearningCursor(cursor);
  }

  function selectCourse(courseId: string) {
    const course = dashboard?.courses.find((item) => item.id === courseId);
    setSelectedId(courseId);
    if (course) {
      activateLearningCursor(getResumeCursor(course), { course, scroll: true });
    }
    else setActiveModule(0);
  }

  function openModule(index: number) {
    const cursor: LearningCursor = {
      moduleIndex: index,
      lessonIndex: 0,
      step: showAssignments ? "assignment" : "lessons",
      section: "overview",
      updatedAt: new Date().toISOString(),
    };
    setActiveModule(index);
    if (!showAssignments) setActiveLearningStep("lessons");
    void persistLearningCursor(cursor);
    scrollToActiveModule();
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const trimmedProfileName = profileName.trim();
    const trimmedCertificateName = certificateName.trim();
    setPendingAction("profile-save");
    try {
      const response = await fetch("/api/academy/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedProfileName,
          avatarUrl: profileAvatarUrl,
          certificateName: trimmedCertificateName,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Profile could not be saved.");
      }
      const savedStudent = payload.student ?? {};
      const savedCertificateName =
        savedStudent.certificateName?.trim?.() ?? trimmedCertificateName;
      const savedProfileName =
        savedStudent.name?.trim?.() ?? trimmedProfileName;
      const savedAvatarUrl = savedStudent.avatarUrl ?? profileAvatarUrl;
      setProfileName(savedProfileName);
      setCertificateName(savedCertificateName);
      setProfileAvatarUrl(savedAvatarUrl);
      setDashboard((current) =>
        current
          ? {
              ...current,
              student: {
                ...current.student,
                ...savedStudent,
                name: savedProfileName,
                avatarUrl: savedAvatarUrl,
                certificateName: savedCertificateName,
              },
              courses: current.courses.map((course) =>
                course.certificate
                  ? {
                      ...course,
                      certificate: {
                        ...course.certificate,
                        certificateName: savedCertificateName || undefined,
                      },
                    }
                  : course,
              ),
            }
          : current,
      );
      notify("Profile updated.", "success");
      setAccountPanel(null);
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Profile could not be saved.",
        "error",
      );
    } finally {
      setPendingAction(null);
    }
  }

  async function copyReferralLink() {
    const code = dashboard?.student.referralCode;
    if (!code) return;
    const origin = window.location.origin.includes("localhost")
      ? "https://lumynhq.studio"
      : window.location.origin;
    const link = `${origin}/academy?ref=${encodeURIComponent(code)}`;
    try {
      await window.navigator.clipboard.writeText(link);
      notify(
        "Referral link copied. One point lands when a new student joins with it.",
        "success",
      );
    } catch {
      notify(link, "info");
    }
  }

  async function handleSignOut() {
    setPendingAction("signout");
    try {
      await fetch("/api/academy/session", { method: "DELETE" });
      await signOut(auth);
      router.push("/academy/dashboard");
    } finally {
      setPendingAction(null);
    }
  }

  if (phase === "loading") return <DashboardLoading delayed={loadingDelayed} />;
  if (phase === "auth") return <DashboardAuthScreen />;
  const name =
    dashboard?.student.name ||
    user?.displayName ||
    dashboard?.student.email ||
    "Student";
  const completedModules =
    selected?.course.modules.filter(
      (module) => module.completionStatus === "completed",
    ).length ?? 0;
  const totalModules = selected?.course.modules.length ?? 0;
  const courseReadyForFinalProject =
    Boolean(selected) && totalModules > 0 && completedModules === totalModules;
  const showRouteAside = !showCertificates && !showBilling;
  const latestAttempt = selected?.quizAttempts
    .filter((attempt) => attempt.moduleIndex === activeModule)
    .at(-1);
  const activeModuleData = selected?.course.modules[activeModule];
  const submitted = selected?.assignmentSubmissions.find(
    (item) => item.moduleIndex === activeModule,
  );
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const avatarUrl = dashboard?.student.avatarUrl;
  const gamification = courseGamification(selected);
  const certificateDisplayName =
    certificateName.trim() ||
    dashboard?.student.certificateName?.trim() ||
    selected?.certificate?.certificateName?.trim() ||
    profileName.trim() ||
    name;
  const earnedCertificates =
    dashboard?.courses.filter((course) => Boolean(course.certificate)) ?? [];
  const referralOrigin = appOrigin.includes("localhost")
    ? "https://lumynhq.studio"
    : appOrigin;
  const referralLink =
    dashboard?.student.referralCode && appOrigin
      ? `${referralOrigin}/academy?ref=${dashboard.student.referralCode}`
      : "";
  const lessonsComplete =
    activeModuleData?.lessons.every(
      (lesson) => lesson.completionStatus === "completed",
    ) ?? false;
  const resumeCursor = selected ? getResumeCursor(selected) : undefined;
  const assignmentComplete =
    submitted?.evaluation?.passed === true || submitted?.status === "reviewed";
  const visibleLearningStep = showAssignments
    ? "assignment"
    : activeLearningStep;
  const learningSteps: LearningStepItem[] = activeModuleData
    ? [
        {
          id: "lessons",
          label: "Lessons",
          kicker: "Step 1",
          description: `${activeModuleData.lessons.length} focused cards`,
          status:
            visibleLearningStep === "lessons"
              ? "active"
              : lessonsComplete
                ? "done"
                : "ready",
        },
        {
          id: "quiz",
          label: "Quiz gate",
          kicker: "Step 2",
          description: latestAttempt?.passed
            ? `${latestAttempt.score}% passed`
            : "Prove the concept",
          status:
            visibleLearningStep === "quiz"
              ? "active"
              : latestAttempt?.passed
                ? "done"
                : "ready",
        },
        {
          id: "assignment",
          label: "Practice",
          kicker: "Step 3",
          description: assignmentComplete ? "Submitted" : "Build the proof",
          status:
            visibleLearningStep === "assignment"
              ? "active"
              : assignmentComplete
                ? "done"
                : "ready",
        },
      ]
    : [];

  return (
    <div className="academy-app-font academy-dashboard-shell min-h-screen bg-[#f2f1ed] text-[#18181b] dark:bg-[#08090c] dark:text-white">
      <header className="z-40 border-b border-transparent bg-[#f2f1ed] dark:bg-[#08090c] lg:sticky lg:top-0 lg:border-black/[0.08] lg:bg-[#f8f7f4]/90 lg:backdrop-blur-2xl lg:dark:border-white/[0.08] lg:dark:bg-[#0b0c10]/90">
        <div className="mx-auto hidden h-[72px] max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6 lg:flex lg:px-8">
          <div className="flex items-center gap-4">
            <AcademyHomeLink label="Open Lumyn Academy in browser">
              <AcademyLogo compact />
            </AcademyHomeLink>
            <span className="hidden h-5 w-px bg-black/10 dark:bg-white/10 sm:block" />
            <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:block">
              Academy workspace
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white/60 px-3 py-2 text-[11px] font-semibold capitalize text-neutral-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 md:flex">
              <span
                className={`h-2 w-2 rounded-full ${hasGenerationAccess ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              {hasGenerationExemption
                ? "Unlimited Academy access"
                : `${pointsBalance} points available`}
            </span>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadNotificationCount}
              open={notificationOpen}
              onToggle={() => setNotificationOpen((open) => !open)}
              onClose={() => setNotificationOpen(false)}
              onMarkRead={markNotificationRead}
              onMarkAllRead={markAllNotificationsRead}
              onEnablePush={enableBrowserNotifications}
              readNotificationIds={readNotificationIds}
              browserPermission={browserNotificationPermission}
            />
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/60 text-neutral-500 transition hover:border-[#7c6cf6]/40 hover:text-[#6c5ce7] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 lg:flex"
              aria-label="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <details className="group relative">
              <summary
                aria-label="Open account menu"
                className="relative z-[80] flex h-10 w-10 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#9589ff] to-[#6757e4] text-xs font-bold text-white shadow-[0_8px_24px_rgba(124,108,246,0.3)] ring-2 ring-transparent transition hover:ring-[#7c6cf6]/25 [&::-webkit-details-marker]:hidden"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "ST"
                )}
              </summary>
              <div className="fixed right-4 top-20 z-[100] w-72 overflow-hidden rounded-[1.35rem] border border-black/[0.08] bg-white p-2 text-[#18181b] shadow-[0_24px_70px_rgba(23,19,31,0.22)] dark:border-white/10 dark:bg-[#111219] dark:text-white sm:right-6 lg:right-8">
                <div className="flex items-center gap-3 border-b border-black/[0.06] p-3 dark:border-white/[0.08]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#7c6cf6] text-xs font-bold text-white">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt=""
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials || "ST"
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{name}</p>
                    <p className="truncate text-xs text-neutral-500 dark:text-white/40">
                      {dashboard?.student.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget
                      .closest("details")
                      ?.removeAttribute("open");
                    setAccountPanel("profile");
                  }}
                  className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.currentTarget
                      .closest("details")
                      ?.removeAttribute("open");
                    setAccountPanel("settings");
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={pendingAction === "signout"}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-3 py-2.5 text-sm font-semibold text-red-500 disabled:opacity-60"
                >
                  {pendingAction === "signout" && <LoadingSpinner />}Sign out
                </button>
              </div>
            </details>
          </div>
        </div>
        <div className="mx-auto px-5 pb-6 pt-6 sm:px-6 lg:hidden">
          <div className="flex items-start justify-between gap-4">
            <AcademyHomeLink label="Open Lumyn Academy in browser">
              <AcademyLogo className="pt-1" />
            </AcademyHomeLink>
            <div className="flex items-center gap-3">
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadNotificationCount}
                open={notificationOpen}
                onToggle={() => setNotificationOpen((open) => !open)}
                onClose={() => setNotificationOpen(false)}
                onMarkRead={markNotificationRead}
                onMarkAllRead={markAllNotificationsRead}
                onEnablePush={enableBrowserNotifications}
                readNotificationIds={readNotificationIds}
                browserPermission={browserNotificationPermission}
                mobile
              />
              <details className="group relative">
                <summary
                  aria-label="Open account menu"
                  className="relative z-[80] flex size-14 cursor-pointer list-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#9589ff] to-[#6757e4] text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,108,246,0.28)] ring-2 ring-[#21e0aa]/60 transition hover:ring-[#7c6cf6]/40 [&::-webkit-details-marker]:hidden"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || "ST"
                  )}
                </summary>
                <div className="fixed right-4 top-24 z-[100] w-72 overflow-hidden rounded-[1.35rem] border border-black/[0.08] bg-white p-2 text-[#18181b] shadow-[0_24px_70px_rgba(23,19,31,0.22)] dark:border-white/10 dark:bg-[#111219] dark:text-white">
                  <div className="flex items-center gap-3 border-b border-black/[0.06] p-3 dark:border-white/[0.08]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#7c6cf6] text-xs font-bold text-white">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt=""
                          width={44}
                          height={44}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials || "ST"
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{name}</p>
                      <p className="truncate text-xs text-neutral-500 dark:text-white/40">
                        {dashboard?.student.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                      setAccountPanel("profile");
                    }}
                    className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                      setAccountPanel("settings");
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={pendingAction === "signout"}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.06] px-3 py-2.5 text-sm font-semibold text-red-500 disabled:opacity-60"
                  >
                    {pendingAction === "signout" && <LoadingSpinner />}Sign out
                  </button>
                </div>
              </details>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="text-[1.7rem] font-semibold leading-tight tracking-[-0.04em] text-neutral-800 dark:text-white">
              Welcome, {name.split(" ")[0] || name}
            </h1>
            <p className="mt-2 max-w-xs text-[0.95rem] leading-6 text-neutral-500 dark:text-white/48">
              What would you like to learn today? Pick up your path or build a
              new one.
            </p>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <span className="shrink-0 rounded-full border border-black/[0.07] bg-white/75 px-3 py-2 text-[11px] font-bold text-neutral-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/55">
              {selected?.progressPercent ?? 0}% through path
            </span>
            <span className="shrink-0 rounded-full border border-black/[0.07] bg-white/75 px-3 py-2 text-[11px] font-bold text-neutral-600 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/55">
              {hasGenerationExemption
                ? "Unlimited courses"
                : `${pointsBalance} points left`}
            </span>
          </div>
        </div>
      </header>

      {accountPanel && (
        <AccountPanel
          mode={accountPanel}
          name={name}
          profileName={profileName}
          profileAvatarUrl={profileAvatarUrl}
          certificateName={certificateName}
          preferredAstraName={preferredAstraName}
          referralLink={referralLink}
          referralsCount={dashboard?.student.referralsCount ?? 0}
          isDark={isDark}
          pendingAction={pendingAction}
          onClose={() => setAccountPanel(null)}
          onSaveProfile={saveProfile}
          onToggleTheme={toggleTheme}
          onProfileNameChange={setProfileName}
          onAvatarChange={setProfileAvatarUrl}
          onCertificateNameChange={setCertificateName}
          onPreferredAstraNameChange={updatePreferredAstraName}
          onCopyReferralLink={copyReferralLink}
        />
      )}

      <div className="mx-auto grid w-full max-w-[1720px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-black/[0.08] px-5 py-7 dark:border-white/[0.08] lg:block">
          <div className="sticky top-[100px]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30">
              Workspace
            </p>
            <nav className="mt-3 space-y-1">
              {[
                ["Overview", "/academy/dashboard", "grid", "overview"],
                [
                  "My learning",
                  "/academy/dashboard/learning",
                  "book",
                  "learning",
                ],
                [
                  "Build a path",
                  "/academy/dashboard/generate",
                  "spark",
                  "generate",
                ],
                [
                  "Assignments",
                  "/academy/dashboard/assignments",
                  "check",
                  "assignments",
                ],
                [
                  "Certificates",
                  "/academy/dashboard/certificates",
                  "award",
                  "certificates",
                ],
                ["Point top-up", "/academy/dashboard/billing", "card", "billing"],
              ].map(([label, href, icon, view]) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${dashboardView === view ? "bg-[#7c6cf6]/10 text-[#6555db] dark:text-[#b9b1ff]" : "text-neutral-500 hover:bg-black/[0.04] hover:text-black dark:text-white/45 dark:hover:bg-white/[0.04] dark:hover:text-white"}`}
                >
                  <DashboardIcon type={icon} />
                  {label}
                </Link>
              ))}
            </nav>

            {dashboard?.courses.length ? (
              <div className="mt-8 border-t border-black/[0.08] pt-6 dark:border-white/[0.08]">
                <div className="flex items-center justify-between px-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30">
                    Your paths
                  </p>
                  <span className="text-[10px] text-neutral-400">
                    {dashboard.courses.length}
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  {dashboard.courses.slice(0, 4).map((course) => (
                    <button
                      type="button"
                      key={course.id}
                      onClick={() => {
                        selectCourse(course.id);
                      }}
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${selected?.id === course.id ? "bg-white shadow-sm dark:bg-white/[0.06]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"}`}
                    >
                      <p className="truncate text-xs font-semibold">
                        {course.course.courseTitle}
                      </p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
                        <div
                          className="h-full rounded-full bg-[#7c6cf6]"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.07] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                Point balance
              </p>
              <p className="mt-2 text-sm font-semibold">
                {hasGenerationExemption
                  ? "Unlimited AI courses"
                  : `${pointsBalance} points`}
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
                {POINTS_PER_GENERATION} points per generated path
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-3 pb-36 pt-4 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          {showOverview && (
            <OverviewHero
              name={name}
              course={selected}
              hasGenerationAccess={hasGenerationAccess}
              checkoutPending={pendingAction?.startsWith("checkout-") === true}
              onCheckout={() => startPointCheckout()}
            />
          )}

          {showOverview && (
            <OverviewMetricRail
              progress={selected?.progressPercent ?? 0}
              completedModules={completedModules}
              moduleCount={selected?.course.modules.length ?? 0}
              quizAverage={dashboard?.metrics.quizAverage ?? null}
              pendingAssignments={dashboard?.metrics.pendingAssignments ?? 0}
            />
          )}

          {!hasGenerationAccess && (
            <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-amber-500/20 bg-amber-500/[0.06] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-300">
                    Top up points to keep building
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    You need {POINTS_PER_GENERATION} points to generate another
                    learning path.
                  </h2>
                </div>
                <button
                  type="button"
                  disabled={pendingAction === "checkout-points"}
                  onClick={() => startPointCheckout()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-[#7c6cf6] disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06]"
                >
                  {pendingAction === "checkout-points" && <LoadingSpinner />}Buy
                  points
                </button>
              </div>
            </section>
          )}

          <div
            className={`mt-7 grid gap-7 ${
              showCertificates || showBilling
                ? "mx-auto max-w-3xl"
                : showRouteAside
                  ? "2xl:grid-cols-[minmax(0,1fr)_340px]"
                  : "mx-auto max-w-5xl"
            }`}
          >
            {!showCertificates && !showBilling && (
              <div className={`min-w-0 space-y-7 ${dashboardView}-route`}>
                {showGenerate && (
                  <section
                    id="generate"
                    className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]">
                        <SparkIcon />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                          AI course builder · {POINTS_PER_GENERATION} points
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em]">
                          What do you want to master next?
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-white/45">
                          Describe the skill and outcome. The AI will build the
                          full path and deduct points when generation starts.
                        </p>
                      </div>
                    </div>
                    <form onSubmit={generateCourse} className="mt-5 space-y-3">
                      <textarea
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="e.g. I want to learn React from scratch and build a job-ready portfolio in 8 weeks…"
                        className="min-h-28 w-full rounded-2xl border border-black/[0.08] bg-black/[0.025] p-4 text-sm leading-6 outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10 dark:bg-black/20"
                        required
                        maxLength={1200}
                      />
                      <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
                        <select
                          value={level}
                          onChange={(event) => setLevel(event.target.value)}
                          className="h-12 rounded-xl border border-black/[0.08] bg-transparent px-3 text-sm outline-none dark:border-white/10 placeholder:text-gray-500 pl-3"
                        >
                          <option className="text-gray-600">Beginner</option>
                          <option className="text-gray-600">
                            Intermediate
                          </option>
                          <option className="text-gray-600">Advanced</option>
                        </select>
                        <input
                          value={goal}
                          onChange={(event) => setGoal(event.target.value)}
                          placeholder="Your desired outcome"
                          className="h-12 rounded-xl border border-black/[0.08] bg-transparent px-4 text-sm outline-none focus:border-[#7c6cf6] dark:border-white/10"
                          required
                        />
                        <button
                          type="submit"
                          disabled={
                            !hasGenerationAccess || pendingAction === "generate"
                          }
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-6 text-sm font-bold text-white shadow-[0_12px_25px_rgba(124,108,246,0.22)] transition hover:bg-[#6b5bdd] disabled:opacity-40"
                        >
                          {pendingAction === "generate" ? (
                            <LoadingSpinner />
                          ) : (
                            <SparkIcon small />
                          )}
                          {pendingAction === "generate"
                            ? "Building your course…"
                            : hasGenerationAccess
                              ? "Generate path"
                              : "Need more points"}
                        </button>
                      </div>
                    </form>
                    {pendingAction === "generate" && (
                      <div
                        className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-[#7c6cf6]/20 bg-[#10111a] p-5 text-white shadow-[0_18px_60px_rgba(38,29,75,0.22)]"
                        role="status"
                        aria-live="polite"
                      >
                        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#7c6cf6]/25 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 left-10 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b9b1ff]">
                              Building your Academy path
                            </p>
                            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
                              Designing the curriculum, finding videos, and
                              writing assessments.
                            </h3>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">
                              This can take a minute because Lumyn creates the
                              path, enriches lessons with YouTube study targets,
                              and prepares the assessment gates before saving.
                            </p>
                          </div>
                          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-[2rem] border border-white/10 bg-white/[0.04]">
                            <span className="absolute h-20 w-20 animate-spin rounded-full border border-[#7c6cf6]/20 border-t-[#b9b1ff]" />
                            <span className="absolute h-14 w-14 animate-ping rounded-full bg-[#7c6cf6]/10" />
                            <SparkIcon />
                          </div>
                        </div>
                        <div className="relative mt-5 grid gap-2 sm:grid-cols-4">
                          {[
                            ["01", "Map modules", "Structuring the route"],
                            ["02", "Match videos", "Preparing study targets"],
                            ["03", "Build checks", "Writing assessments"],
                            ["04", "Save path", "Syncing dashboard"],
                          ].map(([step, title, detail], index) => (
                            <div
                              key={title}
                              className="rounded-2xl border border-white/8 bg-white/[0.035] p-3"
                              style={{ animationDelay: `${index * 120}ms` }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[10px] font-black text-[#b9b1ff]">
                                  {step}
                                </span>
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#8f82ff]" />
                              </div>
                              <p className="mt-2 text-xs font-bold">{title}</p>
                              <p className="mt-1 text-[11px] leading-4 text-white/42">
                                {detail}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                          <span className="academy-xp-bar absolute inset-y-0 left-0 w-2/3 rounded-full bg-gradient-to-r from-[#7c6cf6] via-[#38bdf8] to-[#b9b1ff]" />
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {showOverview && <OverviewJourney course={selected} />}

                {(showLearning || showAssignments) && (
                  <section
                    id="learning"
                    className="relative overflow-hidden rounded-[1.55rem] border border-black/[0.08] bg-white/75 p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:rounded-[1.75rem] sm:p-7"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                          Active learning path
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                          {selected?.course.courseTitle ??
                            "No learning path yet"}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-white/48">
                          {selected?.course.courseDescription ??
                            "Use the AI builder above to create a personalized, persisted course."}
                        </p>
                      </div>
                      {dashboard?.courses.length ? (
                        <details className="group w-full lg:max-w-sm">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.35rem] border border-black/[0.08] bg-black/[0.025] p-3 transition hover:border-[#7c6cf6]/35 hover:bg-[#7c6cf6]/[0.045] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07] [&::-webkit-details-marker]:hidden">
                            <span className="min-w-0">
                              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
                                Current path
                              </span>
                              <span className="mt-1 block truncate text-sm font-bold">
                                {selected?.course.courseTitle ??
                                  "Select a learning path"}
                              </span>
                              <span className="mt-1 block text-xs text-neutral-500 dark:text-white/42">
                                {selected?.progressPercent ?? 0}% complete
                              </span>
                            </span>
                            <span className="grid size-9 shrink-0 place-items-center rounded-2xl border border-black/[0.08] bg-white/70 transition group-open:rotate-180 dark:border-white/10 dark:bg-white/[0.06]">
                              <svg
                                aria-hidden="true"
                                className="size-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="m6 9 6 6 6-6"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                          </summary>
                          <div className="mt-2 overflow-hidden rounded-[1.35rem] border border-black/[0.08] bg-white/95 p-2 shadow-xl shadow-black/5 backdrop-blur dark:border-white/10 dark:bg-[#171821]/95 dark:shadow-black/20">
                            <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                              {dashboard.courses.map((course) => {
                                const isActive = course.id === selected?.id;
                                const courseCompletedModules =
                                  course.course.modules.filter(
                                    (module) =>
                                      module.completionStatus === "completed",
                                  ).length;
                                return (
                                  <button
                                    type="button"
                                    key={course.id}
                                    onClick={(event) => {
                                      selectCourse(course.id);
                                      event.currentTarget
                                        .closest("details")
                                        ?.removeAttribute("open");
                                    }}
                                    className={`w-full rounded-2xl border p-3 text-left transition ${
                                      isActive
                                        ? "border-[#7c6cf6]/40 bg-[#7c6cf6]/[0.1]"
                                        : "border-transparent hover:border-black/[0.08] hover:bg-black/[0.035] dark:hover:border-white/10 dark:hover:bg-white/[0.05]"
                                    }`}
                                  >
                                    <span className="flex items-start justify-between gap-3">
                                      <span className="min-w-0">
                                        <span className="block truncate text-sm font-bold">
                                          {course.course.courseTitle}
                                        </span>
                                        <span className="mt-1 block text-xs text-neutral-500 dark:text-white/42">
                                          {courseCompletedModules}/
                                          {course.course.modules.length} modules
                                          cleared
                                        </span>
                                      </span>
                                      <span className="shrink-0 rounded-full border border-black/[0.08] px-2 py-1 text-[10px] font-black text-[#6c5ce7] dark:border-white/10 dark:text-[#b9b1ff]">
                                        {course.progressPercent}%
                                      </span>
                                    </span>
                                    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
                                      <span
                                        className="block h-full rounded-full bg-[#7c6cf6]"
                                        style={{
                                          width: `${course.progressPercent}%`,
                                        }}
                                      />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.currentTarget
                                  .closest("details")
                                  ?.removeAttribute("open");
                                setDeleteConfirmOpen(true);
                              }}
                              disabled={
                                !selected || pendingAction === "delete-course"
                              }
                              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 text-xs font-black text-red-500 transition hover:bg-red-500/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {pendingAction === "delete-course"
                                ? "Deleting..."
                                : "Delete current path"}
                            </button>
                          </div>
                        </details>
                      ) : null}
                    </div>
                    {selected && (
                      <div className="mt-7">
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-neutral-500 dark:text-white/40">
                            Overall completion
                          </span>
                          <span className="font-bold text-[#6c5ce7] dark:text-[#b9b1ff]">
                            {selected.progressPercent}%
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
                          <div
                            className="h-full rounded-full bg-[#7c6cf6] transition-all duration-500"
                            style={{ width: `${selected.progressPercent}%` }}
                          />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-neutral-500 dark:text-white/45">
                          <span className="rounded-full border border-black/[0.08] px-3 py-1.5 dark:border-white/10">
                            Level {gamification.level}
                          </span>
                          <span className="rounded-full border border-black/[0.08] px-3 py-1.5 dark:border-white/10">
                            {gamification.xp} XP
                          </span>
                          <span className="rounded-full border border-black/[0.08] px-3 py-1.5 dark:border-white/10">
                            {completedModules}/{totalModules} modules cleared
                          </span>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {selected && (showLearning || showAssignments) && (
                  <ModulePathPicker
                    courseTitle={selected.course.courseTitle}
                    modules={selected.course.modules}
                    activeModule={activeModule}
                    onSelect={openModule}
                  />
                )}

                {selected &&
                  activeModuleData &&
                  (showLearning || showAssignments) && (
                    <LearningRoute
                      selected={selected}
                      activeModuleData={activeModuleData}
                      activeModule={activeModule}
                      showLearning={showLearning}
                      showAssignments={showAssignments}
                      visibleLearningStep={visibleLearningStep}
                      learningSteps={learningSteps}
                      resumeCursor={resumeCursor}
                      pendingAction={pendingAction}
                      latestAttempt={latestAttempt}
                      submitted={submitted}
                      quizAnswers={quizAnswers}
                      quizResult={quizResult}
                      assignmentDraft={assignmentDraft}
                      finalDraft={finalDraft}
                      courseReadyForFinalProject={courseReadyForFinalProject}
                      onLearningStepSelect={(step) => {
                        setActiveLearningStep(step);
                        if (
                          step === "lessons" ||
                          step === "quiz" ||
                          step === "assignment"
                        ) {
                          void persistLearningCursor({
                            moduleIndex: activeModule,
                            lessonIndex: step === "lessons" ? 0 : undefined,
                            step,
                            section: "overview",
                            updatedAt: new Date().toISOString(),
                          });
                        }
                      }}
                      onLessonOpen={(lessonIndex) => {
                        void persistLearningCursor({
                          moduleIndex: activeModule,
                          lessonIndex,
                          step: "lessons",
                          section: "overview",
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                      onLessonToggle={(lessonIndex, completed) =>
                        toggleLessonCompletion(lessonIndex, completed)
                      }
                      onQuizAnswerChange={(questionIndex, optionIndex) =>
                        setQuizAnswers((answers) => ({
                          ...answers,
                          [questionIndex]: optionIndex,
                        }))
                      }
                      onRepairQuiz={repairModuleQuiz}
                      onSubmitQuiz={submitQuiz}
                      onSubmitAssignment={submitAssignment}
                      onSubmitFinalProject={submitFinalProject}
                      onAssignmentDraftChange={setAssignmentDraft}
                      onFinalDraftChange={setFinalDraft}
                      onAssignmentFilesChange={handleAssignmentFilesChange}
                      onFinalProjectFilesChange={handleFinalProjectFilesChange}
                    />
                  )}

              </div>
            )}

            {showCertificates && (
              <CertificateRoute
                certificateDisplayName={certificateDisplayName}
                selected={selected}
                earnedCertificates={earnedCertificates}
              />
            )}

            {showBilling && (
              <PointTopUpRoute
                hasGenerationAccess={hasGenerationAccess}
                hasGenerationExemption={hasGenerationExemption}
                pointsBalance={pointsBalance}
                purchasePoints={purchasePoints}
                purchaseAmount={purchaseAmount}
                pendingAction={pendingAction}
                onPurchasePointsChange={setPurchasePoints}
                onCheckout={(points) => {
                  void startPointCheckout(points);
                }}
              />
            )}

            {showRouteAside && (
              <DashboardRightRail
                routeClassName={dashboardView}
                activityDates={dashboard?.metrics.activityDates ?? []}
                certificateDisplayName={certificateDisplayName}
                selected={selected}
                hasGenerationAccess={hasGenerationAccess}
                hasGenerationExemption={hasGenerationExemption}
                pointsBalance={pointsBalance}
                purchasePoints={purchasePoints}
                purchaseAmount={purchaseAmount}
                pendingAction={pendingAction}
                onPurchasePointsChange={setPurchasePoints}
                onCheckout={() => startPointCheckout()}
              />
            )}
          </div>
        </main>
      </div>
      <MobileDashboardNav
        currentView={dashboardView}
        isDark={isDark}
        moreOpen={mobileMoreOpen}
        onToggleMore={() => setMobileMoreOpen((open) => !open)}
        onToggleTheme={toggleTheme}
        onSignOut={handleSignOut}
        signingOut={pendingAction === "signout"}
      />
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      {selected && (
        <FloatingAstraChat
          messages={selected.tutorMessages}
          moduleTitle={activeModuleData?.title}
          preferredName={
            preferredAstraName.trim() || name.split(" ")[0] || name
          }
          question={tutorQuestion}
          pending={pendingAction === "tutor"}
          resetting={pendingAction === "tutor-reset"}
          onPreferredNameChange={updatePreferredAstraName}
          onQuestionChange={setTutorQuestion}
          onResetChat={startNewTutorChat}
          onSubmit={askTutor}
        />
      )}
      {quizModalOpen && quizResult && activeModuleData && (
        <QuizResultModal
          result={quizResult}
          title={activeModuleData.quiz.title}
          onClose={() => setQuizModalOpen(false)}
        />
      )}
      {moduleCelebration && (
        <ModuleCelebrationModal
          title={moduleCelebration.title}
          message={moduleCelebration.message}
          xp={moduleCelebration.xp}
          onClose={() => setModuleCelebration(null)}
        />
      )}
      {deleteConfirmOpen && selected && (
        <div
          className="fixed inset-0 z-[96] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-course-title"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-red-500/20 bg-[#111218] p-6 text-white shadow-2xl sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/12 text-red-200 ring-1 ring-red-500/20">
                <span className="text-2xl font-black">!</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-200/80">
                  Delete learning path
                </p>
                <h2
                  id="delete-course-title"
                  className="mt-2 text-2xl font-semibold tracking-[-0.03em]"
                >
                  Delete "{selected.course.courseTitle}"?
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  This permanently removes this generated course, lesson
                  progress, quiz attempts, assignments, final project
                  submission, and any certificate data for this path.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-4">
              <p className="text-sm font-semibold text-red-100">
                This cannot be undone.
              </p>
              <p className="mt-1 text-xs leading-5 text-red-100/62">
                Your Academy points will not be refunded. You can generate a new
                path later if you want to restart.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={pendingAction === "delete-course"}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 px-5 text-sm font-bold text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep this path
              </button>
              <button
                type="button"
                onClick={() => void deleteSelectedCourse()}
                disabled={pendingAction === "delete-course"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingAction === "delete-course" && <LoadingSpinner />}
                {pendingAction === "delete-course"
                  ? "Deleting..."
                  : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
      {pendingAction === "delete-course" && (
        <div
          className="fixed inset-0 z-[96] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Deleting course"
        >
          <div className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-[#111218] p-7 text-center text-white shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-200">
              <LoadingSpinner />
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-red-200/80">
              Deleting path
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              Removing this course...
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              We are deleting the generated lessons, progress, assignments, and
              certificate data for this path. This should only take a moment.
            </p>
          </div>
        </div>
      )}
      {showCelebration && selected && (
        <CelebrationModal
          courseTitle={selected.course.courseTitle}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
