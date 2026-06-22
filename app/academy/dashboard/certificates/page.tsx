import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Certificates | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyCertificatesPage() {
  return <StudentDashboard />;
}
