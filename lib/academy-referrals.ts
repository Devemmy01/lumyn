import { randomBytes } from "crypto";
import AcademyPointTransaction from "@/models/AcademyPointTransaction";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

export const REFERRAL_POINT_REWARD = 1;

function makeReferralCode() {
  return `LUMYN${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function ensureAcademyReferralCode(student: IAcademyStudentDocument) {
  if (student.referralCode) return student;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const referralCode = makeReferralCode();
    try {
      const updated = await AcademyStudent.findOneAndUpdate(
        { _id: student._id, referralCode: { $exists: false } },
        { $set: { referralCode } },
        { new: true, runValidators: true },
      );
      return updated ?? student;
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not create a unique referral code.");
}

export async function creditAcademyReferral({
  newStudentUid,
  newStudentEmail,
  referralCode,
}: {
  newStudentUid: string;
  newStudentEmail: string;
  referralCode?: string;
}) {
  const normalizedCode = referralCode?.trim().toUpperCase();
  if (!normalizedCode) return null;

  const referrer = await AcademyStudent.findOneAndUpdate(
    {
      referralCode: normalizedCode,
      firebaseUid: { $ne: newStudentUid },
    },
    {
      $inc: {
        pointsBalance: REFERRAL_POINT_REWARD,
        referralsCount: 1,
      },
    },
    { new: true, runValidators: true },
  );

  if (!referrer) return null;

  await AcademyStudent.updateOne(
    { firebaseUid: newStudentUid },
    {
      $set: {
        referredByCode: normalizedCode,
        referredByUid: referrer.firebaseUid,
        referredAt: new Date(),
      },
    },
  );

  await AcademyPointTransaction.create({
    studentUid: referrer.firebaseUid,
    studentEmail: referrer.email,
    type: "referral_credit",
    points: REFERRAL_POINT_REWARD,
    balanceAfter: referrer.pointsBalance,
    reference: newStudentUid,
    note: `Referral reward for ${newStudentEmail}`,
  });

  return referrer;
}
