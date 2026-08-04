"use client";

import { useEffect, useRef, useState } from "react";
import { type GeneratedLesson } from "@/lib/academy";
import { ChevronDownIcon } from "@/components/academy/dashboard/icons";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import { buildYouTubeLearningUrl } from "@/components/academy/dashboard/utils";
import {
  buildLessonWorkspaceFiles,
  type PracticeCodeFileSnapshot,
} from "@/components/academy/dashboard/workspace";
import { isRelevantLessonVideo } from "@/lib/youtube-relevance";

export function LessonCard({
  courseTitle,
  lesson,
  index,
  moduleTitle,
  pending,
  videoPending,
  active,
  onOpen,
  onToggle,
  onRefreshVideo,
}: {
  courseTitle: string;
  lesson: GeneratedLesson;
  index: number;
  moduleTitle: string;
  pending: boolean;
  videoPending: boolean;
  active?: boolean;
  onOpen?: () => void;
  onToggle: () => void;
  onRefreshVideo: (silent?: boolean) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const videoRefreshRequested = useRef(false);
  const codingTask =
    /code|html|css|javascript|typescript|tsx|jsx|react|component|function|api|page|website|app|program|python|sql|java|c\+\+|cpp|c#|csharp|golang|\bgo\b|rust|php|ruby|swift|kotlin|bash|shell|terminal|script/i.test(
      `${lesson.title} ${lesson.practicalTask} ${lesson.challenge ?? ""} ${lesson.starterCode ?? ""}`,
    );
  const completed = lesson.completionStatus === "completed";
  const [quickCheckPassed, setQuickCheckPassed] = useState(completed);
  const hasQuickCheck = Boolean(lesson.lessonAssessment?.length);
  const lessonText = [
    lesson.notes,
    lesson.conceptExplanation,
    lesson.whyItMatters,
    lesson.practicalTask,
    lesson.safetyNotes,
  ]
    .filter(Boolean)
    .join(" ");
  const readingMinutes = Math.max(
    2,
    Math.ceil((lessonText.split(/\s+/).filter(Boolean).length || 120) / 140),
  );
  const xp = completed ? 100 : codingTask ? 70 : 55;
  const videoUrl = buildYouTubeLearningUrl(
    lesson.videoSearchQuery,
    courseTitle,
    moduleTitle,
    lesson.title,
  );
  const savedVideo = lesson.youtubeVideo;
  const enrichedVideo =
    savedVideo && isRelevantLessonVideo(savedVideo, lesson)
      ? savedVideo
      : undefined;
  const primaryVideoUrl = enrichedVideo?.watchUrl ?? videoUrl;
  const videoTitle = enrichedVideo?.title ?? lesson.videoTitle ?? lesson.title;
  const missionSteps = [
    lesson.videoLearningGoal ?? lesson.goal ?? "Study the core idea",
    lesson.keyTakeaways?.length
      ? "Capture the key takeaways"
      : "Explain it in your own words",
    lesson.challenge ??
      (codingTask ? "Run a mini experiment" : "Complete the practice task"),
  ];

  useEffect(() => {
    if (!active) return;
    detailsRef.current?.setAttribute("open", "");
    window.setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, [active]);

  useEffect(() => {
    if (
      !active ||
      enrichedVideo ||
      videoPending ||
      videoRefreshRequested.current
    ) {
      return;
    }
    videoRefreshRequested.current = true;
    onRefreshVideo(true);
  }, [active, enrichedVideo, onRefreshVideo, savedVideo, videoPending]);

  return (
    <details
      ref={detailsRef}
      onToggle={(event) => {
        if (event.currentTarget.open) onOpen?.();
      }}
      className="group overflow-hidden rounded-2xl border border-black/[0.08] bg-white/80 transition hover:border-[#7c6cf6]/25 open:bg-white open:shadow-sm dark:border-white/[0.08] dark:bg-[#111219] dark:open:bg-white/[0.04]"
    >
      <summary className="grid cursor-pointer list-none gap-4 p-4 outline-none transition hover:bg-black/[0.025] focus-visible:ring-2 focus-visible:ring-[#7c6cf6] md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_180px] lg:items-center sm:p-5 [&::-webkit-details-marker]:hidden">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${completed ? "bg-emerald-500 text-white" : "bg-black/[0.05] text-neutral-500 dark:bg-white/[0.07] dark:text-white/60"}`}
        >
          {completed ? "✓" : index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-6 sm:text-base">
            {lesson.title}
          </span>
          <span className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400">
            <span>{completed ? "Completed" : "Available"}</span>
            <span>+{xp} XP</span>
            <span>{readingMinutes} min</span>
            <a
              href={primaryVideoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="text-[#6c5ce7] underline-offset-4 hover:underline dark:text-[#b9b1ff]"
            >
              Watch lesson
            </a>
          </span>
        </span>
        <span className="grid gap-2 md:col-span-2 lg:col-span-1 lg:min-w-40">
          <span className="relative h-2 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
            <span
              className="academy-xp-bar absolute inset-y-0 left-0 overflow-hidden rounded-full bg-[#7c6cf6]"
              style={{ width: `${completed ? 100 : 35}%` }}
            />
          </span>
          <span className="flex items-center justify-end gap-2 text-[10px] font-bold text-neutral-400">
            {completed ? "100%" : "Tap to open"}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-neutral-400 transition duration-300 group-open:rotate-180 dark:bg-white/[0.06]"
              aria-hidden="true"
            >
              <ChevronDownIcon />
            </span>
          </span>
        </span>
      </summary>
      <div className="border-t border-black/[0.06] px-4 pb-5 pt-1 dark:border-white/[0.06] sm:px-5 sm:pb-6">
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {missionSteps.map((step, stepIndex) => (
            <div
              key={step}
              className="rounded-2xl border border-black/[0.07] bg-black/[0.025] p-3 dark:border-white/[0.07] dark:bg-white/[0.035]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Step {stepIndex + 1}
              </p>
              <p className="mt-1 text-xs font-semibold text-neutral-600 dark:text-white/52">
                {step}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-red-500/15 bg-red-500/[0.045] dark:border-red-400/20 dark:bg-red-400/[0.06]">
          <div
            className={`relative overflow-hidden bg-[#08090d] ${
              enrichedVideo ? "aspect-video" : "min-h-48"
            }`}
          >
            {enrichedVideo ? (
              <iframe
                title={enrichedVideo.title}
                src={enrichedVideo.embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.16),transparent_58%),linear-gradient(145deg,#0b0c12,#14101a)] p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-200 ring-1 ring-red-500/20">
                  ▶
                </div>
                <p className="mt-4 text-sm font-semibold text-white">
                  {videoTitle}
                </p>
                <p className="mt-2 max-w-sm text-xs leading-5 text-white/45">
                  {videoPending
                    ? "Finding a more relevant course-style tutorial for this lesson…"
                    : "Open the focused YouTube search while this lesson waits for a strong tutorial match."}
                </p>
                {!videoPending && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white transition hover:bg-red-500"
                  >
                    Search focused tutorials
                  </a>
                )}
              </div>
            )}
            {enrichedVideo?.thumbnailUrl && (
              <a
                href={enrichedVideo.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:bg-red-600"
              >
                Open source
              </a>
            )}
          </div>
          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-600 dark:text-red-300">
                Video study
              </p>
              <h3 className="mt-1 text-base font-semibold">{videoTitle}</h3>
              {enrichedVideo && (
                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-white/45">
                  {enrichedVideo.channelTitle}
                  {enrichedVideo.durationLabel
                    ? ` · ${enrichedVideo.durationLabel}`
                    : ""}
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/60">
                {lesson.videoLearningGoal ??
                  "Watch a strong visual explanation first, then use Lumyn for practice and assessment."}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
              <a
                href={primaryVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-500"
              >
                {enrichedVideo ? "Watch on YouTube" : "Search YouTube"}
              </a>
              <button
                type="button"
                onClick={() => onRefreshVideo(false)}
                disabled={videoPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-500/[0.07] disabled:cursor-not-allowed disabled:opacity-55 dark:text-red-300"
              >
                {videoPending && <LoadingSpinner />}
                {videoPending ? "Finding tutorial…" : "Find better tutorial"}
              </button>
            </div>
          </div>
          {(lesson.recommendedChannels?.length ||
            lesson.keyTakeaways?.length) && (
            <div className="grid gap-3 border-t border-red-500/10 p-4 md:grid-cols-2">
              {lesson.recommendedChannels?.length ? (
                <ListPanel
                  title="Suggested channels"
                  items={lesson.recommendedChannels}
                />
              ) : null}
              {lesson.keyTakeaways?.length ? (
                <ListPanel
                  title="Watch for these ideas"
                  items={lesson.keyTakeaways}
                />
              ) : null}
            </div>
          )}
        </div>
        <div className="mt-5 rounded-2xl border border-black/[0.07] bg-black/[0.025] p-4 text-sm leading-6 dark:border-white/[0.07] dark:bg-white/[0.035]">
          <span className="font-bold text-neutral-800 dark:text-white">
            Practice:
          </span>{" "}
          {lesson.practicalTask}
        </div>
        <details className="mt-5 overflow-hidden rounded-2xl border border-black/[0.07] bg-black/[0.018] dark:border-white/[0.07] dark:bg-white/[0.025]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
            More guidance
            <span className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">
              Open
            </span>
          </summary>
          <div className="border-t border-black/[0.06] p-4 dark:border-white/[0.06]">
            <p className="whitespace-pre-line text-sm leading-7 text-neutral-600 dark:text-white/55">
              {lesson.notes}
            </p>
            {(lesson.goal ||
              lesson.explanation ||
              lesson.example ||
              lesson.expectedResult ||
              lesson.tests?.length ||
              lesson.hint) && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lesson.explanation && (
                  <InfoPanel title="Learn">{lesson.explanation}</InfoPanel>
                )}
                {lesson.example && (
                  <InfoPanel title="Example">{lesson.example}</InfoPanel>
                )}
                {lesson.expectedResult && (
                  <InfoPanel title="Expected result">
                    {lesson.expectedResult}
                  </InfoPanel>
                )}
                {lesson.hint && (
                  <InfoPanel title="Hint">{lesson.hint}</InfoPanel>
                )}
              </div>
            )}
            {lesson.stepByStepLab?.length ? (
              <ListPanel
                title="Practice checklist"
                items={lesson.stepByStepLab}
                ordered
              />
            ) : null}
            {(lesson.conceptExplanation ||
              lesson.whyItMatters ||
              lesson.prerequisites?.length) && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {lesson.conceptExplanation && (
                  <InfoPanel title="Concept explained">
                    {lesson.conceptExplanation}
                  </InfoPanel>
                )}
                {lesson.whyItMatters && (
                  <InfoPanel title="Why it matters">
                    {lesson.whyItMatters}
                  </InfoPanel>
                )}
                {lesson.prerequisites?.length ? (
                  <ListPanel
                    title="Before you start"
                    items={lesson.prerequisites}
                  />
                ) : null}
              </div>
            )}
            {lesson.realWorldExample && (
              <div className="mt-4 rounded-2xl border border-black/[0.07] bg-black/[0.025] p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                  Real-life scenario · {lesson.realWorldExample.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-white/55">
                  {lesson.realWorldExample.scenario}
                </p>
                <p className="mt-2 text-xs font-semibold text-neutral-600 dark:text-white/65">
                  Takeaway: {lesson.realWorldExample.takeaway}
                </p>
              </div>
            )}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {lesson.commonMistakes?.length ? (
                <ListPanel
                  title="Common mistakes"
                  items={lesson.commonMistakes}
                />
              ) : null}
              {lesson.safetyNotes ? (
                <InfoPanel title="Safety notes">{lesson.safetyNotes}</InfoPanel>
              ) : null}
              <InfoPanel title="Where to do it">
                {codingTask
                  ? "Use the Academy practice playground below and keep all project files, output, and evidence inside the system."
                  : "Use the Academy notes and module workspace for the task, and keep all evidence inside the system."}
              </InfoPanel>
              <InfoPanel title="How it is checked">
                Lesson challenges are self-checks. Click mark complete when you
                have done it. The quiz, module assignment, and final project are
                the assessed parts.
              </InfoPanel>
            </div>
            {lesson.visualAid && lesson.visualAid.items.length > 0 && (
              <div className="mt-4 rounded-2xl border border-black/[0.07] bg-white/60 p-4 dark:border-white/[0.07] dark:bg-white/[0.03]">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                  Visual · {lesson.visualAid.title}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  {lesson.visualAid.items.map((item, itemIndex) => (
                    <div
                      key={`${item}-${itemIndex}`}
                      className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col"
                    >
                      <div className="flex min-h-16 flex-1 items-center justify-center rounded-xl border border-[#7c6cf6]/15 bg-[#7c6cf6]/[0.06] p-3 text-center text-xs font-medium leading-5">
                        {item}
                      </div>
                      {itemIndex < lesson.visualAid!.items.length - 1 && (
                        <span className="rotate-90 text-[#7c6cf6] sm:rotate-0">
                          →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(lesson.codeExample || lesson.starterCode) && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center justify-between bg-[#111218] px-4 py-3 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                    {lesson.starterCode ? "Starter code" : "Example"} ·{" "}
                    {lesson.codeExample?.language ?? "code"}
                  </p>
                  <span className="flex gap-1.5">
                    <i className="h-2 w-2 rounded-full bg-red-400" />
                    <i className="h-2 w-2 rounded-full bg-amber-400" />
                    <i className="h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                </div>
                <HighlightedCode
                  code={lesson.starterCode || lesson.codeExample?.code || ""}
                  language={lesson.codeExample?.language ?? "code"}
                />
                {lesson.codeExample?.explanation && (
                  <p className="border-t border-white/[0.08] bg-[#111218] px-4 py-3 text-xs leading-5 text-white/50">
                    {lesson.codeExample.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </details>
        {hasQuickCheck && (
          <LessonQuickCheck
            questions={lesson.lessonAssessment!}
            completed={completed}
            onPassed={() => setQuickCheckPassed(true)}
          />
        )}
        {codingTask && (
          <CodePlayground
            lesson={lesson}
            moduleTitle={moduleTitle}
            courseTitle={courseTitle}
          />
        )}
        <div className="mt-5 flex justify-end border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
          <button
            type="button"
            disabled={pending || (!completed && hasQuickCheck && !quickCheckPassed)}
            onClick={onToggle}
            className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition disabled:opacity-60 sm:w-auto ${completed ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15" : "bg-[#7c6cf6] text-white hover:bg-[#6b5bdd]"}`}
          >
            {pending && <LoadingSpinner />}
            {pending
              ? "Saving…"
              : completed
                ? "Completed ✓"
                : hasQuickCheck && !quickCheckPassed
                  ? "Pass quick check to finish"
                  : "Complete lesson · earn XP"}
          </button>
        </div>
      </div>
    </details>
  );
}

