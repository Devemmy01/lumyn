import { createHash } from "crypto";
import type { GeneratedCourse, GeneratedLesson, YouTubeLessonVideo } from "@/lib/academy";
import AcademyVideoCache from "@/models/AcademyVideoCache";

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const DEFAULT_CACHE_DAYS = 30;
const MAX_SEARCH_RESULTS = 5;

type YouTubeSearchItem = {
  id?: { videoId?: string };
};

type YouTubeVideoItem = {
  id: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
      high?: { url?: string };
      standard?: { url?: string };
      maxres?: { url?: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
  };
  status?: {
    embeddable?: boolean;
    privacyStatus?: string;
  };
};

type SearchPayload = {
  items?: YouTubeSearchItem[];
};

type VideosPayload = {
  items?: YouTubeVideoItem[];
};

type CandidateRequest = {
  key: string;
  query: string;
  lesson: GeneratedLesson;
};

function youtubeApiKey() {
  return process.env.YOUTUBE_API_KEY?.trim();
}

function cacheTtlDays() {
  const configured = Number(process.env.YOUTUBE_CACHE_TTL_DAYS ?? DEFAULT_CACHE_DAYS);
  if (!Number.isFinite(configured) || configured <= 0) return DEFAULT_CACHE_DAYS;
  return Math.min(Math.floor(configured), 365);
}

function expiresAt() {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + cacheTtlDays());
  return expiry;
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 260);
}

function cacheKey(query: string) {
  return createHash("sha256").update(normalizeQuery(query)).digest("hex");
}

function buildLessonQuery(course: GeneratedCourse, moduleTitle: string, lesson: GeneratedLesson) {
  return [
    lesson.videoSearchQuery,
    course.courseTitle,
    moduleTitle,
    lesson.title,
    "tutorial",
    "explained",
  ]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ");
}

function durationLabel(duration?: string) {
  if (!duration) return undefined;
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  if (seconds) return `${seconds}s`;
  return undefined;
}

function durationSeconds(duration?: string) {
  if (!duration) return 0;
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return 0;
  return (Number(match[1] ?? 0) * 3600) + (Number(match[2] ?? 0) * 60) + Number(match[3] ?? 0);
}

function thumbnailUrl(item: YouTubeVideoItem) {
  const thumbnails = item.snippet?.thumbnails;
  return thumbnails?.maxres?.url ??
    thumbnails?.standard?.url ??
    thumbnails?.high?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
}

function toLessonVideo(item: YouTubeVideoItem): YouTubeLessonVideo | null {
  const title = item.snippet?.title?.trim();
  const channelTitle = item.snippet?.channelTitle?.trim();
  if (!item.id || !title || !channelTitle) return null;
  if (item.status?.privacyStatus && item.status.privacyStatus !== "public") return null;
  if (item.status?.embeddable === false) return null;

  const viewCount = Number(item.statistics?.viewCount);
  const duration = item.contentDetails?.duration;

  return {
    videoId: item.id,
    title,
    channelTitle,
    thumbnailUrl: thumbnailUrl(item),
    watchUrl: `https://www.youtube.com/watch?v=${item.id}`,
    embedUrl: `https://www.youtube.com/embed/${item.id}`,
    duration,
    durationLabel: durationLabel(duration),
    publishedAt: item.snippet?.publishedAt,
    viewCount: Number.isFinite(viewCount) ? viewCount : undefined,
  };
}

function channelScore(video: YouTubeLessonVideo, lesson: GeneratedLesson) {
  const preferredChannels = lesson.recommendedChannels ?? [];
  const channel = video.channelTitle.toLowerCase();
  if (preferredChannels.some((preferred) => channel.includes(preferred.toLowerCase()))) return 4;
  if (/freecodecamp|traversy|net ninja|web dev simplified|fireship|crashcourse|simplilearn|ibm|networkchuck/i.test(video.channelTitle)) {
    return 2;
  }
  return 0;
}

