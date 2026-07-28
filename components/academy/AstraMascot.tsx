import { useId } from "react";
import clsx from "clsx";

export type AstraExpression = "happy" | "thinking" | "focused" | "celebrating";

type AstraMascotProps = {
  expression?: AstraExpression;
  className?: string;
  label?: string;
};

export default function AstraMascot({
  expression = "happy",
  className,
  label = "Astra, Lumyn Academy learning agent",
}: AstraMascotProps) {
  const isThinking = expression === "thinking";
  const isFocused = expression === "focused";
  const isCelebrating = expression === "celebrating";
  const svgId = useId().replace(/:/g, "");
  const coreId = `${svgId}-astra-core`;
  const leftWingId = `${svgId}-astra-wing-left`;
  const rightWingId = `${svgId}-astra-wing-right`;
  const shadowId = `${svgId}-astra-soft-shadow`;

  return (
    <svg
      viewBox="0 0 220 220"
      role="img"
      aria-label={label}
      className={clsx("overflow-visible", className)}
    >
      <defs>
        <radialGradient id={coreId} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#fff7ff" />
          <stop offset="38%" stopColor="#b9b1ff" />
          <stop offset="76%" stopColor="#7c6cf6" />
          <stop offset="100%" stopColor="#4b3eb8" />
        </radialGradient>
        <linearGradient id={leftWingId} x1="39" x2="105" y1="80" y2="144">
          <stop stopColor="#c4bcff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#7c6cf6" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={rightWingId} x1="181" x2="116" y1="80" y2="144">
          <stop stopColor="#c4bcff" />
          <stop offset="1" stopColor="#7c6cf6" stopOpacity="0.18" />
        </linearGradient>
        <filter id={shadowId} x="-30%" y="-25%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" floodColor="#3d2f9d" floodOpacity="0.25" stdDeviation="12" />
        </filter>
      </defs>

      <ellipse cx="110" cy="190" rx="54" ry="12" fill="#31245f" opacity="0.14" />

      {isCelebrating && (
        <g opacity="0.9">
          <path d="M41 50h12M47 44v12M174 43h14M181 36v14" stroke="#fbbf24" strokeLinecap="round" strokeWidth="4" />
          <circle cx="33" cy="83" r="4" fill="#c4bcff" />
          <circle cx="188" cy="78" r="4" fill="#fb7185" />
          <path d="m55 28 8 7-10 4M159 28l-9 7 10 4" fill="none" stroke="#a78bfa" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </g>
      )}

      {isThinking && (
        <g opacity="0.92">
          <circle cx="170" cy="52" r="8" fill="#f8fafc" opacity="0.86" />
          <circle cx="188" cy="33" r="4" fill="#b9b1ff" />
          <path d="m160 23 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#fbbf24" />
        </g>
      )}

      <g filter={`url(#${shadowId})`}>
        <path
          d="M92 84C64 61 41 61 30 76c-11 15 0 48 48 67 16 6 28-6 23-22Z"
          fill={`url(#${leftWingId})`}
          opacity="0.95"
        />
        <path
          d="M128 84c28-23 51-23 62-8 11 15 0 48-48 67-16 6-28-6-23-22Z"
          fill={`url(#${rightWingId})`}
          opacity="0.95"
        />

        <path
          d="M73 60c6-28 31-40 37-40s31 12 37 40c21 11 34 32 34 58 0 43-32 72-71 72s-71-29-71-72c0-26 13-47 34-58Z"
          fill={`url(#${coreId})`}
        />
        <path
          d="M76 62c8-13 21-20 34-20s26 7 34 20"
          fill="none"
          opacity="0.38"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="7"
        />
        <path
          d="M80 64 62 39M140 64l18-25"
          fill="none"
          stroke="#7c6cf6"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <circle cx="59" cy="35" r="7" fill="#b9b1ff" />
        <circle cx="161" cy="35" r="7" fill="#c4bcff" />

        <path
          d="M73 146c12 14 61 14 74 0"
          fill="none"
          opacity="0.34"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="7"
        />
      </g>

      <g>
        {isFocused ? (
          <>
            <path d="M76 101c11-7 23-6 30 1M144 101c-11-7-23-6-30 1" fill="none" stroke="#241854" strokeLinecap="round" strokeWidth="5" />
            <circle cx="88" cy="113" r="7" fill="#1f164a" />
            <circle cx="132" cy="113" r="7" fill="#1f164a" />
            <path d="M97 139h26" stroke="#261950" strokeLinecap="round" strokeWidth="5" />
          </>
        ) : isThinking ? (
          <>
            <circle cx="87" cy="110" r="7" fill="#1f164a" />
            <path d="M123 109c7-5 16-4 21 2" fill="none" stroke="#1f164a" strokeLinecap="round" strokeWidth="5" />
            <path d="M99 137c8 6 18 6 25 0" fill="none" stroke="#241854" strokeLinecap="round" strokeWidth="5" />
          </>
        ) : (
          <>
            <path d="M78 109c6 7 17 7 23 0M119 109c6 7 17 7 23 0" fill="none" stroke="#1f164a" strokeLinecap="round" strokeWidth="5" />
            {isCelebrating ? (
              <ellipse cx="110" cy="135" rx="11" ry="13" fill="#241854" />
            ) : (
              <path d="M94 136c9 10 23 10 32 0" fill="none" stroke="#241854" strokeLinecap="round" strokeWidth="5" />
            )}
          </>
        )}
      </g>

      <g fill="none" stroke="#5d4be4" strokeLinecap="round" strokeWidth="6">
        {isCelebrating ? (
          <>
            <path d="M68 128c-20-8-31-21-33-36" />
            <path d="M152 128c20-8 31-21 33-36" />
          </>
        ) : isFocused ? (
          <>
            <path d="M67 135c-13 4-23 12-29 22" />
            <path d="M153 135c13 4 23 12 29 22" />
          </>
        ) : (
          <>
            <path d="M67 132c-15 0-26 7-34 19" />
            <path d="M153 132c15 0 26 7 34 19" />
          </>
        )}
      </g>

      <path
        d="m110 70 7 14 15 2-11 10 3 15-14-8-14 8 3-15-11-10 15-2Z"
        fill="#fff"
        opacity="0.22"
      />
    </svg>
  );
}
