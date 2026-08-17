import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import AcademyEnrollment from "@/models/AcademyEnrollment";
import AcademyStudent from "@/models/AcademyStudent";

const avatarUrls = new Set(Array.from({ length: 17 }, (_, index) => `/pp${index + 1}.png`));

export async function PATCH(request: NextRequest) {
  try {
    const { decoded } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as {
      name?: string;
      avatarUrl?: string;
      certificateName?: string;
    } | null;

    const name = body?.name?.trim();
    const avatarUrl = body?.avatarUrl?.trim();
    const certificateName = body?.certificateName?.trim();

    if (!name || name.length > 120) {
      return NextResponse.json(
        { success: false, error: "Enter a profile name up to 120 characters." },
        { status: 400 },
      );
    }

    if (avatarUrl && !avatarUrls.has(avatarUrl)) {
      return NextResponse.json(
        { success: false, error: "Choose one of the available Lumyn avatars." },
        { status: 400 },
      );
    }

    if (certificateName && certificateName.length > 120) {
      return NextResponse.json(
        { success: false, error: "Enter a certificate name up to 120 characters." },
        { status: 400 },
      );
    }

    const unsetFields: Record<string, ""> = {};
    if (!avatarUrl) unsetFields.avatarUrl = "";
    if (!certificateName) unsetFields.certificateName = "";

    const student = await AcademyStudent.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      {
        $set: {
          name,
          ...(avatarUrl ? { avatarUrl } : {}),
          ...(certificateName ? { certificateName } : {}),
        },
        ...(Object.keys(unsetFields).length ? { $unset: unsetFields } : {}),
      },
      { new: true, runValidators: true },
    );

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Academy student account was not found." },
        { status: 404 },
      );
    }

    if (certificateName) {
      await AcademyEnrollment.updateMany(
        { studentUid: decoded.uid, certificate: { $exists: true } },
        { $set: { "certificate.certificateName": certificateName } },
      );
    } else {
      await AcademyEnrollment.updateMany(
        { studentUid: decoded.uid, certificate: { $exists: true } },
        { $unset: { "certificate.certificateName": "" } },
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        email: student.email,
        avatarUrl: student.avatarUrl,
        certificateName: student.certificateName,
        role: student.role,
        diamondsBalance: student.diamondsBalance ?? 0,
        referralCode: student.referralCode,
        referralsCount: student.referralsCount ?? 0,
        subscription: student.subscription,
        mentorshipStatus: student.mentorshipStatus,
      },
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 503 },
      );
    }
    console.error("[PATCH /api/academy/profile]", error);
    return NextResponse.json(
      { success: false, error: "Could not update your profile." },
      { status: 500 },
    );
  }
}
