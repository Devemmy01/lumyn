import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[76vh] items-center overflow-hidden bg-[color:var(--bg-secondary)]">
      <div className="pointer-events-none absolute -left-40 top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#7c6cf6]/15 blur-[130px]" />
      <div className="container-mid relative text-center">
        <p className="mb-6 font-[Georgia] text-8xl font-normal italic tracking-[-0.06em] text-[#897af8] md:text-9xl" aria-hidden="true">
          404
        </p>
        <h1 className="mb-5 text-4xl font-medium tracking-[-0.045em] text-[color:var(--text-primary)] md:text-7xl">This path ends here.</h1>
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
