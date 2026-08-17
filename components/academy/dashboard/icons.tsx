export function DashboardIcon({ type }: { type: string }) {
  const common = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (type === "grid" || type === "progress") return <svg {...common}><path {...stroke} d="m4.5 11 7.5-6.5L19.5 11" /><path {...stroke} d="M6.4 10.2v8.1c0 .9.7 1.7 1.7 1.7h7.8c.9 0 1.7-.7 1.7-1.7v-8.1" /><path {...stroke} d="M10 20v-5.2h4V20" /></svg>;
  if (type === "book" || type === "modules") return <svg {...common}><path {...stroke} d="M4.8 5.5A2.5 2.5 0 0 1 7.3 3H12v17H7.2a2.4 2.4 0 0 0-2.4 2V5.5Z" /><path {...stroke} d="M19.2 5.5A2.5 2.5 0 0 0 16.7 3H12v17h4.8a2.4 2.4 0 0 1 2.4 2V5.5Z" /><path {...stroke} d="M8 7.5h1.5M14.5 7.5H16" /></svg>;
  if (type === "spark") return <SparkIcon small />;
  if (type === "check" || type === "work") return <svg {...common}><path {...stroke} d="M8.2 4.5h7.6" /><path {...stroke} d="M9 3h6l.7 2.2c.2.5-.2 1-.7 1H9c-.5 0-.9-.5-.7-1L9 3Z" /><path {...stroke} d="M6.2 5.2h-.1A2.1 2.1 0 0 0 4 7.3v11.1c0 1.2.9 2.1 2.1 2.1h11.8c1.2 0 2.1-.9 2.1-2.1V7.3c0-1.2-.9-2.1-2.1-2.1h-.1" /><path {...stroke} d="m8 13 2.4 2.4L16 9.8" /></svg>;
  if (type === "award") return <AwardIcon />;
  if (type === "gem") return <svg {...common}><path {...stroke} d="M6.2 4.5h11.6L21 9.3l-9 10.2-9-10.2 3.2-4.8Z" /><path {...stroke} d="M3 9.3h18M9 4.5 7.5 9.3l4.5 10.2 4.5-10.2L15 4.5" /></svg>;
  if (type === "card") return <svg {...common}><path {...stroke} d="M4 8.2c0-1.5 1.2-2.7 2.7-2.7h10.6c1.5 0 2.7 1.2 2.7 2.7v7.6c0 1.5-1.2 2.7-2.7 2.7H6.7A2.7 2.7 0 0 1 4 15.8V8.2Z" /><path {...stroke} d="M4.5 9.5h15M7.5 15h3" /></svg>;
  return <svg {...common}><path {...stroke} d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z" /><path {...stroke} d="M12 8v4l2.5 1.7" /></svg>;
}

export function SparkIcon({ small = false }: { small?: boolean }) {
  const size = small ? 15 : 19;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.8c.5 4.7 2.7 6.9 7.4 7.4-4.7.5-6.9 2.7-7.4 7.4-.5-4.7-2.7-6.9-7.4-7.4 4.7-.5 6.9-2.7 7.4-7.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M19 16.5c.2 1.5 1 2.3 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.2 2.3-1 2.5-2.5Z" fill="currentColor" /></svg>;
}

export function AwardIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.7" /><path d="m8.5 13-1 8 4.5-2 4.5 2-1-8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m10.3 9 1.1 1.1L14 7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
export function ActivityIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 17V9M9.3 17V5M14.7 17v-7M20 17V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
export function ArrowIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
export function SunIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>; }
export function MoonIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.2A7.7 7.7 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>; }
export function MoreIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 8h10M7 12h10M7 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M4 8h.01M4 12h.01M4 16h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>; }
export function ChevronDownIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
