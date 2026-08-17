import { randomBytes } from "crypto";
import { REFERRALS_PER_DIAMOND } from "@/lib/academy";
import { awardReferralDiamonds } from "@/lib/academy-diamonds";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

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

  const previousReferrer = await AcademyStudent.findOne({
    referralCode: normalizedCode,
    firebaseUid: { $ne: newStudentUid },
  });
  if (!previousReferrer) return null;
  const referralsBefore = previousReferrer.referralsCount ?? 0;

  const referrer = await AcademyStudent.findOneAndUpdate(
    {
      referralCode: normalizedCode,
      firebaseUid: { $ne: newStudentUid },
    },
    {
      $inc: {
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

  const referralsAfter = referrer.referralsCount ?? referralsBefore + 1;
  const diamondsEarned =
    Math.floor(referralsAfter / REFERRALS_PER_DIAMOND) -
    Math.floor(referralsBefore / REFERRALS_PER_DIAMOND);
  if (diamondsEarned > 0) {
    await awardReferralDiamonds({
      studentUid: referrer.firebaseUid,
      studentEmail: referrer.email,
      diamonds: diamondsEarned,
      reference: `${newStudentUid}:${newStudentEmail}`,
    });
  }

  return referrer;
}
