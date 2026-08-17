import clsx from "clsx";
import Image from "next/image";

type AcademyLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function AcademyLogo({ compact = false, className }: AcademyLogoProps) {
  return (
    <span
      className={clsx(
        "group inline-flex items-center gap-2.5 text-[#18131f] dark:text-white",
        className,
      )}
      aria-label="Lumyn Academy"
    >
      <span className="relative shrink-0" aria-hidden="true">
        <Image
          src="/logomainwhite.png"
          alt=""
          width={compact ? 84 : 104}
          height={compact ? 27 : 33}
          sizes={compact ? "84px" : "104px"}
          className="block dark:hidden"
          priority
        />
        <Image
          src="/logomain.png"
          alt=""
          width={compact ? 84 : 104}
          height={compact ? 27 : 33}
          sizes={compact ? "84px" : "104px"}
          className="hidden dark:block"
          priority
        />
      </span>
      
    </span>
  );
}
