import clsx from "clsx";
import Image from "next/image";

type LumynLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function LumynLogo({ compact = false, className }: LumynLogoProps) {
  return (
    <span
      className={clsx("inline-flex items-center gap-3 text-[color:var(--text-primary)]", className)}
      aria-label="Lumyn"
    >
      <Image
        src="/logomainwhite.png"
        alt="Lumyn Logo"
        width={compact ? 96 : 120}
        height={compact ? 30 : 38}
        className="block dark:hidden"
        priority
      />
      <Image
        src="/logomain.png"
        alt="Lumyn Logo"
        width={compact ? 96 : 120}
        height={compact ? 30 : 38}
        className="hidden dark:block"
        priority
      />
    </span>
  );
}
