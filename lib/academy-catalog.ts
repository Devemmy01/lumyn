import type { GeneratedCourse } from "@/lib/academy";

type EnrollmentProgressShape = {
  lessonCompletions: Array<{ moduleIndex: number; lessonIndex: number; completedAt: string }>;
};

function lessonKey(moduleIndex: number, lessonIndex: number) {
  return `${moduleIndex}:${lessonIndex}`;
}

/**
 * Builds a per-student view of shared catalog content: clones the pristine
 * `GeneratedCourse` blob and overlays completionStatus from the student's
 * enrollment, so the rest of the app (LessonCard, LearningRoute, etc.) can
 * keep consuming the same GeneratedCourse shape it always has. Module-level
 * completionStatus is left as a placeholder here; call
 * `recalculateEnrollmentProgress` (lib/academy-progress.ts) right after to
 * derive lock/unlock state from quiz and assignment progress too.
 */
export function hydrateCourseForEnrollment(
  content: GeneratedCourse,
  enrollment: EnrollmentProgressShape,
): GeneratedCourse {
  const completedLessons = new Set(
    (enrollment.lessonCompletions ?? []).map((item) => lessonKey(item.moduleIndex, item.lessonIndex)),
  );

  return {
    ...content,
    modules: content.modules.map((module, moduleIndex) => ({
      ...module,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        completionStatus: completedLessons.has(lessonKey(moduleIndex, lessonIndex))
          ? ("completed" as const)
          : ("not_started" as const),
      })),
      completionStatus: "locked" as const,
    })),
  };
}
