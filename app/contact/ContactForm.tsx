"use client";

import { useState, FormEvent } from "react";
import SectionWrapper from "@/components/SectionWrapper";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setResponseMessage(data.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setResponseMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setResponseMessage("Failed to send. Please try again.");
    }
  }

  return (
    <>
      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Form */}
          <div className="rounded-[2rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-5 sm:p-8 lg:p-10">
            <p className="label-sm mb-5">Project note</p>
            <h2 className="mb-8 text-3xl font-medium tracking-[-0.04em] text-[color:var(--text-primary)] md:text-5xl">Tell us what needs to move.</h2>

            {status === "success" ? (
              <div className=" bg-sage/10 border border-sage/20 p-8 text-center rounded-2xl">
                <div className="w-14 h-14 rounded-2xl bg-sage/15 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12l5 5 9-9" stroke="#7C6CF6" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">Message Sent</h3>
                <p className="text-charcoal-muted">{responseMessage}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 btn-secondary"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-charcoal mb-2">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      required
                      disabled={status === "loading"}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-charcoal mb-2">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      required
                      disabled={status === "loading"}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-charcoal mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're thinking about..."
                    required
                    rows={6}
                    disabled={status === "loading"}
                    className="textarea-field"
                  />
                </div>

                {status === "error" && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {responseMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full gap-3 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                                strokeDasharray="31.416" strokeDashoffset="10" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <aside className="space-y-6" aria-label="Contact information">
            <div className="rounded-[1.75rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-6">
              <h3 className="font-semibold text-charcoal mb-3 tracking-tight">What We Work On</h3>
              <ul className="space-y-2 text-sm text-charcoal-muted">
                {[
                  "Full-stack web applications",
                  "High-performance digital tools",
                  "Progressive Web Apps (PWAs)",
                  "Internal productivity tools",
                  "Modern engineering solutions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c6cf6]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="dark-visual rounded-[1.75rem] border border-white/10 bg-[#09090b] p-6 text-white">
              <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">What to expect</p>
              <h3 className="text-2xl font-medium tracking-[-0.035em] text-white">A thoughtful response, not a sales sequence.</h3>
              <p className="mt-4 text-sm leading-7 text-white/55">
                We read every message and respond with a useful next step.
              </p>
            </div>
          </aside>
        </div>
      </SectionWrapper>
    </>
  );
}
