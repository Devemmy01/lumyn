import { ReactNode } from "react";
import clsx from "clsx";

interface SectionWrapperProps {
  children:    ReactNode;
  className?:  string;
  id?:         string;
  background?: "default" | "tinted" | "dark";
  size?:       "sm" | "md" | "lg";
  container?:  "narrow" | "mid" | "wide";
  /** Adds a subtle violet radial glow anchored to a corner */
  glow?:       "top-right" | "top-left" | "bottom-center";
  /** Renders a hairline gradient separator above the section */
  separator?:  boolean;
}

const glowStyles: Record<string, string> = {
  "top-right":
    "radial-gradient(ellipse 65% 50% at 90% 0%, rgba(124,108,246,0.055) 0%, transparent 65%)",
  "top-left":
    "radial-gradient(ellipse 60% 45% at 10% 0%, rgba(124,108,246,0.05) 0%, transparent 60%)",
  "bottom-center":
    "radial-gradient(ellipse 80% 55% at 50% 100%, rgba(124,108,246,0.045) 0%, transparent 65%)",
};

export default function SectionWrapper({
  children,
  className,
  id,
  background = "default",
  size       = "md",
  container  = "wide",
  glow,
  separator  = false,
}: SectionWrapperProps) {
  return (
    <>
      {/* Optional section separator */}
      {separator && (
        <div className="section-divider mx-auto w-full max-w-5xl px-8" aria-hidden="true" />
      )}

      <section
        id={id}
        className={clsx(
          "relative overflow-hidden",
          background === "default" && "bg-ivory",
          background === "tinted" && "bg-ivory-200/70",
          background === "dark"    && "bg-charcoal",
          size === "sm" && "py-14 md:py-20",
          size === "md" && "py-20 md:py-28 lg:py-36",
          size === "lg" && "py-28 md:py-36 lg:py-48",
          className
        )}
      >
        {/* Optional ambient violet glow */}
        {glow && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: glowStyles[glow] }}
            aria-hidden="true"
          />
        )}

        <div
          className={clsx(
            "relative z-10",
            container === "narrow" && "container-narrow",
            container === "mid"    && "container-mid",
            container === "wide"   && "container-wide"
          )}
        >
          {children}
        </div>
      </section>
    </>
  );
}
