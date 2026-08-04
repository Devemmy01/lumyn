"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";
import { MoonIcon, SunIcon } from "@/components/academy/dashboard/icons";
import {
  InstallIcon,
  type AcademyInstallStatus,
} from "@/components/academy/dashboard/AcademyInstallPrompt";

const academyAvatars = Array.from(
  { length: 17 },
  (_, index) => `/pp${index + 1}.png`,
);

type AccountPanelMode = "profile" | "settings";

export function AccountPanel({
  mode,
  name,
  profileName,
  profileAvatarUrl,
  certificateName,
  preferredAstraName,
  referralLink,
  referralsCount,
  isDark,
  installStatus,
  pendingAction,
  onClose,
  onSaveProfile,
  onToggleTheme,
  onInstallApp,
  onProfileNameChange,
  onAvatarChange,
  onCertificateNameChange,
  onPreferredAstraNameChange,
  onCopyReferralLink,
}: {
  mode: AccountPanelMode;
  name: string;
  profileName: string;
  profileAvatarUrl: string;
  certificateName: string;
  preferredAstraName: string;
  referralLink: string;
  referralsCount: number;
  isDark: boolean;
  installStatus: AcademyInstallStatus;
  pendingAction: string | null;
  onClose: () => void;
  onSaveProfile: (event: FormEvent<HTMLFormElement>) => void;
  onToggleTheme: () => void;
  onInstallApp: () => void;
  onProfileNameChange: (value: string) => void;
  onAvatarChange: (value: string) => void;
  onCertificateNameChange: (value: string) => void;
  onPreferredAstraNameChange: (value: string) => void;
  onCopyReferralLink: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-panel-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-[1.75rem] border border-black/[0.08] bg-[#faf9f6] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl dark:border-white/10 dark:bg-[#111219] sm:max-h-[90vh] sm:rounded-[2rem] sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
              Account
            </p>
            <h2
              id="account-panel-title"
              className="mt-1 text-2xl font-semibold tracking-[-0.03em]"
            >
              {mode === "profile" ? "Profile" : "Settings"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] text-xl text-neutral-500 transition hover:border-[#7c6cf6]/30 hover:text-[#6c5ce7] dark:border-white/10 dark:text-white/50"
            aria-label="Close account panel"
          >
            ×
          </button>
        </div>

        {mode === "profile" && (
          <form onSubmit={onSaveProfile} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Display name
              </span>
              <input
                value={profileName}
                onChange={(event) => onProfileNameChange(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-black/[0.08] bg-white/70 px-4 text-sm font-semibold outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10 dark:bg-black/20"
                maxLength={120}
                required
              />
            </label>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Choose avatar
              </p>
              <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {academyAvatars.map((avatar) => {
                  const selectedAvatar = profileAvatarUrl === avatar;
                  return (
                    <button
                      type="button"
                      key={avatar}
                      onClick={() => onAvatarChange(avatar)}
                      className={`relative aspect-square overflow-hidden rounded-full border transition ${selectedAvatar ? "border-none ring-4 ring-[#7c6cf6]" : "border-black/[0.08] hover:border-[#7c6cf6]/35 dark:border-white/10"}`}
                    >
                      <Image
                        src={avatar}
                        alt="Profile avatar option"
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              disabled={pendingAction === "profile-save"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60 sm:w-auto"
            >
              {pendingAction === "profile-save" && <LoadingSpinner />}Save
              profile
            </button>
          </form>
        )}

        {mode === "settings" && (
          <div className="mt-6 space-y-5">
            <section className="relative overflow-hidden rounded-2xl border border-[#7c6cf6]/25 bg-[#111218] p-4 text-white shadow-[0_16px_45px_rgba(58,45,130,0.14)] sm:p-5">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#7c6cf6]/25 blur-3xl" />
              <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#7c6cf6]/18 text-[#c8c1ff] ring-1 ring-white/10">
                    <InstallIcon />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold">Install Lumyn Academy</p>
                      {installStatus === "installed" && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">Installed</span>
                      )}
                    </div>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-white/45">
                      {installStatus === "installed"
                        ? "Academy is installed on this device and ready to launch."
                        : installStatus === "ios" || installStatus === "ios-legacy"
                          ? "Add Academy to your iPhone or iPad Home Screen."
                          : installStatus === "android"
                            ? "Add Academy to your Android Home Screen, including older Chrome devices."
                          : installStatus === "manual"
                            ? "Get browser-specific steps for installing the Academy app."
                            : "Launch your learning workspace like a native app."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onInstallApp}
                  disabled={installStatus === "installed" || installStatus === "checking"}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#897af8] disabled:cursor-default disabled:bg-white/10 disabled:text-white/35"
                >
                  <InstallIcon />
                  {installStatus === "installed"
                    ? "Installed"
                    : installStatus === "available"
                      ? "Install app"
                      : installStatus === "checking"
                        ? "Checking…"
                        : "Show me how"}
                </button>
              </div>
            </section>
            <section className="rounded-2xl border border-black/[0.08] bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-bold">Appearance</p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">
                    Switch the Academy workspace theme.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] px-4 py-2.5 text-sm font-semibold transition hover:border-[#7c6cf6]/35 hover:text-[#6c5ce7] dark:border-white/10"
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                  {isDark ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </section>
            <section className="rounded-2xl border border-black/[0.08] bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <label className="block">
                <span className="text-sm font-bold">Preferred Astra name</span>
                <span className="mt-1 block text-xs text-neutral-500 dark:text-white/40">
                  This stays on this device and changes how Astra addresses you.
                </span>
                <input
                  value={preferredAstraName}
                  onChange={(event) =>
                    onPreferredAstraNameChange(event.target.value)
                  }
                  className="mt-3 h-12 w-full rounded-2xl border border-black/[0.08] bg-transparent px-4 text-sm outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10"
                  placeholder={name.split(" ")[0] || name}
                  maxLength={80}
                />
              </label>
            </section>
            <section className="rounded-2xl border border-black/[0.08] bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <form onSubmit={onSaveProfile}>
                <label className="block">
                  <span className="text-sm font-bold">Certificate name</span>
                  <span className="mt-1 block text-xs text-neutral-500 dark:text-white/40">
                    This is the full name that will appear on your Lumyn Academy
                    certificates.
                  </span>
                  <input
                    value={certificateName}
                    onChange={(event) =>
                      onCertificateNameChange(event.target.value)
                    }
                    className="mt-3 h-12 w-full rounded-2xl border border-black/[0.08] bg-transparent px-4 text-sm outline-none transition focus:border-[#7c6cf6] focus:ring-4 focus:ring-[#7c6cf6]/10 dark:border-white/10"
                    placeholder={profileName || name}
                    maxLength={120}
                  />
                </label>
                <button
                  type="submit"
                  disabled={pendingAction === "profile-save"}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7c6cf6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6b5bdd] disabled:opacity-60 sm:w-auto"
                >
                  {pendingAction === "profile-save" && <LoadingSpinner />}
                  Save certificate name
                </button>
              </form>
            </section>
            <section className="rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.07] p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-sm font-bold">Referral link</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-white/45">
                    Invite a new student and earn 1 free point when they create
                    their account.
                  </p>
                  <p className="mt-3 truncate rounded-xl bg-white/65 px-3 py-2 text-xs font-semibold text-[#6c5ce7] dark:bg-black/20 dark:text-[#b9b1ff]">
                    {referralLink || "Referral link loading..."}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {referralsCount} referrals credited
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCopyReferralLink}
                  className="inline-flex items-center justify-center rounded-xl bg-[#7c6cf6] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6b5bdd]"
                >
                  Copy link
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
