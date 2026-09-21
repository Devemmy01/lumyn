import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { initializeCoursePurchase, isPaystackConfigured } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import CreatorCourse from "@/models/CreatorCourse";
import CreatorCoursePurchase from "@/models/CreatorCoursePurchase";
import MarketplacePayment from "@/models/MarketplacePayment";
import AcademyStudent from "@/models/AcademyStudent";

function getValidOrigin(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}

function getCheckoutBaseUrl(request: NextRequest) {
  const requestOrigin =
    getValidOrigin(request.headers.get("origin")) ??
    getValidOrigin(request.headers.get("referer")) ??
    getValidOrigin(request.nextUrl.origin);
  const configuredOrigin = getValidOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (process.env.NODE_ENV !== "production") {
    return requestOrigin ?? configuredOrigin ?? request.nextUrl.origin;
  }
  return configuredOrigin ?? requestOrigin ?? request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please contact Lumyn support." },
        { status: 503 },
      );
    }

    const { decoded, student } = await getVerifiedAcademyStudent(request);
    const body = (await request.json().catch(() => null)) as { courseId?: string } | null;
    const courseId = body?.courseId;
    if (!courseId) {
      return NextResponse.json({ error: "A course is required." }, { status: 400 });
    }

    await connectDB();
    const course = await CreatorCourse.findOne({ _id: courseId, status: "published" });
    if (!course) {
      return NextResponse.json({ error: "This course is not available for purchase." }, { status: 404 });
    }
    if (course.creatorUid === decoded.uid) {
      return NextResponse.json({ error: "You can't purchase your own course." }, { status: 400 });
    }

    const alreadyOwned = await CreatorCoursePurchase.exists({
      studentUid: decoded.uid,
      courseId: course._id,
      status: "active",
    });
    if (alreadyOwned) {
      return NextResponse.json({ error: "You already own this course." }, { status: 400 });
    }

    const creator = await AcademyStudent.findOne({ firebaseUid: course.creatorUid });
    const splitCode = creator?.creatorProfile?.paystackSplitCode;
    if (!splitCode) {
      return NextResponse.json({ error: "This course's creator isn't set up to receive payments yet." }, { status: 400 });
    }

    const reference = `marketplace-purchase-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const redirectUrl = new URL("/academy/marketplace/payment/callback", getCheckoutBaseUrl(request)).toString();

    const data = await initializeCoursePurchase({
      email: student.email,
      amountCents: course.priceCents,
      currency: course.currency,
      reference,
      callbackUrl: redirectUrl,
      splitCode,
      metadata: { studentUid: decoded.uid, courseId: course._id.toString() },
    });

    await MarketplacePayment.create({
      reference,
      studentUid: decoded.uid,
      studentEmail: student.email,
      kind: "course_purchase",
      courseId: course._id.toString(),
      amount: course.priceCents,
      currency: course.currency,
      status: "pending",
      provider: "paystack",
      splitSnapshot: { splitCode },
    });

    return NextResponse.json({ success: true, authorizationUrl: data.authorization_url, reference });
  } catch (error) {
    console.error("[marketplace purchase initialize]", error);
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 },
    );
  }
}
