import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academy Payment",
  robots: { index: false, follow: false, nocache: true },
};

export default function AcademyPaymentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
