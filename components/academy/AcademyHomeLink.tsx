"use client";

import type { MouseEvent, ReactNode } from "react";

type AcademyHomeLinkProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

function isStandalonePwa() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.matchMedia?.("(display-mode: fullscreen)").matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export default function AcademyHomeLink({
  children,
  className,
  label = "Academy home",
}: AcademyHomeLinkProps) {
  function openAcademyHome(event: MouseEvent<HTMLAnchorElement>) {
    if (!isStandalonePwa()) return;

    event.preventDefault();
    window.open(new URL("/academy", window.location.origin).toString(), "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href="/academy"
      aria-label={label}
      className={className}
      rel="noopener noreferrer external"
      onClick={openAcademyHome}
    >
      {children}
    </a>
  );
}
