import Image from "next/image";
import clsx from "clsx";

export type AstraExpression = "happy" | "thinking" | "focused" | "celebrating";

type AstraMascotProps = {
  expression?: AstraExpression;
  className?: string;
  label?: string;
  priority?: boolean;
};

const ASTRA_ASSETS: Record<AstraExpression, string> = {
  happy: "/generated/astra/astra-wave.png",
  thinking: "/generated/astra/astra-learning.png",
  focused: "/generated/astra/astra-learning.png",
  celebrating: "/generated/astra/astra-celebrating.png",
};

export default function AstraMascot({
  expression = "happy",
  className,
  label = "Astra, Lumyn Academy learning assistant",
  priority = false,
}: AstraMascotProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={clsx(
        "relative block overflow-visible drop-shadow-[0_16px_34px_rgba(91,57,194,0.28)]",
        className,
      )}
    >
      <Image
        src={ASTRA_ASSETS[expression]}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 640px) 6rem, 10rem"
        className="object-contain"
        aria-hidden="true"
      />
    </span>
  );
}
