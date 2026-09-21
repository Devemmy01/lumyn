"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { AD_PLACEMENTS, adsGloballyEnabled, type AdPlacement } from "@/lib/ads/config";
import { useAdsAllowed } from "@/lib/ads/no-ads-zone";

const ADS_ORIGIN = process.env.NEXT_PUBLIC_ADS_ORIGIN;

/**
 * One slot, one placement. Renders nothing at all — not even reserved space
 * — when ads are globally killed, this placement is disabled, we're inside a
 * <NoAdsZone> (the whole /guides store), or NEXT_PUBLIC_ADS_ORIGIN isn't
 * configured yet. Otherwise it reserves its final width/height immediately
 * (no layout shift), lazy-loads via IntersectionObserver, and points a
 * sandboxed iframe at /ad-frame/[placement] served from a dedicated
 * subdomain (NEXT_PUBLIC_ADS_ORIGIN) rather than this site's own origin.
 *
 * sandbox="allow-scripts allow-same-origin" together are normally a sandbox
 * escape when the framed document shares the parent's origin — here it's
 * safe specifically because the frame's `src` resolves to a genuinely
 * different registrable origin (the ads subdomain has no cookies of its own
 * and shares none with the main site, since cookies aren't Domain-scoped
 * wildcarded). allow-same-origin is required at all: an opaque-origin frame
 * (the old srcDoc approach) can never send a Referer header, and Adsterra's
 * ad server silently no-fills any request with no Referer — confirmed
 * directly against production. No allow-popups (blocks popunders
 * structurally) and no top-level navigation either way.
 */
export default function AdSlot({ placement }: { placement: AdPlacement }) {
  const adsAllowed = useAdsAllowed();
  const config = AD_PLACEMENTS[placement];
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);

  const active =
    adsAllowed && adsGloballyEnabled() && Boolean(config?.enabled) && Boolean(config?.slotId) && Boolean(ADS_ORIGIN);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const node = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!shouldLoad || !active) return;
    // The ad-frame document is its own page and can't see our CSS variables
    // — resolve the current theme's background once, here, and pass it
    // through so a blank/no-fill ad doesn't flash white in dark mode.
    const resolvedBg = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg-secondary")
      .trim() || "#ffffff";
    const src = `${ADS_ORIGIN}/ad-frame/${placement}?bg=${encodeURIComponent(resolvedBg)}`;
    setFrameSrc(src);
    track("ad_slot_render", { placement, network: config.network });
  }, [shouldLoad, active, config, placement]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="mx-auto overflow-hidden rounded-xl"
      style={{
        width: config.width,
        maxWidth: "100%",
        height: config.height,
        backgroundColor: "var(--bg-secondary)",
      }}
      data-ad-placement={placement}
    >
      {frameSrc && (
        <iframe
          title="Advertisement"
          sandbox="allow-scripts allow-same-origin"
          width={config.width}
          height={config.height}
          style={{ border: "none", display: "block", width: "100%", height: "100%" }}
          src={frameSrc}
        />
      )}
    </div>
  );
}
