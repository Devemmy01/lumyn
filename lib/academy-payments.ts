import connectDB from "@/lib/mongodb";
import AcademyPayment from "@/models/AcademyPayment";
import AcademyStudent from "@/models/AcademyStudent";

type PaystackCharge = {
  id?: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string;
  metadata?: { studentUid?: string; planId?: string } | string;
  customer?: { email?: string; customer_code?: string };
  subscription?: { subscription_code?: string; email_token?: string; next_payment_date?: string };
};

export async function activateAcademyPayment(data: PaystackCharge) {
  await connectDB();
  const payment = await AcademyPayment.findOne({ reference: data.reference });
  if (!payment) throw new Error("Payment reference was not issued by Lumyn Academy.");
  if (data.status !== "success" || data.amount !== payment.amount ||
      data.currency.toUpperCase() !== payment.currency.toUpperCase()) {
    throw new Error("Payment verification did not match the checkout.");
  }

  const paidAt = data.paid_at ? new Date(data.paid_at) : new Date();
  const nextDate = data.subscription?.next_payment_date
    ? new Date(data.subscription.next_payment_date)
    : new Date(paidAt.getTime() + 31 * 24 * 60 * 60 * 1000);

  payment.status = "success";
  payment.providerTransactionId = data.id?.toString();
  payment.paidAt = paidAt;
  await payment.save();

  const student = await AcademyStudent.findOneAndUpdate(
    { firebaseUid: payment.studentUid },
    {
      $set: {
        "subscription.planId": payment.planId,
        "subscription.status": "active",
        "subscription.provider": "paystack",
        "subscription.currentPeriodEnd": nextDate,
        "subscription.customerCode": data.customer?.customer_code,
        "subscription.subscriptionCode": data.subscription?.subscription_code,
        "subscription.emailToken": data.subscription?.email_token,
        "subscription.cancelAtPeriodEnd": false,
      },
    },
    { new: true }
  );
  if (!student) throw new Error("Student account was not found.");
  return { payment, student };
}
