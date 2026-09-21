"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToolLayout from "@/components/tools/ToolLayout";
import EstimateDisclaimer from "@/components/tools/send-money/EstimateDisclaimer";
import { SOURCE_CURRENCIES, type SourceCurrency } from "@/lib/tools/send-money/fx";
import { PROVIDERS_VERSION, rankProviders, buildOutboundUrl } from "@/lib/tools/send-money/providers";

function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

const CURRENCY_SYMBOLS: Record<SourceCurrency, string> = { GBP: "£", USD: "$", EUR: "€", CAD: "CA$" };

export default function SendMoneyClient({
  initialRates,
}: {
  initialRates: Partial<Record<SourceCurrency, { rate: number; asOf: string }>>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState(() => Number(searchParams.get("amount")) || 500);
  const [currency, setCurrency] = useState<SourceCurrency>(() => {
    const param = searchParams.get("currency");
    return param && SOURCE_CURRENCIES.includes(param as SourceCurrency) ? (param as SourceCurrency) : "GBP";
  });

  const syncUrl = useCallback(
    (nextAmount: number, nextCurrency: SourceCurrency) => {
      const params = new URLSearchParams();
      params.set("amount", String(nextAmount));
      params.set("currency", nextCurrency);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    syncUrl(amount, currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, currency]);

  const rateInfo = initialRates[currency];
  const results = useMemo(() => {
    if (!rateInfo || amount <= 0) return [];
    return rankProviders({ sendAmount: amount, sourceCurrency: currency, midMarketRate: rateInfo.rate });
  }, [amount, currency, rateInfo]);

  const inputPanel = (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
          You send
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            className="input-field flex-1"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
          />
          <select
            className="input-field w-28"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as SourceCurrency)}
          >
            {SOURCE_CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {rateInfo && (
        <div
          className="rounded-xl border p-4 text-xs"
          style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
        >
          <p className="mb-1 font-semibold" style={{ color: "var(--text-primary)" }}>
            Mid-market reference rate
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            1 {currency} = {formatNaira(rateInfo.rate)}
          </p>
          <p className="mt-1" style={{ color: "var(--text-tertiary)" }}>
            As of {new Date(rateInfo.asOf).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}.
            No provider gives you this exact rate — it&apos;s the reference point every provider's
            spread is measured against.
          </p>
        </div>
      )}

      <EstimateDisclaimer />
    </div>
  );

  const resultPanel = (
    <div className="space-y-3">
      {!rateInfo && (
        <p className="body-sm" style={{ color: "var(--text-tertiary)" }}>
          Live rates aren&apos;t available for {currency} right now — try again shortly.
        </p>
      )}
      {results.map((provider, index) => (
        <div
          key={provider.id}
          className="rounded-2xl border p-5"
          style={{
            borderColor: index === 0 ? "#7c6cf6" : "var(--border-primary)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 font-semibold" style={{ color: "var(--text-primary)" }}>
                {provider.name}
                {index === 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: "#7c6cf6" }}
                  >
                    Best value
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {provider.deliverySpeed}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {formatNaira(provider.amountReceivedNaira)}
              </p>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {provider.totalCostPercent.toFixed(1)}% total cost
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>
              Rate: 1 {currency} = {formatNaira(provider.effectiveRate)}
            </span>
            <span>
              Fee: {CURRENCY_SYMBOLS[currency]}
              {provider.feeInSourceCurrency.toFixed(2)}
            </span>
            <span>Last verified: {provider.lastVerified}</span>
          </div>

          <a
            href={buildOutboundUrl(provider)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-secondary mt-4 inline-flex px-4 py-2 text-xs"
          >
            Go to {provider.name}
          </a>
        </div>
      ))}
    </div>
  );

  const explainer = (
    <div className="space-y-4">
      <p>
        We start from a live mid-market exchange rate — the same rate you&apos;d see on Google or
        Reuters, with no markup. Every provider then applies two things on top of it: a fee (flat,
        percentage, or both), and their own exchange rate, which is usually a bit worse than mid-market.
        That gap is the provider&apos;s margin, and it&apos;s often bigger than the fee itself — which
        is why the &quot;no fee&quot; option isn&apos;t always the cheapest.
      </p>
      <p>
        <strong>Since 1 May 2026</strong>, Central Bank of Nigeria rules require every licensed
        International Money Transfer Operator to settle diaspora remittances in naira only, through a
        designated account at an Authorised Dealer Bank, at a rate benchmarked against real-time
        Nigerian FX market prices. In practice: every legal option now pays your recipient in naira, not
        dollars — so the rate and fee comparison here is the whole decision, there&apos;s no &quot;take
        cash in dollars instead&quot; alternative anymore.
      </p>
      <p>
        Provider figures are versioned and maintained manually (config version {PROVIDERS_VERSION}) —
        each one shows when it was last checked, because silently stale financial data is worse than no
        comparison at all.
      </p>

      <div className="not-prose mt-8 space-y-5 border-t pt-6" style={{ borderColor: "var(--border-primary)" }}>
        <h3 className="heading-sm" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h3>
        {[
          {
            q: "Why is the amount received different from the advertised exchange rate?",
            a: "Providers apply their own exchange rate, which usually runs a bit below the true mid-market rate — that gap is their margin, and it's often larger than any fee they charge. The amount you actually receive reflects both the fee and that margin, not just the headline rate.",
          },
          {
            q: "Can I still receive dollars instead of naira?",
            a: "No. Since 1 May 2026, Central Bank of Nigeria rules require every licensed International Money Transfer Operator to pay recipients in naira only, settled through a designated account at an Authorised Dealer Bank.",
          },
          {
            q: "How current are the provider numbers?",
            a: "Each provider shows a last-verified date. Fees and rate margins change, so treat these as estimates and confirm the exact figure on the provider's own site before sending.",
          },
        ].map((item) => (
          <div key={item.q}>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {item.q}
            </p>
            <p className="body-sm mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ToolLayout
      title="Send Money to Nigeria"
      description="Compare what you'd actually receive in naira across providers — not just their advertised rate."
      updatedOn={PROVIDERS_VERSION}
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      explainer={explainer}
      fieldGuideSlug="getting-paid"
    />
  );
}
