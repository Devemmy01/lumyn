import Link from "next/link";
import clsx from "clsx";

interface CTAProps {
  headline: string;
  subtext?: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  variant?: "default" | "dark" | "sage";
  centered?: boolean;
}

export default function CTA({
  headline,
  subtext,
  primaryCTA,
  secondaryCTA,
  variant = "default",
  centered = true,
}: CTAProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl p-10 md:p-16",
        variant === "default" && "bg-ivory-200/80 border border-stone/60",
        variant === "dark" && "bg-charcoal",
        variant === "sage" && "bg-sage/10 border border-sage/20",
        centered && "text-center"
      )}
    >
      <h2
        className={clsx(
          "heading-md mb-4 text-balance",
          variant === "dark" ? "text-ivory" : "text-charcoal"
        )}
      >
        {headline}
      </h2>

      {subtext && (
        <p
          className={clsx(
            "text-base md:text-lg leading-relaxed mb-8 max-w-xl",
            centered && "mx-auto",
            variant === "dark" ? "text-ivory/60" : "text-charcoal-muted"
          )}
        >
          {subtext}
        </p>
      )}

      <div
        className={clsx(
          "flex flex-col sm:flex-row gap-4",
          centered && "justify-center"
        )}
      >
        <Link
          href={primaryCTA.href}
          className={clsx(
            variant === "dark"
              ? "inline-flex items-center gap-2 px-7 py-3.5 bg-ivory text-charcoal font-medium rounded-xl hover:bg-ivory-200 transition-all duration-300 text-sm"
              : "btn-primary"
          )}
        >
          {primaryCTA.label}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {secondaryCTA && (
          <Link
            href={secondaryCTA.href}
            className={clsx(
              variant === "dark"
                ? "inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-ivory/70 font-medium rounded-xl border border-ivory/20 hover:border-ivory/40 hover:text-ivory transition-all duration-300 text-sm"
                : "btn-secondary"
            )}
          >
            {secondaryCTA.label}
          </Link>
        )}
      </div>
    </div>
  );
}
