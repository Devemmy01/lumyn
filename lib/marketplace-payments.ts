import { platformSharePercent, type PaystackChargeData } from "@/lib/paystack";
import connectDB from "@/lib/mongodb";
import AcademyStudent from "@/models/AcademyStudent";
import CreatorCourse from "@/models/CreatorCourse";
import CreatorCoursePurchase from "@/models/CreatorCoursePurchase";
import MarketplacePayment from "@/models/MarketplacePayment";

function isDuplicateKeyError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000);
}

export async function activateMarketplacePayment(data: PaystackChargeData) {
  await connectDB();

  const payment = await MarketplacePayment.findOne({ reference: data.reference });
  if (!payment) throw new Error("Payment reference was not issued by Lumyn Marketplace.");
  if (payment.status === "success") {
    return { payment, alreadyProcessed: true };
  }

  if (
    data.status !== "success" ||
    Number(data.amount) !== payment.amount ||
    data.currency.toUpperCase() !== payment.currency.toUpperCase()
  ) {
    payment.status = "failed";
    await payment.save();
    throw new Error("Payment verification did not match the checkout.");
  }

  payment.status = "success";
  payment.providerTransactionId = data.id?.toString();
  payment.paidAt = data.paid_at ? new Date(data.paid_at) : new Date();
  await payment.save();

  if (payment.kind === "listing_fee") {
    await AcademyStudent.findOneAndUpdate(
      { firebaseUid: payment.studentUid },
      {
        $set: {
          "creatorProfile.listingFee.status": "paid",
          "creatorProfile.listingFee.paymentReference": payment.reference,
          "creatorProfile.listingFee.paidAt": payment.paidAt,
          "creatorProfile.payoutStatus": "pending_first_approval",
        },
      },
    );
  }

  if (payment.kind === "course_purchase" && payment.courseId) {
    const course = await CreatorCourse.findById(payment.courseId);
    if (course) {
      const platformFeeCents = Math.round((payment.amount * platformSharePercent()) / 100);
      const creatorEarningsCents = payment.amount - platformFeeCents;
      try {
        await CreatorCoursePurchase.create({
          studentUid: payment.studentUid,
          studentEmail: payment.studentEmail,
          courseId: course._id,
          courseSlug: course.slug,
          creatorUid: course.creatorUid,
          priceCentsPaid: payment.amount,
          currency: payment.currency,
          platformFeeCents,
          creatorEarningsCents,
          paymentReference: payment.reference,
        });
        course.purchaseCount += 1;
        await course.save();
      } catch (error) {
        if (!isDuplicateKeyError(error)) throw error;
      }
    }
  }

  return { payment, alreadyProcessed: false };
}
