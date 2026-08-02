"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function AcademyThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#5d5670] shadow-sm backdrop-blur transition hover:border-[#7c6cf6]/40 hover:text-[#6757df] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55 dark:hover:border-[#7c6cf6]/50 dark:hover:text-white"
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.2A7.7 7.7 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
      )}
    </button>
  );
}
