import type { InvoiceData } from "@/lib/tools/invoice/calculations";
import { calculateInvoiceTotals, formatCurrency, lineItemAmount } from "@/lib/tools/invoice/calculations";

export default function ModernTemplate({ invoice }: { invoice: InvoiceData }) {
  const totals = calculateInvoiceTotals(invoice);

  return (
    <div className="bg-white p-8 text-[#17131f] sm:p-10" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <div className="flex items-start justify-between gap-6 border-b-2 pb-6" style={{ borderColor: "#7c6cf6" }}>
        <div className="flex items-center gap-4">
          {invoice.logoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={invoice.logoDataUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
          )}
          <div>
            <p className="text-lg font-bold">{invoice.business.name || "Your business name"}</p>
            <p className="whitespace-pre-line text-xs text-neutral-500">{invoice.business.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight" style={{ color: "#7c6cf6" }}>
            INVOICE
          </p>
          <p className="mt-1 text-xs text-neutral-500">{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
        <div>
          <p className="mb-1 font-semibold uppercase tracking-wide text-neutral-400">Billed to</p>
          <p className="font-medium">{invoice.client.name || "Client name"}</p>
          <p className="whitespace-pre-line text-neutral-500">{invoice.client.address}</p>
        </div>
        <div className="text-right">
          <p>
            <span className="text-neutral-400">Issued </span>
            {invoice.issueDate || "—"}
          </p>
          <p>
            <span className="text-neutral-400">Due </span>
            {invoice.dueDate || "—"}
          </p>
        </div>
      </div>

      <table className="mt-8 w-full text-xs">
        <thead>
          <tr className="border-b text-neutral-400" style={{ borderColor: "#eee" }}>
            <th className="pb-2 text-left font-semibold">Description</th>
            <th className="pb-2 text-right font-semibold">Qty</th>
            <th className="pb-2 text-right font-semibold">Rate</th>
            <th className="pb-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} className="border-b" style={{ borderColor: "#f3f3f3" }}>
              <td className="py-2.5 pr-2">{item.description || "—"}</td>
              <td className="py-2.5 text-right">{item.quantity}</td>
              <td className="py-2.5 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
              <td className="py-2.5 text-right font-medium">
                {formatCurrency(lineItemAmount(item), invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-[260px] space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span>{formatCurrency(totals.subtotal, invoice.currency)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Discount</span>
              <span>-{formatCurrency(totals.discountAmount, invoice.currency)}</span>
            </div>
          )}
          {invoice.vatEnabled && (
            <div className="flex justify-between">
              <span className="text-neutral-500">VAT (7.5%)</span>
              <span>{formatCurrency(totals.vatAmount, invoice.currency)}</span>
            </div>
          )}
          {invoice.withholdingTaxEnabled && (
            <div className="flex justify-between">
              <span className="text-neutral-500">WHT ({invoice.withholdingTaxPercent}%)</span>
              <span>-{formatCurrency(totals.withholdingTaxAmount, invoice.currency)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-1.5 text-sm font-bold" style={{ borderColor: "#7c6cf6" }}>
            <span>Total</span>
            <span style={{ color: "#7c6cf6" }}>{formatCurrency(totals.total, invoice.currency)}</span>
          </div>
        </div>
      </div>

      {(invoice.bank.accountName || invoice.bank.accountNumber || invoice.bank.bankName) && (
        <div className="mt-8 rounded-xl p-4 text-xs" style={{ backgroundColor: "#f7f4ef" }}>
          <p className="mb-1 font-semibold uppercase tracking-wide text-neutral-400">Payment details</p>
          <p>{invoice.bank.accountName}</p>
          <p>
            {invoice.bank.accountNumber} · {invoice.bank.bankName}
          </p>
        </div>
      )}

      {invoice.paymentTerms && (
        <p className="mt-4 text-xs text-neutral-500">
          <span className="font-semibold">Payment terms: </span>
          {invoice.paymentTerms}
        </p>
      )}
      {invoice.notes && <p className="mt-2 whitespace-pre-line text-xs text-neutral-500">{invoice.notes}</p>}
    </div>
  );
}
