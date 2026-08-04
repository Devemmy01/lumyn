import type { GeneratedLesson, YouTubeLessonVideo } from "@/lib/academy";

const GENERIC_TERMS = new Set([
  "and",
  "basic",
  "basics",
  "beginner",
  "build",
  "course",
  "explained",
  "for",
  "from",
  "full",
  "how",
  "introduction",
  "learn",
  "lesson",
  "program",
  "programming",
  "the",
  "tutorial",
  "using",
  "video",
  "with",
]);

const BROAD_TOPIC_TERMS = new Set([
  "code",
  "css",
  "data",
  "html",
  "javascript",
  "network",
  "python",
  "react",
  "security",
  "system",
  "web",
]);

function words(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9+#.]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !GENERIC_TERMS.has(word))
      .map((word) =>
        word.length > 4 && word.endsWith("s") ? word.slice(0, -1) : word,
      ),
  );
}

export function youtubeDurationSeconds(duration?: string) {
  if (!duration) return 0;
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;
  return (
    Number(match[1] ?? 0) * 3600 +
    Number(match[2] ?? 0) * 60 +
    Number(match[3] ?? 0)
  );
}

export function isRelevantLessonVideo(
  video: YouTubeLessonVideo,
  lesson: Pick<
    GeneratedLesson,
    "title" | "goal" | "videoSearchQuery" | "videoLearningGoal"
  >,
) {
  const seconds = youtubeDurationSeconds(video.duration);
  if (seconds < 4 * 60 || seconds > 90 * 60) return false;
  if (/\b(shorts?|reel|tiktok)\b/i.test(video.title)) return false;

  const lessonTerms = words(
    [
      lesson.title,
      lesson.goal,
      lesson.videoSearchQuery,
      lesson.videoLearningGoal,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const videoTerms = words(video.title);
  const overlap = [...lessonTerms].filter((term) => videoTerms.has(term));

  return (
    lessonTerms.size > 0 &&
    (overlap.length >= Math.min(2, lessonTerms.size) ||
      overlap.some((term) => !BROAD_TOPIC_TERMS.has(term)))
  );
}
