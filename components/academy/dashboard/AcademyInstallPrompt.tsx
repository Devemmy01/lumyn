"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AcademyLogo from "@/components/academy/AcademyLogo";
import AstraMascot from "@/components/academy/AstraMascot";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export type AcademyInstallStatus =
  | "checking"
  | "available"
  | "ios"
  | "ios-legacy"
  | "android"
  | "installed"
  | "manual";

const INSTALL_DISMISS_KEY = "lumyn_academy_install_dismissed_at";
const INSTALL_DISMISS_DAYS = 7;

function isStandalone() {
  return (
    (typeof window.matchMedia === "function" &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function isIOSDevice() {
  const navigatorWithPlatform = window.navigator as Navigator & {
    platform?: string;
    maxTouchPoints?: number;
  };
  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (navigatorWithPlatform.platform === "MacIntel" &&
      (navigatorWithPlatform.maxTouchPoints ?? 0) > 1)
  );
}

function isLegacyIOSDevice() {
  const match = window.navigator.userAgent.match(/OS (\d+)[._]/i);
  return Boolean(match && Number(match[1]) < 12);
}

function isAndroidDevice() {
  return /android/i.test(window.navigator.userAgent);
}

function recentlyDismissed() {
  const stored = window.localStorage.getItem(INSTALL_DISMISS_KEY);
  if (!stored) return false;
  const dismissedAt = Number(stored);
  if (!Number.isFinite(dismissedAt)) return false;
  return Date.now() - dismissedAt < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function useAcademyInstall() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const promptTimer = useRef<number | null>(null);
  const autoPromptSuppressed = useRef(false);
  const [status, setStatus] = useState<AcademyInstallStatus>("checking");
  const [promptOpen, setPromptOpen] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setStatus("installed");
      return;
    }

    const ios = isIOSDevice();
    const android = isAndroidDevice();
    setStatus(
      ios
        ? isLegacyIOSDevice()
          ? "ios-legacy"
          : "ios"
        : android
          ? "android"
          : "manual",
    );

    const showLater = () => {
      if (recentlyDismissed() || autoPromptSuppressed.current) return;
      if (promptTimer.current) window.clearTimeout(promptTimer.current);
      promptTimer.current = window.setTimeout(() => setPromptOpen(true), 1200);
    };

    showLater();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setStatus("available");
      showLater();
    };
    const handleInstalled = () => {
      deferredPrompt.current = null;
      window.localStorage.removeItem(INSTALL_DISMISS_KEY);
      setPromptOpen(false);
      setStatus("installed");
    };
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      if (displayMode.matches) handleInstalled();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    if (typeof displayMode.addEventListener === "function") {
      displayMode.addEventListener("change", handleDisplayModeChange);
    } else if (typeof displayMode.addListener === "function") {
      displayMode.addListener(handleDisplayModeChange);
    }

    return () => {
      if (promptTimer.current) window.clearTimeout(promptTimer.current);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      if (typeof displayMode.removeEventListener === "function") {
        displayMode.removeEventListener("change", handleDisplayModeChange);
      } else if (typeof displayMode.removeListener === "function") {
        displayMode.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  const dismissPrompt = useCallback(() => {
    autoPromptSuppressed.current = true;
    window.localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
    setPromptOpen(false);
  }, []);

  const closePrompt = useCallback(() => {
    autoPromptSuppressed.current = true;
    setPromptOpen(false);
  }, []);

  const install = useCallback(async () => {
    if (status === "installed") return;

    const event = deferredPrompt.current;
    if (!event) {
      setPromptOpen(true);
      return;
    }

    await event.prompt();
    const choice = await event.userChoice;
    deferredPrompt.current = null;
    setPromptOpen(false);
    if (choice.outcome === "accepted") {
      setStatus("installed");
      window.localStorage.removeItem(INSTALL_DISMISS_KEY);
    } else {
      setStatus("manual");
    }
  }, [status]);

  const openInstall = useCallback(() => {
    if (status === "available") {
      void install();
      return;
    }
    if (status !== "installed") setPromptOpen(true);
  }, [install, status]);

  return {
    status,
    promptOpen,
    install,
    openInstall,
    dismissPrompt,
    closePrompt,
  };
}

export function AcademyInstallPrompt({
  open,
  status,
  onInstall,
  onDismiss,
  onClose,
}: {
  open: boolean;
  status: AcademyInstallStatus;
  onInstall: () => void | Promise<void>;
  onDismiss: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || status === "installed" || status === "checking") return null;

  const ios = status === "ios" || status === "ios-legacy";
  const legacyIOS = status === "ios-legacy";
  const android = status === "android";
  const manual = status === "manual";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center overflow-hidden bg-[#08090d]/55 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="academy-install-title"
      onClick={onClose}
    >
      <section
        className="relative max-h-[92svh] w-full max-w-[540px] overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-[#101118] text-white shadow-[0_35px_120px_rgba(0,0,0,0.5)] sm:max-h-[90vh] sm:rounded-[2.3rem]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7c6cf6]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#21e0aa]/10 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-xl text-white/55 transition hover:bg-white/10 hover:text-white"
          aria-label="Close install prompt"
        >
          ×
        </button>

        <div className="relative p-5 pb-4 sm:p-7 sm:pb-5">
          <div className="flex items-start gap-4 pr-10">
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[1.15rem] border border-white/10 bg-gradient-to-br from-[#9185ff] to-[#6655dc] shadow-[0_18px_45px_rgba(124,108,246,0.3)] sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-[1.4rem]">
              <AstraMascot expression="happy" className="h-16 w-16 translate-y-1 sm:h-20 sm:w-20" />
            </div>
            <div className="min-w-0 pt-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b9b1ff]">
                Your academy, one tap away
              </p>
              <h2 id="academy-install-title" className="mt-1.5 text-xl font-semibold tracking-[-0.035em] sm:mt-2 sm:text-3xl">
                Install Lumyn Academy
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-6 text-white/58">
            Learn in a focused, app-like workspace with faster access to your paths,
            projects, progress, and Astra.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["⚡", "Open faster"],
              ["◉", "Stay focused"],
              ["↗", "Launch anywhere"],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.045] p-3 text-center">
                <span className="text-lg" aria-hidden="true">{icon}</span>
                <p className="mt-1 text-[10px] font-bold text-white/65 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>

          {ios && (
            <div className="mt-5 rounded-2xl border border-[#21e0aa]/20 bg-[#21e0aa]/[0.07] p-4">
              <p className="text-xs font-bold text-[#8ff5d5]">Install on iPhone or iPad</p>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-white/62">
                <li><strong className="mr-2 text-white">1.</strong>Open this page in Safari.</li>
                <li><strong className="mr-2 text-white">2.</strong>Tap the Share button at the bottom of Safari.</li>
                <li><strong className="mr-2 text-white">3.</strong>Choose <strong className="text-white">Add to Home Screen</strong>.</li>
              </ol>
              {legacyIOS && (
                <p className="mt-3 border-t border-[#21e0aa]/15 pt-3 text-[10px] leading-4 text-white/45">
                  Older iOS can still add Academy to the Home Screen, but it needs an internet connection and may have limited offline behavior.
                </p>
              )}
            </div>
          )}

          {android && (
            <div className="mt-5 rounded-2xl border border-[#21e0aa]/20 bg-[#21e0aa]/[0.07] p-4">
              <p className="text-xs font-bold text-[#8ff5d5]">Install on Android</p>
              <ol className="mt-3 space-y-2 text-xs leading-5 text-white/62">
                <li><strong className="mr-2 text-white">1.</strong>Open Academy in Chrome.</li>
                <li><strong className="mr-2 text-white">2.</strong>Tap the three-dot browser menu.</li>
                <li><strong className="mr-2 text-white">3.</strong>Choose <strong className="text-white">Add to Home screen</strong> or <strong className="text-white">Install app</strong>.</li>
              </ol>
              <p className="mt-3 border-t border-[#21e0aa]/15 pt-3 text-[10px] leading-4 text-white/45">
                On older Android browsers, use Chrome rather than the built-in browser. Academy will launch from your Home Screen and stay online-synced.
              </p>
            </div>
          )}

          {manual && (
            <div className="mt-5 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.08] p-4 text-xs leading-5 text-white/62">
              Open your browser menu and choose <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home Screen</strong>. If that option is missing, try Chrome, Edge, or Safari.
            </div>
          )}
        </div>

        <div className="relative grid gap-2 border-t border-white/[0.08] bg-black/15 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
          {status === "available" ? (
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-black text-white shadow-[0_14px_32px_rgba(124,108,246,0.28)] transition hover:-translate-y-0.5 hover:bg-[#897af8]"
            >
              <InstallIcon /> Install free
            </button>
          ) : (
            <button type="button" onClick={onClose} className="h-12 rounded-2xl bg-[#7c6cf6] px-6 text-sm font-black text-white transition hover:bg-[#897af8]">
              Got it
            </button>
          )}
          <button type="button" onClick={onDismiss} className="h-12 rounded-2xl px-5 text-xs font-bold text-white/42 transition hover:bg-white/[0.05] hover:text-white/70">
            Maybe later
          </button>
        </div>

        <div className="relative flex justify-center border-t border-white/[0.05] px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] opacity-55">
          <AcademyLogo compact className="scale-75" />
        </div>
      </section>
    </div>
  );
}

export function InstallIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
