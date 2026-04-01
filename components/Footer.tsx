"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const footerLinks = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Philosophy", href: "/philosophy" },
    { label: "Contact", href: "/contact" },
  ],
  Products: [
    { label: "Mindfuel", href: "/products#mindfuel" },
    { label: "Summai", href: "/products#summai" },
    { label: "EdTurbo", href: "/products#edturbo" },
    { label: "All Products", href: "/products" },
  ],
  Journal: [
    { label: "All Articles", href: "/journal" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory/80">
      <div className="container-wide pt-16 pb-8 md:pt-20">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-ivory/10">
          {/* Brand */}
          <div className="lg:col-span-2 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <Image src="/footer.png" alt="Lumyn" width={120} height={120} className="h-8 w-auto" />
            </Link>

            <p className="text-ivory/60 text-sm leading-relaxed mb-6">
              A calm digital product studio building intelligent tools
              designed to remove noise and restore clarity.
            </p>

            {/* Newsletter mini */}
            <div>
              <p className="text-xs font-medium text-ivory/40 tracking-widest uppercase mb-3">
                Stay in the loop
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-ivory/40 tracking-widest uppercase mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8">
          <p className="text-xs text-ivory/30">
            &copy; {year} Lumyn. Built with restraint.
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
        throw new Error(data.error || "Error subscribing");
      }

      setStatus("success");
      setMessage(data.message || "Subscribed!");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed");
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 min-w-0 px-3 py-2 bg-ivory/10 border border-ivory/10 rounded-lg
                     text-sm text-ivory placeholder-ivory/30 focus:outline-none
                     focus:border-sage/50 transition-colors duration-200 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-sage hover:bg-sage-dark text-ivory text-sm font-medium
                     rounded-lg transition-all duration-200 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {message && (
        <p className={`text-[10px] uppercase tracking-wider font-semibold animate-fade-in ${
          status === "success" ? "text-sage" : "text-red-400"
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}
