const ICONS: Record<string, React.JSX.Element> = {
  "invoice-generator": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2.5h9l4.5 4.5V21a1 1 0 01-1 1H6a1 1 0 01-1-1V3.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 2.5V7a1 1 0 001 1h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13h8M8 16.5h8M8 9.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "send-money-to-nigeria": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 7l8.2-4a1 1 0 01.8 0L20 7M3 7l9 4.2M3 7v10l9 4.2M20 7l-9 4.2m9-4.2v10l-9 4.2m0-10v10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  "employer-cost-calculator": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="2.5" width="15" height="19" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7h8M8 11h2.2M12.9 11h2.2M8 15h2.2M12.9 15h2.2M8 18.5h2.2M12.9 18.5h2.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function ToolIcon({ slug }: { slug: string }) {
  return ICONS[slug] ?? null;
}
