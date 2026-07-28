"use client";

import type { FormEvent } from "react";
import {
  MIN_MODULE_QUIZ_QUESTIONS,
  type AssignmentSubmission,
  type GeneratedModule,
  type LearningCursor,
} from "@/lib/academy";
import { AwardIcon } from "@/components/academy/dashboard/icons";
import {
  EvaluationFeedback,
  SubmissionSummary,
} from "@/components/academy/dashboard/FeedbackParts";
import {
  LessonCard,
  PracticeCodeWorkspace,
} from "@/components/academy/dashboard/LessonCard";
import {
  LearningStepPanel,
  LearningStepTabs,
  type LearningStepId,
  type LearningStepItem,
} from "@/components/academy/dashboard/LearningFlowParts";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import type {
  DashboardCourse,
  QuizResultState,
} from "@/components/academy/dashboard/types";
import {
  buildAssignmentWorkspaceFiles,
  buildFinalProjectWorkspaceFiles,
  type PracticeCodeFileSnapshot,
} from "@/components/academy/dashboard/workspace";

type LearningRouteProps = {
  selected: DashboardCourse;
  activeModuleData: GeneratedModule;
  activeModule: number;
  showLearning: boolean;
  showAssignments: boolean;
  visibleLearningStep: LearningStepId;
  learningSteps: LearningStepItem[];
  resumeCursor?: LearningCursor;
  pendingAction: string | null;
  latestAttempt?: {
    score: number;
    passed: boolean;
  };
  submitted?: AssignmentSubmission;
  quizAnswers: Record<number, number>;
  quizResult: QuizResultState | null;
  assignmentDraft: string;
  finalDraft: string;
  courseReadyForFinalProject: boolean;
  onLearningStepSelect: (step: LearningStepId) => void;
  onLessonOpen: (lessonIndex: number) => void;
  onLessonToggle: (lessonIndex: number, completed: boolean) => void;
  onQuizAnswerChange: (questionIndex: number, optionIndex: number) => void;
  onRepairQuiz: () => void;
  onSubmitQuiz: (event: FormEvent<HTMLFormElement>) => void;
  onSubmitAssignment: (event: FormEvent<HTMLFormElement>) => void;
  onSubmitFinalProject: (event: FormEvent<HTMLFormElement>) => void;
  onAssignmentDraftChange: (value: string) => void;
  onFinalDraftChange: (value: string) => void;
  onAssignmentFilesChange: (files: PracticeCodeFileSnapshot[]) => void;
  onFinalProjectFilesChange: (files: PracticeCodeFileSnapshot[]) => void;
};

