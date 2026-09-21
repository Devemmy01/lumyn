"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { AD_PLACEMENTS, adsGloballyEnabled, type AdPlacement } from "@/lib/ads/config";
import { buildAdTagHtml } from "@/lib/ads/networks";
import { useAdsAllowed } from "@/lib/ads/no-ads-zone";

/**
 * One slot, one placement. Renders nothing at all — not even reserved space
 * — when ads are globally killed, this placement is disabled, or we're
 * inside a <NoAdsZone> (the whole /guides store). Otherwise it reserves its
 * final width/height immediately (no layout shift), lazy-loads via
 * IntersectionObserver, and writes the network's tag into a sandboxed
 * iframe rather than the page — sandbox="allow-scripts" grants script
 * execution only: no allow-popups (blocks popunders structurally), no
 * allow-same-origin (the ad can't read our DOM or cookies), no top-level
 * navigation. A network tag that can't load — or isn't configured yet —
 * just leaves the empty reserved box, never a broken page.
 */
export default function AdSlot({ placement }: { placement: AdPlacement }) {
  const adsAllowed = useAdsAllowed();
  const config = AD_PLACEMENTS[placement];
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [tagHtml, setTagHtml] = useState<string | null>(null);

  const active = adsAllowed && adsGloballyEnabled() && Boolean(config?.enabled);

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
    const html = buildAdTagHtml(placement, config);
    setTagHtml(html);
    if (html) {
      track("ad_slot_render", { placement, network: config.network });
    }
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
      {tagHtml && (
        <iframe
          title="Advertisement"
          sandbox="allow-scripts"
          width={config.width}
          height={config.height}
          style={{ border: "none", display: "block", width: "100%", height: "100%" }}
          srcDoc={tagHtml}
        />
      )}
    </div>
  );
}
