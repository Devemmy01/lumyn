"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/academy/dashboard/LoadingStates";

type Bank = { name: string; code: string };
type Pricing = { listingFeeCents: number; platformSharePercent: number; currency: string } | null;

export function ListingFeeModal({
  getToken,
  pricing,
  onClose,
}: {
  getToken: () => Promise<string | null>;
  pricing: Pricing;
  onClose: () => void;
}) {
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [legalName, setLegalName] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [acceptedGuidelines, setAcceptedGuidelines] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const token = await getToken();
      if (!token) return;
      const response = await fetch("/api/marketplace/creator/banks", { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (response.ok) setBanks(payload.banks ?? []);
    })();
  }, [getToken]);

  useEffect(() => {
    setResolvedName(null);
    if (accountNumber.length !== 10 || !bankCode) return;
    const timeout = setTimeout(async () => {
      setResolving(true);
      try {
        const token = await getToken();
        if (!token) return;
        const response = await fetch(
          `/api/marketplace/creator/resolve-account?accountNumber=${accountNumber}&bankCode=${bankCode}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const payload = await response.json();
        if (response.ok) setResolvedName(payload.accountName);
      } finally {
        setResolving(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [accountNumber, bankCode, getToken]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again.");
      const response = await fetch("/api/marketplace/creator/listing-fee/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessName, bankCode, accountNumber, legalName, idType, idNumber, acceptedGuidelines }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not start checkout.");
      window.location.href = payload.authorizationUrl;
    } catch (submitError) {
      setSubmitting(false);
      setError(submitError instanceof Error ? submitError.message : "Could not start checkout.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[1.75rem] border border-black/[0.08] bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#151621]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
          One-time creator fee
        </p>
        <h2 className="mt-2 text-xl font-semibold">Set up payouts</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Pay the one-time listing fee and tell us where to send your earnings. This unlocks unlimited course
          submissions — no fee on future courses.
        </p>
        {pricing && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-xs font-semibold text-neutral-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white/60">
            <span>
              You&apos;ll be charged {pricing.currency} {(pricing.listingFeeCents / 100).toFixed(2)} now
            </span>
            <span>Lumyn keeps {pricing.platformSharePercent}% of every future sale</span>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-500 dark:text-red-300">{error}</p>}

        <div className="mt-5 space-y-3">
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Business or full name"
            className="input-field"
          />
          <select
            value={bankCode}
            onChange={(event) => setBankCode(event.target.value)}
            className="input-field bg-[#14151f]"
            style={{ colorScheme: "dark" }}
          >
            <option value="" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              {banks === null ? "Loading banks…" : "Select your bank"}
            </option>
            {banks?.map((bank) => (
              <option key={bank.code} value={bank.code} style={{ backgroundColor: "#14151f", color: "#fff" }}>
                {bank.name}
              </option>
            ))}
          </select>
          <input
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10-digit account number"
            inputMode="numeric"
            className="input-field"
          />
          {resolving && <p className="text-xs text-neutral-500">Checking account…</p>}
          {resolvedName && (
            <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              {resolvedName}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
            Identity verification
          </p>
          <p className="text-xs leading-5 text-neutral-500">
            We manually verify creator identity before your first course goes live. This stays on file with your
            payout details and isn&apos;t shared with students.
          </p>
          <input
            value={legalName}
            onChange={(event) => setLegalName(event.target.value)}
            placeholder="Full legal name (as on your ID)"
            className="input-field"
          />
          <select
            value={idType}
            onChange={(event) => setIdType(event.target.value)}
            className="input-field bg-[#14151f]"
            style={{ colorScheme: "dark" }}
          >
            <option value="" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              ID type
            </option>
            <option value="nin" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              National ID (NIN)
            </option>
            <option value="bvn" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              Bank Verification Number (BVN)
            </option>
            <option value="passport" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              International Passport
            </option>
            <option value="drivers_license" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              Driver&apos;s License
            </option>
            <option value="voters_card" style={{ backgroundColor: "#14151f", color: "#fff" }}>
              Voter&apos;s Card
            </option>
          </select>
          <input
            value={idNumber}
            onChange={(event) => setIdNumber(event.target.value)}
            placeholder="ID number"
            className="input-field"
          />
        </div>

        <div className="mt-6 rounded-xl border border-black/[0.08] bg-black/[0.02] p-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6c5ce7] dark:text-[#b9b1ff]">
            Content guidelines
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-neutral-500">
            <li>• Your course must be entirely your own original work — you own the rights to it, or have explicit permission to use every piece of included material.</li>
            <li>• No copyrighted video, music, code, text, or images you don&apos;t have rights to. Copied or reused content will be rejected, and repeat violations may get you removed from the marketplace.</li>
            <li>• Video and audio must be clear and watchable, and course content must actually deliver on what it promises.</li>
          </ul>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-neutral-600 dark:text-white/70">
            <input
              type="checkbox"
              checked={acceptedGuidelines}
              onChange={(event) => setAcceptedGuidelines(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 accent-[#7c6cf6] dark:border-white/20"
            />
            <span>I confirm this is original content I have the rights to, contains no copyrighted material I don&apos;t own, and meets Lumyn&apos;s quality guidelines above.</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={
              submitting ||
              !businessName.trim() ||
              !bankCode ||
              accountNumber.length !== 10 ||
              !legalName.trim() ||
              !idType ||
              !idNumber.trim() ||
              !acceptedGuidelines
            }
            onClick={() => void submit()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#6b5bdd] disabled:opacity-50"
          >
            {submitting && <LoadingSpinner />}
            Pay & continue
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/[0.08] px-5 py-3 text-sm font-semibold text-neutral-600 dark:border-white/10 dark:text-white/65"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
