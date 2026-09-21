import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { listingFeeCents, marketplaceCurrency, platformSharePercent } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";

export async function GET(request: NextRequest) {
  try {
    const { decoded, student } = await getVerifiedAcademyStudent(request);
    await connectDB();
    const courseCount = await CreatorCourse.countDocuments({ creatorUid: decoded.uid });
    return NextResponse.json({
      success: true,
      // Deliberately excludes bankDetails/identity — the client never needs them,
      // and there's no reason to send that data (encrypted or not) over the wire.
      creatorProfile: {
        payoutStatus: student.creatorProfile?.payoutStatus ?? "unpaid",
        listingFee: student.creatorProfile?.listingFee ?? { status: "unpaid" },
      },
      courseCount,
      pricing: {
        listingFeeCents: listingFeeCents(),
        platformSharePercent: platformSharePercent(),
        currency: marketplaceCurrency(),
      },
    });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/profile]", error);
    return NextResponse.json({ error: "Could not load your creator profile." }, { status: 500 });
  }
}
