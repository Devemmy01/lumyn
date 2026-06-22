import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Assignments | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyAssignmentsPage() {
  return <StudentDashboard />;
}
