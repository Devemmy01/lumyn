"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuth, googleProvider } from "@/lib/firebase/client";
import { academyPlans } from "@/lib/academy";

type AuthMode = "signin" | "signup";

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : "Authentication failed. Please try again.";
  }
  const messages: Record<string, string> = {
    "auth/configuration-not-found": "Student sign-in is not configured yet. Please contact Lumyn support.",
    "auth/operation-not-allowed": "This sign-in method is not enabled yet. Please contact Lumyn support.",
    "auth/invalid-credential": "The email or password you entered is incorrect.",
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/weak-password": "Choose a stronger password with at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Allow pop-ups in your browser to continue with Google.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  };
  return messages[error.code] ?? "Authentication failed. Please try again.";
}

export default function AcademyAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") ?? "ai-learning-path";
  const referralCode = searchParams.get("ref") ?? "";
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const auth = useMemo(() => getFirebaseAuth(), []);
  const plan = academyPlans.find((item) => item.id === selectedPlan) ?? academyPlans[0];

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStatus("idle");
    setMessage("");
  }

  async function createSession(idToken: string) {
    const response = await fetch("/api/academy/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, planId: selectedPlan, referralCode }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    if (!response.ok) {
      throw new Error(
        payload?.error ?? "Could not create your Academy session. Please try again.",
      );
    }
  }

  async function finishAuth(idToken: string) {
    await createSession(idToken);
    router.push(`/academy/dashboard?plan=${encodeURIComponent(selectedPlan)}`);
  }

  async function handleGoogleSignIn() {
    try {
      setStatus("loading");
      setMessage("");
      const credential = await signInWithPopup(auth, googleProvider);
      await finishAuth(await credential.user.getIdToken());
    } catch (error) {
      setStatus("error");
      setMessage(getAuthErrorMessage(error));
    }
  }

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setStatus("loading");
      setMessage("");
      const credential = mode === "signup"
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      if (mode === "signup" && name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      await finishAuth(await credential.user.getIdToken());
    } catch (error) {
      setStatus("error");
      setMessage(getAuthErrorMessage(error));
    }
  }

  return (
    <div className="relative rounded-[2.15rem] bg-gradient-to-br from-[#7464ff]/65 via-[#c7c0ff]/55 to-[#7464ff]/65 p-px shadow-[0_30px_95px_rgba(53,42,110,0.22)] dark:from-white/18 dark:via-[#7c6cf6]/20 dark:to-[#342874] dark:shadow-[0_38px_130px_rgba(0,0,0,0.52)]">
      <div className="academy-auth-card dark-visual relative overflow-hidden rounded-[calc(2.15rem-1px)] bg-[#141222]/96 p-6 backdrop-blur-2xl sm:p-8">
        <div className="relative mb-7 flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9589ff]">{mode === "signin" ? "Welcome back" : "Start learning"}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-white sm:text-[1.75rem]">{mode === "signin" ? "Open your workspace" : "Create your account"}</h2>
          </div>
        </div>

        <div className="academy-auth-segment mb-6 grid grid-cols-2 rounded-2xl border border-white/[0.08] bg-black/35 p-1.5">
          {(["signin", "signup"] as AuthMode[]).map((item) => (
            <button key={item} type="button" onClick={() => changeMode(item)} className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${mode === item ? "bg-white text-[#121217] shadow-[0_8px_24px_rgba(0,0,0,0.25)]" : "text-white/42 hover:bg-white/[0.04] hover:text-white/80"}`}>
              {item === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <button type="button" onClick={handleGoogleSignIn} disabled={status === "loading"} className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-3.5 text-sm font-semibold text-[#141419] shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-[#f2f0ff] disabled:cursor-not-allowed disabled:opacity-60">
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4"><span className="h-px flex-1 bg-white/[0.08]" /><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">or use email</span><span className="h-px flex-1 bg-white/[0.08]" /></div>

        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold tracking-wide text-white/45">Full name</span>
              <span className="relative block"><FieldIcon type="user" /><input value={name} onChange={(event) => setName(event.target.value)} className="academy-auth-input" placeholder="How should we address you?" autoComplete="name" required /></span>
            </label>
          )}
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold tracking-wide text-white/45">Email address</span>
            <span className="relative block"><FieldIcon type="email" /><input value={email} onChange={(event) => setEmail(event.target.value)} className="academy-auth-input" placeholder="you@example.com" type="email" autoComplete="email" required /></span>
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold tracking-wide text-white/45">Password</span>
            <span className="relative block">
              <FieldIcon type="lock" />
              <input value={password} onChange={(event) => setPassword(event.target.value)} className="academy-auth-input pr-14" placeholder="At least 6 characters" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white/35 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
            </span>
          </label>

          {message && <p className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-3 text-sm leading-5 text-red-200">{message}</p>}

          <button type="submit" disabled={status === "loading"} className="academy-auth-submit group relative mt-2 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#7565f5] via-[#8979ff] to-[#7061ed] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_36px_rgba(103,87,226,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(103,87,226,0.38)] disabled:cursor-not-allowed disabled:opacity-60">
            <span className="relative z-10">{status === "loading" ? "Preparing your workspace…" : mode === "signup" ? "Create student account" : "Open my dashboard"}</span>
            {status !== "loading" && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="relative z-10 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </button>
        </form>
        <p className="relative mt-5 text-center text-[10px] leading-5 text-white/30">By continuing, you agree to Lumyn’s <a href="/terms" className="font-semibold text-white/55 underline underline-offset-2 hover:text-white">Terms</a> and acknowledge the <a href="/privacy" className="font-semibold text-white/55 underline underline-offset-2 hover:text-white">Privacy Policy</a>. Point purchases are also covered by our <a href="/refund-policy" className="font-semibold text-white/55 underline underline-offset-2 hover:text-white">Refund Policy</a>.</p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.8c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.9A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 13.7a6 6 0 0 1 0-3.4V7.4H3.1a10 10 0 0 0 0 9.2l3.4-2.9Z"/><path fill="#EA4335" d="M12 6.2c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.9A5.9 5.9 0 0 1 12 6.2Z"/></svg>;
}

function FieldIcon({ type }: { type: "user" | "email" | "lock" }) {
  return (
    <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/25">
      {type === "user" && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M5.5 20c.6-3.3 2.8-5 6.5-5s5.9 1.7 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
      {type === "email" && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m5 7 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {type === "lock" && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="15" r="1" fill="currentColor"/></svg>}
    </span>
  );
}
