"use client";

import Link from "next/link";
import LumynLogo from "./LumynLogo";

const footerLinks = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Philosophy", href: "/#philosophy" },
    { label: "Contact", href: "/contact" },
  ],
  Ecosystem: [
    { label: "Products", href: "/products" },
    { label: "Lumyn Academy", href: "/academy" },
  ],
  Learn: [
    { label: "Academy Pricing", href: "/academy#learning-options" },
    { label: "AI Learning Path", href: "/academy/sign-in?plan=ai-learning-path" },
    { label: "Journal", href: "/journal" },
    { label: "Mentorship", href: "/academy#mentorship" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-[color:var(--bg-primary)] pt-20 pb-10 text-[color:var(--text-primary)] dark:border-white/10">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          <div className="max-w-xs">
            <Link href="/" className="mb-6 inline-block" aria-label="Lumyn home">
              <LumynLogo />
            </Link>
            <p className="mb-6 text-sm font-medium leading-relaxed text-[color:var(--text-secondary)]">
              Thoughtfully building for the modern internet.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            {Object.entries(footerLinks).map(([cat, links]) => (
              <div key={cat} className="min-w-[120px]">
                <h4 className="mb-6 font-semibold tracking-wide text-[color:var(--text-primary)]">
                  {cat}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group relative text-sm font-medium text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[#7c6cf6]"
                      >
                        <span>{link.label}</span>
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#7c6cf6] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-black/10 pt-8 text-sm font-medium text-[color:var(--text-tertiary)] dark:border-white/10 md:flex-row">
          <p>&copy; {year} Lumyn Studio.</p>
          {/* <p className="mt-3 md:mt-0 text-center">Academy payments are securely processed by Paystack.</p> */}
        </div>
      </div>
    </footer>
  );
}
