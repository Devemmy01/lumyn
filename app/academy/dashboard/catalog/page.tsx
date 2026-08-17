import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Course Catalog | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyCatalogPage() {
  return <StudentDashboard />;
}
