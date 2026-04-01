"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] flex items-center bg-ivory">
      <div className="container-mid text-center">
        <p className="label-sm mb-4">Something went wrong</p>
        <h2 className="heading-lg text-charcoal mb-4">
          An unexpected error occurred
        </h2>
        <p className="body-md max-w-md mx-auto mb-8">
          We&apos;re sorry about that. You can try refreshing the page, or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
