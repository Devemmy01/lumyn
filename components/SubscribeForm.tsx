"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setMessage(data.message || "Successfully subscribed!");
      setEmail("");
    } catch (error: unknown) {
      setStatus("error");
      const msg = error instanceof Error ? error.message : "Failed to subscribe. Please try again.";
      setMessage(msg);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="w-full px-3 py-2.5 bg-ivory/10 border border-ivory/10 rounded-lg text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-sage/50 transition-colors duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-2.5 bg-sage hover:bg-sage-dark text-ivory text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin h-4 w-4 text-ivory" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {message && (
        <p className={`text-xs animate-fade-in ${
          status === "success" ? "text-sage" : "text-red-400"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
