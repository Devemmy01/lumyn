"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import LumynLogo from "@/components/LumynLogo";
import { useTheme } from "@/components/ThemeProvider";
import { academyPlans, type AssignmentSubmission, type GeneratedCourse, type GeneratedLesson, type LearningActivity, type QuizAttempt, type SubmissionEvaluation, type SubscriptionStatus } from "@/lib/academy";
import { getFirebaseAuth } from "@/lib/firebase/client";

type TutorMessage = { role: "user" | "assistant"; content: string; createdAt: string };
type ToastState = { type: "success" | "error" | "warning" | "info"; message: string };
type QuizResultState = { score: number; passed: boolean; answers: number[] };
type DashboardCourse = {
  id: string;
  course: GeneratedCourse;
  status: string;
  progressPercent: number;
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
  finalProjectSubmission?: { content: string; status: string; submittedAt: string; evaluation?: SubmissionEvaluation };
  activityLog: LearningActivity[];
  certificate?: { certificateId: string; issuedAt: string };
  tutorMessages: TutorMessage[];
  createdAt: string;
};
type DashboardPayload = {
  student: {
    name?: string;
    email: string;
    role: string;
    courseGenerationExempt?: boolean;
    subscription?: {
      planId?: string;
      status?: SubscriptionStatus;
      currentPeriodEnd?: string;
      cancelAtPeriodEnd?: boolean;
    };
    mentorshipStatus?: string;
    trial?: {
      available: boolean;
      usedAt?: string;
      courseId?: string;
    };
  };
  courses: DashboardCourse[];
  metrics: { quizAverage: number | null; pendingAssignments: number; activityDates: string[]; certificateCount: number };
};

