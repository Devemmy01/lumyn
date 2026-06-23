"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import LumynLogo from "./LumynLogo";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/academy", label: "Academy" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
      <header className="fixed top-2 md:top-4 left-0 right-0 z-50 flex justify-center w-full pointer-events-none transition-all duration-700 px-4 md:px-8">
        <nav
          className={clsx(
            "pointer-events-auto flex w-full max-w-7xl items-center justify-between rounded-full px-3 py-3 transition-all duration-700 md:mx-auto md:px-8 md:py-4",
            scrolled
              ? "border border-black/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80"
              : "bg-transparent border border-transparent",
          )}
        >
          <Link href="/" className="shrink-0" aria-label="Lumyn home">
            <LumynLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex lg:gap-5">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "text-[11px] uppercase font-medium tracking-[0.08em] transition-all duration-300",
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
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="pointer-events-auto z-50 p-2 text-black focus:outline-none dark:text-white md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="w-8 h-8"
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
                className="w-8 h-8"
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
          <ThemeToggleButton
            isDark={isDark}
            onToggle={toggleTheme}
            className="mt-10 mx-auto"
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
