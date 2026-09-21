import type { InvoiceData } from "@/lib/tools/invoice/calculations";
import { calculateInvoiceTotals, formatCurrency, lineItemAmount } from "@/lib/tools/invoice/calculations";

export default function ClassicTemplate({ invoice }: { invoice: InvoiceData }) {
  const totals = calculateInvoiceTotals(invoice);

  return (
    <div className="bg-white p-8 text-black sm:p-10" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          {invoice.logoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={invoice.logoDataUrl} alt="" className="h-12 w-12 object-cover" />
          )}
          <div>
            <p className="text-base font-bold uppercase tracking-wide">{invoice.business.name || "Your business name"}</p>
            <p className="whitespace-pre-line text-xs text-neutral-600">{invoice.business.address}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold uppercase tracking-widest">Invoice</p>
          <p className="text-xs text-neutral-600">No. {invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-black" />

      <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
        <div>
          <p className="mb-1 font-bold uppercase">Bill to</p>
          <p className="font-medium">{invoice.client.name || "Client name"}</p>
          <p className="whitespace-pre-line text-neutral-600">{invoice.client.address}</p>
        </div>
        <div className="text-right">
          <p>Date: {invoice.issueDate || "—"}</p>
          <p>Due: {invoice.dueDate || "—"}</p>
        </div>
      </div>

      <table className="mt-8 w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-black p-2 text-left">Description</th>
            <th className="border border-black p-2 text-right">Qty</th>
            <th className="border border-black p-2 text-right">Rate</th>
            <th className="border border-black p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-black p-2">{item.description || "—"}</td>
              <td className="border border-black p-2 text-right">{item.quantity}</td>
              <td className="border border-black p-2 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
              <td className="border border-black p-2 text-right">{formatCurrency(lineItemAmount(item), invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <table className="w-full max-w-[260px] text-xs">
          <tbody>
            <tr>
              <td className="py-1">Subtotal</td>
              <td className="py-1 text-right">{formatCurrency(totals.subtotal, invoice.currency)}</td>
            </tr>
            {totals.discountAmount > 0 && (
              <tr>
                <td className="py-1">Discount</td>
                <td className="py-1 text-right">-{formatCurrency(totals.discountAmount, invoice.currency)}</td>
              </tr>
            )}
            {invoice.vatEnabled && (
              <tr>
                <td className="py-1">VAT (7.5%)</td>
                <td className="py-1 text-right">{formatCurrency(totals.vatAmount, invoice.currency)}</td>
              </tr>
            )}
            {invoice.withholdingTaxEnabled && (
              <tr>
                <td className="py-1">WHT ({invoice.withholdingTaxPercent}%)</td>
                <td className="py-1 text-right">-{formatCurrency(totals.withholdingTaxAmount, invoice.currency)}</td>
              </tr>
            )}
            <tr className="border-t-2 border-black font-bold">
              <td className="py-1.5">Total</td>
              <td className="py-1.5 text-right">{formatCurrency(totals.total, invoice.currency)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {(invoice.bank.accountName || invoice.bank.accountNumber || invoice.bank.bankName) && (
        <div className="mt-8 border border-black p-3 text-xs">
          <p className="mb-1 font-bold uppercase">Payment details</p>
          <p>{invoice.bank.accountName}</p>
          <p>
            {invoice.bank.accountNumber} · {invoice.bank.bankName}
          </p>
        </div>
      )}

      {invoice.paymentTerms && (
        <p className="mt-4 text-xs">
          <span className="font-bold">Payment terms: </span>
          {invoice.paymentTerms}
        </p>
      )}
      {invoice.notes && <p className="mt-2 whitespace-pre-line text-xs">{invoice.notes}</p>}
    </div>
  );
}
