/* HeroVisual — lightweight product card mockup, no infinite animations, mobile-safe */

export default function HeroVisual() {
  return (
    <div
      className="relative w-full max-w-[360px] mx-auto mt-10 md:mt-14 select-none"
      aria-hidden="true"
    >
      {/* ── Background card (source document — noise) ── */}
      <div className="relative mx-5 rounded-2xl border border-stone/50 bg-white/70 p-5 shadow-soft opacity-50 pointer-events-none">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-stone/40" />
          <div className="h-2 w-20 rounded-full bg-stone/30" />
          <div className="ml-auto h-2 w-10 rounded-full bg-stone/20" />
        </div>
        <div className="space-y-2">
          {[100, 88, 94, 72, 83, 60].map((w, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-stone/30"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>

      {/* ── Foreground card (clarity output) ── */}
      <div
        className="relative -mt-12 mx-0 rounded-2xl border border-stone/60 bg-white p-6 shadow-card-hover
                   animate-fade-up opacity-0"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage/10 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1L12 4V10L7 13L2 10V4L7 1Z"
                      stroke="#7C6CF6" strokeWidth="1.4" strokeLinejoin="round" />
                <circle cx="7" cy="7" r="2" fill="#7C6CF6" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-charcoal tracking-tight">Summai</span>
          </div>
          <span className="text-[10px] font-medium text-sage bg-sage/10 rounded-full px-2.5 py-0.5">
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
              <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
              <span className="text-sm text-charcoal/75 leading-snug">{text}</span>
            </div>
          ))}
        </div>

        {/* Divider + stats */}
        <div className="pt-4 border-t border-stone/40 flex items-center justify-between">
          <span className="text-[11px] text-charcoal-muted/50">from 2,400 words</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            <span className="text-[11px] font-semibold text-sage tracking-tight">−89% noise</span>
          </div>
        </div>
      </div>

      {/* ── Small floating chip — focus score ── */}
      <div
        className="absolute right-3 top-6
                   bg-white rounded-xl border border-stone/50 shadow-soft px-3 py-2
                   animate-fade-up opacity-0"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        <p className="text-[9px] font-medium text-charcoal-muted/50 uppercase tracking-widest leading-none mb-1">
          Focus
        </p>
        <p className="text-base font-semibold text-charcoal leading-none tabular-nums">
          91<span className="text-[9px] font-normal text-charcoal-muted/50">%</span>
        </p>
      </div>
    </div>
  );
}
