"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function CheckoutForm({ productSlug }: { productSlug: string }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/store/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug }),
      });
      const data = await response.json();

      if (!response.ok || !data.authorizationUrl) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      setError("Could not start checkout. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field"
          disabled={submitting}
        />
        <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          We&apos;ll send your download links to this address — double check it.
        </p>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#e0554f" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Redirecting to payment…" : "Continue to payment"}
      </button>

      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        You&apos;ll pay securely with Paystack. By continuing you agree to our{" "}
        <Link href="/guides/payment-policy" className="underline" style={{ color: "#7c6cf6" }}>
          payment policy
        </Link>
        .
      </p>
    </form>
  );
}
