"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function PaymentCallback() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    const reference = params.get("reference") ?? params.get("trxref");
    if (!user || !reference) {
      setError("Your payment session could not be verified. Sign in and try again.");
      return;
    }
    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/academy/payment/verify?reference=${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Payment verification failed.");
      router.replace("/academy/dashboard?payment=success");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Payment verification failed.");
    }
  }), [auth, params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-semibold">{error ? "We could not verify payment" : "Confirming your payment"}</h1>
        <p className="mt-4 text-white/55">{error || "Please keep this page open for a moment."}</p>
        {error && <Link href="/academy/dashboard" className="btn-primary mt-6">Return to dashboard</Link>}
      </div>
    </main>
  );
}
