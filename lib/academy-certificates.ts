import { randomUUID } from "crypto";
import { hasPaidAcademyAccess } from "@/lib/academy-access";
import { reserveCertificateDiamonds, refundCertificateDiamonds } from "@/lib/academy-diamonds";
import connectDB from "@/lib/mongodb";
import AcademyEnrollment, {
  type AcademyCertificateUnlockMethod,
  type IAcademyEnrollmentDocument,
} from "@/models/AcademyEnrollment";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

function buildCertificatePayload(
  student: Pick<IAcademyStudentDocument, "certificateName" | "name">,
  unlockMethod: AcademyCertificateUnlockMethod,
) {
  return {
    certificateId: `LUMYN-${randomUUID().slice(0, 8).toUpperCase()}`,
    issuedAt: new Date().toISOString(),
    certificateName: student.certificateName?.trim() || student.name?.trim() || undefined,
    unlockMethod,
    unlockedAt: new Date().toISOString(),
  };
}

/**
 * Auto-issues a certificate for free when the student already has paid
 * access (subscriber, VIP, or admin). Mutates the in-memory enrollment doc
 * but does not save it — call sites already save the enrollment as part of
 * a broader progress update. Returns true when a certificate was newly set.
 */
export function maybeAutoIssueCertificate(
  enrollment: IAcademyEnrollmentDocument,
  student: IAcademyStudentDocument,
): boolean {
  if (enrollment.certificate) return false;
  if (enrollment.status !== "completed") return false;
  if (!hasPaidAcademyAccess(student)) return false;

  enrollment.certificate = buildCertificatePayload(student, "subscription");
  enrollment.markModified("certificate");
  return true;
}

export async function unlockCertificateWithDiamonds(enrollmentId: string, student: IAcademyStudentDocument) {
  await connectDB();
  const enrollment = await AcademyEnrollment.findOne({ _id: enrollmentId, studentUid: student.firebaseUid });
  if (!enrollment) throw new Error("Enrollment not found.");
  if (enrollment.certificate) throw new Error("This certificate has already been unlocked.");
  if (enrollment.status !== "completed") {
    throw new Error("Complete this course before unlocking its certificate.");
  }

  await reserveCertificateDiamonds(student.firebaseUid, String(enrollment._id));

  const updated = await AcademyEnrollment.findOneAndUpdate(
    { _id: enrollment._id, certificate: { $exists: false } },
    { $set: { certificate: buildCertificatePayload(student, "diamonds") } },
    { new: true },
  );

  if (!updated) {
    await refundCertificateDiamonds(student.firebaseUid, String(enrollment._id));
    throw new Error("This certificate was already unlocked.");
  }

  return updated;
}

export async function unlockCertificateWithPayment(enrollmentId: string, studentUid: string) {
  await connectDB();
  const student = await AcademyStudent.findOne({ firebaseUid: studentUid });
  if (!student) throw new Error("Student account was not found.");

  const updated = await AcademyEnrollment.findOneAndUpdate(
    { _id: enrollmentId, studentUid, certificate: { $exists: false } },
    { $set: { certificate: buildCertificatePayload(student, "payment") } },
    { new: true },
  );
  if (!updated) throw new Error("This certificate was already unlocked.");
  return updated;
}
