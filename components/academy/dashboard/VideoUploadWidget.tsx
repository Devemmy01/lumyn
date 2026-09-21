"use client";

import { useEffect, useRef, useState } from "react";
import * as tus from "tus-js-client";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type VideoStatus = "not_uploaded" | "uploading" | "processing" | "ready" | "failed";

export function VideoUploadWidget({
  courseId,
  moduleIndex,
  lessonIndex,
  status,
  getToken,
  onBeforeUpload,
  onStatusChange,
}: {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  status: VideoStatus;
  getToken: () => Promise<string | null>;
  /** Persists the current module/lesson structure — the lesson must exist in the database before Bunny can be told about it. */
  onBeforeUpload: () => Promise<boolean>;
  onStatusChange: (status: VideoStatus) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
    };
  }, []);

  async function pollStatus(attempt = 0) {
    const token = await getToken();
    if (!token) return;
    try {
      const response = await fetch(
        `/api/marketplace/creator/courses/${courseId}/lessons/${moduleIndex}/${lessonIndex}/video-status`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not check video status.");

      onStatusChange(payload.videoStatus);
      if (payload.videoStatus === "ready" || payload.videoStatus === "failed") {
        setBusy(false);
        return;
      }
      if (attempt < 60) {
        pollTimer.current = window.setTimeout(() => void pollStatus(attempt + 1), 5000);
      } else {
        setBusy(false);
        setError("This is taking longer than expected. Refresh in a bit to check progress.");
      }
    } catch (pollError) {
      setBusy(false);
      setError(pollError instanceof Error ? pollError.message : "Could not check video status.");
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    setProgress(0);
    onStatusChange("uploading");

    try {
      const saved = await onBeforeUpload();
      if (!saved) throw new Error("Could not save your changes before uploading. Try again.");

      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const tokenResponse = await fetch(
        `/api/marketplace/creator/courses/${courseId}/lessons/${moduleIndex}/${lessonIndex}/video-upload-token`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      const credentials = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(credentials.error ?? "Could not start the upload.");

      const upload = new tus.Upload(file, {
        endpoint: credentials.endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          AuthorizationSignature: credentials.authorizationSignature,
          AuthorizationExpire: String(credentials.authorizationExpire),
          VideoId: credentials.videoGuid,
          LibraryId: credentials.libraryId,
        },
        metadata: {
          filetype: file.type,
          title: file.name,
        },
        onError: (uploadError) => {
          setBusy(false);
          setError(uploadError.message || "The upload failed.");
          onStatusChange("failed");
        },
        onProgress: (bytesSent, bytesTotal) => {
          setProgress(Math.round((bytesSent / bytesTotal) * 100));
        },
        onSuccess: () => {
          onStatusChange("processing");
          void pollStatus();
        },
      });

      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
      upload.start();
    } catch (uploadError) {
      setBusy(false);
      setError(uploadError instanceof Error ? uploadError.message : "Could not start the upload.");
      onStatusChange("failed");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isUploading = busy && progress < 100;
  const isProcessing = busy && progress >= 100;

  return (
    <div className="min-w-[180px] space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        disabled={busy}
        onChange={(event) => void handleFileSelect(event)}
        className="hidden"
        id={`video-upload-${moduleIndex}-${lessonIndex}`}
      />

      {isUploading || isProcessing ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6c5ce7] dark:text-[#b9b1ff]">
            <LoadingSpinner />
            {isProcessing ? "Processing…" : `Uploading ${progress}%`}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-400/15">
            <div
              className={`h-full rounded-full bg-[#7c6cf6] transition-[width] duration-300 ease-out ${isProcessing ? "animate-pulse" : ""}`}
              style={{ width: `${isProcessing ? 100 : progress}%` }}
            />
          </div>
        </div>
      ) : (
        <label
          htmlFor={`video-upload-${moduleIndex}-${lessonIndex}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#7c6cf6]/30 bg-[#7c6cf6]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6c5ce7] transition hover:bg-[#7c6cf6]/20 dark:text-[#b9b1ff]"
        >
          {status === "ready" ? "Replace video" : "Upload video"}
        </label>
      )}
      {error && <p className="text-xs text-red-500 dark:text-red-300">{error}</p>}
    </div>
  );
}
