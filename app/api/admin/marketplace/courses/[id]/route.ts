import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { createPaystackSplit, createPaystackSubaccount, isPaystackConfigured } from "@/lib/paystack";
import { decryptField } from "@/lib/crypto";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import AcademyStudent, { type IAcademyStudentDocument } from "@/models/AcademyStudent";

type RouteContext = { params: Promise<{ id: string }> };

const ALLOWED_STATUSES = ["published", "rejected", "archived"] as const;

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const course = await CreatorCourse.findById(id).lean();
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("[GET /api/admin/marketplace/courses/:id]", error);
    return NextResponse.json({ error: "Could not load this course." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json().catch(() => null)) as {
      status?: (typeof ALLOWED_STATUSES)[number];
      rejectionReason?: string;
    } | null;
    if (!body?.status || !ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "A valid status is required." }, { status: 400 });
    }
    if (body.status === "rejected" && !body.rejectionReason?.trim()) {
      return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
    }

    await connectDB();
    const course = await CreatorCourse.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course was not found." }, { status: 404 });
    }

    let creator: IAcademyStudentDocument | null = null;
    if (body.status === "published") {
      // First-ever approval for this creator activates their payout channel.
      // Do this BEFORE touching course.status so a Paystack failure aborts
      // the whole publish action — a course must never go live with no way
      // to pay its creator.
      creator = await AcademyStudent.findOne({ firebaseUid: course.creatorUid });
      if (creator && creator.creatorProfile?.payoutStatus !== "active") {
        if (!isPaystackConfigured()) {
          return NextResponse.json({ error: "Payments are temporarily unavailable." }, { status: 503 });
        }
        const bankDetails = creator.creatorProfile?.bankDetails;
        if (!bankDetails?.accountNumber || !bankDetails?.bankCode) {
          return NextResponse.json(
            { error: "This creator hasn't submitted payout bank details yet." },
            { status: 400 },
          );
        }
        const subaccountCode = await createPaystackSubaccount({
          businessName: bankDetails.businessName || creator.name || creator.email,
          bankCode: bankDetails.bankCode,
          accountNumber: decryptField(bankDetails.accountNumber),
        });
        const splitCode = await createPaystackSplit({
          name: `Lumyn Marketplace — ${creator.email}`,
          creatorSubaccountCode: subaccountCode,
        });
        creator.creatorProfile = {
          ...creator.creatorProfile,
          payoutStatus: "active",
          paystackSubaccountCode: subaccountCode,
          paystackSplitCode: splitCode,
          listingFee: creator.creatorProfile?.listingFee ?? { status: "unpaid" },
        };
        await creator.save();
      }
    }

    course.status = body.status;
    course.reviewedAt = new Date();
    if (body.status === "published") {
      course.publishedAt = new Date();
      course.rejectionReason = undefined;
    } else if (body.status === "rejected") {
      course.rejectionReason = body.rejectionReason?.trim();
    }

    await course.save();
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("[PATCH /api/admin/marketplace/courses/:id]", error);
    return NextResponse.json({ error: "Could not update this course." }, { status: 500 });
  }
}
