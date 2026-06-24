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

  if (!session) return children;

  return (
    <div className="min-h-[100svh] bg-[#060608] font-sans text-white">
      <AdminNav user={session.user} />
      <main className="lg:pl-72">
        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 sm:py-9 xl:px-10 xl:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
