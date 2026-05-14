import { ReactNode } from "react";
import clsx from "clsx";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
  container?: "narrow" | "mid" | "wide";
  separator?: boolean;
}

export default function SectionWrapper({
  children,
  className,
  id,
  background = "default",
  size = "md",
  container = "wide",
  separator = false,
}: SectionWrapperProps) {
  return (
    <>
      {/* Optional section separator */}
      {separator && (
        <div
          className="mx-auto w-full max-w-5xl px-8"
          style={{
            borderTop: "1px solid var(--border-primary)",
          }}
          aria-hidden="true"
        />
      )}

      <section
        id={id}
        className={clsx(
          "relative overflow-hidden transition-colors duration-300",
          size === "sm" && "py-14 md:py-20",
          size === "md" && "py-20 md:py-28 lg:py-36",
          size === "lg" && "py-28 md:py-36 lg:py-48",
          className
        )}
        style={{
          backgroundColor:
            background === "secondary" ? "var(--bg-secondary)" : "var(--bg-primary)",
        }}
      >
        {/* Subtle radial gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124, 108, 246, 0.05) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div
          className={clsx(
            "relative z-10",
            container === "narrow" && "container-narrow",
            container === "mid" && "container-mid",
            container === "wide" && "container-wide"
          )}
        >
          {children}
        </div>
      </section>
    </>
  );
}
