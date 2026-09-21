import { createHash } from "crypto";

const BUNNY_API_URL = "https://video.bunnycdn.com";
export const BUNNY_TUS_ENDPOINT = "https://video.bunnycdn.com/tusupload";

export function isBunnyStreamConfigured() {
  return Boolean(process.env.BUNNY_STREAM_LIBRARY_ID && process.env.BUNNY_STREAM_API_KEY);
}

function libraryId() {
  const id = process.env.BUNNY_STREAM_LIBRARY_ID;
  if (!id) throw new Error("Video uploads are temporarily unavailable.");
  return id;
}

function apiKey() {
  const key = process.env.BUNNY_STREAM_API_KEY;
  if (!key) throw new Error("Video uploads are temporarily unavailable.");
  return key;
}

function tokenAuthKey() {
  const key = process.env.BUNNY_STREAM_TOKEN_AUTH_KEY;
  if (!key) throw new Error("Video playback is temporarily unavailable.");
  return key;
}

export function playbackTtlSeconds() {
  const configured = Number(process.env.BUNNY_STREAM_SIGNED_URL_TTL_SECONDS ?? 21600);
  return Number.isInteger(configured) && configured > 0 ? configured : 21600;
}

async function bunnyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BUNNY_API_URL}${path}`, {
    ...init,
    headers: {
      AccessKey: apiKey(),
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Bunny Stream request failed (${response.status}): ${body || response.statusText}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function createBunnyVideo({ title }: { title: string }) {
  const data = await bunnyRequest<{ guid: string }>(`/library/${libraryId()}/videos`, {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  return data.guid;
}

export async function deleteBunnyVideo(videoGuid: string) {
  await bunnyRequest(`/library/${libraryId()}/videos/${videoGuid}`, { method: "DELETE" });
}

export function createTusUploadCredentials({
  videoGuid,
  expirySeconds = 3600 * 6,
}: {
  videoGuid: string;
  expirySeconds?: number;
}) {
  const lib = libraryId();
  const key = apiKey();
  const authorizationExpire = Math.floor(Date.now() / 1000) + Math.max(expirySeconds, 3600);
  const authorizationSignature = createHash("sha256")
    .update(`${lib}${key}${authorizationExpire}${videoGuid}`)
    .digest("hex");

  return {
    endpoint: BUNNY_TUS_ENDPOINT,
    libraryId: lib,
    videoGuid,
    authorizationSignature,
    authorizationExpire,
  };
}

const STATUS_MAP: Record<number, "uploading" | "processing" | "ready" | "failed"> = {
  0: "uploading",
  1: "processing",
  2: "processing",
  3: "processing",
  4: "ready",
  5: "failed",
  6: "failed",
  7: "processing",
  8: "ready",
};

export async function getBunnyVideoStatus(videoGuid: string) {
  const data = await bunnyRequest<{ status: number; encodeProgress: number; length?: number }>(
    `/library/${libraryId()}/videos/${videoGuid}`,
  );
  return {
    videoStatus: STATUS_MAP[data.status] ?? "processing",
    encodeProgress: data.encodeProgress,
    durationSeconds: data.length,
  };
}

export function generateEmbedPlaybackUrl({
  videoGuid,
  ttlSeconds = playbackTtlSeconds(),
}: {
  videoGuid: string;
  ttlSeconds?: number;
}) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const token = createHash("sha256")
    .update(`${tokenAuthKey()}${videoGuid}${expires}`)
    .digest("hex");
  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId()}/${videoGuid}?token=${token}&expires=${expires}`;
  return { embedUrl, expires };
}
