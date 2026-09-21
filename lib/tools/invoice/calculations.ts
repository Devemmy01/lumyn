/** Statutory Nigerian VAT rate. Last verified 21 Sep 2026 against the VAT Act
 * as amended by the Finance Act 2020 (rate raised from 5% to 7.5%, effective
 * 1 Feb 2020) — unchanged as of writing. */
export const VAT_RATE = 0.075;
export const UPDATED_ON = "21 September 2026";

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceTotals {
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  withholdingTaxAmount: number;
  total: number;
}

export function lineItemAmount(item: LineItem): number {
  return item.quantity * item.rate;
}

export function calculateInvoiceTotals({
  lineItems,
  discountAmount,
  vatEnabled,
  withholdingTaxEnabled,
  withholdingTaxPercent,
}: {
  lineItems: LineItem[];
  discountAmount: number;
  vatEnabled: boolean;
  withholdingTaxEnabled: boolean;
  withholdingTaxPercent: number;
}): InvoiceTotals {
  const subtotal = lineItems.reduce((sum, item) => sum + lineItemAmount(item), 0);
  const safeDiscount = Math.min(Math.max(discountAmount, 0), subtotal);
  const taxableBase = subtotal - safeDiscount;
  const vatAmount = vatEnabled ? taxableBase * VAT_RATE : 0;
  const withholdingTaxAmount = withholdingTaxEnabled
    ? taxableBase * (withholdingTaxPercent / 100)
    : 0;
  const total = taxableBase + vatAmount - withholdingTaxAmount;

  return {
    subtotal,
    discountAmount: safeDiscount,
    vatAmount,
    withholdingTaxAmount,
    total: Math.max(0, total),
  };
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type InvoiceTemplate = "modern" | "classic";

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  template: InvoiceTemplate;
  logoDataUrl: string | null;
  business: { name: string; address: string };
  client: { name: string; address: string };
  lineItems: LineItem[];
  vatEnabled: boolean;
  withholdingTaxEnabled: boolean;
  withholdingTaxPercent: number;
  discountAmount: number;
  notes: string;
  paymentTerms: string;
  bank: { accountName: string; accountNumber: string; bankName: string };
}
