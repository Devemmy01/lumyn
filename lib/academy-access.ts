import { cookies } from "next/headers";
import { decodeProtectedHeader } from "jose";
import connectDB, { MongoConnectionUnavailableError } from "@/lib/mongodb";
import { verifyAcademySessionToken } from "@/lib/academy-session";
import { FirebaseCertificatesUnavailableError, verifyAcademyToken } from "@/lib/firebase/admin";
import { ensureAcademyReferralCode } from "@/lib/academy-referrals";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

const paidStatuses = new Set(["active", "past_due"]);

export class AcademyDatabaseUnavailableError extends Error {
  constructor(message = "The academy dashboard is temporarily unavailable. Please try again in a moment.") {
    super(message);
    this.name = "AcademyDatabaseUnavailableError";
  }
}

export async function getAcademyTokenFromRequest(request: Request) {
  const header = request.headers.get("authorization");

  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  const cookieStore = await cookies();
  return cookieStore.get("lumyn_academy_session")?.value;
}

async function getFirebaseTokenFromRequest(request: Request) {
  const header = request.headers.get("authorization");

  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  return null;
}

async function getAcademySessionTokenFromRequest() {
  const cookieStore = await cookies();
  return cookieStore.get("lumyn_academy_session")?.value;
}

function isFirebaseIdToken(token?: string | null) {
  if (!token) return false;
  try {
    return decodeProtectedHeader(token).alg === "RS256";
  } catch {
    return false;
  }
}

export async function getVerifiedAcademyStudent(request: Request) {
  let decoded;

  const sessionToken = await getAcademySessionTokenFromRequest();
  if (sessionToken) {
    try {
      decoded = await verifyAcademySessionToken(sessionToken);
    } catch {
      decoded = null;
    }
  }

  if (!decoded) {
    const headerToken = await getFirebaseTokenFromRequest(request);
    const token = headerToken ?? (isFirebaseIdToken(sessionToken) ? sessionToken : null);
    try {
      decoded = await verifyAcademyToken(token);
    } catch (error) {
      if (error instanceof FirebaseCertificatesUnavailableError) {
        throw new AcademyDatabaseUnavailableError("Academy authentication is temporarily unavailable. Please try again in a moment.");
      }
      throw error;
    }
  }

  try {
    await connectDB();
  } catch (error) {
    if (error instanceof MongoConnectionUnavailableError) {
      throw new AcademyDatabaseUnavailableError();
    }
    throw error;
  }

  let student = await AcademyStudent.findOne({ firebaseUid: decoded.uid }) as IAcademyStudentDocument | null;

  if (!student) {
    throw new Error("Academy student account was not found.");
  }
  student = await ensureAcademyReferralCode(student);

  return { decoded, student };
}

function configuredVipEmails() {
  return new Set(
    (process.env.ACADEMY_VIP_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function hasVipAccess(student: {
  email?: string;
  vipAccess?: boolean;
}) {
  if (student.vipAccess === true) return true;
  if (student.vipAccess === false) return false;
  return Boolean(student.email) && configuredVipEmails().has(student.email!.toLowerCase());
}

/**
 * True when a student can use the AI tutor and unlock certificates for free:
 * admins, VIP-flagged students, active/past-due subscribers, or a cancelled
 * subscription that hasn't reached its paid-through date yet.
 */
export function hasPaidAcademyAccess(student: {
  role?: string;
  email?: string;
  vipAccess?: boolean;
  subscription?: { status?: string; currentPeriodEnd?: Date | string };
}) {
  const status = student.subscription?.status ?? "inactive";
  const periodEnd = student.subscription?.currentPeriodEnd
    ? new Date(student.subscription.currentPeriodEnd).getTime()
    : 0;
  return (
    student.role === "admin" ||
    hasVipAccess(student) ||
    paidStatuses.has(status) ||
    (status === "cancelled" && periodEnd > Date.now())
  );
}
