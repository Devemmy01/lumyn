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
    <img 
      src="/mindlogo.png" 
      alt="MindFuel" 
      className="w-full h-full object-cover "
    />
  );
}

function AcademyIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[inherit] bg-white/10 text-[11px] font-bold tracking-[0.18em] text-white">
      LA
    </div>
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
  MindFuel: MindfuelIcon,
  Mindfuel: MindfuelIcon,
  "Lumyn Academy": AcademyIcon,
  LumynAcademy: AcademyIcon,
  Summai:   SummaiIcon,
  EdTurbo:  EdTurboIcon,
};

export default function ProductCard({
  name,
  tagline,
  description,
  href,
  status = "development",
  accentColor = "#7C6CF6",
}: ProductCardProps) {
  const StatusCfg = statusConfig[status];
  const Icon = productIcons[name];

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-6 p-8 cursor-pointer overflow-hidden h-full
                  border rounded-2xl transition-all duration-300 card"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-primary)",
      }}
      aria-label={`${name}: ${tagline}`}
    >
      {/* Icon + status row */}
      <div className="flex items-start justify-between gap-4 relative z-10">
        {/* Icon */}
        <div className="relative flex-shrink-0">
          <div
            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-white
                       transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 4px 12px ${accentColor}40`,
            }}
          >
            {Icon ? <Icon /> : <span className="text-lg font-bold leading-none">{name.charAt(0)}</span>}
          </div>
        </div>

        {/* Status badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5  text-[11px]
                     font-semibold tracking-widest border rounded-2xl whitespace-nowrap shrink-0
                     transition-all duration-300 badge-secondary"
        >
          <span className={clsx("w-1.5 h-1.5  animate-pulse", StatusCfg.dot)} aria-hidden="true" />
          {StatusCfg.label}
        </span>
      </div>

      {/* Text content */}
      <div className="flex-1 flex flex-col gap-3 relative z-10">
        <h3 className="heading-sm transition-colors duration-200 group-hover:text-sage-dark">{name}</h3>
        <p className="font-semibold text-sm leading-snug tracking-tight" style={{ color: "var(--text-primary)" }}>
          {tagline}
        </p>
        <p className="text-sm leading-relaxed opacity-70" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <div
        className="flex items-center gap-2.5 font-medium relative z-10 pt-2
                   transition-all duration-300 group-hover:translate-x-1"
        style={{
          color: "var(--accent)",
          borderTopColor: "var(--border-primary)",
        }}
      >
        <span>Learn more</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
