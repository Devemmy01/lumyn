import type { GeneratedCourse } from "@/lib/academy";

type ProgressInputs = {
  quizAttempts: Array<{ moduleIndex: number; passed: boolean }>;
  assignmentSubmissions: Array<{ moduleIndex: number; status: string }>;
  finalProjectSubmission?: { status: string };
  status: "active" | "completed" | "archived";
};

/**
 * Recomputes module lock/progress state on a hydrated (per-student) course
 * clone and returns the enrollment-level progress percent + status. Safe to
 * mutate `hydratedCourse` in place since it is always a fresh clone, never
 * the shared catalog document.
 */
export function recalculateEnrollmentProgress(
  hydratedCourse: GeneratedCourse,
  enrollment: ProgressInputs,
) {
  const modules = hydratedCourse.modules;
  const attempts = enrollment.quizAttempts ?? [];
  const submissions = enrollment.assignmentSubmissions ?? [];
  const lessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (total, module) => total + module.lessons.filter((lesson) => lesson.completionStatus === "completed").length,
    0,
  );
  const passedQuizzes = modules.filter((_, index) =>
    attempts.some((attempt) => attempt.moduleIndex === index && attempt.passed),
  ).length;
  const submittedAssignments = modules.filter((_, index) =>
    submissions.some((submission) => submission.moduleIndex === index && submission.status !== "needs_revision"),
  ).length;
  const totalItems = lessonCount + modules.length * 2 + 1;
  const completedItems =
    completedLessons +
    passedQuizzes +
    submittedAssignments +
    (enrollment.finalProjectSubmission && enrollment.finalProjectSubmission.status !== "needs_revision" ? 1 : 0);

  modules.forEach((module, index) => {
    const lessonsDone = module.lessons.every((lesson) => lesson.completionStatus === "completed");
    const quizDone = attempts.some((attempt) => attempt.moduleIndex === index && attempt.passed);
    const assignmentDone = submissions.some(
      (submission) => submission.moduleIndex === index && submission.status !== "needs_revision",
    );
    module.completionStatus =
      lessonsDone && quizDone && assignmentDone
        ? "completed"
        : index === 0 || modules[index - 1]?.completionStatus === "completed"
          ? "in_progress"
          : "locked";
  });

  const progressPercent = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  const status = enrollment.status === "archived" ? "archived" : progressPercent === 100 ? "completed" : "active";
  return { progressPercent, status: status as ProgressInputs["status"] };
}

export function latestQuizScores(enrollment: { quizAttempts: Array<{ moduleIndex: number; score: number }> }) {
  const latest = new Map<number, number>();
  for (const attempt of enrollment.quizAttempts ?? []) latest.set(attempt.moduleIndex, attempt.score);
  return [...latest.values()];
}
