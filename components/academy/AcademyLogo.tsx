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
        "group inline-flex items-center gap text-[#18131f] dark:text-white",
        className,
      )}
      aria-label="Lumyn Academy"
    >
      <span
        className={clsx(
          "relative grid shrink-0 place-items-center",
          compact ? "h-9 w-9" : "h-11 w-11",
        )}
        aria-hidden="true"
      >
        <Image
          src="/android-chrome-512x512.png"
          alt=""
          width={compact ? 36 : 44}
          height={compact ? 36 : 44}
          sizes={compact ? "36px" : "44px"}
          className="h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(124,108,246,0.24)]"
          priority
        />
      </span>
      <span className={clsx("relative leading-none", compact && "block")}>
        <span
          className={clsx(
            "block font-serif italic tracking-[-0.055em] text-transparent bg-clip-text",
            "bg-[linear-gradient(110deg,#1d142b_5%,#7c6cf6_46%,#b45cff_96%)]",
            "dark:bg-[linear-gradient(110deg,#fff_0%,#cfc8ff_42%,#9b6cff_92%)]",
            compact ? "text-[1.28rem]" : "text-[1.52rem]",
          )}
        >
          Academy
        </span>
        <span className="mt-1 block h-px w-full origin-left scale-x-90 bg-[linear-gradient(90deg,#7c6cf6,transparent)] transition group-hover:scale-x-100" />
      </span>
    </span>
  );
}
