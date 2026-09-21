"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Layout-level boundary: any subtree wrapped in <NoAdsZone> makes <AdSlot>
 * render nothing, structurally, regardless of whether a page remembers to
 * omit it. Store checkout, success, download and payment-policy pages are
 * wrapped in this at the layout level — someone who paid us never sees an
 * ad, and that can't be broken by a missed prop on one page. */
const NoAdsContext = createContext(false);

export function NoAdsZone({ children }: { children: ReactNode }) {
  return <NoAdsContext.Provider value={true}>{children}</NoAdsContext.Provider>;
}

export function useAdsAllowed(): boolean {
  return !useContext(NoAdsContext);
}
