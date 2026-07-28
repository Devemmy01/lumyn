import { POINTS_PER_GENERATION, STARTER_ACADEMY_POINTS } from "@/lib/academy";
import connectDB from "@/lib/mongodb";
import AcademyPointTransaction from "@/models/AcademyPointTransaction";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

export async function ensureStarterAcademyPoints(student: IAcademyStudentDocument): Promise<IAcademyStudentDocument> {
  if (typeof student.pointsBalance === "number" && student.starterPointsGrantedAt) {
    return student;
  }

  await connectDB();
  const updated = await AcademyStudent.findOneAndUpdate(
    {
      _id: student._id,
      $or: [
        { pointsBalance: { $exists: false } },
        { starterPointsGrantedAt: { $exists: false } },
      ],
    },
    {
      $set: {
        pointsBalance: STARTER_ACADEMY_POINTS,
        starterPointsGrantedAt: new Date(),
      },
    },
    { new: true }
  );

  if (updated) {
    await AcademyPointTransaction.create({
      studentUid: updated.firebaseUid,
      studentEmail: updated.email,
      type: "starter_grant",
      points: STARTER_ACADEMY_POINTS,
      balanceAfter: updated.pointsBalance,
      note: "Starter Academy points",
    });
    return updated;
  }

  return student;
}

export async function grantAcademyPoints({
  email,
  points,
  note,
  createdBy,
}: {
  email: string;
  points: number;
  note?: string;
  createdBy?: string;
}) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { $inc: { pointsBalance: points } },
    { new: true, runValidators: true }
  );
  if (!student) throw new Error("No Academy account exists for that email yet.");

  await AcademyPointTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "admin_grant",
    points,
    balanceAfter: student.pointsBalance,
    note,
    createdBy,
  });

  return student;
}

export async function creditPurchasedPoints({
  studentUid,
  points,
  reference,
}: {
  studentUid: string;
  points: number;
  reference: string;
}) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid },
    { $inc: { pointsBalance: points } },
    { new: true, runValidators: true }
  );
  if (!student) throw new Error("Student account was not found.");

  await AcademyPointTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "purchase",
    points,
    balanceAfter: student.pointsBalance,
    reference,
    note: "Flutterwave point purchase",
  });

  return student;
}

export async function reserveGenerationPoints(studentUid: string) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid, pointsBalance: { $gte: POINTS_PER_GENERATION } },
    { $inc: { pointsBalance: -POINTS_PER_GENERATION } },
    { new: true, runValidators: true }
  );

  if (!student) {
    throw new Error(`You need ${POINTS_PER_GENERATION} points to generate a learning path.`);
  }

  await AcademyPointTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "generation_debit",
    points: -POINTS_PER_GENERATION,
    balanceAfter: student.pointsBalance,
    note: "AI learning path generation",
  });

  return student;
}

export async function refundGenerationPoints(studentUid: string) {
  await connectDB();
  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid },
    { $inc: { pointsBalance: POINTS_PER_GENERATION } },
    { new: true, runValidators: true }
  );
  if (!student) return null;

  await AcademyPointTransaction.create({
    studentUid: student.firebaseUid,
    studentEmail: student.email,
    type: "refund",
    points: POINTS_PER_GENERATION,
    balanceAfter: student.pointsBalance,
    note: "Generation failed before course creation",
  });

  return student;
}
