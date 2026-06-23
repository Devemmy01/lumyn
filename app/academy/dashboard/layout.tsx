import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default function AcademyDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
