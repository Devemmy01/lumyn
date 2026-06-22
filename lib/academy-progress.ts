import type { IAcademyCourseDocument } from "@/models/AcademyCourse";

export function recalculateCourseProgress(course: IAcademyCourseDocument) {
  const modules = course.course.modules;
  const attempts = course.quizAttempts ?? [];
  const submissions = course.assignmentSubmissions ?? [];
  const lessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (total, module) => total + module.lessons.filter((lesson) => lesson.completionStatus === "completed").length,
    0
  );
  const passedQuizzes = modules.filter((_, index) =>
    attempts.some((attempt) => attempt.moduleIndex === index && attempt.passed)
  ).length;
  const submittedAssignments = modules.filter((_, index) =>
    submissions.some((submission) =>
      submission.moduleIndex === index && submission.status !== "needs_revision"
    )
  ).length;
  const totalItems = lessonCount + modules.length * 2 + 1;
  const completedItems = completedLessons + passedQuizzes + submittedAssignments +
    (course.finalProjectSubmission && course.finalProjectSubmission.status !== "needs_revision" ? 1 : 0);

  modules.forEach((module, index) => {
    const lessonsDone = module.lessons.every((lesson) => lesson.completionStatus === "completed");
    const quizDone = attempts.some((attempt) => attempt.moduleIndex === index && attempt.passed);
    const assignmentDone = submissions.some((submission) =>
      submission.moduleIndex === index && submission.status !== "needs_revision"
    );
    module.completionStatus = lessonsDone && quizDone && assignmentDone
      ? "completed"
      : index === 0 || modules[index - 1]?.completionStatus === "completed"
        ? "in_progress"
        : "locked";
  });

  course.progressPercent = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  if (course.status !== "archived") {
    course.status = course.progressPercent === 100 ? "completed" : "active";
  }
  course.markModified("course");
  return course.progressPercent;
}

export function latestQuizScores(course: IAcademyCourseDocument) {
  const latest = new Map<number, number>();
  for (const attempt of course.quizAttempts ?? []) latest.set(attempt.moduleIndex, attempt.score);
  return [...latest.values()];
}
