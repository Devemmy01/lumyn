"use client";

import clsx from "clsx";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type AdminUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null | undefined;

const links = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/posts", label: "Journal posts", icon: "file" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "users" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "message" },
  { href: "/admin/academy", label: "Academy", icon: "spark" },
  { href: "/admin/inbox", label: "Email inbox", icon: "mail" },
] as const;

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
}

export default function AdminNav({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/[0.07] bg-[#08080b] lg:flex">
        <div className="flex h-24 items-center border-b border-white/[0.07] px-7">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Lumyn admin home">
            <Image src="/logo.png" alt="Lumyn Logo" width={36} height={36} />
            <span>
              <span className="block text-sm font-bold tracking-[0.18em] text-white">LUMYN</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Operations</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Workspace</p>
          <nav className="space-y-1.5" aria-label="Admin navigation">
            {links.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition",
                    active
                      ? "bg-[#7c6cf6]/15 text-white shadow-[inset_0_0_0_1px_rgba(124,108,246,0.18)]"
                      : "text-white/65 hover:bg-white/[0.04] hover:text-white/90",
                  )}
                >
                  <AdminIcon name={item.icon} active={active} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#9b8cff]" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/[0.07] p-4">
          <div className="mb-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Lumyn Logo" width={36} height={36} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.name || "Admin"}</p>
                <p className="truncate text-xs text-white/50">{user?.email || "Lumyn operations"}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.08] text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="h-10 rounded-xl border border-red-500/15 bg-red-500/[0.04] text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#08080b]/90 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Lumyn Logo" width={36} height={36} />
            <span className="text-xs font-bold tracking-[0.18em]">LUMYN / ADMIN</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
          >
            <span className="text-lg">{isOpen ? "×" : "☰"}</span>
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-white/[0.07] py-3">
            <nav className="space-y-1" aria-label="Mobile admin navigation">
              {links.map((item) => {
                const active = isActiveRoute(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                      active ? "bg-[#7c6cf6]/15 text-white" : "text-white/65",
                    )}
                  >
                    <AdminIcon name={item.icon} active={active} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
              <Link href="/" target="_blank" className="flex h-10 items-center justify-center rounded-xl border border-white/10 text-xs text-white/75">View site ↗</Link>
              <button type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })} className="h-10 rounded-xl border border-red-500/20 text-xs text-red-300">Sign out</button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function AdminIcon({ name, active }: { name: (typeof links)[number]["icon"]; active: boolean }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />,
    spark: <path d="m12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3ZM5 15l-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  };

  return (
    <span className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", active ? "bg-[#7c6cf6]/20 text-[#b9b1ff]" : "bg-white/[0.035] text-white/50 group-hover:text-white/75")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[name]}
      </svg>
    </span>
  );
}
