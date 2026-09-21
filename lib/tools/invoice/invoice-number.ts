const STORAGE_KEY = "lumyn-invoice-counter";

/** Reads the next invoice number and advances the counter in localStorage.
 * No server state — this is purely a per-browser convenience so numbers
 * don't repeat across invoices made on the same device. */
export function nextInvoiceNumber(): string {
  if (typeof window === "undefined") return "INV-0001";

  try {
    const current = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
    const next = current + 1;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    return `INV-${String(next).padStart(4, "0")}`;
  } catch {
    return "INV-0001";
  }
}
