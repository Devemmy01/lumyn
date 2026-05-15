"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/philosophy", label: "Method" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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
            "pointer-events-auto flex md:items-center justify-between w-full max-w-7xl mx-auto px-2 md:px-12 py- md:py-6 transition-all duration-700 rounded-full",
            scrolled
              ? "bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl"
              : "bg-transparent border border-transparent",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className=""
          >
            {/* <Image
              src="/footer.png"
              alt="Lumyn"
              width={100}
              height={30}
              className="h-6 w-auto"
            /> */} <h2 className="text-[22px] font-[900] ">Lumyn<span className="text-[#7c6cf6] text-[30px]">.</span></h2>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "text-xs uppercase font-medium tracking-[0.1em] transition-all duration-300",
                    active ? "text-white" : "text-neutral-500 hover:text-white",
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <div className="w-[1px] h-4 bg-white/20 mx-2" />
            <Link
              href="/contact"
              className="text-xs uppercase text-white font-semibold hover:opacity-75 transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">Contact</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 focus:outline-none z-50 pointer-events-auto"
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
          "fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700",
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
              className="text-4xl md:text-6xl font-medium tracking-tighter uppercase text-white hover:text-neutral-500 transition-colors duration-300"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-4xl md:text-6xl font-medium tracking-tighter uppercase text-white hover:text-neutral-500 transition-colors duration-300 mt-8"
          >
            Contact
          </Link>
        </nav>
      </div>
    </>
  );
}
