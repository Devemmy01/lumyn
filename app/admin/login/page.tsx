"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#7c6cf6] opacity-[0.05] blur-[120px] pointer-events-none" 
      />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] p-8 sm:p-12 relative z-10 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-10">
          <span className="text-white font-bold tracking-widest text-2xl uppercase">LUMYN / ADMIN</span>
        </div>

        <h1 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest text-center mb-8">
          Studio Access
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-950/30 text-red-500 text-sm font-medium border border-red-900/50 text-center rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-5 py-3.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-neutral-700 outline-none
                       focus:ring-1 focus:ring-[#7c6cf6] focus:border-[#7c6cf6] transition-all"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full px-5 py-3.5 bg-[#050505] border border-[#222] rounded-xl text-white placeholder-neutral-700 outline-none
                         focus:ring-1 focus:ring-[#7c6cf6] focus:border-[#7c6cf6] transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-[#7c6cf6] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-white text-black hover:bg-[#7c6cf6] hover:text-white rounded-xl transition-all font-bold tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs tracking-widest font-semibold uppercase text-neutral-600">
          Reserved for Lumyn members.
        </p>
      </div>
    </div>
  );
}