const paidStatuses = new Set(["active", "past_due"]);

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
  const [phase, setPhase] = useState<"loading" | "ready" | "working" | "error">("loading");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultState | null>(null);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [assignmentDraft, setAssignmentDraft] = useState("");
  const [finalDraft, setFinalDraft] = useState("");
  const [tutorQuestion, setTutorQuestion] = useState("");

  const selected = dashboard?.courses.find((course) => course.id === selectedId) ?? dashboard?.courses[0];
  const subscription = dashboard?.student.subscription;
  const periodEnd = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).getTime() : 0;
  const hasPaidAccess = dashboard?.student.role === "admin" || paidStatuses.has(subscription?.status ?? "inactive") ||
    (subscription?.status === "cancelled" && periodEnd > Date.now());
  const hasGenerationExemption = dashboard?.student.courseGenerationExempt === true;
  const hasGenerationAccess = hasPaidAccess || hasGenerationExemption || Boolean(dashboard?.student.trial?.available);
  const currentView = pathname.split("/").filter(Boolean).at(-1) ?? "dashboard";
  const dashboardView = currentView === "dashboard" ? "overview" : currentView;
  const showOverview = dashboardView === "overview";
  const showGenerate = dashboardView === "generate";
  const showLearning = dashboardView === "learning";
  const showAssignments = dashboardView === "assignments";
  const showCertificates = dashboardView === "certificates";
  const showBilling = dashboardView === "billing";

  function notify(message: string, type: ToastState["type"] = "info") {
    setToast({ message, type });
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
  }, [activeModule, selectedId]);

  useEffect(() => {
    setMobileMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const loadingTimeout = window.setTimeout(() => {
      if (!cancelled) {
        setPhase("error");
        setToast({ type: "error", message: "The dashboard is taking too long to load. Refresh the page or sign in again." });
      }
    }, 12000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (cancelled) return;
      if (!currentUser) {
        window.clearTimeout(loadingTimeout);
        router.replace("/academy/sign-in");
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
        if (!response.ok) throw new Error(payload.error ?? "Your dashboard could not be loaded.");
        if (cancelled) return;
        setDashboard(payload);
        setSelectedId(payload.courses[0]?.id ?? "");
        setPhase("ready");
        if (paymentConfirmed) setToast({ type: "success", message: "Payment confirmed. Your Academy access is active." });
      } catch (error) {
        if (!cancelled) {
          setPhase("error");
          setToast({ type: "error", message: error instanceof Error ? error.message : "Your dashboard could not be loaded." });
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
    setDashboard((current) => current ? {
      ...current,
      courses: current.courses.map((course) => course.id === selected.id ? { ...course, ...update } : course),
    } : current);
  }

  async function patchCourse(body: Record<string, unknown>, actionKey = String(body.action ?? "course")) {
    if (!selected || !token) return;
    const previousProgress = selected.progressPercent;
    setPendingAction(actionKey);
    try {
      const response = await fetch(`/api/academy/courses/${selected.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Progress could not be saved.");
      mergeCourse(payload);
      setPhase("ready");
      if (payload.progressPercent === 100 && previousProgress < 100) {
        setShowCelebration(true);
      }
      if (body.action === "lesson") notify("Lesson progress saved.", "success");
      return payload;
    } catch (error) {
      setPhase("error");
      notify(error instanceof Error ? error.message : "Progress could not be saved.", "error");
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
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, level, goal }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Course generation failed.");
      const newCourse: DashboardCourse = {
        id: payload.courseId, course: payload.course, status: "active", progressPercent: 0,
        quizAttempts: [], assignmentSubmissions: [], activityLog: [], tutorMessages: [], createdAt: new Date().toISOString(),
      };
      setDashboard((current) => current ? {
        ...current,
        student: payload.accessType === "free_trial"
          ? {
            ...current.student,
            trial: {
              available: false,
              usedAt: new Date().toISOString(),
              courseId: payload.courseId,
            },
          }
          : current.student,
        courses: [newCourse, ...current.courses],
      } : current);
      setSelectedId(payload.courseId);
      setActiveModule(0);
      setPrompt("");
      setGoal("");
      setPhase("ready");
      notify(payload.accessType === "free_trial"
        ? "Your free AI course is ready. Subscribe whenever you want to generate another path."
        : "Your AI learning path is ready and saved.", "success");
    } catch (error) {
      setPhase("error");
      notify(error instanceof Error ? error.message : "Course generation failed.", "error");
    } finally {
      setPendingAction(null);
    }
  }

  async function startCheckout(planId = subscription?.planId ?? "ai-learning-path") {
    if (!token) return;
    setPendingAction(`checkout-${planId}`);
    try {
      const response = await fetch("/api/academy/payment/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Checkout could not be started.");
      window.location.assign(payload.authorizationUrl);
    } catch (error) {
      setPhase("error");
      notify(error instanceof Error ? error.message : "Checkout could not be started.", "error");
      setPendingAction(null);
    }
  }

  async function cancelSubscription() {
    if (!token || !window.confirm("Cancel renewal at the end of your current billing period?")) return;
    setPendingAction("cancel-subscription");
    try {
      const response = await fetch("/api/academy/payment/cancel", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Cancellation failed.");
      setDashboard((current) => current ? { ...current, student: { ...current.student, subscription: payload.subscription } } : current);
      notify("Renewal cancelled. Access remains available through the paid period.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Cancellation failed.", "error");
    } finally {
      setPendingAction(null);
    }
  }

  async function submitQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const questions = selected?.course.modules[activeModule]?.quiz.questions ?? [];
    if (questions.some((_, index) => quizAnswers[index] === undefined)) {
      notify("Answer every quiz question before submitting.", "warning");
      return;
    }
    const answers = questions.map((_, index) => quizAnswers[index]);
    const payload = await patchCourse(
      { action: "quiz", moduleIndex: activeModule, answers },
      `quiz-${activeModule}`
    );
    const latest = payload?.quizAttempts?.at(-1);
    if (latest) {
      setQuizResult({ score: latest.score, passed: latest.passed, answers });
      setQuizModalOpen(true);
      notify(`Quiz complete: ${latest.score}%.`, latest.passed ? "success" : "warning");
    }
  }

  async function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await patchCourse(
      { action: "assignment", moduleIndex: activeModule, content: assignmentDraft },
      `assignment-${activeModule}`
    );
    const evaluation = result?.assignmentSubmissions?.find(
      (item: AssignmentSubmission) => item.moduleIndex === activeModule
    )?.evaluation;
    if (result && evaluation) {
      notify(
        evaluation.passed
          ? `Assignment passed with ${evaluation.score}%.`
          : `Assignment needs revision: ${evaluation.score}%.`,
        evaluation.passed ? "success" : "warning"
      );
      if (evaluation.passed) setAssignmentDraft("");
    }
  }

  async function askTutor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !tutorQuestion.trim()) return;
    setPendingAction("tutor");
    try {
      const response = await fetch("/api/academy/tutor", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selected.id, moduleIndex: activeModule, message: tutorQuestion }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "The tutor could not answer.");
      mergeCourse({ tutorMessages: payload.messages });
      setTutorQuestion("");
      setPhase("ready");
    } catch (error) {
      setPhase("error");
      notify(error instanceof Error ? error.message : "The tutor could not answer.", "error");
    } finally {
      setPendingAction(null);
    }
  }

  async function handleSignOut() {
    setPendingAction("signout");
    try {
      await fetch("/api/academy/session", { method: "DELETE" });
      await signOut(auth);
      router.push("/academy");
    } finally {
      setPendingAction(null);
    }
  }

  if (phase === "loading") return <DashboardLoading />;
  const name = user?.displayName || dashboard?.student.name || dashboard?.student.email || "Student";
  const plan = academyPlans.find((item) => item.id === subscription?.planId);
  const completedModules = selected?.course.modules.filter((module) => module.completionStatus === "completed").length ?? 0;
  const latestAttempt = selected?.quizAttempts.filter((attempt) => attempt.moduleIndex === activeModule).at(-1);
  const activeModuleData = selected?.course.modules[activeModule];
  const submitted = selected?.assignmentSubmissions.find((item) => item.moduleIndex === activeModule);
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="academy-dashboard-shell min-h-screen bg-[#f2f1ed] text-[#18181b] dark:bg-[#08090c] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[#f8f7f4]/90 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0b0c10]/90">
        <div className="mx-auto flex h-[72px] max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/academy" aria-label="Academy home"><LumynLogo compact /></Link>
            <span className="hidden h-5 w-px bg-black/10 dark:bg-white/10 sm:block" />
            <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:block">Academy workspace</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white/60 px-3 py-2 text-[11px] font-semibold capitalize text-neutral-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50 md:flex">
              <span className={`h-2 w-2 rounded-full ${hasPaidAccess || hasGenerationExemption ? "bg-emerald-500" : dashboard?.student.trial?.available ? "bg-[#7c6cf6]" : "bg-amber-500"}`} />
              {hasPaidAccess ? `${subscription?.status ?? "active"} · ${plan?.name ?? "Academy"}` : hasGenerationExemption ? "Unlimited Academy access" : dashboard?.student.trial?.available ? "Free course available" : "Subscription required"}
            </span>
            <button type="button" onClick={toggleTheme} className="hidden h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/60 text-neutral-500 transition hover:border-[#7c6cf6]/40 hover:text-[#6c5ce7] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 lg:flex" aria-label="Toggle theme">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#9589ff] to-[#6757e4] text-xs font-bold text-white shadow-[0_8px_24px_rgba(124,108,246,0.3)]">{initials || "ST"}</div>
            <button type="button" onClick={handleSignOut} disabled={pendingAction === "signout"} className="hidden items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-[#6c5ce7] disabled:opacity-50 sm:flex">{pendingAction === "signout" && <LoadingSpinner />}Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1720px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-black/[0.08] px-5 py-7 dark:border-white/[0.08] lg:block">
          <div className="sticky top-[100px]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30">Workspace</p>
            <nav className="mt-3 space-y-1">
              {[
                ["Overview", "/academy/dashboard", "grid", "overview"],
                ["My learning", "/academy/dashboard/learning", "book", "learning"],
                ["Build a path", "/academy/dashboard/generate", "spark", "generate"],
                ["Assignments", "/academy/dashboard/assignments", "check", "assignments"],
                ["Certificates", "/academy/dashboard/certificates", "award", "certificates"],
                ["Billing", "/academy/dashboard/billing", "card", "billing"],
              ].map(([label, href, icon, view]) => (
                <Link key={label} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${dashboardView === view ? "bg-[#7c6cf6]/10 text-[#6555db] dark:text-[#b9b1ff]" : "text-neutral-500 hover:bg-black/[0.04] hover:text-black dark:text-white/45 dark:hover:bg-white/[0.04] dark:hover:text-white"}`}>
                  <DashboardIcon type={icon} />{label}
                </Link>
              ))}
            </nav>

            {dashboard?.courses.length ? <div className="mt-8 border-t border-black/[0.08] pt-6 dark:border-white/[0.08]">
              <div className="flex items-center justify-between px-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 dark:text-white/30">Your paths</p><span className="text-[10px] text-neutral-400">{dashboard.courses.length}</span></div>
              <div className="mt-3 space-y-1">{dashboard.courses.slice(0, 4).map((course) => <button type="button" key={course.id} onClick={() => { setSelectedId(course.id); setActiveModule(0); }} className={`w-full rounded-xl px-3 py-3 text-left transition ${selected?.id === course.id ? "bg-white shadow-sm dark:bg-white/[0.06]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"}`}><p className="truncate text-xs font-semibold">{course.course.courseTitle}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]"><div className="h-full rounded-full bg-[#7c6cf6]" style={{ width: `${course.progressPercent}%` }} /></div></button>)}</div>
            </div> : null}

            <div className="mt-8 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.07] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6c5ce7] dark:text-[#b9b1ff]">Current plan</p>
              <p className="mt-2 text-sm font-semibold">{hasPaidAccess ? plan?.name ?? "Academy access" : hasGenerationExemption ? "Unlimited AI courses" : dashboard?.student.trial?.available ? "One free AI course" : "Free trial completed"}</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">{hasPaidAccess && plan ? `${plan.price}/${plan.cadence}` : hasGenerationExemption ? "Granted by Lumyn Academy" : dashboard?.student.trial?.available ? "No payment required" : "Subscribe to generate more paths"}</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
          <MobileRouteHeading view={dashboardView} progress={selected?.progressPercent ?? 0} />

          {showOverview && <OverviewHero name={name} course={selected} hasGenerationAccess={hasGenerationAccess} checkoutPending={pendingAction?.startsWith("checkout-") === true} onCheckout={() => startCheckout()} />}

          {showOverview && <OverviewMetricRail
            progress={selected?.progressPercent ?? 0}
            completedModules={completedModules}
            moduleCount={selected?.course.modules.length ?? 0}
            quizAverage={dashboard?.metrics.quizAverage ?? null}
            pendingAssignments={dashboard?.metrics.pendingAssignments ?? 0}
          />}

          {!hasPaidAccess && !hasGenerationExemption && !dashboard?.student.trial?.available && (
            <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-amber-500/20 bg-amber-500/[0.06] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-600 dark:text-amber-300">Choose a plan to unlock AI learning</p><h2 className="mt-2 text-xl font-semibold">Generate personalized courses and save every milestone.</h2></div><div className="flex flex-col gap-2 sm:flex-row">{academyPlans.map((item) => <button type="button" key={item.id} disabled={pendingAction === `checkout-${item.id}`} onClick={() => startCheckout(item.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-[#7c6cf6] disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06]">{pendingAction === `checkout-${item.id}` && <LoadingSpinner />}{item.name} · {item.price}</button>)}</div></div>
            </section>
          )}

          <div className={`mt-7 grid gap-7 ${showCertificates || showBilling ? "mx-auto max-w-3xl" : "2xl:grid-cols-[minmax(0,1fr)_340px]"}`}>
            {!showCertificates && !showBilling && <div className={`min-w-0 space-y-7 ${dashboardView}-route`}>
              {showGenerate && <section id="generate" className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
                <div className="absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#7c6cf6]/10 blur-3xl" />
                <div className="relative flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]"><SparkIcon /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">AI course builder {dashboard?.student.trial?.available && !hasPaidAccess ? "· first course free" : ""}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em]">What do you want to master next?</h2><p className="mt-1 text-sm text-neutral-500 dark:text-white/45">{dashboard?.student.trial?.available && !hasPaidAccess ? "Your first complete course is free—no subscription required." : "Describe the skill and outcome. The AI will build the full path."}</p></div></div>
                <form onSubmit={generateCourse} className="mt-5 space-y-3">
                  <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="e.g. I want to learn React from scratch and build a job-ready portfolio in 8 weeks…" className="min-h-28 w-full rounded-2xl border border-black/[0.08] bg-black/[0.025] p-4 text-sm leading-6 outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10 dark:bg-black/20" required maxLength={1200} />
                  <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
                    <select value={level} onChange={(event) => setLevel(event.target.value)} className="h-12 rounded-xl border border-black/[0.08] bg-transparent px-3 text-sm outline-none dark:border-white/10 placeholder:text-gray-500 pl-3"><option className="text-gray-600">Beginner</option><option className="text-gray-600">Intermediate</option><option className="text-gray-600">Advanced</option></select>
                    <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="Your desired outcome" className="h-12 rounded-xl border border-black/[0.08] bg-transparent px-4 text-sm outline-none focus:border-[#7c6cf6] dark:border-white/10" required />
                    <button type="submit" disabled={!hasGenerationAccess || pendingAction === "generate"} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-6 text-sm font-bold text-white shadow-[0_12px_25px_rgba(124,108,246,0.22)] transition hover:bg-[#6b5bdd] disabled:opacity-40">{pendingAction === "generate" ? <LoadingSpinner /> : <SparkIcon small />}{pendingAction === "generate" ? "Building your course…" : dashboard?.student.trial?.available && !hasPaidAccess && !hasGenerationExemption ? "Generate free course" : "Generate path"}</button>
                  </div>
                </form>
              </section>}

              {showOverview && <OverviewJourney course={selected} />}

              {(showLearning || showAssignments) && <section id="learning" className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Active learning path</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{selected?.course.courseTitle ?? "No learning path yet"}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-white/48">{selected?.course.courseDescription ?? "Use the AI builder above to create a personalized, persisted course."}</p></div>
                  {dashboard?.courses.length ? <select value={selected?.id} onChange={(event) => { setSelectedId(event.target.value); setActiveModule(0); }} className="w-full rounded-xl border border-black/[0.08] bg-transparent p-3 text-sm outline-none dark:border-white/10 lg:max-w-xs">{dashboard.courses.map((course) => <option key={course.id} value={course.id}>{course.course.courseTitle}</option>)}</select> : null}
                </div>
                {selected && <div className="mt-7"><div className="mb-2 flex items-center justify-between text-xs"><span className="text-neutral-500 dark:text-white/40">Overall completion</span><span className="font-bold text-[#6c5ce7] dark:text-[#b9b1ff]">{selected.progressPercent}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-[#6757e4] to-[#9b8cff] shadow-[0_0_18px_rgba(124,108,246,0.35)] transition-all duration-500" style={{ width: `${selected.progressPercent}%` }} /></div></div>}
              </section>}

              {selected && (showLearning || showAssignments) && <section id="modules">
                <div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Course map</p><h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em]">Choose a module</h2></div><span className="text-xs text-neutral-400">{selected.course.modules.length} modules</span></div>
                <div className="grid gap-3 md:grid-cols-2">{selected.course.modules.map((item, index) => <button type="button" key={`${item.title}-${index}`} onClick={() => item.completionStatus !== "locked" && setActiveModule(index)} disabled={item.completionStatus === "locked"} className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${activeModule === index ? "border-[#7c6cf6]/50 bg-[#7c6cf6]/[0.08] shadow-[0_12px_35px_rgba(124,108,246,0.08)]" : "border-black/[0.08] bg-white/75 hover:-translate-y-0.5 hover:border-[#7c6cf6]/30 dark:border-white/[0.08] dark:bg-[#111219]"}`}><div className="flex items-start justify-between gap-4"><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${item.completionStatus === "completed" ? "bg-emerald-500 text-white" : activeModule === index ? "bg-[#7c6cf6] text-white" : "bg-black/[0.05] text-neutral-400 dark:bg-white/[0.07]"}`}>{item.completionStatus === "completed" ? "✓" : String(index + 1).padStart(2, "0")}</span><span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:bg-white/[0.06]">{item.completionStatus.replace("_", " ")}</span></div><h3 className="mt-5 font-semibold">{item.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500 dark:text-white/40">{item.description}</p><div className={`absolute bottom-0 left-0 h-0.5 bg-[#7c6cf6] transition-all ${activeModule === index ? "w-full" : "w-0 group-hover:w-full"}`} /></button>)}</div>
              </section>}

              {selected && activeModuleData && (showLearning || showAssignments) && <section id="work" className={`space-y-7 ${showAssignments ? "assignment-only" : ""}`}>
                {showLearning && (
                  <div className="overflow-hidden rounded-[1.75rem] border border-black/[0.08] bg-white/75 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]">
                    <div className="border-b border-black/[0.07] bg-gradient-to-r from-[#7c6cf6]/10 to-transparent p-5 dark:border-white/[0.07] sm:p-7">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Module {activeModule + 1}</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{activeModuleData.title}</h2>
                      <p className="mt-2 text-sm text-neutral-500 dark:text-white/45">{activeModuleData.lessons.length} guided lessons · quiz · practical assignment</p>
                    </div>
                    <div className="space-y-4 p-4 sm:p-6">
                      {activeModuleData.lessons.map((lesson, index) => (
                        <LessonCard
                          key={`${activeModule}-${lesson.title}-${index}`}
                          lesson={lesson}
                          index={index}
                          pending={pendingAction === `lesson-${activeModule}-${index}`}
                          onToggle={() => patchCourse(
                            {
                              action: "lesson",
                              moduleIndex: activeModule,
                              lessonIndex: index,
                              completed: lesson.completionStatus !== "completed",
                            },
                            `lesson-${activeModule}-${index}`
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={submitQuiz} className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Knowledge check</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">{activeModuleData.quiz.title}</h2></div>
                    {latestAttempt && <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${latestAttempt.passed ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>{latestAttempt.score}% · {latestAttempt.passed ? "Passed" : "Try again"}</span>}
                  </div>
                  <div className="mt-7 space-y-8">
                    {activeModuleData.quiz.questions.map((question, questionIndex) => {
                      if (typeof question === "string") return <p key={questionIndex} className="text-sm">This legacy quiz cannot be graded. Generate a new course.</p>;
                      return (
                        <fieldset key={questionIndex} disabled={Boolean(latestAttempt?.passed)}>
                          <legend className="font-semibold"><span className="mr-2 text-[#7c6cf6]">{String(questionIndex + 1).padStart(2, "0")}</span>{question.question}</legend>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {question.options.map((option, optionIndex) => {
                              const isSelected = quizAnswers[questionIndex] === optionIndex;
                              const isCorrect = quizResult && optionIndex === question.correctAnswerIndex;
                              const isWrongSelection = quizResult && isSelected && !isCorrect;
                              return <label key={optionIndex} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${isCorrect ? "border-emerald-500/40 bg-emerald-500/10" : isWrongSelection ? "border-red-500/40 bg-red-500/10" : isSelected ? "border-[#7c6cf6]/50 bg-[#7c6cf6]/10" : "border-black/[0.08] hover:border-[#7c6cf6]/25 dark:border-white/10"}`}><input type="radio" className="accent-[#7c6cf6]" name={`q-${activeModule}-${questionIndex}`} checked={isSelected} onChange={() => setQuizAnswers((answers) => ({ ...answers, [questionIndex]: optionIndex }))} />{option}{isCorrect && <span className="ml-auto text-emerald-600">✓</span>}</label>;
                            })}
                          </div>
                          {quizResult && <p className="mt-3 rounded-xl bg-black/[0.03] p-3 text-xs leading-5 text-neutral-600 dark:bg-white/[0.04] dark:text-white/55"><strong>Explanation:</strong> {question.explanation}</p>}
                        </fieldset>
                      );
                    })}
                  </div>
                  <button type="submit" disabled={typeof activeModuleData.quiz.questions[0] === "string" || pendingAction === `quiz-${activeModule}` || latestAttempt?.passed} className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(124,108,246,0.2)] transition disabled:cursor-not-allowed sm:w-auto ${latestAttempt?.passed ? "bg-emerald-500" : "bg-[#7c6cf6] hover:bg-[#6b5bdd] disabled:opacity-50"}`}>{pendingAction === `quiz-${activeModule}` && <LoadingSpinner />}{latestAttempt?.passed ? "Completed ✓" : pendingAction === `quiz-${activeModule}` ? "Grading quiz…" : "Submit quiz"}</button>
                </form>

                <form onSubmit={submitAssignment} id="assignments" className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Put it into practice</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">Module assignment</h2>
                  <div className="mt-5 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-black/[0.07] p-4 dark:border-white/[0.08]"><p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Assignment</p><p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/55">{activeModuleData.assignment}</p></div><div className="rounded-2xl border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.05] p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-[#6c5ce7] dark:text-[#b9b1ff]">Mini project</p><p className="mt-2 text-sm leading-6">{activeModuleData.miniProject}</p></div></div>
                  {submitted?.evaluation && <EvaluationFeedback evaluation={submitted.evaluation} />}
                  {submitted?.status === "submitted" || submitted?.status === "reviewed" ? (
                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-sm leading-6"><span className="font-bold text-emerald-600">Accepted {new Date(submitted.submittedAt).toLocaleDateString()}</span><p className="mt-1 text-neutral-600 dark:text-white/55">{submitted.content}</p></div>
                  ) : (
                    <><textarea value={assignmentDraft} onChange={(event) => setAssignmentDraft(event.target.value)} placeholder="Explain how your solution meets every requirement. Include relevant code/file details and an optional repository or live link. A link alone cannot be assessed." className="mt-5 min-h-36 w-full rounded-2xl border border-black/[0.08] bg-transparent p-4 text-sm leading-6 outline-none focus:border-[#7c6cf6] dark:border-white/10" required /><p className="mt-2 text-xs text-neutral-500 dark:text-white/40">Your submission is graded against the stated requirements. Score 70% or higher to pass.</p><button type="submit" disabled={pendingAction === `assignment-${activeModule}`} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:w-auto">{pendingAction === `assignment-${activeModule}` && <LoadingSpinner />}{pendingAction === `assignment-${activeModule}` ? "Assessing submission…" : submitted ? "Resubmit assignment" : "Submit assignment"}</button></>
                  )}
                </form>

                <TutorPanel
                  messages={selected.tutorMessages}
                  question={tutorQuestion}
                  pending={pendingAction === "tutor"}
                  onQuestionChange={setTutorQuestion}
                  onSubmit={askTutor}
                />
              </section>}

              {selected && <section id="final-project" className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7"><div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600"><AwardIcon /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">Capstone</p><h2 className="mt-1 text-2xl font-semibold">Final project</h2></div></div><p className="mt-5 rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 text-sm leading-7 text-neutral-600 dark:border-white/[0.07] dark:bg-black/15 dark:text-white/55">{selected.course.finalProject}</p>{selected.finalProjectSubmission?.evaluation && <EvaluationFeedback evaluation={selected.finalProjectSubmission.evaluation} />}{selected.finalProjectSubmission?.status === "submitted" || selected.finalProjectSubmission?.status === "reviewed" ? <p className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-sm"><strong className="text-emerald-600">Accepted:</strong> {selected.finalProjectSubmission.content}</p> : <form onSubmit={async (event) => { event.preventDefault(); const result = await patchCourse({ action: "final_project", content: finalDraft }, "final-project"); const evaluation = result?.finalProjectSubmission?.evaluation as SubmissionEvaluation | undefined; if (evaluation) { notify(evaluation.passed ? `Final project passed with ${evaluation.score}%.` : `Final project needs revision: ${evaluation.score}%.`, evaluation.passed ? "success" : "warning"); if (evaluation.passed) setFinalDraft(""); } }}><textarea value={finalDraft} onChange={(event) => setFinalDraft(event.target.value)} className="mt-5 min-h-36 w-full rounded-2xl border border-black/[0.08] bg-transparent p-4 text-sm leading-6 outline-none focus:border-[#7c6cf6] dark:border-white/10" placeholder="Explain your implementation, decisions, completed requirements, and evidence. Include repository/demo links only alongside the explanation." required /><button type="submit" disabled={pendingAction === "final-project"} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pendingAction === "final-project" && <LoadingSpinner />}{pendingAction === "final-project" ? "Assessing project…" : selected.finalProjectSubmission ? "Resubmit final project" : "Submit final project"}</button></form>}</section>}
            </div>}

            <aside className={`${dashboardView}-route-aside space-y-4 2xl:sticky 2xl:top-[100px] 2xl:self-start`}>
              <section className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Learning rhythm</p><h2 className="mt-1 font-semibold">Last 7 days</h2></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]"><ActivityIcon /></span></div><div className="mt-5 grid grid-cols-7 gap-1.5">{lastSevenDays().map((day) => { const active = dashboard?.metrics.activityDates.includes(day.key); return <div key={day.key} className="text-center"><div className={`h-11 rounded-lg transition ${active ? "bg-gradient-to-b from-[#9b8cff] to-[#6757e4] shadow-[0_8px_18px_rgba(124,108,246,0.2)]" : "bg-black/[0.04] dark:bg-white/[0.05]"}`} /><p className="mt-1.5 text-[9px] font-semibold text-neutral-400">{day.label}</p></div>; })}</div><p className="mt-4 text-xs leading-5 text-neutral-500 dark:text-white/40">Every completed lesson, quiz, and submission builds your streak.</p></section>
              <CertificateCard studentName={name} course={selected} />
              <section id="billing" className="rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Billing</p><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${hasPaidAccess || hasGenerationExemption ? "bg-emerald-500/10 text-emerald-600" : dashboard?.student.trial?.available ? "bg-[#7c6cf6]/10 text-[#6555db] dark:text-[#b9b1ff]" : "bg-amber-500/10 text-amber-600"}`}>{hasPaidAccess ? subscription?.status ?? "active" : hasGenerationExemption ? "exempt" : dashboard?.student.trial?.available ? "free trial" : "trial used"}</span></div><p className="mt-4 font-semibold">{hasPaidAccess ? plan?.name ?? "Academy access" : hasGenerationExemption ? "Unlimited AI courses" : dashboard?.student.trial?.available ? "One free AI course" : "Subscription required"}</p><p className="mt-1 text-xs text-neutral-500 dark:text-white/40">{subscription?.currentPeriodEnd ? `Access through ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : hasGenerationExemption ? "This account can generate multiple courses without a subscription" : dashboard?.student.trial?.available ? "Generate your first course at no cost" : "Subscribe to generate additional courses"}</p>{hasPaidAccess && !subscription?.cancelAtPeriodEnd && <button type="button" disabled={pendingAction === "cancel-subscription"} onClick={cancelSubscription} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-red-500 transition hover:text-red-600 disabled:opacity-60">{pendingAction === "cancel-subscription" && <LoadingSpinner />}Cancel renewal</button>}{!hasPaidAccess && !hasGenerationExemption && !dashboard?.student.trial?.available && <button type="button" disabled={pendingAction === `checkout-${subscription?.planId ?? "ai-learning-path"}`} onClick={() => startCheckout()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">{pendingAction?.startsWith("checkout-") && <LoadingSpinner />}View subscription</button>}<div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-black/[0.07] pt-4 text-[10px] font-semibold text-neutral-400 dark:border-white/[0.07]"><Link href="/terms" className="hover:text-[#6c5ce7]">Terms</Link><Link href="/privacy" className="hover:text-[#6c5ce7]">Privacy</Link><Link href="/refund-policy" className="hover:text-[#6c5ce7]">Refund policy</Link><span>Payments by Paystack</span></div></section>
              <section className="dark-visual relative overflow-hidden rounded-[1.5rem] bg-[#101017] p-5 text-white shadow-sm"><div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#7c6cf6]/30 blur-3xl" /><p className="relative text-[10px] font-bold uppercase tracking-[0.16em] text-[#a99eff]">Guided mentorship</p><p className="relative mt-3 text-lg font-semibold capitalize text-white">{dashboard?.student.mentorshipStatus === "none" ? "Build with an expert" : dashboard?.student.mentorshipStatus}</p><p className="relative mt-2 text-xs leading-5 text-white/45">Weekly guidance, reviews, accountability, and career support.</p><Link href="/academy#mentorship" className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b9b1ff]">Explore mentorship <ArrowIcon /></Link></section>
            </aside>
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
      {quizModalOpen && quizResult && activeModuleData && (
        <QuizResultModal
          result={quizResult}
          title={activeModuleData.quiz.title}
          onClose={() => setQuizModalOpen(false)}
        />
      )}
      {showCelebration && selected && (
        <CelebrationModal courseTitle={selected.course.courseTitle} onClose={() => setShowCelebration(false)} />
      )}
    </div>
  );
}

function OverviewHero({
  name,
  course,
  hasGenerationAccess,
  checkoutPending,
  onCheckout,
}: {
  name: string;
  course?: DashboardCourse;
  hasGenerationAccess: boolean;
  checkoutPending: boolean;
  onCheckout: () => void;
}) {
  const progress = course?.progressPercent ?? 0;

  return (
    <section id="overview" className="dark-visual relative isolate overflow-hidden rounded-[2.2rem] bg-[#0e0f15] px-6 py-8 text-white shadow-[0_28px_90px_rgba(38,29,75,0.22)] sm:px-9 sm:py-10 lg:min-h-[360px] lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(124,108,246,0.17),transparent_46%),radial-gradient(circle_at_86%_18%,rgba(80,201,255,0.15),transparent_28%)]" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-[#8f82ff]/25" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px] pb-5">
        <div>
          
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">Make today count,<br /><span className="text-[#9e93ff]">{name.split(" ")[0]}.</span></h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/50 sm:text-base">One focused lesson, one honest attempt, one step closer to the work you want to do.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {course ? <Link href="/academy/dashboard/learning" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(124,108,246,0.3)] transition hover:-translate-y-0.5 hover:bg-[#897af8]">Continue where I stopped <ArrowIcon /></Link> : hasGenerationAccess ? <Link href="/academy/dashboard/generate" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white">Build my first path <ArrowIcon /></Link> : <button type="button" onClick={onCheckout} disabled={checkoutPending} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-bold text-white disabled:opacity-60">{checkoutPending && <LoadingSpinner />}{checkoutPending ? "Opening checkout…" : "Activate access"}</button>}
            {course && <Link href="/academy/dashboard/generate" className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-6 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white">Build a new path</Link>}
          </div>
        </div>
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center lg:h-64 lg:w-64">
          <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-5 rounded-full opacity-90" style={{ background: `conic-gradient(#8f82ff ${progress * 3.6}deg, rgba(255,255,255,0.075) 0deg)` }} />
          <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-[#111218] shadow-[inset_0_0_45px_rgba(124,108,246,0.12)]">
            <span className="text-4xl font-semibold tracking-[-0.06em] text-white">{progress}%</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">course progress</span>
          </div>
          <span className="absolute right-0 top-10 h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_18px_#7dd3fc]" />
          <span className="absolute bottom-7 left-5 h-2 w-2 rounded-full bg-[#a99eff] shadow-[0_0_16px_#a99eff]" />
        </div>
      </div>
      <div className="relative mt-9 flex items-center gap-3 border-t border-white/[0.08] pt-5 text-xs text-white/40 lg:absolute lg:bottom-8 lg:left-12 lg:mt-5 lg:max-w-[52%] lg:pt-0"><span className="h-px w-8 bg-[#8f82ff]" />{course ? course.course.courseTitle : "Your next learning path starts with a clear goal."}</div>
    </section>
  );
}

function OverviewMetricRail({ progress, completedModules, moduleCount, quizAverage, pendingAssignments }: { progress: number; completedModules: number; moduleCount: number; quizAverage: number | null; pendingAssignments: number }) {
  const metrics = [
    { label: "Path progress", value: `${progress}%`, detail: "overall" },
    { label: "Modules", value: `${completedModules}/${moduleCount}`, detail: "completed" },
    { label: "Quiz signal", value: quizAverage === null ? "—" : `${quizAverage}%`, detail: "average" },
    { label: "Open work", value: String(pendingAssignments), detail: "assignments" },
  ];

  return (
    <section className="mt-6 overflow-hidden border-y border-black/[0.08] dark:border-white/[0.08]" aria-label="Learning metrics">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => <div key={metric.label} className={`relative px-4 py-5 sm:px-6 ${index % 2 === 0 ? "border-r border-black/[0.08] dark:border-white/[0.08]" : ""} ${index < 2 ? "border-b border-black/[0.08] lg:border-b-0 dark:border-white/[0.08]" : ""} ${index === 1 ? "lg:border-r" : ""} ${index === 2 ? "lg:border-r" : ""}`}><span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-[#7c6cf6] opacity-0 transition group-hover:opacity-100" /><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">{metric.label}</p><div className="mt-2 flex items-baseline gap-2"><span className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{metric.value}</span><span className="text-[10px] text-neutral-400">{metric.detail}</span></div></div>)}
      </div>
    </section>
  );
}

function OverviewJourney({ course }: { course?: DashboardCourse }) {
  if (!course) {
    return <section className="relative overflow-hidden py-4 sm:py-8"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7565e8] dark:text-[#a99eff]">Your learning journey</p><h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em]">Turn a goal into a path you can actually finish.</h2><div className="mt-8 flex items-center gap-2 overflow-hidden">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="flex flex-1 items-center gap-2"><span className={`h-3 w-3 shrink-0 rounded-full ${item === 0 ? "bg-[#7c6cf6] shadow-[0_0_18px_rgba(124,108,246,.6)]" : "border border-black/15 dark:border-white/15"}`} />{item < 4 && <span className="h-px flex-1 border-t border-dashed border-black/15 dark:border-white/15" />}</div>)}</div><Link href="/academy/dashboard/generate" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#6b5bdd] dark:text-[#b9b1ff]">Describe what you want to learn <ArrowIcon /></Link></section>;
  }

  const availableModuleIndex = course.course.modules.findIndex((module) => module.completionStatus !== "completed" && module.completionStatus !== "locked");
  const courseModulesComplete = availableModuleIndex === -1;
  const nextModuleIndex = courseModulesComplete ? Math.max(0, course.course.modules.length - 1) : availableModuleIndex;
  const nextModule = course.course.modules[nextModuleIndex] ?? course.course.modules[0];

  return (
    <section className="relative overflow-hidden py-2 sm:py-6">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7565e8] dark:text-[#a99eff]">Current journey</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{course.course.courseTitle}</h2><p className="mt-3 text-sm text-neutral-500 dark:text-white/45">{courseModulesComplete ? "All modules complete" : <>Up next: <span className="font-semibold text-neutral-800 dark:text-white/75">{nextModule?.title}</span></>}</p></div>
        <Link href="/academy/dashboard/learning" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 px-5 text-sm font-semibold transition hover:border-[#7c6cf6] hover:text-[#6b5bdd] dark:border-white/12 dark:hover:text-[#b9b1ff]">Open course <ArrowIcon /></Link>
      </div>
      <div className="mt-9 overflow-x-auto pb-3">
        <ol className="flex min-w-max items-start">
          {course.course.modules.map((module, index) => {
            const complete = module.completionStatus === "completed";
            const current = index === nextModuleIndex;
            return <li key={`${module.title}-${index}`} className="flex w-44 items-start"><div className="min-w-0 flex-1"><div className="flex items-center"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${complete ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-[#7c6cf6] bg-[#7c6cf6] text-white shadow-[0_0_0_6px_rgba(124,108,246,.1)]" : "border-black/10 bg-white text-neutral-400 dark:border-white/10 dark:bg-white/[0.04]"}`}>{complete ? "✓" : index + 1}</span>{index < course.course.modules.length - 1 && <span className={`h-px flex-1 ${complete ? "bg-emerald-500/60" : "bg-black/10 dark:bg-white/10"}`} />}</div><p className={`mt-3 max-w-36 text-xs font-semibold leading-5 ${current ? "text-[#6655dc] dark:text-[#b9b1ff]" : "text-neutral-500 dark:text-white/40"}`}>{module.title}</p></div></li>;
          })}
        </ol>
      </div>
    </section>
  );
}

function TutorPanel({ messages, question, pending, onQuestionChange, onSubmit }: { messages: TutorMessage[]; question: string; pending: boolean; onQuestionChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void> }) {
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, pending]);

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-[#7c6cf6]/20 bg-gradient-to-br from-[#7c6cf6]/[0.1] via-white/65 to-sky-400/[0.05] p-5 shadow-[0_18px_55px_rgba(74,59,130,0.08)] dark:from-[#7c6cf6]/[0.14] dark:via-[#111219] dark:to-[#0d1117] sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#7c6cf6]/15 blur-[70px]" />
      <header className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7c6cf6] text-white shadow-[0_10px_25px_rgba(124,108,246,0.25)]"><SparkIcon /></div>
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Context-aware help</p><h2 className="mt-1 text-xl font-semibold">AI tutor</h2></div>
        <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,.7)]" />Online</span>
      </header>
      <div className="relative mt-5 max-h-96 space-y-3 overflow-y-auto pr-1" aria-live="polite" aria-busy={pending}>
        {messages.length ? messages.slice(-8).map((entry, index) => (
          <div key={`${entry.createdAt}-${index}`} className={`rounded-2xl p-4 text-sm leading-6 ${entry.role === "assistant" ? "mr-4 border border-[#7c6cf6]/15 bg-white/70 shadow-sm dark:bg-white/[0.05] sm:mr-8" : "ml-4 bg-[#7c6cf6] text-white shadow-[0_10px_25px_rgba(124,108,246,.16)] sm:ml-8"}`}>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest opacity-55">{entry.role === "assistant" ? "Lumyn tutor" : "You"}</p>
            {entry.content}
          </div>
        )) : !pending ? (
          <div className="rounded-2xl border border-dashed border-[#7c6cf6]/25 p-6 text-center"><p className="text-sm font-medium">Stuck on something?</p><p className="mt-1 text-xs text-neutral-500 dark:text-white/40">Ask for an explanation, example, or hint about this module.</p></div>
        ) : null}
        {pending && <TutorTypingIndicator />}
        <div ref={conversationEndRef} />
      </div>
      <form onSubmit={onSubmit} className="relative mt-4 flex flex-col gap-2 sm:flex-row">
        <input value={question} onChange={(event) => onQuestionChange(event.target.value)} disabled={pending} className="h-12 min-w-0 flex-1 rounded-xl border border-black/[0.08] bg-white/75 px-4 text-sm outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 disabled:opacity-60 dark:border-white/10 dark:bg-black/20" placeholder={pending ? "Lumyn is thinking…" : "Ask your tutor about this module…"} required />
        <button type="submit" disabled={pending} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60">{pending ? "Thinking…" : "Ask tutor"}</button>
      </form>
    </section>
  );
}

function TutorTypingIndicator() {
  return (
    <div className="mr-12 w-fit rounded-2xl border border-[#7c6cf6]/15 bg-white/80 px-4 py-3 shadow-sm dark:bg-white/[0.05]" role="status">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#7565e8] dark:text-[#b9b1ff]">Lumyn tutor</p>
      <div className="flex items-center gap-1.5" aria-hidden="true"><span className="academy-typing-dot" /><span className="academy-typing-dot" /><span className="academy-typing-dot" /></div>
      <span className="sr-only">Lumyn tutor is typing</span>
    </div>
  );
}

function MobileRouteHeading({ view, progress }: { view: string; progress: number }) {
  const labels: Record<string, { eyebrow: string; title: string }> = {
    overview: { eyebrow: "Your workspace", title: "Overview" },
    learning: { eyebrow: "Keep moving", title: "My learning" },
    generate: { eyebrow: "AI course studio", title: "Build a path" },
    assignments: { eyebrow: "Practical work", title: "Assignments" },
    certificates: { eyebrow: "Your achievements", title: "Certificates" },
    billing: { eyebrow: "Plan and access", title: "Billing" },
  };
  const current = labels[view] ?? labels.overview;

  return (
    <div className="mb-5 flex items-end justify-between gap-4 lg:hidden">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7565e8] dark:text-[#a99eff]">{current.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">{current.title}</h1>
      </div>
      <div className="rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-[10px] font-bold text-neutral-500 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white/50">
        {progress}% complete
      </div>
    </div>
  );
}

function MobileDashboardNav({
  currentView,
  isDark,
  moreOpen,
  onToggleMore,
  onToggleTheme,
  onSignOut,
  signingOut,
}: {
  currentView: string;
  isDark: boolean;
  moreOpen: boolean;
  onToggleMore: () => void;
  onToggleTheme: () => void;
  onSignOut: () => void | Promise<void>;
  signingOut: boolean;
}) {
  const primaryItems = [
    { label: "Home", href: "/academy/dashboard", view: "overview", icon: "grid" },
    { label: "Learn", href: "/academy/dashboard/learning", view: "learning", icon: "book" },
    { label: "Build", href: "/academy/dashboard/generate", view: "generate", icon: "spark" },
    { label: "Work", href: "/academy/dashboard/assignments", view: "assignments", icon: "check" },
  ];
  const moreActive = currentView === "certificates" || currentView === "billing";

  return (
    <>
      {moreOpen && (
        <button type="button" aria-label="Close mobile navigation" onClick={onToggleMore} className="fixed inset-0 z-[55] bg-black/35 backdrop-blur-[2px] lg:hidden" />
      )}
      {moreOpen && (
        <section className="fixed inset-x-3 bottom-[5.8rem] z-[65] overflow-hidden rounded-[1.6rem] border border-black/[0.08] bg-[#faf9f6] p-3 shadow-[0_24px_80px_rgba(23,19,31,0.24)] dark:border-white/10 dark:bg-[#121319] lg:hidden" aria-label="More dashboard actions">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/academy/dashboard/certificates" className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${currentView === "certificates" ? "bg-[#7c6cf6] text-white" : "bg-black/[0.035] dark:bg-white/[0.05]"}`}><DashboardIcon type="award" /> Certificates</Link>
            <Link href="/academy/dashboard/billing" className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${currentView === "billing" ? "bg-[#7c6cf6] text-white" : "bg-black/[0.035] dark:bg-white/[0.05]"}`}><DashboardIcon type="card" /> Billing</Link>
          </div>
          <button type="button" onClick={onToggleTheme} className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-black/[0.035] p-3.5 text-left dark:bg-white/[0.05]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white/70 text-[#6c5ce7] dark:border-white/10 dark:bg-white/[0.06] dark:text-[#b9b1ff]">{isDark ? <SunIcon /> : <MoonIcon />}</span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Appearance</span><span className="mt-0.5 block text-[10px] text-neutral-400">Switch to {isDark ? "light" : "dark"} mode</span></span>
            <span className="text-xs text-neutral-400">{isDark ? "Dark" : "Light"}</span>
          </button>
          <button type="button" onClick={onSignOut} disabled={signingOut} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-3.5 text-sm font-semibold text-red-500 disabled:opacity-60">{signingOut && <LoadingSpinner />}Sign out</button>
        </section>
      )}
      <nav className="academy-mobile-safe fixed inset-x-0 bottom-0 z-[70] border-t border-black/[0.08] bg-[#faf9f6]/95 px-2 pt-2 shadow-[0_-12px_40px_rgba(23,19,31,0.08)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0c0d11]/95 lg:hidden" aria-label="Mobile dashboard navigation">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const active = currentView === item.view;
            return <Link key={item.view} href={item.href} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-bold transition ${active ? "bg-[#7c6cf6]/12 text-[#6655dc] dark:text-[#b9b1ff]" : "text-neutral-400 dark:text-white/35"}`}><DashboardIcon type={item.icon} /><span>{item.label}</span></Link>;
          })}
          <button type="button" onClick={onToggleMore} aria-expanded={moreOpen} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-bold transition ${moreOpen || moreActive ? "bg-[#7c6cf6]/12 text-[#6655dc] dark:text-[#b9b1ff]" : "text-neutral-400 dark:text-white/35"}`}><MoreIcon /><span>More</span></button>
        </div>
      </nav>
    </>
  );
}

function LessonCard({
  lesson,
  index,
  pending,
  onToggle,
}: {
  lesson: GeneratedLesson;
  index: number;
  pending: boolean;
  onToggle: () => void;
}) {
  const codingTask = /code|html|css|javascript|typescript|react|component|function|api|page|website|app|program|python|sql/i.test(
    `${lesson.title} ${lesson.practicalTask}`
  );

  return (
    <details className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-black/[0.018] transition hover:border-[#7c6cf6]/25 open:bg-white/70 open:shadow-sm dark:border-white/[0.07] dark:bg-black/15 dark:open:bg-white/[0.025]">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 outline-none transition hover:bg-[#7c6cf6]/[0.035] focus-visible:ring-2 focus-visible:ring-[#7c6cf6] sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${lesson.completionStatus === "completed" ? "bg-emerald-500 text-white" : "bg-[#7c6cf6]/10 text-[#6c5ce7] dark:text-[#b9b1ff]"}`}>{lesson.completionStatus === "completed" ? "✓" : index + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold sm:text-base">{lesson.title}</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{lesson.completionStatus === "completed" ? "Completed" : "Tap to open lesson"}</span>
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-neutral-400 transition duration-300 group-open:rotate-180 dark:bg-white/[0.06]" aria-hidden="true"><ChevronDownIcon /></span>
      </summary>
      <div className="border-t border-black/[0.06] px-4 pb-5 pt-1 dark:border-white/[0.06] sm:px-5 sm:pb-6">
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600 dark:text-white/55">{lesson.notes}</p>

        {lesson.realWorldExample && (
          <div className="mt-5 rounded-2xl border border-sky-500/15 bg-sky-500/[0.06] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-sky-600 dark:text-sky-300">Real-life scenario · {lesson.realWorldExample.title}</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/55">{lesson.realWorldExample.scenario}</p>
            <p className="mt-2 text-xs font-semibold text-sky-700 dark:text-sky-200">Takeaway: {lesson.realWorldExample.takeaway}</p>
          </div>
        )}

        {lesson.visualAid && lesson.visualAid.items.length > 0 && (
          <div className="mt-5 rounded-2xl border border-black/[0.07] bg-white/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">Visual · {lesson.visualAid.title}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              {lesson.visualAid.items.map((item, itemIndex) => (
                <div key={`${item}-${itemIndex}`} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col">
                  <div className="flex min-h-16 flex-1 items-center justify-center rounded-xl border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.06] p-3 text-center text-xs font-medium leading-5">{item}</div>
                  {itemIndex < lesson.visualAid!.items.length - 1 && <span className="rotate-90 text-[#7c6cf6] sm:rotate-0">→</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.codeExample && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
            <div className="flex items-center justify-between bg-[#111218] px-4 py-3 text-white"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Example · {lesson.codeExample.language}</p><span className="flex gap-1.5"><i className="h-2 w-2 rounded-full bg-red-400" /><i className="h-2 w-2 rounded-full bg-amber-400" /><i className="h-2 w-2 rounded-full bg-emerald-400" /></span></div>
            <pre className="overflow-x-auto bg-[#090a0d] p-4 text-xs leading-6 text-[#d8d5ff]"><code>{lesson.codeExample.code}</code></pre>
            <p className="border-t border-white/[0.08] bg-[#111218] px-4 py-3 text-xs leading-5 text-white/50">{lesson.codeExample.explanation}</p>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.06] p-4 text-sm leading-6"><span className="font-bold text-[#6555db] dark:text-[#b9b1ff]">Try it:</span> {lesson.practicalTask}</div>
        {codingTask && <CodePlayground lesson={lesson} />}
        <div className="mt-5 flex justify-end border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
          <button type="button" disabled={pending} onClick={onToggle} className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition disabled:opacity-60 sm:w-auto ${lesson.completionStatus === "completed" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15" : "bg-[#7c6cf6] text-white shadow-[0_10px_24px_rgba(124,108,246,0.2)] hover:bg-[#6b5bdd]"}`}>{pending && <LoadingSpinner />}{pending ? "Saving…" : lesson.completionStatus === "completed" ? "Completed ✓" : "Mark complete"}</button>
        </div>
      </div>
    </details>
  );
}

function CodePlayground({ lesson }: { lesson: GeneratedLesson }) {
  const fallback = `<!doctype html>\n<html>\n  <body>\n    <h1>${lesson.title.replace(/[<>]/g, "")}</h1>\n    <p>Build your solution here.</p>\n  </body>\n</html>`;
  const [code, setCode] = useState(lesson.codeExample?.code || fallback);
  const [preview, setPreview] = useState(() => buildPreview(lesson.codeExample?.code || fallback, lesson.codeExample?.language || "html"));
  const [running, setRunning] = useState(false);
  const language = lesson.codeExample?.language || "html";

  function runCode() {
    setRunning(true);
    window.setTimeout(() => {
      setPreview(buildPreview(code, language));
      setRunning(false);
    }, 250);
  }

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
      <div className="flex items-center justify-between bg-[#111218] px-4 py-3 text-white"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a99eff]">Practice playground</p><p className="mt-0.5 text-[10px] text-white/35">Edit and run your code safely in the browser</p></div><button type="button" onClick={runCode} disabled={running} className="inline-flex items-center gap-2 rounded-lg bg-[#7c6cf6] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{running && <LoadingSpinner />}{running ? "Running…" : "Run code ▶"}</button></div>
      <div className="grid min-h-72 lg:grid-cols-2">
        <textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="min-h-72 resize-y border-0 bg-[#090a0d] p-4 font-mono text-xs leading-6 text-[#d8d5ff] outline-none" aria-label="Code editor" />
        <iframe title={`${lesson.title} preview`} sandbox="allow-scripts" srcDoc={preview} className="min-h-72 w-full border-0 bg-white" />
      </div>
    </div>
  );
}

function buildPreview(code: string, language: string) {
  const normalized = language.toLowerCase();
  if (normalized.includes("html")) return code;
  if (normalized.includes("css")) return `<!doctype html><html><head><style>${code}</style></head><body><main class="preview"><h1>CSS Preview</h1><p>Edit the styles to change this preview.</p><button>Example button</button></main></body></html>`;
  if (normalized.includes("javascript") || normalized === "js" || normalized.includes("typescript")) {
    const runnable = normalized.includes("typescript") ? code.replace(/:\s*[A-Za-z][A-Za-z0-9_<>,\[\]| ]*/g, "") : code;
    const serialized = JSON.stringify(runnable).replace(/<\/script/gi, "<\\/script");
    return `<!doctype html><html><body style="font-family:system-ui;padding:20px"><h3>Console output</h3><pre id="output" style="white-space:pre-wrap"></pre><script>const output=document.getElementById('output');const write=(...args)=>output.textContent+=args.map(v=>typeof v==='object'?JSON.stringify(v,null,2):String(v)).join(' ')+'\\n';console.log=write;console.error=write;try{(0,eval)(${serialized})}catch(error){write('Error:',error.message)}<\/script></body></html>`;
  }
  return `<!doctype html><html><body style="font-family:system-ui;padding:24px"><h3>Code saved</h3><p>Live preview currently supports HTML, CSS, and JavaScript. Use this editor to draft the ${language} solution.</p></body></html>`;
}

function EvaluationFeedback({ evaluation }: { evaluation: SubmissionEvaluation }) {
  return (
    <div className={`mt-5 rounded-2xl border p-5 ${evaluation.passed ? "border-emerald-500/20 bg-emerald-500/[0.07]" : "border-amber-500/20 bg-amber-500/[0.07]"}`}>
      <div className="flex items-center justify-between gap-4"><p className="font-bold">AI assessment</p><span className={`rounded-full px-3 py-1 text-xs font-bold ${evaluation.passed ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}>{evaluation.score}% · {evaluation.passed ? "Passed" : "Needs revision"}</span></div>
      <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-white/55">{evaluation.summary}</p>
      {evaluation.strengths.length > 0 && <div className="mt-4"><p className="text-xs font-bold text-emerald-600">What worked</p><ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-white/50">{evaluation.strengths.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>}
      {evaluation.improvements.length > 0 && <div className="mt-4"><p className="text-xs font-bold text-amber-600">Improve next</p><ul className="mt-2 space-y-1 text-xs text-neutral-600 dark:text-white/50">{evaluation.improvements.map((item) => <li key={item}>→ {item}</li>)}</ul></div>}
    </div>
  );
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const colors = {
    success: "border-emerald-500/25 bg-emerald-950 text-emerald-50",
    error: "border-red-500/25 bg-red-950 text-red-50",
    warning: "border-amber-500/25 bg-amber-950 text-amber-50",
    info: "border-[#7c6cf6]/25 bg-[#17142b] text-white",
  };
  const icons = { success: "✓", error: "!", warning: "!", info: "i" };
  return <div role="status" aria-live="polite" className={`fixed right-4 top-20 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl ${colors[toast.type]}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{icons[toast.type]}</span><p className="flex-1 text-sm leading-6">{toast.message}</p><button type="button" onClick={onClose} className="text-lg opacity-50 hover:opacity-100" aria-label="Dismiss notification">×</button></div>;
}

function QuizResultModal({ result, title, onClose }: { result: QuizResultState; title: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="quiz-result-title"><div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111218] p-7 text-center text-white shadow-2xl"><div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold ${result.passed ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{result.score}%</div><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a99eff]">Quiz result</p><h2 id="quiz-result-title" className="mt-2 text-2xl font-semibold">{result.passed ? "Excellent—module quiz passed!" : "Good attempt—review and retry."}</h2><p className="mt-3 text-sm leading-6 text-white/50">{title}. {result.passed ? "Your result is saved and the quiz is complete." : "Correct answers and explanations are now highlighted below."}</p><button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white">Review answers</button></div></div>;
}

function CelebrationModal({ courseTitle, onClose }: { courseTitle: string; onClose: () => void }) {
  return <div className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="pointer-events-none absolute inset-0">{Array.from({ length: 28 }, (_, index) => <i key={index} className="academy-confetti" style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 8) * 0.14}s`, backgroundColor: ["#7c6cf6", "#f59e0b", "#10b981", "#38bdf8", "#f472b6"][index % 5] }} />)}</div><div className="relative w-full max-w-lg rounded-[2.25rem] border border-white/10 bg-[#111218] p-8 text-center text-white shadow-2xl sm:p-10"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#9b8cff] to-[#5f50d8] text-4xl shadow-[0_20px_50px_rgba(124,108,246,0.35)]">🏆</div><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9b1ff]">Course complete</p><h2 className="mt-3 text-3xl font-semibold">You did it!</h2><p className="mt-3 text-sm leading-6 text-white/55">You completed <strong className="text-white">{courseTitle}</strong>. Your certificate is ready to view and print.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold">Stay here</button><Link href="/academy/dashboard/certificates" onClick={onClose} className="flex-1 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white">View certificate</Link></div></div></div>;
}

function CertificateCard({ studentName, course }: { studentName: string; course?: DashboardCourse }) {
  return <section id="certificates" className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219]"><div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl" /><div className="relative flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Certificate</p><h2 className="mt-1 font-semibold">Completion proof</h2></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600"><AwardIcon /></span></div>{course?.certificate ? <><div className="relative mt-5 rounded-2xl border border-[#7c6cf6]/20 bg-gradient-to-br from-[#7c6cf6]/10 to-amber-400/[0.06] p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6c5ce7] dark:text-[#b9b1ff]">Lumyn Academy</p><p className="mt-3 text-sm font-semibold">{course.course.courseTitle}</p><p className="mt-2 text-[10px] text-neutral-500">{course.certificate.certificateId}</p></div><button type="button" onClick={() => openCertificate(studentName, course)} className="relative mt-4 w-full rounded-xl border border-[#7c6cf6]/30 bg-[#7c6cf6]/10 p-3 text-sm font-semibold text-[#6c5ce7] transition hover:bg-[#7c6cf6]/15 dark:text-[#b9b1ff]">View / save as PDF</button></> : <><div className="relative mt-5 h-2 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.07]"><div className="h-full rounded-full bg-amber-500" style={{ width: `${course?.progressPercent ?? 0}%` }} /></div><p className="relative mt-3 text-xs leading-5 text-neutral-500 dark:text-white/40">Finish the path and final project to unlock your certificate.</p></>}</section>;
}

function LoadingSpinner() { return <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />; }

function DashboardIcon({ type }: { type: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  if (type === "grid" || type === "progress") return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7" /></svg>;
  if (type === "book" || type === "modules") return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
  if (type === "spark") return <SparkIcon small />;
  if (type === "check" || type === "work") return <svg {...common}><path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" rx="2" /></svg>;
  if (type === "award") return <AwardIcon />;
  if (type === "card") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M3 9h18M7 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" /><path d="M12 8v4l2.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function SparkIcon({ small = false }: { small?: boolean }) {
  const size = small ? 15 : 19;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.8c.5 4.7 2.7 6.9 7.4 7.4-4.7.5-6.9 2.7-7.4 7.4-.5-4.7-2.7-6.9-7.4-7.4 4.7-.5 6.9-2.7 7.4-7.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M19 16.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5Z" fill="currentColor" /></svg>;
}

function AwardIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" /><path d="m8.5 13-1 8 4.5-2 4.5 2-1-8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m10.3 9 1.1 1.1L14 7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ActivityIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 17V9M9.3 17V5M14.7 17v-7M20 17V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function ArrowIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function SunIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>; }
function MoonIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.2A7.7 7.7 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>; }
function MoreIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></svg>; }
function ChevronDownIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

function lastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { key: date.toISOString().slice(0, 10), label: date.toLocaleDateString(undefined, { weekday: "narrow" }) };
  });
}

function openCertificate(studentName: string, course: DashboardCourse) {
  if (!course.certificate) return;
  const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[character] ?? character));
  const certificateWindow = window.open("", "_blank", "width=1200,height=850");
  if (!certificateWindow) return;
  const issuedAt = new Date(course.certificate.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  certificateWindow.document.write(`<!doctype html><html><head><title>${escape(course.certificate.certificateId)}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#ece9f4;font-family:Inter,Arial,sans-serif;color:#17131f;padding:28px}.toolbar{display:flex;justify-content:center;margin-bottom:18px}.toolbar button{border:0;border-radius:12px;background:#6f5de7;color:white;padding:12px 20px;font-weight:700;cursor:pointer}.certificate{position:relative;max-width:1120px;min-height:720px;margin:auto;overflow:hidden;background:#fbfaf7;padding:64px 76px;box-shadow:0 30px 90px rgba(38,28,65,.18)}.frame{position:absolute;inset:22px;border:1px solid #7c6cf6}.frame:after{content:"";position:absolute;inset:8px;border:1px solid rgba(124,108,246,.25)}.orb{position:absolute;width:360px;height:360px;border-radius:50%;filter:blur(1px);background:radial-gradient(circle,rgba(124,108,246,.16),transparent 68%)}.orb.one{right:-130px;top:-150px}.orb.two{left:-170px;bottom:-190px}.content{position:relative;z-index:2;text-align:center}.brand{font-size:13px;font-weight:800;letter-spacing:.34em;color:#6755d5;text-transform:uppercase}.eyebrow{margin-top:76px;font-size:12px;font-weight:700;letter-spacing:.2em;color:#8c8496;text-transform:uppercase}.title{margin:16px 0 0;font-family:Georgia,serif;font-size:58px;font-weight:400;letter-spacing:-.03em}.presented{margin-top:48px;font-size:14px;color:#7b7484}.name{display:inline-block;margin-top:12px;border-bottom:1px solid #b6adc8;padding:0 44px 10px;font-family:Georgia,serif;font-size:42px}.copy{margin:28px auto 0;max-width:700px;font-size:15px;line-height:1.7;color:#625b6c}.course{margin-top:8px;font-size:25px;font-weight:700;color:#5f4fd1}.footer{display:grid;grid-template-columns:1fr 150px 1fr;align-items:end;gap:30px;margin-top:62px}.signature,.date{border-top:1px solid #aaa1b7;padding-top:10px;font-size:11px;color:#777080}.seal{display:flex;height:112px;width:112px;margin:auto;align-items:center;justify-content:center;border:2px solid #7c6cf6;border-radius:50%;background:#f3f0ff;color:#6654d5;font-size:11px;font-weight:800;letter-spacing:.12em;line-height:1.5;text-transform:uppercase}.id{margin-top:26px;font-family:monospace;font-size:10px;color:#918a9a}@page{size:A4 landscape;margin:0}@media print{body{padding:0;background:white}.toolbar{display:none}.certificate{width:297mm;height:210mm;max-width:none;min-height:0;box-shadow:none;padding:18mm 22mm}.frame{inset:7mm}.eyebrow{margin-top:16mm}.title{font-size:16mm}.presented{margin-top:10mm}.name{font-size:11mm}.footer{margin-top:14mm}}
  </style></head><body><div class="toolbar"><button onclick="window.print()">Print or save as PDF</button></div><main class="certificate"><div class="frame"></div><div class="orb one"></div><div class="orb two"></div><div class="content"><div class="brand">Lumyn Academy</div><p class="eyebrow">Certificate of achievement</p><h1 class="title">Certificate of Completion</h1><p class="presented">This certificate is proudly presented to</p><div class="name">${escape(studentName)}</div><p class="copy">for successfully completing the required lessons, assessments, practical assignments, and final project in</p><div class="course">${escape(course.course.courseTitle)}</div><div class="footer"><div class="signature"><strong>Lumyn Academy</strong><br/>Program Director</div><div class="seal">Verified<br/>Completion</div><div class="date"><strong>${escape(issuedAt)}</strong><br/>Date issued</div></div><div class="id">Certificate ID: ${escape(course.certificate.certificateId)}</div></div></main></body></html>`);
  certificateWindow.document.close();
}

function DashboardLoading() {
  return <div className="min-h-screen bg-[#f2f1ed] dark:bg-[#08090c]"><header className="h-[72px] border-b border-black/[0.08] bg-white/60 dark:border-white/[0.08] dark:bg-[#0b0c10]" /><div className="mx-auto grid max-w-[1720px] lg:grid-cols-[250px_minmax(0,1fr)]"><aside className="hidden min-h-[calc(100vh-72px)] border-r border-black/[0.08] p-6 dark:border-white/[0.08] lg:block"><div className="h-3 w-20 animate-pulse rounded bg-black/[0.08] dark:bg-white/[0.08]" /><div className="mt-6 space-y-3">{[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-11 animate-pulse rounded-xl bg-black/[0.05] dark:bg-white/[0.05]" />)}</div></aside><main className="p-5 sm:p-8"><div className="h-52 animate-pulse rounded-[2rem] bg-black/[0.06] dark:bg-white/[0.06]" /><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]" />)}</div></main></div></div>;
}
