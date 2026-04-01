"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";

export default function AdminNav({ user }: { user: any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/subscribers", label: "Subscribers" },
    { href: "/admin/inquiries", label: "Inquiries" },
  ];

  return (
    <nav className="bg-white border-b border-stone/30 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image src="/lumyn.png" alt="Lumyn" width={120} height={120} className="h-8 w-auto" />
            </div>
            {/* Desktop links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              {links.map(({ href, label }) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-sage text-charcoal"
                        : "border-transparent text-charcoal-muted hover:text-charcoal hover:border-stone/40"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop user actions */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <span className="text-sm text-charcoal-muted">
              {user?.name || "Admin"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Sign out
            </button>
            <Link
              href="https://lumynhq.studio"
              target="_blank"
              className="text-sm text-sage hover:text-sage-dark font-medium px-3 py-1.5 bg-sage/10 rounded-lg transition-colors"
            >
              View Site ↗
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-ivory-200 focus:outline-none transition-all active:scale-95"
              aria-expanded={isOpen}
            >
              {isOpen ? (
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
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("sm:hidden transition-all duration-200 ease-in-out overflow-hidden", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="pt-2 pb-3 space-y-1 px-4 border-t border-stone/10">
          {links.map(({ href, label }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                  isActive
                    ? "bg-sage/5 border-sage text-charcoal"
                    : "border-transparent text-charcoal-muted hover:bg-stone/5 hover:border-stone/30 hover:text-charcoal"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 pb-3 border-t border-stone/10 px-4">
          <div className="flex items-center px-3 mb-3">
            <div className="text-base font-medium text-charcoal">{user?.name || "Admin"}</div>
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              className="block px-3 py-2 text-base font-medium text-sage hover:bg-sage/5 rounded-md transition-colors"
            >
              View Live Site ↗
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
