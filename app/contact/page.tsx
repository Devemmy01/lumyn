import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Lumyn. Whether you have a project in mind, want to collaborate, or just want to say hello — we'd love to hear from you.",
  openGraph: {
    title: "Contact — Lumyn",
    description: "Start a conversation with Lumyn.",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-ivory py-28 md:py-40">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-5 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>Contact</p>
          <h1
            className="heading-display text-charcoal mb-6 text-balance animate-fade-up opacity-0 max-w-3xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Start a Conversation
          </h1>
          <p
            className="body-lg text-charcoal-muted max-w-lg animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Have a project in mind? Want to collaborate? Or just want to say hello?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <ContactForm />
    </>
  );
}