export function LearningRoute({
  selected,
  activeModuleData,
  activeModule,
  showLearning,
  showAssignments,
  visibleLearningStep,
  learningSteps,
  resumeCursor,
  pendingAction,
  latestAttempt,
  submitted,
  quizAnswers,
  quizResult,
  assignmentDraft,
  finalDraft,
  courseReadyForFinalProject,
  onLearningStepSelect,
  onLessonOpen,
  onLessonToggle,
  onQuizAnswerChange,
  onRepairQuiz,
  onSubmitQuiz,
  onSubmitAssignment,
  onSubmitFinalProject,
  onAssignmentDraftChange,
  onFinalDraftChange,
  onAssignmentFilesChange,
  onFinalProjectFilesChange,
}: LearningRouteProps) {
  const quizQuestions = activeModuleData.quiz.questions;
  const usableQuizQuestionCount = quizQuestions.filter(
    (question) => typeof question !== "string",
  ).length;
  const quizReady =
    usableQuizQuestionCount >= MIN_MODULE_QUIZ_QUESTIONS &&
    usableQuizQuestionCount === quizQuestions.length;

  return (
    <>
      <section
        id="active-module-work"
        className="scroll-mt-24 space-y-5 sm:scroll-mt-28"
      >
        <div className="rounded-[1.75rem] border border-black/[0.08] bg-white/72 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">
            Module {activeModule + 1}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
            {activeModuleData.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-500 dark:text-white/45">
            {activeModuleData.description}
          </p>
          {!showAssignments && (
            <div className="mt-6">
              <LearningStepTabs
                steps={learningSteps}
                activeStep={visibleLearningStep}
                onSelect={onLearningStepSelect}
              />
            </div>
          )}
        </div>

        {visibleLearningStep === "lessons" && showLearning && (
          <LearningStepPanel
            eyebrow="Step 1 · video-supported lessons"
            title="Watch, practice, then prove the idea"
            description="Each lesson gives you a targeted YouTube study path, key ideas to watch for, compact notes, practice work, and a lesson check before you mark it complete."
          >
            <div className="space-y-4">
              {activeModuleData.lessons.map((lesson, index) => (
                <LessonCard
                  key={`${activeModule}-${lesson.title}-${index}`}
                  courseTitle={selected.course.courseTitle}
                  lesson={lesson}
                  index={index}
                  moduleTitle={activeModuleData.title}
                  pending={pendingAction === `lesson-${activeModule}-${index}`}
                  active={
                    resumeCursor?.step === "lessons" &&
                    resumeCursor.moduleIndex === activeModule &&
                    (resumeCursor.lessonIndex ?? 0) === index
                  }
                  onOpen={() => onLessonOpen(index)}
                  onToggle={() =>
                    onLessonToggle(
                      index,
                      lesson.completionStatus !== "completed",
                    )
                  }
                />
              ))}
            </div>
          </LearningStepPanel>
        )}

        {visibleLearningStep === "quiz" && showLearning && (
          <LearningStepPanel
            eyebrow="Step 2 · comprehensive assessment"
            title={activeModuleData.quiz.title}
            description="Pass this assessment after completing the lesson videos and practice tasks. It checks whether the whole module actually landed."
          >
            <form onSubmit={onSubmitQuiz}>
              {latestAttempt && (
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${latestAttempt.passed ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}
                >
                  {latestAttempt.score}% ·{" "}
                  {latestAttempt.passed ? "Passed" : "Try again"}
                </span>
              )}
              {!quizReady && (
                <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-700 dark:text-amber-200">
                  <p>
                    This module does not have enough usable AI-generated quiz
                    questions yet. Repair just this assessment for free so it
                    can include at least {MIN_MODULE_QUIZ_QUESTIONS} technical
                    questions.
                  </p>
                  <button
                    type="button"
                    onClick={onRepairQuiz}
                    disabled={pendingAction === `repair-quiz-${activeModule}`}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pendingAction === `repair-quiz-${activeModule}` && (
                      <LoadingSpinner />
                    )}
                    {pendingAction === `repair-quiz-${activeModule}`
                      ? "Repairing assessment..."
                      : "Repair assessment for free"}
                  </button>
                </div>
              )}
              {quizReady && (
                <div className="mt-7 space-y-8">
                  {quizQuestions.map(
                  (question, questionIndex) => {
                    if (typeof question === "string")
                      return (
                        <p key={questionIndex} className="text-sm">
                          This legacy quiz cannot be graded. Generate a new
                          course.
                        </p>
                      );
                    return (
                      <fieldset
                        key={questionIndex}
                        disabled={Boolean(latestAttempt?.passed)}
                      >
                        <legend className="font-semibold leading-7">
                          <span className="mr-2 text-[#7c6cf6]">
                            {String(questionIndex + 1).padStart(2, "0")}
                          </span>
                          {question.question}
                        </legend>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {question.options.map((option, optionIndex) => {
                            const isSelected =
                              quizAnswers[questionIndex] === optionIndex;
                            const isCorrect =
                              quizResult &&
                              optionIndex === question.correctAnswerIndex;
                            const isWrongSelection =
                              quizResult && isSelected && !isCorrect;
                            return (
                              <label
                                key={optionIndex}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm leading-6 transition ${isCorrect ? "border-emerald-500/40 bg-emerald-500/10" : isWrongSelection ? "border-red-500/40 bg-red-500/10" : isSelected ? "border-[#7c6cf6]/50 bg-[#7c6cf6]/10" : "border-black/[0.08] hover:border-[#7c6cf6]/25 dark:border-white/10"}`}
                              >
                                <input
                                  type="radio"
                                  className="accent-[#7c6cf6]"
                                  name={`q-${activeModule}-${questionIndex}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    onQuizAnswerChange(
                                      questionIndex,
                                      optionIndex,
                                    )
                                  }
                                />
                                {option}
                                {isCorrect && (
                                  <span className="ml-auto text-emerald-600">
                                    OK
                                  </span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                        {quizResult && (
                          <p className="mt-3 rounded-xl bg-black/[0.03] p-3 text-xs leading-5 text-neutral-600 dark:bg-white/[0.04] dark:text-white/55">
                            <strong>Explanation:</strong>{" "}
                            {question.explanation}
                          </p>
                        )}
                      </fieldset>
                    );
                  },
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={
                  !quizReady ||
                  pendingAction === `quiz-${activeModule}` ||
                  latestAttempt?.passed
                }
                className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(124,108,246,0.2)] transition disabled:cursor-not-allowed sm:w-auto ${latestAttempt?.passed ? "bg-emerald-500" : "bg-[#7c6cf6] hover:bg-[#6b5bdd] disabled:opacity-50"}`}
              >
                {pendingAction === `quiz-${activeModule}` && <LoadingSpinner />}
                {latestAttempt?.passed
                  ? "Completed"
                  : pendingAction === `quiz-${activeModule}`
                    ? "Grading quiz..."
                    : "Submit quiz"}
              </button>
            </form>
          </LearningStepPanel>
        )}

        {visibleLearningStep === "assignment" && (
          <LearningStepPanel
            eyebrow="Step 3 · practice"
            title="Build the module project"
            description="Complete the assignment first, then extend it into the mini project. Submit your code, what you built, and evidence that it runs."
          >
            <form onSubmit={onSubmitAssignment} id="assignments">
              <section className="mb-4 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.07] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6c5ce7] dark:text-[#b9b1ff]">
                  Project brief
                </p>
                <div className="mt-3 flex flex-col gap-4">
                  <div className="space-y-3 text-sm leading-6 text-neutral-700 dark:text-white/65">
                    <p>
                      <strong className="text-neutral-950 dark:text-white">
                        Build:
                      </strong>{" "}
                      {activeModuleData.assignment}
                    </p>
                    <p>
                      <strong className="text-neutral-950 dark:text-white">
                        Extend:
                      </strong>{" "}
                      {activeModuleData.miniProject}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <RequirementPanel
                      title="Requirements"
                      items={[
                        ...new Set([
                          ...(activeModuleData.assignmentDeliverables ?? []),
                          ...(activeModuleData.miniProjectDeliverables ?? []),
                        ]),
                      ]}
                    />
                    <RequirementPanel
                      title="Submit when"
                      items={[
                        ...new Set([
                          ...(activeModuleData.assignmentAssessmentCriteria ??
                            []),
                          ...(activeModuleData.miniProjectAssessmentCriteria ??
                            []),
                        ]),
                      ]}
                    />
                  </div>
                </div>
              </section>
              <PracticeCodeWorkspace
                key={`${selected.id}-${activeModule}-assignment-workspace`}
                initialCode=""
                initialFiles={buildAssignmentWorkspaceFiles(activeModuleData)}
                language="html"
                seedTitle={`${activeModuleData.title} assignment`}
                title="Assignment workspace"
                subtitle="Build the assignment and mini project here"
                onFilesChange={onAssignmentFilesChange}
              />
              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">
                  How assessment works
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/58">
                  Submit one response that covers both the assignment and mini
                  project. Include the relevant code or file names, a short
                  explanation of your decisions, and evidence that the result
                  runs. A link alone is not enough for grading.
                </p>
              </div>
              {submitted?.evaluation && (
                <EvaluationFeedback evaluation={submitted.evaluation} />
              )}
              {submitted?.status === "submitted" ||
              submitted?.status === "reviewed" ? (
                <SubmissionSummary submission={submitted} />
              ) : (
                <>
                  <textarea
                    value={assignmentDraft}
                    onChange={(event) =>
                      onAssignmentDraftChange(event.target.value)
                    }
                    placeholder="Optional notes for the grader: what you built, key decisions, and anything to look for in the preview."
                    className="mt-5 min-h-28 w-full rounded-2xl border border-black/[0.08] bg-transparent p-4 text-sm leading-6 outline-none focus:border-[#7c6cf6] dark:border-white/10"
                  />
                  <p className="mt-2 text-xs text-neutral-500 dark:text-white/40">
                    The code workspace is included in your submission
                    automatically. Score 70% or higher to pass.
                  </p>
                  <button
                    type="submit"
                    disabled={pendingAction === `assignment-${activeModule}`}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
                  >
                    {pendingAction === `assignment-${activeModule}` && (
                      <LoadingSpinner />
                    )}
                    {pendingAction === `assignment-${activeModule}`
                      ? "Assessing submission..."
                      : submitted
                        ? "Resubmit assignment"
                        : "Submit assignment"}
                  </button>
                </>
              )}
            </form>
          </LearningStepPanel>
        )}
      </section>

      {courseReadyForFinalProject && (
        <FinalProjectSection
          selected={selected}
          finalDraft={finalDraft}
          pendingAction={pendingAction}
          onFinalDraftChange={onFinalDraftChange}
          onSubmitFinalProject={onSubmitFinalProject}
          onFinalProjectFilesChange={onFinalProjectFilesChange}
        />
      )}
    </>
  );
}

function FinalProjectSection({
  selected,
  finalDraft,
  pendingAction,
  onFinalDraftChange,
  onSubmitFinalProject,
  onFinalProjectFilesChange,
}: {
  selected: DashboardCourse;
  finalDraft: string;
  pendingAction: string | null;
  onFinalDraftChange: (value: string) => void;
  onSubmitFinalProject: (event: FormEvent<HTMLFormElement>) => void;
  onFinalProjectFilesChange: (files: PracticeCodeFileSnapshot[]) => void;
}) {
  return (
    <section
      id="final-project"
      className="rounded-[1.75rem] border border-black/[0.08] bg-white/75 p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111219] sm:p-7"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <AwardIcon />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
            Capstone
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Final project</h2>
        </div>
      </div>
      <p className="mt-5 rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 text-sm leading-7 text-neutral-600 dark:border-white/[0.07] dark:bg-black/15 dark:text-white/55">
        {selected.course.finalProject}
      </p>
      {selected.course.finalProjectPlan && (
        <div className="mt-4 grid gap-3">
          <RequirementPanel
            title="Project overview"
            body={selected.course.finalProjectPlan.overview}
          />
          <RequirementPanel
            title="Approved lab environment"
            body={selected.course.finalProjectPlan.labEnvironment}
          />
          <div className="rounded-2xl border border-black/[0.07] bg-black/[0.02] p-5 dark:border-white/[0.07] dark:bg-black/15">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Project phases
            </p>
            <div className="mt-4 space-y-3">
              {selected.course.finalProjectPlan.phases.map((phase, index) => (
                <div
                  key={`${phase.title}-${index}`}
                  className="rounded-2xl border border-black/[0.06] bg-white/55 p-4 dark:border-white/[0.07] dark:bg-white/[0.035]"
                >
                  <p className="text-sm font-bold">
                    {index + 1}. {phase.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/55">
                    {phase.instructions}
                  </p>
                  <RequirementPanel
                    title="Evidence"
                    items={phase.evidence}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <RequirementPanel
              title="Final deliverables"
              items={selected.course.finalProjectPlan.deliverables}
            />
            <RequirementPanel
              title="Final rubric"
              items={selected.course.finalProjectPlan.assessmentCriteria}
            />
          </div>
          <RequirementPanel
            title="Safety and ethics"
            body={selected.course.finalProjectPlan.safetyNotes}
          />
        </div>
      )}
      {selected.finalProjectSubmission?.evaluation && (
        <EvaluationFeedback
          evaluation={selected.finalProjectSubmission.evaluation}
        />
      )}
      {selected.finalProjectSubmission?.status === "submitted" ||
      selected.finalProjectSubmission?.status === "reviewed" ? (
        <SubmissionSummary
          submission={{
            content: selected.finalProjectSubmission.content,
            status: selected.finalProjectSubmission.status,
            submittedAt: selected.finalProjectSubmission.submittedAt,
          }}
        />
      ) : (
        <form onSubmit={onSubmitFinalProject}>
          <PracticeCodeWorkspace
            key={`${selected.id}-final-project-workspace`}
            initialCode=""
            initialFiles={buildFinalProjectWorkspaceFiles(selected.course)}
            language="html"
            seedTitle={`${selected.course.courseTitle} capstone`}
            title="Capstone workspace"
            subtitle="Build the final project here, then submit the workspace"
            onFilesChange={onFinalProjectFilesChange}
          />
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">
              In-system capstone
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/58">
              Your final project is assessed from this Academy workspace. Add
              notes below for decisions, tradeoffs, and anything the grader
              should inspect in the preview.
            </p>
          </div>
          <textarea
            value={finalDraft}
            onChange={(event) => onFinalDraftChange(event.target.value)}
            className="mt-5 min-h-36 w-full rounded-2xl border border-black/[0.08] bg-transparent p-4 text-sm leading-6 outline-none focus:border-[#7c6cf6] dark:border-white/10"
            placeholder="Implementation notes: what you built, key decisions, completed requirements, and how to test it in the preview."
          />
          <button
            type="submit"
            disabled={pendingAction === "final-project"}
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {pendingAction === "final-project" && <LoadingSpinner />}
            {pendingAction === "final-project"
              ? "Assessing project…"
              : selected.finalProjectSubmission
                ? "Resubmit final project"
                : "Submit final project"}
          </button>
        </form>
      )}
    </section>
  );
}

function RequirementPanel({
  title,
  body,
  items,
  compact = false,
}: {
  title: string;
  body?: string;
  items?: string[];
  compact?: boolean;
}) {
  return (
    <div
      className={`${compact ? "mt-3" : ""} rounded-2xl border border-black/[0.07] bg-black/[0.02] p-4 dark:border-white/[0.07] dark:bg-white/[0.035]`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {title}
      </p>
      {body && (
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/55">
          {body}
        </p>
      )}
      {items?.length ? (
        <ul className="mt-2 space-y-2 text-sm leading-6 text-neutral-600 dark:text-white/55">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-2">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c6cf6]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
