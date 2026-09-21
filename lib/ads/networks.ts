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

/** The ad creative (images) an invoke.js script pulls in commonly comes
 * from a different subdomain of the same ad-network domain than the script
 * itself was loaded from (e.g. a CDN subdomain, not www.<network>.com) —
 * a real ad rendered as a visible browser broken-image icon on the live
 * site traced back to exactly this: img-src only allowlisted the exact
 * script host, so the creative's actual <img> request got silently
 * dropped by CSP with no console-visible network failure (blocked
 * subresource requests inside a sandboxed CSP'd document don't always
 * surface as a request Playwright/devtools can see either — it just never
 * fires). Wildcarding one subdomain level for images only (never for
 * script-src, which stays exact) keeps script execution locked to the
 * literal hosts from each ad tag while giving creative assets realistic
 * room to load. */
function wildcardSubdomains(origins: string[]): string[] {
  const wildcards = origins.flatMap((origin) => {
    try {
      const url = new URL(origin);
      const parts = url.hostname.split(".");
      const baseDomain = parts.length > 2 ? parts.slice(-2).join(".") : url.hostname;
      return [`${url.protocol}//${baseDomain}`, `${url.protocol}//*.${baseDomain}`];
    } catch {
      return [];
    }
  });
  return Array.from(new Set([...origins, ...wildcards]));
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
  const scriptSrc = origins.length > 0 ? `'unsafe-inline' ${origins.join(" ")}` : "'none'";
  const assetOrigins = wildcardSubdomains(origins);
  const imgSrc = assetOrigins.join(" ") || "'none'";
  const frameSrc = assetOrigins.join(" ") || "'none'";

  // The iframe is its own isolated document — it doesn't inherit our theme's
  // CSS variables, so a blank/no-fill ad response defaults to the browser's
  // white canvas regardless of dark mode. Baking the resolved --bg-secondary
  // value in as the body background keeps an empty slot visually quiet
  // instead of flashing white.
  return `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${scriptSrc}; img-src ${imgSrc} data:; style-src 'unsafe-inline'; frame-src ${frameSrc};"></head><body style="margin:0;padding:0;background-color:${backgroundColor};">${tag}</body></html>`;
}
