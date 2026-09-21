"use client";

import { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import ModernTemplate from "@/components/tools/invoice/templates/ModernTemplate";
import ClassicTemplate from "@/components/tools/invoice/templates/ClassicTemplate";
import {
  UPDATED_ON,
  CURRENCY_SYMBOLS,
  calculateInvoiceTotals,
  formatCurrency,
  type Currency,
  type InvoiceData,
  type InvoiceTemplate,
  type LineItem,
} from "@/lib/tools/invoice/calculations";
import { nextInvoiceNumber } from "@/lib/tools/invoice/invoice-number";

function emptyLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function inTwoWeeksISO() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export default function InvoiceGeneratorClient() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [issueDate, setIssueDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState(inTwoWeeksISO());
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [template, setTemplate] = useState<InvoiceTemplate>("modern");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLineItem()]);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState(false);
  const [withholdingTaxPercent, setWithholdingTaxPercent] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Due within 14 days of invoice date.");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInvoiceNumber(nextInvoiceNumber());
  }, []);

  const invoice: InvoiceData = {
    invoiceNumber,
    issueDate,
    dueDate,
    currency,
    template,
    logoDataUrl,
    business: { name: businessName, address: businessAddress },
    client: { name: clientName, address: clientAddress },
    lineItems,
    vatEnabled,
    withholdingTaxEnabled,
    withholdingTaxPercent,
    discountAmount,
    notes,
    paymentTerms,
    bank: { accountName: bankAccountName, accountNumber: bankAccountNumber, bankName },
  };

  const totals = calculateInvoiceTotals(invoice);

  function updateLineItem(id: string, patch: Partial<LineItem>) {
    setLineItems((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeLineItem(id: string) {
    setLineItems((items) => (items.length > 1 ? items.filter((item) => item.id !== id) : items));
  }

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handlePrint() {
    window.print();
  }

  const inputPanel = (
    <div className="space-y-6">
      <div
        className="rounded-2xl border p-4 text-xs"
        style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}
      >
        <strong>Everything here stays in your browser.</strong> Nothing you type is sent to a server or
        stored anywhere but this device.
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Your business
        </h3>
        <div className="space-y-3">
          <input
            className="input-field"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <textarea
            className="textarea-field"
            placeholder="Business address"
            rows={2}
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
          />
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
              Logo (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Client
        </h3>
        <div className="space-y-3">
          <input
            className="input-field"
            placeholder="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <textarea
            className="textarea-field"
            placeholder="Client address"
            rows={2}
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
            Invoice number
          </label>
          <input className="input-field" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
            Currency
          </label>
          <select className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            {Object.keys(CURRENCY_SYMBOLS).map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
            Issue date
          </label>
          <input type="date" className="input-field" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
            Due date
          </label>
          <input type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Line items
        </h3>
        <div className="space-y-3">
          {lineItems.map((item) => (
            <div key={item.id} className="grid grid-cols-[1fr_60px_90px_28px] gap-2">
              <input
                className="input-field"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
              />
              <input
                type="number"
                min={0}
                className="input-field"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, { quantity: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                className="input-field"
                value={item.rate}
                onChange={(e) => updateLineItem(item.id, { rate: Number(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => removeLineItem(item.id)}
                aria-label="Remove line item"
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLineItems((items) => [...items, emptyLineItem()])}
          className="btn-secondary mt-3 px-4 py-2 text-xs"
        >
          + Add line item
        </button>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
          <input type="checkbox" checked={vatEnabled} onChange={(e) => setVatEnabled(e.target.checked)} />
          Add VAT (7.5%)
        </label>
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
          <input
            type="checkbox"
            checked={withholdingTaxEnabled}
            onChange={(e) => setWithholdingTaxEnabled(e.target.checked)}
          />
          Deduct withholding tax
        </label>
        {withholdingTaxEnabled && (
          <input
            type="number"
            min={0}
            max={100}
            className="input-field w-24"
            value={withholdingTaxPercent}
            onChange={(e) => setWithholdingTaxPercent(Number(e.target.value))}
          />
        )}
        <div>
          <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
            Discount ({currency})
          </label>
          <input
            type="number"
            min={0}
            className="input-field"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Bank details
        </h3>
        <div className="space-y-3">
          <input
            className="input-field"
            placeholder="Account name"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
          />
          <input
            className="input-field"
            placeholder="Account number"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
          />
          <input className="input-field" placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          className="textarea-field"
          placeholder="Payment terms"
          rows={2}
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
        />
        <textarea className="textarea-field" placeholder="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </div>
  );

  const resultPanel = (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 rounded-full border p-1" style={{ borderColor: "var(--border-primary)" }}>
          {(["modern", "classic"] as InvoiceTemplate[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTemplate(option)}
              className="rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors"
              style={{
                backgroundColor: template === option ? "#7c6cf6" : "transparent",
                color: template === option ? "white" : "var(--text-secondary)",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <button type="button" onClick={handlePrint} className="btn-primary px-5 py-2.5 text-xs">
          Download PDF
        </button>
      </div>

      <div
        ref={printAreaRef}
        className="print-area overflow-hidden rounded-2xl border shadow-sm"
        style={{ borderColor: "var(--border-primary)" }}
      >
        {template === "modern" ? <ModernTemplate invoice={invoice} /> : <ClassicTemplate invoice={invoice} />}
      </div>

      <p className="no-print text-right text-xs" style={{ color: "var(--text-tertiary)" }}>
        Total due: <strong>{formatCurrency(totals.total, currency)}</strong>
      </p>
    </div>
  );

  const explainer = (
    <div className="space-y-4">
      <p>
        This tool totals your line items, applies VAT and/or withholding tax if you turn them on, and
        subtracts any discount — all in your browser, instantly, as you type.
      </p>
      <p>
        <strong>VAT</strong> is added at Nigeria&apos;s standard 7.5% rate on the discounted subtotal.{" "}
        <strong>Withholding tax</strong>, where applicable, is deducted at whatever percentage you enter —
        the correct rate depends on the type of service and your client&apos;s status, so confirm it with
        your accountant or FIRS guidance rather than assuming a default.
      </p>
      <p>
        Your invoice number auto-increments using your browser&apos;s local storage, so it won&apos;t repeat
        on this device — but it isn&apos;t synced anywhere, so it won&apos;t track across devices or browsers.
      </p>
      <p>
        Click &quot;Download PDF&quot; to open your browser&apos;s print dialog and save the invoice as a
        PDF — no file ever leaves your device to generate it.
      </p>

      <div className="not-prose mt-8 space-y-5 border-t pt-6" style={{ borderColor: "var(--border-primary)" }}>
        <h3 className="heading-sm" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h3>
        {[
          {
            q: "Is my invoice data stored anywhere?",
            a: "No. Everything you type stays in your browser's memory and local storage for the invoice number counter — nothing is sent to a server.",
          },
          {
            q: "Does this handle Nigerian VAT?",
            a: "Yes — toggle VAT on and it applies the standard 7.5% rate to your discounted subtotal.",
          },
          {
            q: "What withholding tax rate should I use?",
            a: "It depends on the type of service and your client — this tool lets you enter any percentage, but confirm the correct rate with your accountant or current FIRS guidance rather than assuming a default.",
          },
          {
            q: "Can I use a currency other than naira?",
            a: "Yes — NGN, USD, GBP, and EUR are all available. Switching currency only changes the symbol shown; it doesn't convert amounts.",
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
      title="Invoice Generator"
      description="Create a clean, professional invoice with Nigerian bank details built in. Nothing leaves your browser."
      updatedOn={UPDATED_ON}
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      explainer={explainer}
      fieldGuideSlug="getting-paid"
    />
  );
}
