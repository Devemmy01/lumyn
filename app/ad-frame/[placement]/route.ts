import { NextRequest, NextResponse } from "next/server";
import { AD_PLACEMENTS } from "@/lib/ads/config";
import { buildAdTagHtml } from "@/lib/ads/networks";

/**
 * Serves one ad placement's wrapper document, meant to be loaded cross-origin
 * — from NEXT_PUBLIC_ADS_ORIGIN (a dedicated subdomain, e.g.
 * ads.lumynhq.studio), never from the main site's own origin — into an
 * <iframe sandbox="allow-scripts allow-same-origin"> on the main site.
 *
 * That combination of sandbox flags only stays safe because the iframe's
 * `src` resolves to a genuinely different registrable origin than the main
 * site: allow-same-origin then only grants the ad script access to that
 * separate ads-subdomain origin's own (empty) storage/cookies, never to
 * lumynhq.studio's. Rendering this same document via `srcdoc` (an opaque,
 * unique origin every load) was the safer-looking but non-functional
 * alternative — Adsterra's ad server silently no-fills any request that
 * arrives with no Referer header, which an opaque-origin document can never
 * send, confirmed directly: curl with no Referer got a 200 with a 0-byte
 * body; the same request with one got the full ad script back.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placement: string }> },
) {
  const { placement } = await params;
  const config = AD_PLACEMENTS[placement];

  if (!config || !config.enabled || !config.slotId) {
    return new NextResponse("<!DOCTYPE html><html><body></body></html>", {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const bg = request.nextUrl.searchParams.get("bg") ?? "#ffffff";
  const html = buildAdTagHtml(placement, config, bg);

  return new NextResponse(html ?? "<!DOCTYPE html><html><body></body></html>", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
