import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Build a Learning Path | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyGeneratePage() {
  return <StudentDashboard />;
}
