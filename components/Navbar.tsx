"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { href: "/products",   label: "Products"   },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/journal",    label: "Journal"    },
  { href: "/about",      label: "About"      },
];


export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-ivory shadow-soft border-b border-stone/50"
            : "bg-ivory border-b border-stone/30"
        )}
      >
        <nav className="container-wide flex items-center justify-between h-16 md:h-20">

          {/* ── Logo lockup ── */}
          <Link
            href="/"
            className="flex items-center gap-[10px] group"
            aria-label="Lumyn home"
          >
            <Image src="/lumyn.png" alt="Lumyn" width={120} height={120} className="h-8 w-auto" />
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative py-1 text-sm font-medium tracking-wide",
                    "transition-colors duration-200",
                    active ? "text-charcoal" : "text-charcoal-muted hover:text-charcoal"
                  )}
                >
                  {label}
                  {/* Active indicator */}
                  <span
                    className={clsx(
                      "absolute -bottom-0.5 left-0 right-0 h-px rounded-full bg-sage",
                      "transition-all duration-300",
                      active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                    style={{ transformOrigin: "left" }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Right CTA + hamburger ── */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
            >
              Get in Touch
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-ivory-200 focus:outline-none transition-all active:scale-95"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-ivory md:hidden flex flex-col",
          "transition-all duration-400 ease-out-expo",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Subtle ambient glow in mobile menu */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(124,108,246,0.06) 0%, transparent 65%)"
          }}
          aria-hidden="true"
        />

        <div className="relative flex-1 flex flex-col container-wide pt-24 pb-12">
          <nav className="flex flex-col gap-1 flex-1" aria-label="Mobile navigation">
            {navLinks.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "text-[2rem] font-semibold tracking-tight py-3 border-b border-stone/30",
                  "transition-colors duration-200 hover:text-sage",
                  "flex items-center justify-between",
                  pathname === href ? "text-charcoal" : "text-charcoal-muted",
                  menuOpen ? "animate-fade-up opacity-0" : "opacity-0"
                )}
                style={{
                  animationDelay: `${i * 55 + 60}ms`,
                  animationFillMode: "forwards"
                }}
              >
                {label}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                     className="opacity-30" aria-hidden="true">
                  <path d="M2 8h12M9 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </nav>

          <div
            className={clsx(
              "pt-8",
              menuOpen ? "animate-fade-up opacity-0" : "opacity-0"
            )}
            style={{ animationDelay: "360ms", animationFillMode: "forwards" }}
          >
            <Link href="/contact" className="btn-primary w-full justify-center">
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
