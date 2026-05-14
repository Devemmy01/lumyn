"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";

export default function AdminNav({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } | null | undefined }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/subscribers", label: "Subscribers" },
    { href: "/admin/inquiries", label: "Inquiries" },
  ];

  return (
    <nav className="bg-[#050505] border-b border-[#222] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold tracking-widest text-lg">LUMYN / ADMIN</span>
            </div>
            {/* Desktop links */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {links.map(({ href, label }) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors uppercase tracking-widest",
                      isActive
                        ? "border-white text-white"
                        : "border-transparent text-neutral-500 hover:text-white"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop user actions */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <span className="text-sm font-semibold tracking-widest uppercase text-neutral-500">
              {user?.name || "Admin"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 font-bold transition-colors"
            >
              Sign out
            </button>
            <Link
              href="https://lumynhq.studio"
              target="_blank"
              className="text-xs uppercase tracking-widest text-[#7c6cf6] hover:text-white font-bold px-4 py-2 border border-[#7c6cf6] hover:bg-[#7c6cf6] transition-all rounded-full"
            >
              View Site ↗
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-white hover:bg-[#111] focus:outline-none transition-all active:scale-95"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("sm:hidden transition-all duration-200 ease-in-out overflow-hidden bg-[#0a0a0a]", isOpen ? "max-h-96 border-b border-[#222]" : "max-h-0")}>
        <div className="pt-2 pb-3 space-y-1 px-4 border-t border-[#222]">
          {links.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block pl-3 pr-4 py-3 border-l-2 text-sm font-semibold tracking-widest uppercase transition-colors",
                  isActive
                    ? "border-[#7c6cf6] text-white bg-[#111]"
                    : "border-transparent text-neutral-500 hover:bg-[#111] hover:text-white"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 pb-4 border-t border-[#222] px-4 space-y-3">
          <div className="px-3 text-sm font-semibold tracking-widest text-neutral-500 uppercase">{user?.name || "Admin"}</div>
          <Link
            href="/"
            target="_blank"
            className="block px-3 py-2 text-sm font-semibold uppercase tracking-widest text-[#7c6cf6] hover:text-white"
          >
            View Live Site ↗
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="block w-full text-left px-3 py-2 text-sm font-bold uppercase tracking-widest text-red-500 hover:text-red-400"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
