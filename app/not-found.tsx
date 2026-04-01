import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-ivory min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
      <div className="container-mid relative text-center">
        <p className="text-8xl md:text-9xl font-semibold text-stone tracking-tight mb-6" aria-hidden="true">
          404
        </p>
        <h1 className="heading-lg text-charcoal mb-4">Page not found</h1>
        <p className="body-md max-w-md mx-auto mb-10">
          This page doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/journal" className="btn-secondary">
            Read the Journal
          </Link>
        </div>
      </div>
    </section>
  );
}
