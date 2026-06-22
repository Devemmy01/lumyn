import type { Metadata } from "next";
import StudentDashboard from "@/components/academy/StudentDashboard";

export const metadata: Metadata = { title: "Billing | Lumyn Academy" };
export const dynamic = "force-dynamic";

export default function AcademyBillingPage() {
  return <StudentDashboard />;
}
