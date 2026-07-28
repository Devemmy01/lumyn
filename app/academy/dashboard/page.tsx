import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "Lumyn Academy student dashboard for generated courses, assignments, quizzes, progress, certificates, and point balance.",
};

export const dynamic = "force-dynamic";

export default function AcademyDashboardPage() {
  return <StudentDashboard />;
}
