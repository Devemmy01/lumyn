export type AdNetwork = "adsterra";

export interface AdPlacementConfig {
  network: AdNetwork;
  slotId: string;
  width: number;
  height: number;
  enabled: boolean;
}

/**
 * One entry per placement. Adding a fourth placement is a new key here plus
 * wherever <AdSlot placement="..." /> is rendered — never a change to AdSlot
 * itself. Slot IDs come from env vars (account-specific, set per network
 * dashboard) so no real account identifiers live in source. The tag
 * template for each placement is looked up separately, in
 * lib/ads/networks.ts, keyed by placement rather than by network — a single
 * network can serve incompatible tag shapes for different ad formats (e.g.
 * Adsterra's Banner vs Native Banner units), so the template has to be
 * per-placement, not per-network.
 *
 * Monetag isn't used: their only verification path installs a service
 * worker at the site root for their push-notification ad format, which is
 * exactly the format this project's ad rules exclude, and a root service
 * worker can't be contained by the sandboxed-iframe architecture every
 * other placement relies on. Adsterra only, for now.
 */
export const AD_PLACEMENTS: Record<string, AdPlacementConfig> = {
  "journal-inline": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_SLOT_ID ?? "",
    // Native Banner is fluid-width in reality (it adapts to content width) —
    // this is a reserved-space estimate for a single-row native strip, not
    // an exact Adsterra spec. Adjust once you see the real rendered size.
    width: 640,
    height: 120,
    enabled: process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_ENABLED !== "false",
  },
  "journal-inline-2": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_2_SLOT_ID ?? "",
    // Adsterra caps Native Banner at one unit per registered site, so this
    // second in-article slot uses a Banner unit instead — 468x60, the
    // smallest fixed size still available once 300x250/728x90 were used.
    width: 468,
    height: 60,
    enabled: process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_2_ENABLED !== "false",
  },
  "journal-index-sidebar": {
    network: "adsterra",
    // 160x600 skyscraper — a natural fit for the sticky sidebar's width,
    // unlike centering a tall unit under a list of articles.
    slotId: process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_SIDEBAR_SLOT_ID ?? "",
    width: 160,
    height: 600,
    enabled: process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_SIDEBAR_ENABLED !== "false",
  },
  "journal-index-bottom": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_BOTTOM_SLOT_ID ?? "",
    width: 728,
    height: 90,
    enabled: process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_BOTTOM_ENABLED !== "false",
  },
  "tool-below-result": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_SLOT_ID ?? "",
    // 300x250 ("medium rectangle") — one of Adsterra's fixed banner sizes;
    // the original 336x280 pick isn't an offered size.
    width: 300,
    height: 250,
    enabled: process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_ENABLED !== "false",
  },
  "tool-below-result-2": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_2_SLOT_ID ?? "",
    width: 160,
    height: 300,
    enabled: process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_2_ENABLED !== "false",
  },
  "tools-index": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_SLOT_ID ?? "",
    width: 728,
    height: 90,
    enabled: process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_ENABLED !== "false",
  },
  "tools-index-top": {
    network: "adsterra",
    slotId: process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_TOP_SLOT_ID ?? "",
    width: 320,
    height: 50,
    enabled: process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_TOP_ENABLED !== "false",
  },
};

export type AdPlacement = keyof typeof AD_PLACEMENTS;

/** Global kill switch — one env var turns every ad slot off in one deploy,
 * regardless of individual placement flags. */
export function adsGloballyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";
}
