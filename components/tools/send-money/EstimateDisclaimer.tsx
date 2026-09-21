export default function EstimateDisclaimer() {
  return (
    <p
      className="rounded-xl border p-3 text-xs"
      style={{ borderColor: "var(--border-primary)", color: "var(--text-tertiary)" }}
    >
      These are estimates based on published fee structures and typical exchange-rate margins, not
      live quotes. Rates and fees change — confirm the exact amount on the provider&apos;s own site
      before you send.
    </p>
  );
}
