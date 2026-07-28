"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

type PaymentCallbackState = {
  detail: string;
  message: string;
  status: "checking" | "success" | "error";
};

export default function PaymentCallback() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const params = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<PaymentCallbackState>({
    detail: "Please keep this page open for a moment.",
    message: "Confirming your payment",
    status: "checking",
  });

  useEffect(() => {
    let redirectTimer: number | undefined;
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const reference = params.get("tx_ref") ?? params.get("reference") ?? params.get("trxref");
      const transactionId = params.get("transaction_id");
      const providerStatus = params.get("status")?.toLowerCase();

      if (providerStatus && ["cancelled", "canceled", "failed"].includes(providerStatus)) {
        setState({
          detail: "No Academy points were added. You can return to billing and try again whenever you are ready.",
          message: providerStatus === "failed" ? "Payment failed" : "Payment was cancelled",
          status: "error",
        });
        return;
      }

      if (!user || (!reference && !transactionId)) {
        setState({
          detail: "No Academy points were added. Sign in again, then retry the purchase from billing.",
          message: "Your payment session could not be verified",
          status: "error",
        });
        return;
      }

      try {
        const token = await user.getIdToken();
        const query = new URLSearchParams();
        if (reference) query.set("tx_ref", reference);
        if (transactionId) query.set("transaction_id", transactionId);
        const response = await fetch(`/api/academy/payment/verify?${query.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json() as { alreadyProcessed?: boolean; balance?: number; error?: string; points?: number };
        if (!response.ok) throw new Error(payload.error ?? "Payment verification failed.");
        if (!isMounted) return;

        const pointsText = typeof payload.points === "number" ? `${payload.points} Academy points` : "Your Academy points";
        const balanceText = typeof payload.balance === "number" ? ` Your new balance is ${payload.balance} points.` : "";
        setState({
          detail: payload.alreadyProcessed
            ? "This payment had already been processed. Redirecting you back to the dashboard."
            : `${pointsText} have been added.${balanceText} Redirecting you back to the dashboard.`,
          message: "Payment confirmed",
          status: "success",
        });
        redirectTimer = window.setTimeout(() => {
          router.replace("/academy/dashboard?payment=success");
        }, 1400);
      } catch (reason) {
        if (!isMounted) return;
        setState({
          detail: reason instanceof Error ? reason.message : "Payment verification failed.",
          message: "We could not verify payment",
          status: "error",
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (redirectTimer) window.clearTimeout(redirectTimer);
    };
  }, [auth, params, router]);

  const isChecking = state.status === "checking";
  const isSuccess = state.status === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black ${
          isSuccess ? "border-[#7c6cf6]/40 bg-[#7c6cf6]/15 text-[#c9c2ff]" : state.status === "error" ? "border-amber-400/35 bg-amber-400/10 text-amber-200" : "border-white/10 bg-white/[0.05] text-white"
        }`}>
          {isChecking ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" /> : isSuccess ? "OK" : "!"}
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b9b1ff]">{isSuccess ? "Transaction complete" : state.status === "error" ? "Transaction not completed" : "Secure verification"}</p>
        <h1 className="mt-3 text-3xl font-semibold">{state.message}</h1>
        <p className="mt-4 text-sm leading-6 text-white/55">{state.detail}</p>
        {state.status === "error" && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/academy/dashboard" className="btn-secondary flex-1">Return to dashboard</Link>
            <Link href="/academy/dashboard/billing" className="btn-primary flex-1">Try again</Link>
          </div>
        )}
        {isSuccess && <Link href="/academy/dashboard?payment=success" className="btn-primary mt-7">Go to dashboard</Link>}
      </div>
    </main>
  );
}
