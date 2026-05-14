/* HeroVisual — lightweight product card mockup, no infinite animations, mobile-safe */

export default function HeroVisual() {
  return (
    <div
      className="relative w-full max-w-[360px] mx-auto mt-10 md:mt-14 select-none"
      aria-hidden="true"
    >
      {/* ── Background card (source document — noise) ── */}
      <div className="relative mx-5  border bg-white/70 p-5 shadow-soft opacity-50 pointer-events-none" style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-primary)"
      }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 " style={{ backgroundColor: "var(--border-secondary)" }} />
          <div className="h-2 w-20 " style={{ backgroundColor: "var(--border-secondary)" }} />
          <div className="ml-auto h-2 w-10 " style={{ backgroundColor: "var(--border-primary)" }} />
        </div>
        <div className="space-y-2">
          {[100, 88, 94, 72, 83, 60].map((w, i) => (
            <div
              key={i}
              className="h-1.5 "
              style={{ width: `${w}%`, backgroundColor: "var(--border-secondary)" }}
            />
          ))}
        </div>
      </div>

      {/* ── Foreground card (clarity output) ── */}
      <div
        className="relative -mt-12 mx-0  border p-6 shadow-card-hover animate-fade-up opacity-0"
        style={{
          animationDelay: "0.3s",
          animationFillMode: "forwards",
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-primary)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6  bg-sage/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z"
                      stroke="#7C6CF6" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="7" cy="7" r="2" fill="#7C6CF6" />
              </svg>
            </div>
            <span className="text-xs font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>Summai</span>
          </div>
          <span className="text-[10px] font-medium text-sage bg-sage/10  px-2.5 py-0.5">
            Summary ready
          </span>
        </div>

        {/* Key points */}
        <div className="space-y-3 mb-5">
          {[
            "Core argument identified",
            "Three decisions surface",
            "Action items extracted",
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5  bg-sage shrink-0" />
              <span className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Divider + stats */}
        <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border-primary)" }}>
          <span className="text-[11px] tracking-tight" style={{ color: "var(--text-tertiary)" }}>from 2,400 words</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5  bg-sage" />
            <span className="text-[11px] font-semibold text-sage tracking-tight">−89% noise</span>
          </div>
        </div>
      </div>

      {/* ── Small floating chip — focus score ── */}
      <div
        className="absolute right-3 top-6  border shadow-soft px-3 py-2 animate-fade-up opacity-0"
        style={{
          animationDelay: "0.55s",
          animationFillMode: "forwards",
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-primary)"
        }}
      >
        <p className="text-[9px] font-medium uppercase tracking-widest leading-none mb-1" style={{ color: "var(--text-tertiary)" }}>
          Focus
        </p>
        <p className="text-base font-semibold leading-none tabular-nums" style={{ color: "var(--text-primary)" }}>
          91<span className="text-[9px] font-normal" style={{ color: "var(--text-tertiary)" }}>%</span>
        </p>
      </div>
    </div>
  );
}
