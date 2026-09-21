import type { SourceCurrency } from "@/lib/tools/send-money/fx";

/**
 * ⚠️ PLACEHOLDER DATA — every fee, margin, and lastVerified date below is
 * illustrative scaffolding, not verified real-world figures. Provider fees
 * and exchange-rate margins change often and vary by corridor and amount;
 * this file exists so the comparison table has real shape and math to test
 * against, but every number must be checked against each provider's actual
 * published pricing before this tool goes live. That's why this is a
 * versioned, manually-maintained config rather than something scraped or
 * computed — you own keeping it current.
 *
 * Since 1 May 2026, CBN rules require all licensed IMTOs to settle diaspora
 * remittances in naira only, through designated accounts at Authorised
 * Dealer Banks, at rates benchmarked against real-time NFEM market prices.
 * So every provider here pays the recipient in naira — there's no "cash
 * pickup in dollars" option left to compare against.
 */
export const PROVIDERS_VERSION = "2026-09-21.1";

export interface MoneyProvider {
  id: string;
  name: string;
  /** Flat fee, in the source currency. */
  flatFee: number;
  /** Percentage fee on the send amount, 0-100. */
  percentageFee: number;
  /** How much worse than the mid-market rate this provider's exchange rate
   * typically runs, as a percentage (e.g. 1.5 = 1.5% below mid-market). */
  rateMarginPercent: number;
  deliverySpeed: string;
  outboundUrl: string;
  /** Populated later without touching any component — see SendMoneyClient. */
  affiliateParam?: string;
  lastVerified: string;
  supportedCurrencies: SourceCurrency[];
}

export const PROVIDERS: MoneyProvider[] = [
  {
    id: "wise",
    name: "Wise",
    flatFee: 2.5,
    percentageFee: 0.6,
    rateMarginPercent: 0.2,
    deliverySpeed: "Minutes to a few hours",
    outboundUrl: "https://wise.com/send-money/send-money-to-nigeria",
    lastVerified: "2026-09-21",
    supportedCurrencies: ["GBP", "USD", "EUR", "CAD"],
  },
  {
    id: "worldremit",
    name: "WorldRemit",
    flatFee: 3.99,
    percentageFee: 0,
    rateMarginPercent: 1.8,
    deliverySpeed: "Minutes",
    outboundUrl: "https://www.worldremit.com/en/nigeria",
    lastVerified: "2026-09-21",
    supportedCurrencies: ["GBP", "USD", "EUR", "CAD"],
  },
  {
    id: "remitly",
    name: "Remitly",
    flatFee: 1.99,
    percentageFee: 0,
    rateMarginPercent: 1.5,
    deliverySpeed: "Minutes (Express) to 3-5 days (Economy)",
    outboundUrl: "https://www.remitly.com/us/en/nigeria",
    lastVerified: "2026-09-21",
    supportedCurrencies: ["USD", "GBP", "EUR", "CAD"],
  },
  {
    id: "sendwave",
    name: "Sendwave",
    flatFee: 0,
    percentageFee: 0,
    rateMarginPercent: 2.2,
    deliverySpeed: "Minutes",
    outboundUrl: "https://www.sendwave.com/en-us/countries/nigeria",
    lastVerified: "2026-09-21",
    supportedCurrencies: ["USD", "GBP", "EUR"],
  },
  {
    id: "western-union",
    name: "Western Union",
    flatFee: 4.99,
    percentageFee: 0.5,
    rateMarginPercent: 2.5,
    deliverySpeed: "Minutes to 1 business day",
    outboundUrl: "https://www.westernunion.com/us/en/send-money-to-nigeria.html",
    lastVerified: "2026-09-21",
    supportedCurrencies: ["GBP", "USD", "EUR", "CAD"],
  },
];

export interface ProviderResult extends MoneyProvider {
  effectiveRate: number;
  feeInSourceCurrency: number;
  amountReceivedNaira: number;
  totalCostPercent: number;
}

/** Every outbound link goes through this so an affiliate tag can be added to
 * a provider's config entry later without any component knowing about it. */
export function buildOutboundUrl(provider: MoneyProvider): string {
  if (!provider.affiliateParam) return provider.outboundUrl;
  try {
    const url = new URL(provider.outboundUrl);
    for (const [key, value] of new URLSearchParams(provider.affiliateParam)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return provider.outboundUrl;
  }
}

export function rankProviders({
  sendAmount,
  sourceCurrency,
  midMarketRate,
}: {
  sendAmount: number;
  sourceCurrency: SourceCurrency;
  midMarketRate: number;
}): ProviderResult[] {
  const results = PROVIDERS.filter((provider) => provider.supportedCurrencies.includes(sourceCurrency)).map(
    (provider): ProviderResult => {
      const effectiveRate = midMarketRate * (1 - provider.rateMarginPercent / 100);
      const feeInSourceCurrency = provider.flatFee + sendAmount * (provider.percentageFee / 100);
      const amountAfterFee = Math.max(0, sendAmount - feeInSourceCurrency);
      const amountReceivedNaira = amountAfterFee * effectiveRate;
      const bestCaseNaira = sendAmount * midMarketRate;
      const totalCostPercent =
        bestCaseNaira > 0 ? ((bestCaseNaira - amountReceivedNaira) / bestCaseNaira) * 100 : 0;

      return { ...provider, effectiveRate, feeInSourceCurrency, amountReceivedNaira, totalCostPercent };
    },
  );

  return results.sort((a, b) => b.amountReceivedNaira - a.amountReceivedNaira);
}
