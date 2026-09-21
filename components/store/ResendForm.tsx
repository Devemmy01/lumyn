"use client";

import { useState, type FormEvent } from "react";

const GENERIC_MESSAGE = "If we have orders on file for that email, we've sent fresh links.";

export default function ResendForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await fetch("/api/store/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Same message either way — this endpoint never reveals whether the email exists.
    } finally {
      setMessage(GENERIC_MESSAGE);
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <p className="body-sm" role="status">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="resend-email" className="mb-2 block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Email address
        </label>
        <input
          id="resend-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-field"
          disabled={submitting}
        />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send my download links"}
      </button>
    </form>
  );
}
