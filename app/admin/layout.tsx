import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
  title: "Lumyn Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Always render the admin shell so pages (including login) keep global styling
  // AdminNav is only shown when an authenticated session exists
  return (
    <div className="min-h-[100svh] bg-[#050505] text-white font-sans">
      {session && <AdminNav user={session.user} />}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}
