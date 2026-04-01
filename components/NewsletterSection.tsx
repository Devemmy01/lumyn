"use client";

import { useState, FormEvent } from "react";

interface NewsletterSectionProps {
  compact?: boolean;
}

export default function NewsletterSection({ compact = false }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message ?? "Successfully subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading" || status === "success"}
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="btn-primary shrink-0 px-5 py-3 text-xs"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center">
      {status === "success" ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10l4 4 8-8" stroke="#7C6CF6" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-medium text-charcoal">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === "loading"}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary shrink-0"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
