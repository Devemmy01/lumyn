import { Suspense } from "react";
import PaymentCallback from "@/components/academy/PaymentCallback";

export default function AcademyPaymentCallbackPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#050505]" />}><PaymentCallback /></Suspense>;
}
