import Image from "next/image";

type SpatialVisualProps = {
  variant?: "orbital" | "process";
  className?: string;
};

const signalDots = [18, 28, 22, 39, 31, 47, 43, 58, 51, 67, 62, 78];

export default function SpatialVisual({
  variant = "orbital",
  className = "",
}: SpatialVisualProps) {
  if (variant === "process") {
    return (
      <div
        className={`spatial-frame spatial-process relative min-h-[420px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/45 dark:border-white/10 dark:bg-[#09090c] ${className}`}
        aria-hidden="true"
      >
        <div className="spatial-dot-field absolute inset-0 opacity-45 dark:opacity-30" />
        <div className="spatial-ambient absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c6cf6]/20 blur-[70px] dark:bg-[#7c6cf6]/25" />

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c6cf6] shadow-[0_0_14px_rgba(124,108,246,0.8)]" />
          <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">
            One continuous system
          </span>
        </div>

        <div className="spatial-process-object absolute inset-x-[10%] bottom-[7%] top-[6%]">
          <Image
            src="/generated/lumyn-process-3d.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 90vw, 38vw"
            className="spatial-render spatial-render-process object-contain"
          />
        </div>

        <div className="spatial-signal-chart absolute bottom-5 left-5 hidden h-14 w-36 items-end gap-1.5 sm:flex">
          {signalDots.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="spatial-signal-bar flex-1 rounded-full bg-[#7c6cf6]/55 dark:bg-[#a99ef9]/60"
              style={{
                height: `${height}%`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          ))}
        </div>

        <div className="spatial-float-chip spatial-float-chip-a">
          <span className="text-[#7c6cf6]">01</span>
          Understand
        </div>
        <div className="spatial-float-chip spatial-float-chip-b">
          <span className="text-[#7c6cf6]">04</span>
          Refine
        </div>
      </div>
    );
  }

  return (
    <div
      className={`spatial-frame spatial-orbital relative min-h-[440px] overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/45 dark:border-white/10 dark:bg-[#09090c] ${className}`}
      aria-hidden="true"
    >
      <div className="spatial-dot-field absolute inset-0 opacity-45 dark:opacity-30" />
      <div className="spatial-ambient absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c6cf6]/20 blur-[80px] dark:bg-[#7c6cf6]/30" />

      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
        <span className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-tertiary)]">
          Clarity engine
        </span>
      </div>

      <div className="spatial-ring spatial-ring-a" />
      <div className="spatial-ring spatial-ring-b" />
      <div className="spatial-ring spatial-ring-c" />

      <div className="spatial-orb-object absolute inset-[8%] sm:inset-[5%]">
        <Image
          src="/generated/lumyn-clarity-3d.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 42vw"
          className="spatial-render spatial-render-orb object-contain"
        />
      </div>

      {[
        ["Strategy", "spatial-orbit-label-a"],
        ["Design", "spatial-orbit-label-b"],
        ["Engineering", "spatial-orbit-label-c"],
      ].map(([label, position]) => (
        <span
          key={label}
          className={`spatial-orbit-label ${position}`}
        >
          {label}
        </span>
      ))}

      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-black/10 pt-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-tertiary)] dark:border-white/10">
        <span>Complexity in</span>
        <span className="text-[#7c6cf6]">Clarity out</span>
      </div>
    </div>
  );
}
