"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

/** Renders the real cover image the moment one exists at the given path —
 * drop a file into /public/covers/<slug>.jpg and it just works, no code
 * change. Until then, falls back to a typographic cover so the store never
 * looks broken while real artwork is pending.
 *
 * A same-origin 404 resolves fast enough that the browser can flag the
 * image as failed before React finishes hydrating and attaches onError —
 * that error event fires into nothing and the fallback never shows. The
 * effect below checks img.complete/naturalWidth on mount to catch that
 * already-failed case in addition to the onError handler. */
export default function GuideCover({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div
        className={clsx(
          "flex aspect-[3/4] w-full flex-col justify-between rounded-2xl p-6",
          className,
        )}
        style={{
          background: "linear-gradient(145deg, #7c6cf6 0%, #5e4ee0 100%)",
        }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          Lumyn Field Guide
        </span>
        <span className="text-xl font-semibold leading-tight text-white">{title}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={`${title} cover`}
      className={clsx("aspect-[3/4] w-full rounded-2xl object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
