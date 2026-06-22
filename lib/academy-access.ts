import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import { verifyAcademyToken } from "@/lib/firebase/admin";
import AcademyStudent from "@/models/AcademyStudent";

const paidStatuses = new Set(["active", "past_due"]);

export async function getAcademyTokenFromRequest(request: Request) {
  const header = request.headers.get("authorization");

  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("lumyn_academy_session")?.value;
}

export async function getVerifiedAcademyStudent(request: Request) {
  const token = await getAcademyTokenFromRequest(request);
  const decoded = await verifyAcademyToken(token);

  await connectDB();

  const student = await AcademyStudent.findOne({ firebaseUid: decoded.uid });

  if (!student) {
    throw new Error("Academy student account was not found.");
  }

  return { decoded, student };
}

export function hasPaidAcademyAccess(student: {
  role?: string;
  subscription?: { status?: string; currentPeriodEnd?: Date | string };
}) {
  const status = student.subscription?.status ?? "inactive";
  const periodEnd = student.subscription?.currentPeriodEnd
    ? new Date(student.subscription.currentPeriodEnd).getTime()
    : 0;
  return student.role === "admin" || paidStatuses.has(status) ||
    (status === "cancelled" && periodEnd > Date.now());
}

function configuredCourseExemptions() {
  return new Set(
    (process.env.ACADEMY_COURSE_EXEMPT_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function hasCourseGenerationExemption(student: {
  email?: string;
  courseGenerationExempt?: boolean;
}) {
  if (student.courseGenerationExempt === true) return true;
  if (student.courseGenerationExempt === false) return false;
  return Boolean(student.email) && configuredCourseExemptions().has(student.email!.toLowerCase());
}

export function hasUnlimitedAcademyAccess(student: {
  email?: string;
  role?: string;
  courseGenerationExempt?: boolean;
  subscription?: { status?: string; currentPeriodEnd?: Date | string };
}) {
  return hasCourseGenerationExemption(student) || hasPaidAcademyAccess(student);
}