function LessonQuickCheck({
  questions,
  completed,
  onPassed,
}: {
  questions: NonNullable<GeneratedLesson["lessonAssessment"]>;
  completed: boolean;
  onPassed: () => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [passed, setPassed] = useState(false);
  const question = questions[questionIndex];
  const correct = checked && selectedOption === question.correctAnswerIndex;
  const finished = correct && questionIndex === questions.length - 1;

  if (completed || passed) {
    return (
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">✓</span>
        Knowledge check passed
      </div>
    );
  }

  const advance = () => {
    if (finished) {
      setPassed(true);
      onPassed();
      return;
    }
    setQuestionIndex((index) => Math.min(index + 1, questions.length - 1));
    setSelectedOption(null);
    setChecked(false);
  };

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.045]" aria-label="Lesson knowledge check">
      <div className="flex items-center justify-between gap-4 border-b border-[#7c6cf6]/12 px-4 py-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6c5ce7] dark:text-[#b9b1ff]">Quick check</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/45">One question at a time · instant feedback</p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-black text-[#6c5ce7] shadow-sm dark:bg-white/[0.06] dark:text-[#b9b1ff]">{questionIndex + 1}/{questions.length}</span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-black/[0.07] dark:bg-white/[0.08]">
          <span className="block h-full rounded-full bg-[#7c6cf6] transition-all" style={{ width: `${((questionIndex + (correct ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <h3 className="text-sm font-semibold leading-6 sm:text-base">{question.question}</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const selected = selectedOption === optionIndex;
            const isCorrect = checked && optionIndex === question.correctAnswerIndex;
            const isWrong = checked && selected && !isCorrect;
            return (
              <button
                key={`${option}-${optionIndex}`}
                type="button"
                disabled={correct}
                onClick={() => {
                  setSelectedOption(optionIndex);
                  setChecked(false);
                }}
                className={`rounded-xl border p-3 text-left text-xs font-semibold leading-5 transition ${isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : isWrong ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-300" : selected ? "border-[#7c6cf6]/50 bg-[#7c6cf6]/10" : "border-black/[0.08] bg-white/60 hover:border-[#7c6cf6]/30 dark:border-white/10 dark:bg-white/[0.035]"}`}
              >
                <span className="mr-2 text-[#7c6cf6]">{String.fromCharCode(65 + optionIndex)}.</span>{option}
              </button>
            );
          })}
        </div>
        {checked && (
          <div className={`mt-4 rounded-xl border p-3 text-xs leading-5 ${correct ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-300" : "border-amber-500/20 bg-amber-500/[0.08] text-amber-700 dark:text-amber-200"}`} role="status">
            <strong>{correct ? "You got it." : "Not quite—try once more."}</strong> {question.explanation}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{correctCount}/{questions.length} correct</span>
          {!correct ? (
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={() => {
                const answerIsCorrect = selectedOption === question.correctAnswerIndex;
                setChecked(true);
                if (answerIsCorrect) setCorrectCount((count) => Math.max(count, questionIndex + 1));
              }}
              className="rounded-xl bg-[#7c6cf6] px-5 py-2.5 text-xs font-black text-white transition hover:bg-[#6b5bdd] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Check answer
            </button>
          ) : (
            <button type="button" onClick={advance} className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-white transition hover:bg-emerald-600">
              {finished ? "Finish check" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoPanel({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-black/[0.025] p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
        {title}
      </p>
      <p className="mt-2 text-xs leading-6 text-neutral-600 dark:text-white/55">
        {children}
      </p>
    </div>
  );
}

function ListPanel({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="mt-3 rounded-2xl border border-black/[0.07] bg-black/[0.025] p-4 dark:border-white/[0.07] dark:bg-white/[0.035]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
        {title}
      </p>
      <List
        className={`mt-2 space-y-2 text-xs leading-5 text-neutral-600 dark:text-white/55 ${ordered ? "list-decimal pl-4" : ""}`}
      >
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className={ordered ? "" : "flex gap-2"}>
            {!ordered && (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c6cf6]" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </List>
    </div>
  );
}

function HighlightedCode({
  code,
  language,
  className = "academy-scrollbar overflow-x-auto bg-[#090a0d] p-4 text-xs leading-6 text-[#d8d5ff]",
  hideLineNumbers = false,
}: {
  code: string;
  language: string;
  className?: string;
  hideLineNumbers?: boolean;
}) {
  const lines = code.split("\n");

  return (
    <pre className={`font-mono text-[#d8d5ff] ${className}`}>
      <code aria-label={`${language} code sample`}>
        {lines.map((line, index) => (
          <span
            key={`${index}-${line}`}
            className={hideLineNumbers ? "block min-w-0" : "block min-w-max"}
          >
            {!hideLineNumbers && (
              <span className="mr-4 inline-block w-6 select-none text-right text-white/22">
                {index + 1}
              </span>
            )}
            {highlightCodeLine(line)}
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
}

function highlightCodeLine(line: string) {
  const tokenPattern =
    /(\/\/.*|\/\*.*?\*\/|<!--.*?-->|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|\b(?:const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|type|interface|extends|public|private|protected|def|True|False|None)\b|\b(?:div|span|main|section|button|input|form|html|body|head|style|script|h1|h2|p|a)\b|#[A-Fa-f0-9]{3,8}\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:<>/=+\-*])/g;
  const tokens = line.split(tokenPattern).filter((token) => token !== "");

  return tokens.map((token, index) => {
    let className = "text-[#d8d5ff]";
    if (/^(\/\/|\/\*|<!--)/.test(token)) className = "text-[#6f7890]";
    else if (/^["'`]/.test(token)) className = "text-[#a7f3d0]";
    else if (
      /^(const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|type|interface|extends|public|private|protected|def|True|False|None)$/.test(
        token,
      )
    )
      className = "text-[#c4b5fd]";
    else if (
      /^(div|span|main|section|button|input|form|html|body|head|style|script|h1|h2|p|a)$/.test(
        token,
      )
    )
      className = "text-[#67e8f9]";
    else if (/^#[A-Fa-f0-9]{3,8}$/.test(token) || /^\d/.test(token))
      className = "text-[#fbbf24]";
    else if (/^[{}()[\].,;:<>/=+\-*]$/.test(token))
      className = "text-[#94a3b8]";
    return (
      <span key={`${index}-${token}`} className={className}>
        {token}
      </span>
    );
  });
}

type PlaygroundFile = {
  id: string;
  name: string;
  language: string;
  value: string;
};

function CodePlayground({
  lesson,
  moduleTitle,
  courseTitle,
}: {
  lesson: GeneratedLesson;
  moduleTitle: string;
  courseTitle: string;
}) {
  const initialFiles = buildLessonWorkspaceFiles(lesson, moduleTitle, courseTitle);
  const language = initialFiles?.[0]?.language || lesson.codeExample?.language || "html";
  const browserLanguage = isBrowserLanguage(normalizeProgrammingLanguage(language));
  const fallback = `<!doctype html>\n<html>\n  <body>\n    <h1>${lesson.title.replace(/[<>]/g, "")}</h1>\n    <p>Build your solution here.</p>\n  </body>\n</html>`;
  return (
    <PracticeCodeWorkspace
      initialCode={lesson.starterCode || lesson.codeExample?.code || fallback}
      initialFiles={initialFiles}
      language={language}
      seedTitle={lesson.title}
      title="Practice playground"
      subtitle={
        browserLanguage
          ? "Edit and preview your code safely in the browser"
          : "Edit your code and include it with your lesson evidence"
      }
    />
  );
}

export function PracticeCodeWorkspace({
  initialCode,
  initialFiles,
  language = "html",
  seedTitle,
  title = "Code workspace",
  subtitle = "Edit and run your code safely in the browser",
  onFilesChange,
}: {
  initialCode: string;
  initialFiles?: PracticeCodeFileSnapshot[];
  language?: string;
  seedTitle: string;
  title?: string;
  subtitle?: string;
  onFilesChange?: (files: PracticeCodeFileSnapshot[]) => void;
}) {
  const seededFiles = initialFiles?.length
    ? createPlaygroundFilesFromSnapshots(initialFiles)
    : createPlaygroundFiles(initialCode, language, seedTitle);
  const initialActiveFileId =
    seededFiles.find((file) => file.value.trim())?.id ?? "index-html";
  const [files, setFiles] = useState(seededFiles);
  const [activeFileId, setActiveFileId] = useState<string>(initialActiveFileId);
  const [preview, setPreview] = useState(() =>
    buildPreviewFromFiles(seededFiles, initialActiveFileId),
  );
  const [terminalOutput, setTerminalOutput] = useState("");
  const [previewRun, setPreviewRun] = useState(0);
  const [running, setRunning] = useState(false);
  const activeFile = files.find((file) => file.id === activeFileId) ?? files[0];
  const browserRunnable = hasBrowserRunnableFiles(files);
  const primaryExecutableFile = getPrimaryExecutableFile(files);
  const workerRunnable = canRunInBrowserWorker(primaryExecutableFile);
  const runSupported = browserRunnable || workerRunnable || Boolean(primaryExecutableFile);

  useEffect(() => {
    const workspaceFiles = files.map(({ name, language: fileLanguage, value }) => ({
      name,
      language: fileLanguage,
      value,
    }));
    onFilesChange?.(
      !browserRunnable && terminalOutput.trim()
        ? [
            ...workspaceFiles,
            {
              name: "terminal-output.txt",
              language: "text",
              value: terminalOutput,
            },
          ]
        : workspaceFiles,
    );
  }, [browserRunnable, files, onFilesChange, terminalOutput]);

  function updateActiveFile(value: string) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === activeFile.id ? { ...file, value } : file,
      ),
    );
  }

  function selectFile(file: PlaygroundFile) {
    setActiveFileId(file.id);
    if (isHtmlFile(file)) {
      setPreview(buildPreviewFromFiles(files, file.id));
      setPreviewRun((run) => run + 1);
    }
  }

  async function runCode() {
    if (!runSupported) return;
    setRunning(true);
    if (browserRunnable) {
      window.setTimeout(() => {
        setPreview(buildPreviewFromFiles(files, activeFileId));
        setPreviewRun((run) => run + 1);
        setRunning(false);
      }, 250);
      return;
    }

    if (workerRunnable && primaryExecutableFile) {
      setTerminalOutput("Running...");
      const output = await runFileInBrowserWorker(primaryExecutableFile);
      setTerminalOutput(output);
      setRunning(false);
      return;
    }

    setTerminalOutput(
      [
        `This workspace needs a ${normalizeProgrammingLanguage(primaryExecutableFile?.language ?? "") || "language"} runtime outside the browser.`,
        "",
        `Run command: ${terminalCommandForFile(primaryExecutableFile)}`,
        "",
        "Paste the terminal output, errors, or test results here after running it.",
      ].join("\n"),
    );
    setRunning(false);
  }

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08]">
      <div className="flex items-center justify-between bg-[#111218] px-4 py-3 text-white">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a99eff]">
            {title}
          </p>
          <p className="mt-0.5 text-[10px] text-white/35">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={runCode}
          disabled={running || !runSupported}
          className="inline-flex items-center gap-2 rounded-lg bg-[#7c6cf6] px-3 py-2 text-xs font-bold text-white disabled:opacity-60 whitespace-nowrap"
        >
          {running && <LoadingSpinner />}
          {running
            ? "Running..."
            : browserRunnable
              ? "Run preview"
              : workerRunnable
                ? "Run code"
                : "Show run command"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-white/[0.08] bg-[#090a0d] px-3 pt-3">
        {files.map((file) => {
          const active = file.id === activeFile.id;
          return (
            <button
              key={file.id}
              type="button"
              onClick={() => selectFile(file)}
              className={`rounded-t-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                active
                  ? "bg-[#151720] text-[#d8d5ff]"
                  : "text-white/42 hover:bg-white/[0.05] hover:text-white/70"
              }`}
            >
              {file.name}
            </button>
          );
        })}
      </div>
      <div className="grid min-h-72 lg:grid-cols-2">
        <CodeEditor
          value={activeFile.value}
          onChange={updateActiveFile}
          language={activeFile.language}
          fileName={activeFile.name}
        />
        {browserRunnable ? (
          <div className="min-h-72 bg-white">
            <div className="flex h-10 items-center justify-between border-b border-black/10 bg-[#f8fafc] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
              <span>Output</span>
              <span>Run {previewRun + 1}</span>
            </div>
            <iframe
              key={previewRun}
              title={`${seedTitle} preview`}
              sandbox="allow-scripts"
              srcDoc={preview}
              className="h-[calc(100%-2.5rem)] min-h-[248px] w-full border-0 bg-white"
            />
          </div>
        ) : (
          <TerminalOutputPanel
            files={files}
            output={terminalOutput}
            onOutputChange={setTerminalOutput}
          />
        )}
      </div>
    </div>
  );
}

function TerminalOutputPanel({
  files,
  output,
  onOutputChange,
}: {
  files: PlaygroundFile[];
  output: string;
  onOutputChange: (value: string) => void;
}) {
  const nonEmptyCount = files.filter((file) => file.value.trim()).length;
  const primaryFile =
    files.find((file) => file.value.trim() && !isDocumentationFile(file)) ??
    files.find((file) => !isDocumentationFile(file)) ??
    files.find((file) => file.value.trim()) ??
    files[0];
  const command = terminalCommandForFile(primaryFile);

  return (
    <div className="min-h-72 bg-[#05070b] text-white">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#0d1117] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/42">
        <span>Terminal output</span>
        <span>{nonEmptyCount}/{files.length} files</span>
      </div>
      <div className="grid min-h-[248px] grid-rows-[auto_1fr]">
        <div className="border-b border-white/10 bg-[#080b10] px-4 py-3 font-mono text-xs leading-6 text-white/70">
          <p>
            <span className="text-emerald-300">$</span>{" "}
            <span>{command}</span>
          </p>
          <p className="mt-1 text-[11px] leading-5 text-white/35">
            Use this Academy terminal panel to record expected output, test
            cases, errors, or results from the built-in runner. This evidence is
            included with your submission; do not paste an external link.
          </p>
        </div>
        <textarea
          value={output}
          onChange={(event) => onOutputChange(event.target.value)}
          spellCheck={false}
          placeholder={`Record in-system output or test evidence for ${primaryFile?.name ?? "your code"} here...`}
          className="min-h-[208px] w-full resize-y border-0 bg-[#05070b] p-4 font-mono text-xs leading-6 text-emerald-100 outline-none placeholder:text-white/25"
          aria-label="Terminal output"
        />
      </div>
    </div>
  );
}

function getPrimaryExecutableFile(files: PlaygroundFile[]) {
  return (
    files.find((file) => file.value.trim() && !isDocumentationFile(file)) ??
    files.find((file) => !isDocumentationFile(file)) ??
    files.find((file) => file.value.trim()) ??
    files[0]
  );
}

function canRunInBrowserWorker(file?: PlaygroundFile) {
  if (!file) return false;
  const language = normalizeProgrammingLanguage(
    file.language || languageFromFileName(file.name),
  );
  return language === "javascript" || language === "typescript" || language === "tsx";
}

function transpileForBrowserWorker(file: PlaygroundFile) {
  const language = normalizeProgrammingLanguage(
    file.language || languageFromFileName(file.name),
  );
  const code = stripCodeFence(file.value);
  if (language === "javascript") return code;
  return stripTypeScriptSyntax(code);
}

function stripTypeScriptSyntax(code: string) {
  const withoutTypeBlocks = stripTypeOnlyBlocks(code);
  return stripParameterTypes(withoutTypeBlocks)
    .replace(/^\s*import\s+[^;]+;?\s*$/gm, "")
    .replace(/^\s*export\s+(?=(const|let|var|function|class))/gm, "")
    .replace(/\b(as|satisfies)\s+[A-Za-z_$][\w$<>,[\]\s|&.?]*/g, "")
    .replace(/(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*[^=;\n]+=/g, "$1 $2 =")
    .replace(/\)\s*:\s*[^=({]+(?=\s*=>|\s*{)/g, ")")
    .replace(/<([A-Za-z_$][\w$]*)\s*\/>/g, "'<$1 />'")
    .replace(/<([A-Za-z_$][\w$]*)[^>]*>([\s\S]*?)<\/\1>/g, (_match, tag, body) =>
      JSON.stringify(`<${tag}>${String(body).replace(/{([^}]+)}/g, "${$1}")}</${tag}>`),
    );
}

function stripParameterTypes(code: string) {
  const removeParamTypes = (params: string) =>
    params.replace(
      /([A-Za-z_$][\w$]*\??)\s*:\s*[^,)=]+/g,
      (_match, name) => name.replace(/\?$/, ""),
    );

  return code
    .replace(
      /(function\s+[A-Za-z_$][\w$]*\s*)\(([^)]*)\)/g,
      (_match, prefix, params) => `${prefix}(${removeParamTypes(params)})`,
    )
    .replace(
      /\(([^)]*:\s*[^)]*)\)\s*=>/g,
      (_match, params) => `(${removeParamTypes(params)}) =>`,
    );
}

function stripTypeOnlyBlocks(code: string) {
  const lines = code.split("\n");
  const kept: string[] = [];
  let skipping = false;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!skipping && /^(export\s+)?(type|interface)\s+/.test(trimmed)) {
      const opens = (line.match(/{/g) ?? []).length;
      const closes = (line.match(/}/g) ?? []).length;
      braceDepth = opens - closes;
      skipping = braceDepth > 0 || !/;\s*$/.test(trimmed);
      continue;
    }

    if (skipping) {
      const opens = (line.match(/{/g) ?? []).length;
      const closes = (line.match(/}/g) ?? []).length;
      braceDepth += opens - closes;
      if (braceDepth <= 0 && /[};]\s*$/.test(trimmed)) {
        skipping = false;
        braceDepth = 0;
      }
      continue;
    }

    kept.push(line);
  }

  return kept.join("\n");
}

function runFileInBrowserWorker(file: PlaygroundFile) {
  return new Promise<string>((resolve) => {
    if (typeof Worker === "undefined" || typeof Blob === "undefined") {
      resolve("This browser does not support the in-browser runner.");
      return;
    }

    const runnableCode = transpileForBrowserWorker(file);
    const workerSource = `
      const formatValue = (value) => {
        if (typeof value === "string") return value;
        try { return JSON.stringify(value, null, 2); } catch { return String(value); }
      };
      const write = (level, values) => {
        self.postMessage({ type: "log", level, text: values.map(formatValue).join(" ") });
      };
      console.log = (...values) => write("log", values);
      console.info = (...values) => write("info", values);
      console.warn = (...values) => write("warn", values);
      console.error = (...values) => write("error", values);
      self.addEventListener("error", (event) => {
        self.postMessage({ type: "error", text: event.message || "Runtime error" });
      });
      try {
        ${runnableCode}
        self.postMessage({ type: "done" });
      } catch (error) {
        self.postMessage({ type: "error", text: error && error.message ? error.message : String(error) });
        self.postMessage({ type: "done" });
      }
    `;
    const blob = new Blob([workerSource], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    const lines: string[] = [];
    const timeout = window.setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(
        [
          ...lines,
          "Stopped after 3 seconds. Check for infinite loops or long-running code.",
        ].join("\n"),
      );
    }, 3000);

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data as
        | { type: "log" | "info" | "warn" | "error"; level?: string; text?: string }
        | { type: "done" };
      if (message.type === "done") {
        window.clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(lines.length ? lines.join("\n") : "Code ran with no console output.");
        return;
      }
      if (message.type === "error") {
        lines.push(`Error: ${message.text ?? "Runtime error"}`);
        return;
      }
      lines.push(message.text ?? "");
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(`Error: ${event.message}`);
    };
  });
}

function CodeEditor({
  value,
  onChange,
  language,
  fileName,
}: {
  value: string;
  onChange: (value: string) => void;
  language: string;
  fileName: string;
}) {
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  return (
    <div className="relative min-h-72 overflow-hidden bg-[#090a0d]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ transform: `translate(${-scroll.left}px, ${-scroll.top}px)` }}
      >
        <HighlightedCode
          code={value}
          language={language}
          className="min-h-full whitespace-pre-wrap break-words p-4 text-xs leading-6"
          hideLineNumbers
        />
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onScroll={(event) =>
          setScroll({
            left: event.currentTarget.scrollLeft,
            top: event.currentTarget.scrollTop,
          })
        }
        spellCheck={false}
        wrap="soft"
        placeholder={`Write ${fileName} here...`}
        className="academy-scrollbar relative min-h-72 w-full resize-y overflow-auto border-0 bg-transparent p-4 font-mono text-xs leading-6 text-transparent caret-[#f8fafc] outline-none selection:bg-[#7c6cf6]/35 placeholder:text-white/28"
        aria-label={`${fileName} code editor`}
      />
    </div>
  );
}

function createPlaygroundFiles(
  code: string,
  language: string,
  lessonTitle: string,
): PlaygroundFile[] {
  const runnableCode = stripCodeFence(code);
  const normalized = language.toLowerCase();
  const primaryLanguage = normalizeProgrammingLanguage(normalized);

  if (!isBrowserLanguage(primaryLanguage)) {
    const fileName = fileNameForLanguage(primaryLanguage);
    return [
      {
        id: fileIdFromName(fileName),
        name: fileName,
        language: primaryLanguage,
        value: runnableCode || starterForLanguage(primaryLanguage, lessonTitle),
      },
    ];
  }

  const files: PlaygroundFile[] = [
    { id: fileIdFromName("index.html"), name: "index.html", language: "html", value: "" },
    { id: fileIdFromName("style.css"), name: "style.css", language: "css", value: "" },
    { id: fileIdFromName("script.js"), name: "script.js", language: "javascript", value: "" },
  ];

  if (normalized.includes("css")) {
    files[0].value = `<main class="preview">\n  <h1>${lessonTitle.replace(/[<>]/g, "")}</h1>\n  <p>Edit style.css, then run the preview.</p>\n  <button>Example button</button>\n</main>`;
    files[1].value = runnableCode;
    return files;
  }

  if (
    normalized.includes("javascript") ||
    normalized === "js" ||
    normalized.includes("typescript")
  ) {
    files[0].value = `<main class="preview">\n  <h1>JavaScript output</h1>\n  <p>Use console.log(...) or update the DOM from script.js.</p>\n  <pre id="output"></pre>\n</main>`;
    files[2].value = normalized.includes("typescript")
      ? runnableCode.replace(/:\s*[A-Za-z][A-Za-z0-9_<>,\[\]| ]*/g, "")
      : runnableCode;
    return files;
  }

  const styleBlocks = Array.from(
    runnableCode.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi),
    (match) => match[1].trim(),
  ).filter(Boolean);
  const scriptBlocks = Array.from(
    runnableCode.matchAll(
      /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi,
    ),
    (match) => match[1].trim(),
  ).filter(Boolean);
  const htmlWithoutAssets = runnableCode
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, "");

  files[0].value = htmlWithoutAssets;
  files[1].value = styleBlocks.join("\n\n");
  files[2].value = scriptBlocks.join("\n\n");
  return files;
}

function createPlaygroundFilesFromSnapshots(
  snapshots: PracticeCodeFileSnapshot[],
): PlaygroundFile[] {
  return snapshots.map((file, index) => ({
    id: fileIdFromName(file.name, index),
    name: file.name,
    language: file.language || languageFromFileName(file.name),
    value: stripCodeFence(file.value),
  }));
}

function normalizeProgrammingLanguage(language: string) {
  const normalized = language.toLowerCase().trim();
  if (normalized.includes("javascript") || normalized === "js") return "javascript";
  if (normalized.includes("tsx") || normalized.includes("jsx") || normalized.includes("react")) return "tsx";
  if (normalized.includes("typescript") || normalized === "ts") return "typescript";
  if (normalized.includes("python") || normalized === "py") return "python";
  if (normalized.includes("html")) return "html";
  if (normalized.includes("css")) return "css";
  if (normalized.includes("sql")) return "sql";
  if (normalized.includes("java") && !normalized.includes("javascript")) return "java";
  if (normalized.includes("c++") || normalized.includes("cpp")) return "cpp";
  if (normalized === "c" || normalized.includes("clang")) return "c";
  if (normalized.includes("c#") || normalized.includes("csharp")) return "csharp";
  if (normalized.includes("go") || normalized.includes("golang")) return "go";
  if (normalized.includes("rust")) return "rust";
  if (normalized.includes("php")) return "php";
  if (normalized.includes("ruby")) return "ruby";
  if (normalized.includes("swift")) return "swift";
  if (normalized.includes("kotlin")) return "kotlin";
  if (normalized.includes("r ")) return "r";
  if (normalized.includes("markdown") || normalized === "md") return "markdown";
  if (normalized.includes("json")) return "json";
  if (normalized.includes("yaml") || normalized.includes("yml")) return "yaml";
  if (normalized.includes("shell") || normalized.includes("bash")) return "bash";
  return normalized || "text";
}

function isBrowserLanguage(language: string) {
  return language === "html" || language === "css" || language === "javascript";
}

function fileNameForLanguage(language: string) {
  const filenames: Record<string, string> = {
    bash: "script.sh",
    c: "main.c",
    cpp: "main.cpp",
    csharp: "Program.cs",
    go: "main.go",
    java: "Main.java",
    json: "data.json",
    kotlin: "Main.kt",
    markdown: "README.md",
    php: "index.php",
    python: "main.py",
    r: "analysis.R",
    ruby: "main.rb",
    rust: "main.rs",
    sql: "query.sql",
    swift: "main.swift",
    tsx: "App.tsx",
    text: "notes.txt",
    typescript: "main.ts",
    yaml: "config.yml",
  };
  return filenames[language] ?? "main.txt";
}

function starterForLanguage(language: string, lessonTitle: string) {
  const title = lessonTitle.replace(/[<>]/g, "");
  const starters: Record<string, string> = {
    bash: `#!/usr/bin/env bash\necho "${title}"`,
    c: `#include <stdio.h>\n\nint main(void) {\n  printf("${title}\\n");\n  return 0;\n}`,
    cpp: `#include <iostream>\n\nint main() {\n  std::cout << "${title}" << std::endl;\n  return 0;\n}`,
    csharp: `using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("${title}");\n  }\n}`,
    go: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("${title}")\n}`,
    java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("${title}");\n  }\n}`,
    json: `{\n  "title": "${title}",\n  "items": []\n}`,
    kotlin: `fun main() {\n  println("${title}")\n}`,
    markdown: `# ${title}\n\nWrite your notes or project documentation here.`,
    php: `<?php\necho "${title}";\n`,
    python: `print("${title}")`,
    r: `print("${title}")`,
    ruby: `puts "${title}"`,
    rust: `fn main() {\n    println!("${title}");\n}`,
    sql: `-- ${title}\nSELECT 'Start here' AS message;`,
    swift: `print("${title}")`,
    tsx: `type AppProps = {\n  title: string;\n};\n\nexport function App({ title }: AppProps) {\n  return <main>{title}</main>;\n}\n\nconsole.log("${title}");`,
    typescript: `const title: string = "${title}";\nconsole.log(title);`,
    yaml: `title: "${title}"\nitems: []`,
  };
  return starters[language] ?? `# ${title}\n`;
}

function languageFromFileName(name: string) {
  const extension = name.toLowerCase().split(".").pop() ?? "";
  const languages: Record<string, string> = {
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    css: "css",
    go: "go",
    htm: "html",
    html: "html",
    java: "java",
    js: "javascript",
    json: "json",
    kt: "kotlin",
    md: "markdown",
    php: "php",
    py: "python",
    r: "r",
    rb: "ruby",
    rs: "rust",
    sh: "bash",
    sql: "sql",
    swift: "swift",
    tsx: "tsx",
    ts: "typescript",
    txt: "text",
    yaml: "yaml",
    yml: "yaml",
  };
  return languages[extension] ?? "text";
}

function terminalCommandForFile(file?: PlaygroundFile) {
  if (!file) return "run your project";
  const name = file.name;
  const language = normalizeProgrammingLanguage(file.language || languageFromFileName(name));
  const commands: Record<string, string> = {
    bash: `bash ${name}`,
    c: `gcc ${name} -o main && ./main`,
    cpp: `g++ ${name} -o main && ./main`,
    csharp: `dotnet run`,
    go: `go run ${name}`,
    java: `javac ${name} && java ${name.replace(/\.java$/i, "")}`,
    kotlin: `kotlinc ${name} -include-runtime -d main.jar && java -jar main.jar`,
    markdown: `review ${name}`,
    php: `php ${name}`,
    python: `python ${name}`,
    r: `Rscript ${name}`,
    ruby: `ruby ${name}`,
    rust: `rustc ${name} && ./main`,
    sql: `sqlite3 database.db < ${name}`,
    swift: `swift ${name}`,
    tsx: `npm run typecheck # or npx tsc --noEmit`,
    typescript: `npx ts-node ${name}`,
  };
  return commands[language] ?? `run ${name}`;
}

function fileIdFromName(name: string, index = 0) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || `file-${index + 1}`;
}

function isHtmlFile(file: PlaygroundFile) {
  return file.language.toLowerCase().includes("html") || /\.html?$/i.test(file.name);
}

function isCssFile(file: PlaygroundFile) {
  return file.language.toLowerCase().includes("css") || /\.css$/i.test(file.name);
}

function isJavaScriptFile(file: PlaygroundFile) {
  const language = file.language.toLowerCase();
  return language.includes("javascript") || language === "js" || /\.m?js$/i.test(file.name);
}

function isDocumentationFile(file: PlaygroundFile) {
  const language = file.language.toLowerCase();
  return language.includes("markdown") || /\.md$/i.test(file.name);
}

function hasBrowserRunnableFiles(files: PlaygroundFile[]) {
  return files.some(isHtmlFile) || files.some(isCssFile) || files.some(isJavaScriptFile);
}

function buildPreviewFromFiles(files: PlaygroundFile[], activeFileId?: string) {
  const activeFile = files.find((file) => file.id === activeFileId);
  const htmlFile =
    activeFile && isHtmlFile(activeFile)
      ? activeFile
      : files.find((file) => file.name.toLowerCase() === "index.html") ??
        files.find(isHtmlFile);
  const htmlPages = Object.fromEntries(
    files
      .filter(isHtmlFile)
      .map((file) => [file.name, stripCodeFence(file.value)]),
  );
  const html = htmlFile?.value ?? "";
  const css = files
    .filter(isCssFile)
    .map((file) => file.value)
    .join("\n\n");
  const js = files
    .filter(isJavaScriptFile)
    .map((file) => file.value)
    .join("\n\n");
  return buildHtmlPreview(
    stripCodeFence(html),
    stripCodeFence(css),
    stripCodeFence(js),
    htmlPages,
  );
}

function buildHtmlPreview(
  code: string,
  css = "",
  js = "",
  htmlPages: Record<string, string> = {},
) {
  const previewStyle = `<style>${previewBaseStyles()}${css}</style>`;
  const bodyMatch = code.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : code;
  const bodyHasMarkup =
    bodyContent.replace(/<!--[\s\S]*?-->/g, "").trim().length > 0;
  if (!bodyHasMarkup && !js.trim()) {
    return `<!doctype html><html><head>${previewStyle}</head><body><main class="lumyn-empty-preview"><div><p>No visible output yet</p><h1>Your HTML body is empty.</h1><span>Add something between <code>&lt;body&gt;</code> and <code>&lt;/body&gt;</code>, like <code>&lt;h1&gt;Hello&lt;/h1&gt;</code>, then click Run code.</span></div></main></body></html>`;
  }

  const script = `${buildPreviewScript(js)}${buildPreviewNavigation(htmlPages, js)}`;
  if (/<html[\s>]/i.test(code)) {
    let preview = code;
    preview = /<\/head>/i.test(preview)
      ? preview.replace(/<\/head>/i, `${previewStyle}</head>`)
      : preview.replace(
          /<html\b[^>]*>/i,
          (match) => `${match}<head>${previewStyle}</head>`,
        );
    preview = /<\/body>/i.test(preview)
      ? preview.replace(/<\/body>/i, `${script}</body>`)
      : `${preview}${script}`;
    return preview;
  }

  return `<!doctype html><html><head>${previewStyle}</head><body>${code}${script}</body></html>`;
}

function buildPreviewScript(js: string) {
  if (!js.trim()) return "";
  const serialized = JSON.stringify(js).replace(/<\/script/gi, "<\\/script");
  return `<script>const lumynOutput=document.getElementById('output');const lumynWrite=(...args)=>{if(!lumynOutput)return;lumynOutput.textContent+=args.map(v=>typeof v==='object'?JSON.stringify(v,null,2):String(v)).join(' ')+'\\n';};const originalLog=console.log;const originalError=console.error;console.log=(...args)=>{originalLog(...args);lumynWrite(...args);};console.error=(...args)=>{originalError(...args);lumynWrite('Error:',...args);};try{(0,eval)(${serialized})}catch(error){lumynWrite('Error:',error.message)}if(lumynOutput&&!lumynOutput.textContent.trim())lumynOutput.textContent='Code ran. Use console.log(...) to print here, or update the page from script.js.';<\/script>`;
}

function buildPreviewNavigation(htmlPages: Record<string, string>, js: string) {
  const pageNames = Object.keys(htmlPages);
  if (pageNames.length < 2) return "";
  const serializedPages = JSON.stringify(htmlPages).replace(
    /<\/script/gi,
    "<\\/script",
  );
  const serializedJs = JSON.stringify(js).replace(/<\/script/gi, "<\\/script");
  return `<script>const lumynPages=${serializedPages};const lumynUserScript=${serializedJs};function lumynBodyFromPage(html){const parsed=new DOMParser().parseFromString(html,'text/html');return parsed.body?parsed.body.innerHTML:html;}function lumynRunUserScript(){if(!lumynUserScript.trim())return;try{(0,eval)(lumynUserScript)}catch(error){console.error(error)}}document.addEventListener('click',(event)=>{const link=event.target.closest&&event.target.closest('a[href]');if(!link)return;const rawHref=link.getAttribute('href')||'';const pageName=rawHref.split('#')[0].split('?')[0].split('/').pop();if(!pageName||!lumynPages[pageName])return;event.preventDefault();document.body.innerHTML=lumynBodyFromPage(lumynPages[pageName]);lumynRunUserScript();});<\/script>`;
}

function previewBaseStyles() {
  return `
    *{box-sizing:border-box}
    html{scrollbar-color:rgba(124,108,246,.55) rgba(15,23,42,.08);scrollbar-width:thin}
    body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a}
    ::-webkit-scrollbar{width:9px;height:9px}
    ::-webkit-scrollbar-track{background:rgba(15,23,42,.08)}
    ::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:999px;background:rgba(124,108,246,.6);background-clip:content-box}
    ::-webkit-scrollbar-thumb:hover{background:rgba(124,108,246,.78);background-clip:content-box}
    #output{white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:12px;min-height:96px;padding:14px;background:#f8fafc;color:#0f172a}
    .lumyn-empty-preview{display:grid;min-height:248px;place-items:center;padding:24px;text-align:center}
    .lumyn-empty-preview div{max-width:380px}
    .lumyn-empty-preview p{margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#7c6cf6}
    .lumyn-empty-preview h1{margin:0;font-size:22px}
    .lumyn-empty-preview span{display:block;margin:12px 0 0;line-height:1.6;color:#64748b}
  `;
}

function stripCodeFence(code: string) {
  const trimmed = code.trim();
  const fenced = trimmed.match(/^```[\w-]*\s*([\s\S]*?)\s*```$/);
  return fenced ? fenced[1] : code;
}
