"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { WatermarkOverlay } from "@/components/academy/dashboard/WatermarkOverlay";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

export function LessonVideoPlayer({
  courseId,
  moduleIndex,
  lessonIndex,
}: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
}) {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const [user, setUser] = useState<User | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadPlayback() {
      try {
        const token = await user!.getIdToken();
        const response = await fetch(`/api/marketplace/lessons/${courseId}/${moduleIndex}/${lessonIndex}/playback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Could not load this video.");
        if (cancelled) return;
        setEmbedUrl(payload.embedUrl);
        setWatermarkText(payload.watermarkText ?? "");
        setError(null);

        const expiresInMs = payload.expires * 1000 - Date.now();
        const refreshInMs = Math.max(expiresInMs - 60_000, 30_000);
        refreshTimer.current = window.setTimeout(loadPlayback, refreshInMs);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Could not load this video.");
      }
    }

    void loadPlayback();
    return () => {
      cancelled = true;
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, [user, courseId, moduleIndex, lessonIndex]);

  if (error) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-sm text-red-500 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center gap-3 rounded-2xl border border-black/[0.08] bg-black/[0.02] text-sm text-neutral-500 dark:border-white/[0.08] dark:bg-white/[0.03]">
        <LoadingSpinner /> Loading video…
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/[0.08] bg-black dark:border-white/[0.08]">
      <iframe
        src={embedUrl}
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
      {watermarkText && <WatermarkOverlay text={watermarkText} />}
    </div>
  );
}
