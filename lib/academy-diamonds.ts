import { DIAMONDS_TO_UNLOCK_CERTIFICATE } from "@/lib/academy";
import connectDB from "@/lib/mongodb";
import AcademyDiamondTransaction from "@/models/AcademyDiamondTransaction";
import AcademyStudent from "@/models/AcademyStudent";

export async function grantAcademyDiamonds({
  email,
  diamonds,
  note,
  createdBy,
}: {
  email: string;
  diamonds: number;
  note?: string;
  createdBy?: string;
}) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { $inc: { diamondsBalance: diamonds } },
    { new: true, runValidators: true }
  );
  if (!student) throw new Error("No Academy account exists for that email yet.");

  await AcademyDiamondTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "admin_grant",
    diamonds,
    balanceAfter: student.diamondsBalance,
    note,
    createdBy,
  });

  return student;
}

export async function awardReferralDiamonds({
  studentUid,
  studentEmail,
  diamonds,
  reference,
}: {
  studentUid: string;
  studentEmail: string;
  diamonds: number;
  reference?: string;
}) {
  if (diamonds <= 0) return null;
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid },
    { $inc: { diamondsBalance: diamonds } },
    { new: true, runValidators: true }
  );
  if (!student) return null;

  await AcademyDiamondTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email ?? studentEmail,
    type: "referral_earn",
    diamonds,
    balanceAfter: student.diamondsBalance,
    reference,
    note: `Earned from reaching ${diamonds > 1 ? `${diamonds} referral milestones` : "a referral milestone"}`,
  });

  return student;
}

export async function reserveCertificateDiamonds(studentUid: string, reference: string) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid, diamondsBalance: { $gte: DIAMONDS_TO_UNLOCK_CERTIFICATE } },
    { $inc: { diamondsBalance: -DIAMONDS_TO_UNLOCK_CERTIFICATE } },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new Error(`You need ${DIAMONDS_TO_UNLOCK_CERTIFICATE} diamonds to unlock this certificate.`);
  }

  await AcademyDiamondTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "certificate_unlock_spend",
    diamonds: -DIAMONDS_TO_UNLOCK_CERTIFICATE,
    balanceAfter: student.diamondsBalance,
    reference,
    note: "Certificate unlock",
  });

  return student;
}

export async function refundCertificateDiamonds(studentUid: string, reference: string) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid },
    { $inc: { diamondsBalance: DIAMONDS_TO_UNLOCK_CERTIFICATE } },
    { new: true, runValidators: true }
  );
  if (!student) return null;

  await AcademyDiamondTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "certificate_unlock_refund",
    diamonds: DIAMONDS_TO_UNLOCK_CERTIFICATE,
    balanceAfter: student.diamondsBalance,
    reference,
    note: "Certificate unlock failed after diamonds were reserved",
  });

  return student;
}
