"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAcademyStandalone =
    pathname?.startsWith("/academy/dashboard") ||
    pathname?.startsWith("/academy/sign-in") ||
    pathname?.startsWith("/academy/payment");

  if (isAdmin || isAcademyStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28" id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
