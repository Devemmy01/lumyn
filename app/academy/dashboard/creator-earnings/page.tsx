import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Earnings | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyCreatorEarningsPage() {
  return <StudentDashboard />;
}
