export type SourceCurrency = "GBP" | "USD" | "EUR" | "CAD";

export const SOURCE_CURRENCIES: SourceCurrency[] = ["GBP", "USD", "EUR", "CAD"];

/**
 * Mid-market reference rate to NGN, from ExchangeRate-API's free open
 * endpoint (https://www.exchangerate-api.com/docs/free) — no key required,
 * updates once daily. Cached via Next's fetch cache for 30 minutes so a
 * burst of pageviews doesn't hammer the upstream API; that's well inside
 * this endpoint's own once-a-day update cadence, so the cache window never
 * makes the rate any staler than the source itself already is.
 */
export async function fetchMidMarketRate(source: SourceCurrency): Promise<{
  rate: number;
  asOf: string;
} | null> {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${source}`, {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      result: string;
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (data.result !== "success" || !data.rates?.NGN) return null;

    return { rate: data.rates.NGN, asOf: data.time_last_update_utc ?? new Date().toISOString() };
  } catch (error) {
    console.error("[send-money] Failed to fetch mid-market rate", error);
    return null;
  }
}

export async function fetchAllMidMarketRates(): Promise<
  Partial<Record<SourceCurrency, { rate: number; asOf: string }>>
> {
  const results = await Promise.all(
    SOURCE_CURRENCIES.map(async (currency) => [currency, await fetchMidMarketRate(currency)] as const),
  );

  const rates: Partial<Record<SourceCurrency, { rate: number; asOf: string }>> = {};
  for (const [currency, value] of results) {
    if (value) rates[currency] = value;
  }
  return rates;
}