function pickBestVideo(candidates: YouTubeLessonVideo[], lesson: GeneratedLesson) {
  return [...candidates]
    .filter((video) => {
      const seconds = durationSeconds(video.duration);
      return seconds === 0 || (seconds >= 180 && seconds <= 7200);
    })
    .sort((first, second) => {
      const channelDelta = channelScore(second, lesson) - channelScore(first, lesson);
      if (channelDelta !== 0) return channelDelta;
      const durationDelta =
        Number(durationSeconds(second.duration) >= 480 && durationSeconds(second.duration) <= 3600) -
        Number(durationSeconds(first.duration) >= 480 && durationSeconds(first.duration) <= 3600);
      if (durationDelta !== 0) return durationDelta;
      return (second.viewCount ?? 0) - (first.viewCount ?? 0);
    })[0] ?? candidates[0];
}

async function youtubeJson<T>(url: string) {
  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`YouTube API request failed: ${response.status} ${message.slice(0, 160)}`);
  }
  return response.json() as Promise<T>;
}

async function searchVideoIds(query: string, apiKey: string) {
  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(MAX_SEARCH_RESULTS),
    videoEmbeddable: "true",
    safeSearch: "moderate",
    relevanceLanguage: "en",
    fields: "items(id/videoId)",
  });
  const payload = await youtubeJson<SearchPayload>(`${YOUTUBE_SEARCH_URL}?${params.toString()}`);
  return (payload.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));
}

async function getVideoDetails(videoIds: string[], apiKey: string) {
  if (!videoIds.length) return [];
  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet,contentDetails,statistics,status",
    id: [...new Set(videoIds)].join(","),
    fields: "items(id,snippet(title,channelTitle,publishedAt,thumbnails),contentDetails/duration,statistics/viewCount,status(embeddable,privacyStatus))",
  });
  const payload = await youtubeJson<VideosPayload>(`${YOUTUBE_VIDEOS_URL}?${params.toString()}`);
  return (payload.items ?? []).map(toLessonVideo).filter((video): video is YouTubeLessonVideo => Boolean(video));
}

export async function attachYouTubeVideos(course: GeneratedCourse) {
  const apiKey = youtubeApiKey();
  if (!apiKey) return course;

  const requests: CandidateRequest[] = [];
  for (const learningModule of course.modules) {
    for (const lesson of learningModule.lessons) {
      const query = buildLessonQuery(course, learningModule.title, lesson);
      if (!query.trim()) continue;
      requests.push({ key: cacheKey(query), query, lesson });
    }
  }

  if (!requests.length) return course;

  const cached = await AcademyVideoCache.find({
    normalizedQuery: { $in: requests.map((request) => request.key) },
    expiresAt: { $gt: new Date() },
  }).lean();
  const cachedByKey = new Map(cached.map((item) => [item.normalizedQuery, item.selectedVideo]));
  const misses = requests.filter((request) => !cachedByKey.get(request.key));

  const candidatesByKey = new Map<string, YouTubeLessonVideo[]>();
  if (misses.length) {
    const searchResults = await Promise.allSettled(
      misses.map(async (request) => ({
        request,
        videoIds: await searchVideoIds(request.query, apiKey),
      })),
    );
    const videoIds = searchResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value.videoIds : [],
    );
    const details = await getVideoDetails(videoIds, apiKey);
    const detailsById = new Map(details.map((video) => [video.videoId, video]));

    for (const result of searchResults) {
      if (result.status !== "fulfilled") continue;
      const candidates = result.value.videoIds
        .map((videoId) => detailsById.get(videoId))
        .filter((video): video is YouTubeLessonVideo => Boolean(video));
      candidatesByKey.set(result.value.request.key, candidates);
      const selectedVideo = pickBestVideo(candidates, result.value.request.lesson);
      if (selectedVideo) cachedByKey.set(result.value.request.key, selectedVideo);
      await AcademyVideoCache.findOneAndUpdate(
        { normalizedQuery: result.value.request.key },
        {
          query: result.value.request.query,
          normalizedQuery: result.value.request.key,
          selectedVideo,
          candidates,
          source: "youtube",
          expiresAt: expiresAt(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
  }

  for (const request of requests) {
    const selectedVideo = cachedByKey.get(request.key) ?? pickBestVideo(candidatesByKey.get(request.key) ?? [], request.lesson);
    if (selectedVideo) {
      request.lesson.youtubeVideo = selectedVideo;
    }
  }

  return course;
}
