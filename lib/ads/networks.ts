import type { AdPlacementConfig } from "@/lib/ads/config";

/**
 * The exact script markup for an ad unit is account- and format-specific,
 * copied from the network's dashboard — it isn't something to hardcode
 * here. Keyed by placement, not by network: a single network can serve
 * incompatible tag shapes for different formats on the same account (e.g.
 * Adsterra's Banner units use an `atOptions` + invoke.js pattern, while its
 * Native Banner units use a plain script + target <div>, on a different
 * script domain entirely) — a per-network template can't represent both.
 * Each template has {{slotId}}, {{width}}, {{height}} placeholders
 * substituted per placement. Not secrets — this is public HTML meant to be
 * embedded in a page — so these are plain NEXT_PUBLIC_ vars.
 */
const TAG_TEMPLATES: Record<string, string | undefined> = {
  "journal-inline": process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_TAG_TEMPLATE,
  "journal-inline-2": process.env.NEXT_PUBLIC_AD_JOURNAL_INLINE_2_TAG_TEMPLATE,
  "journal-index-sidebar": process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_SIDEBAR_TAG_TEMPLATE,
  "journal-index-bottom": process.env.NEXT_PUBLIC_AD_JOURNAL_INDEX_BOTTOM_TAG_TEMPLATE,
  "tool-below-result": process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_TAG_TEMPLATE,
  "tool-below-result-2": process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_2_TAG_TEMPLATE,
  "tools-index": process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_TAG_TEMPLATE,
  "tools-index-top": process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_TOP_TAG_TEMPLATE,
};

/**
 * Exact (no-wildcard) origins to allowlist for ad script execution — one
 * shared list across every placement's sandboxed iframe (different
 * placements may load from different script domains, e.g. Adsterra's
 * Banner vs Native Banner units; this list just needs to contain all of
 * them). Read from an env var rather than hardcoded, since the real script
 * host is account- and format-specific and only visible in the exact
 * snippet each network's dashboard gives you.
 */
export function adNetworkScriptOrigins(): string[] {
  const raw = process.env.NEXT_PUBLIC_AD_SCRIPT_ORIGINS ?? "";
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Returns the HTML to write into the sandboxed iframe's document, or null
 * if this placement's template isn't configured yet — the caller should
 * fall back to an empty reserved box, not a broken page.
 *
 * The iframe already can't touch our origin (sandbox="allow-scripts" grants
 * no allow-same-origin), but it's given its own scoped CSP on top of that:
 * script-src is limited to the exact allowlisted ad origins, so even a
 * compromised or misbehaving ad tag can't pull in a script from anywhere
 * else. 'unsafe-inline' is required here because these tags are inline
 * <script> blocks (e.g. Adsterra's atOptions config pattern) — that's safe
 * to allow only because it's scoped to this one sandboxed, isolated
 * document, not the real page's CSP. */
export function buildAdTagHtml(
  placement: string,
  config: AdPlacementConfig,
  backgroundColor = "#ffffff",
): string | null {
  const template = TAG_TEMPLATES[placement];
  if (!template || !config.slotId) return null;

  const tag = template
    .replaceAll("{{slotId}}", config.slotId)
    .replaceAll("{{width}}", String(config.width))
    .replaceAll("{{height}}", String(config.height));

  const origins = adNetworkScriptOrigins();
  // 'unsafe-eval' too — the ad chain calls eval()/new Function() somewhere
  // in its rendering path (confirmed by a page error captured directly
  // against the real ad script). script-src is still what actually bounds
  // this: only code that already loaded from one of these exact 2 trusted
  // origins can run at all, so letting that same already-trusted code use
  // eval isn't a new attack surface beyond the trust this already grants
  // it via 'unsafe-inline' — it's just another way code from those same
  // origins can run more code, not a path for anything untrusted to run.
  const scriptSrc = origins.length > 0 ? `'unsafe-inline' 'unsafe-eval' ${origins.join(" ")}` : "'none'";

  // The invoke.js script itself routes creative through ad-tech redirect
  // chains on domains that rotate per-request and can't be predicted or
  // allowlisted (confirmed by pulling the real script: it references
  // entirely different, unrelated-looking domains, not subdomains of the
  // network's own domain) — a static allowlist for img-src/frame-src is
  // fundamentally incompatible with how programmatic ad delivery works,
  // and produced a live, visible broken-image icon where a real ad should
  // render. Left open for images/frames/fetch (connect-src — the creative
  // pipeline turned out to depend on its own fetch()/XHR calls completing,
  // e.g. impression pixels and a secondary script fetch, before it renders
  // anything visible; blocked via CSP with no visible failure other than
  // the ad staying blank, confirmed directly by capturing the browser
  // console's CSP violation messages against the real ad chain).
  // script-src stays the actual security boundary, locked to the exact
  // hosts from each ad tag — a compromised or malicious creative can still
  // only ever fetch or display data from anywhere, never execute a script
  // from anywhere but those.
  const imgSrc = "* data:";
  const frameSrc = "*";
  const connectSrc = "*";

  // The iframe is its own isolated document — it doesn't inherit our theme's
  // CSS variables, so a blank/no-fill ad response defaults to the browser's
  // white canvas regardless of dark mode. Baking the resolved --bg-secondary
  // value in as the body background keeps an empty slot visually quiet
  // instead of flashing white.
  // Ad creative doesn't always land at exactly the reserved width/height —
  // a few px of overflow from the network's own markup is common, and
  // without an explicit overflow rule the browser's default is to show
  // scrollbars rather than clip it, which is what showed up live (visible
  // scrollbars around an otherwise-empty ad box). html/body are pinned to
  // the exact placement size and clipped, so any oversized creative just
  // gets cropped instead of growing scrollbars.
  const style = `html,body{margin:0;padding:0;width:${config.width}px;height:${config.height}px;overflow:hidden;background-color:${backgroundColor};}`;

  return `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; script-src ${scriptSrc}; img-src ${imgSrc}; connect-src ${connectSrc}; style-src 'unsafe-inline'; frame-src ${frameSrc};"><style>${style}</style></head><body>${tag}</body></html>`;
}
