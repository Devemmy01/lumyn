import type { ReactNode } from "react";
import { NoAdsZone } from "@/lib/ads/no-ads-zone";

/** Structural boundary for the whole /guides store: nothing under this route
 * ever shows an ad. See lib/ads/no-ads-zone.tsx. */
export default function GuidesLayout({ children }: { children: ReactNode }) {
  return <NoAdsZone>{children}</NoAdsZone>;
}
