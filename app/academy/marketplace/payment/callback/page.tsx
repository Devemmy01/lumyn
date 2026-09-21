import { Suspense } from "react";
import MarketplacePaymentCallback from "@/components/academy/MarketplacePaymentCallback";

export default function MarketplacePaymentCallbackPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#050505]" />}>
      <MarketplacePaymentCallback />
    </Suspense>
  );
}
