import { creditPurchasedPoints } from "@/lib/academy-points";
import connectDB from "@/lib/mongodb";
import AcademyPayment from "@/models/AcademyPayment";

export type FlutterwaveCharge = {
  id?: number | string;
  tx_ref?: string;
  reference?: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
  customer?: { email?: string };
};

export async function activateAcademyPayment(data: FlutterwaveCharge) {
  await connectDB();

  const reference = data.tx_ref ?? data.reference;
  if (!reference) throw new Error("Payment reference was missing.");

  const payment = await AcademyPayment.findOne({ reference });
  if (!payment) throw new Error("Payment reference was not issued by Lumyn Academy.");
  if (payment.status === "success") {
    return { payment, student: null, alreadyProcessed: true };
  }

  const verifiedAmountCents = Math.round(Number(data.amount) * 100);
  if (
    data.status !== "successful" ||
    verifiedAmountCents !== payment.amount ||
    data.currency.toUpperCase() !== payment.currency.toUpperCase()
  ) {
    payment.status = "failed";
    await payment.save();
    throw new Error("Payment verification did not match the checkout.");
  }

  payment.status = "success";
  payment.providerTransactionId = data.id?.toString();
  payment.paidAt = data.created_at ? new Date(data.created_at) : new Date();
  await payment.save();

  const student = await creditPurchasedPoints({
    studentUid: payment.studentUid,
    points: payment.points,
    reference: payment.reference,
  });

  return { payment, student, alreadyProcessed: false };
}
