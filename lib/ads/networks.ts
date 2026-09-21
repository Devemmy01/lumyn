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
  "tool-below-result": process.env.NEXT_PUBLIC_AD_TOOL_BELOW_RESULT_TAG_TEMPLATE,
  "tools-index": process.env.NEXT_PUBLIC_AD_TOOLS_INDEX_TAG_TEMPLATE,
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
export function buildAdTagHtml(placement: string, config: AdPlacementConfig): string | null {
  const template = TAG_TEMPLATES[placement];
  if (!template || !config.slotId) return null;

  const tag = template
    .replaceAll("{{slotId}}", config.slotId)
    .replaceAll("{{width}}", String(config.width))
    .replaceAll("{{height}}", String(config.height));

  const origins = adNetworkScriptOrigins();
  const scriptSrc = origins.length > 0 ? `'unsafe-inline' ${origins.join(" ")}` : "'none'";

  return `<!DOCTYPE html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${scriptSrc}; img-src ${origins.join(" ") || "'none'"} data:; style-src 'unsafe-inline'; frame-src ${origins.join(" ") || "'none'"};"></head><body style="margin:0;padding:0;">${tag}</body></html>`;
}
