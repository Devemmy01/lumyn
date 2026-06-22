"use client";

import { useState, type FormEvent } from "react";

export default function MentorshipApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      setStatus("submitting");
      setMessage("");

      const response = await fetch("/api/academy/mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          level: formData.get("level"),
          goal: formData.get("goal"),
          availability: formData.get("availability"),
          message: formData.get("message"),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not submit application.");
      }

      form.reset();
      setStatus("success");
      setMessage("Your mentorship application has been received.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not submit application.");
    }
  }

  return (
    <form
      id="mentorship-application"
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8"
    >
      <p className="label-sm mb-4 text-white/35">Application</p>
      <h3 className="mb-6 text-3xl font-medium tracking-tight text-white">
        Apply for Guided Mentorship.
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Name
          </span>
          <input name="name" className="input-field" required />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Email
          </span>
          <input name="email" type="email" className="input-field" required />
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Current level
          </span>
          <select name="level" className="input-field" required defaultValue="Beginner">
            <option className="text-gray-600" value="Beginner">
              Beginner
            </option>
            <option className="text-gray-600" value="Intermediate">
              Intermediate
            </option>
            <option className="text-gray-600" value="Advanced">
              Advanced
            </option>
            <option className="text-gray-600" value="Career switcher">
              Career switcher
            </option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Availability
          </span>
          <input
            name="availability"
            className="input-field"
            placeholder="Weekends, evenings, or weekdays"
            required
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Goal
          </span>
          <input
            name="goal"
            className="input-field"
            placeholder="What do you want mentorship to help you achieve?"
            required
          />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Notes
          </span>
          <textarea
            name="message"
            className="textarea-field"
            placeholder="Share your background, project idea, or biggest blocker."
          />
        </label>
      </div>

      {message && (
        <p
          className={`mt-5 rounded-2xl border p-4 text-sm ${
            status === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-100"
          }`}
        >
          {message}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-6 w-full">
        {status === "submitting" ? "Submitting..." : "Apply for Mentorship"}
      </button>
    </form>
  );
}
