"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LumynLogo from "./LumynLogo";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/about", label: "Studio" },
  { href: "/products", label: "Products" },
  { href: "/academy", label: "Academy" },
  { href: "/journal", label: "Journal" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-3 z-50 flex w-full justify-center px-3 transition-all duration-500 md:top-4 md:px-6">
        <nav
          className={clsx(
            "pointer-events-auto flex min-h-[62px] w-full max-w-[1280px] items-center justify-between rounded-full border px-3.5 py-2 transition-all duration-500 md:mx-auto md:min-h-[66px] md:px-5",
            scrolled
              ? "border-black/10 bg-white/88 shadow-[0_18px_60px_rgba(25,20,35,0.13)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#08080a]/88"
              : "border-black/10 bg-[color:var(--bg-primary)]/72 shadow-[0_8px_35px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-white/[0.09]",
          )}
        >
          <div className="flex min-w-0 items-center gap-3 md:gap-5">
            <Link href="/" className="shrink-0 px-1" aria-label="Lumyn home">
              <LumynLogo />
            </Link>
            <span className="hidden h-5 w-px bg-black/10 dark:bg-white/10 sm:block" />
            <span className="hidden truncate text-[9px] font-semibold uppercase tracking-[0.19em] text-[color:var(--text-tertiary)] sm:block">
              Product studio
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 lg:flex xl:gap-6">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-300",
                    active
                      ? "text-black dark:text-white"
                      : "text-neutral-500 hover:text-black dark:hover:text-white",
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <div className="mx-1 h-4 w-px bg-black/15 dark:bg-white/20" />
            <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#17131f] px-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#fff] transition hover:bg-[#7c6cf6] dark:bg-white dark:text-[#111] dark:hover:bg-[#7c6cf6] dark:hover:text-[#fff]"
            >
              Start a project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h8M7.5 4l3 3-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="pointer-events-auto z-50 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black focus:outline-none dark:border-white/10 dark:text-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={1}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth={1}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "fixed inset-0 z-40 flex flex-col items-center justify-center bg-[color:var(--bg-primary)] transition-all duration-700",
          menuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4",
        )}
      >
        <nav className="flex flex-col gap-6 text-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-4xl font-medium uppercase tracking-normal text-[color:var(--text-primary)] transition-colors duration-300 hover:text-[#7c6cf6] md:text-6xl"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-[color:var(--text-primary)] px-8 py-4 text-sm font-semibold text-[color:var(--bg-primary)]"
          >
            Start a project
          </Link>
          <ThemeToggleButton
            isDark={isDark}
            onToggle={toggleTheme}
            className="mx-auto mt-4"
          />
        </nav>
      </div>
    </>
  );
}

function ThemeToggleButton({
  isDark,
  onToggle,
  className,
}: {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-black transition-all duration-300 hover:border-[#7c6cf6] hover:text-[#7c6cf6] dark:border-white/10 dark:bg-white/[0.05] dark:text-white",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 14.4A7.7 7.7 0 0 1 9.6 4a8 8 0 1 0 10.4 10.4Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  );
}
