import Link from "next/link";
import clsx from "clsx";

interface ProductCardProps {
  name:         string;
  tagline:      string;
  description:  string;
  href:         string;
  status?:      "live" | "beta" | "development";
  accentColor?: string;
  index?:       number;
}

/* ── Status badge ──────────────────────────────────────────────── */
const statusConfig = {
  live: {
    label: "Live",
    dot:   "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  beta: {
    label: "Beta",
    dot:   "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  development: {
    label: "In Development",
    dot:   "bg-sage",
    badge: "bg-sage/10 text-sage-dark border-sage/20",
  },
};

/* ── Per-product SVG icons ─────────────────────────────────────── */
function MindfuelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.35"/>
      <line x1="10" y1="2.5"  x2="10" y2="5"    stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="10" y1="15"   x2="10" y2="17.5"  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="2.5"  y1="10" x2="5"   y2="10"   stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="15"   y1="10" x2="17.5" y2="10"  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="10" cy="10" r="2.25" fill="currentColor"/>
    </svg>
  );
}

function SummaiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2.5" width="14" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.35"/>
      <line x1="6.5" y1="7"  x2="13.5" y2="7"  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="6.5" y1="10" x2="13.5" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="6.5" y1="13" x2="11"   y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function EdTurboIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M11 2L4 11h6l-1 7 7-9h-6l1-7z"
        stroke="currentColor" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

const productIcons: Record<string, () => React.JSX.Element> = {
  Mindfuel: MindfuelIcon,
  Summai:   SummaiIcon,
  EdTurbo:  EdTurboIcon,
};

export default function ProductCard({
  name,
  tagline,
  description,
  href,
  status      = "development",
  accentColor = "#7C6CF6",
}: ProductCardProps) {
  const StatusCfg = statusConfig[status];
  const Icon = productIcons[name];

  return (
    <Link
      href={href}
      className={clsx(
        "group relative flex flex-col gap-5 p-7 cursor-pointer overflow-hidden h-full",
        "bg-white/75 backdrop-blur-sm rounded-2xl border border-stone/50 shadow-card",
        "hover:shadow-[0_14px_50px_rgba(124,108,246,0.11),0_3px_12px_rgba(31,31,31,0.06)]",
        "hover:-translate-y-2 hover:border-sage/20 hover:bg-white/90",
        "transition-all duration-500 ease-out-expo"
      )}
      aria-label={`${name} — ${tagline}`}
    >
      {/* Accent top-edge line — appears on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] rounded-t-2xl
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, ${accentColor}66, ${accentColor}22, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Icon + status row */}
      <div className="flex items-start justify-between gap-3">
        {/* Icon with glow ring */}
        <div className="relative flex-shrink-0">
          <div className="icon-glow-ring group-hover:opacity-100" aria-hidden="true" />
          <div
            className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white
                       transition-all duration-500 ease-out-expo group-hover:scale-110"
            style={{ backgroundColor: accentColor }}
          >
            {Icon ? <Icon /> : (
              <span className="text-base font-semibold leading-none">{name.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className={clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[10px]",
          "font-semibold tracking-wide border whitespace-nowrap shrink-0",
          StatusCfg.badge
        )}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", StatusCfg.dot)} aria-hidden="true" />
          {StatusCfg.label}
        </span>
      </div>

      {/* Text content */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="heading-sm text-charcoal transition-colors duration-200 group-hover:text-sage">
          {name}
        </h3>
        <p className="text-charcoal text-[13px] font-medium leading-snug">
          {tagline}
        </p>
        <p className="text-charcoal-muted/80 text-sm leading-relaxed mt-1">
          {description}
        </p>
      </div>

      {/* Animated arrow — slides in from left */}
      <div className="flex items-center gap-1.5 text-sage text-sm font-medium
                      -translate-x-1 opacity-0
                      group-hover:translate-x-0 group-hover:opacity-100
                      transition-all duration-300 ease-out-expo">
        Learn more
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M1 6.5h11M7.5 2.5l4 4-4 4"
                stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
}
