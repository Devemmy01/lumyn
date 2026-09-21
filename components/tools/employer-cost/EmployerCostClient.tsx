"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ToolLayout from "@/components/tools/ToolLayout";
import { calculateEmployerCost, formatNaira } from "@/lib/tools/employer-cost/calculations";
import { CONSTANTS_UPDATED_ON, CONSTANTS_EFFECTIVE_DATE } from "@/lib/tools/employer-cost/tax-constants";

type Period = "annual" | "monthly";

function readNumberParam(searchParams: URLSearchParams, key: string, fallback: number): number {
  const value = Number(searchParams.get(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export default function EmployerCostClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [period, setPeriod] = useState<Period>(() =>
    searchParams.get("period") === "monthly" ? "monthly" : "annual",
  );
  const [salaryInput, setSalaryInput] = useState(() => readNumberParam(searchParams, "salary", 6_000_000));
  const [basicPercent, setBasicPercent] = useState(() => readNumberParam(searchParams, "basic", 50));
  const [housingPercent, setHousingPercent] = useState(() => readNumberParam(searchParams, "housing", 30));
  const [transportPercent, setTransportPercent] = useState(() => readNumberParam(searchParams, "transport", 20));
  const [annualRent, setAnnualRent] = useState(() => readNumberParam(searchParams, "rent", 0));
  const [nhfOptIn, setNhfOptIn] = useState(() => searchParams.get("nhf") === "1");
  const [nhiaApplies, setNhiaApplies] = useState(() => searchParams.get("nhia") !== "0");

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.set("period", period);
    params.set("salary", String(salaryInput));
    params.set("basic", String(basicPercent));
    params.set("housing", String(housingPercent));
    params.set("transport", String(transportPercent));
    params.set("rent", String(annualRent));
    params.set("nhf", nhfOptIn ? "1" : "0");
    params.set("nhia", nhiaApplies ? "1" : "0");
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, salaryInput, basicPercent, housingPercent, transportPercent, annualRent, nhfOptIn, nhiaApplies]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const grossAnnual = period === "monthly" ? salaryInput * 12 : salaryInput;
  const splitTotal = basicPercent + housingPercent + transportPercent;

  const result = useMemo(
    () =>
      calculateEmployerCost({
        grossAnnual,
        basicPercent,
        housingPercent,
        transportPercent,
        annualRent,
        nhfOptIn,
        nhiaApplies,
      }),
    [grossAnnual, basicPercent, housingPercent, transportPercent, annualRent, nhfOptIn, nhiaApplies],
  );

  const divisor = period === "monthly" ? 12 : 1;
  const periodLabel = period === "monthly" ? "/month" : "/year";
  const fmt = (amount: number) => `${formatNaira(amount / divisor)}${periodLabel}`;

  function handlePrint() {
    window.print();
  }

  const inputPanel = (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-full border p-1 w-fit" style={{ borderColor: "var(--border-primary)" }}>
        {(["annual", "monthly"] as Period[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setPeriod(option)}
            className="rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors"
            style={{
              backgroundColor: period === option ? "#7c6cf6" : "transparent",
              color: period === option ? "white" : "var(--text-secondary)",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
          Gross salary ({period})
        </label>
        <input
          type="number"
          min={0}
          className="input-field"
          value={salaryInput}
          onChange={(e) => setSalaryInput(Math.max(0, Number(e.target.value)))}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs" style={{ color: "var(--text-tertiary)" }}>
          Basic / housing / transport split (%){splitTotal !== 100 && (
            <span style={{ color: "#e0554f" }}> — adds up to {splitTotal}%, not 100%</span>
          )}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            min={0}
            max={100}
            className="input-field"
            value={basicPercent}
            onChange={(e) => setBasicPercent(Number(e.target.value))}
            aria-label="Basic percent"
          />
          <input
            type="number"
            min={0}
            max={100}
            className="input-field"
            value={housingPercent}
            onChange={(e) => setHousingPercent(Number(e.target.value))}
            aria-label="Housing percent"
          />
          <input
            type="number"
            min={0}
            max={100}
            className="input-field"
            value={transportPercent}
            onChange={(e) => setTransportPercent(Number(e.target.value))}
            aria-label="Transport percent"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs" style={{ color: "var(--text-tertiary)" }}>
          Annual rent paid (for rent relief — optional)
        </label>
        <input
          type="number"
          min={0}
          className="input-field"
          value={annualRent}
          onChange={(e) => setAnnualRent(Math.max(0, Number(e.target.value)))}
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
          <input type="checkbox" checked={nhfOptIn} onChange={(e) => setNhfOptIn(e.target.checked)} />
          Employee opts into NHF (2.5% of basic) — voluntary for private-sector employees since 1 Jan 2026
        </label>
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
          <input type="checkbox" checked={nhiaApplies} onChange={(e) => setNhiaApplies(e.target.checked)} />
          Business has 5+ staff (NHIA employer contribution applies)
        </label>
      </div>

      <button type="button" onClick={handlePrint} className="btn-primary w-full">
        Download breakdown
      </button>
    </div>
  );

  const resultPanel = (
    <div className="print-area space-y-6">
      <div>
        <p className="label-sm mb-4">What the employee takes home</p>
        <div className="space-y-2 text-sm">
          <Row label="Gross" value={fmt(grossAnnual)} />
          <Row label="Employee pension (8%)" value={`-${fmt(result.employeePension)}`} />
          {nhfOptIn && <Row label="NHF (2.5% of basic)" value={`-${fmt(result.nhfAmount)}`} />}
          <Row label="PAYE" value={`-${fmt(result.paye)}`} />
          <Row label="Net pay" value={fmt(result.netPay)} strong />
        </div>
      </div>

      <div className="border-t pt-6" style={{ borderColor: "var(--border-primary)" }}>
        <p className="label-sm mb-4">What the hire actually costs</p>
        <div className="space-y-2 text-sm">
          <Row label="Gross salary" value={fmt(grossAnnual)} />
          <Row label="Employer pension (10%)" value={`+${fmt(result.employerPension)}`} />
          <Row label="NSITF (1% of payroll)" value={`+${fmt(result.nsitf)}`} />
          {nhiaApplies && <Row label="NHIA employer (10% of basic)" value={`+${fmt(result.nhiaEmployer)}`} />}
          <Row label="Total cost to employ" value={fmt(result.totalAnnualCost)} strong accent />
        </div>
      </div>
    </div>
  );

  const explainer = (
    <div className="space-y-4">
      <p>
        Gross salary is split into basic, housing, and transport. Pension (8% employee, 10% employer)
        is calculated on that full split, not gross alone. NHF, where the employee opts in, applies only
        to basic salary — a common miscalculation is applying it to gross pay instead.
      </p>
      <p>
        Taxable income is gross minus employee pension, NHF (if any), and rent relief — 20% of documented
        annual rent, capped at ₦500,000 — then taxed under the Nigeria Tax Act 2025&apos;s progressive
        bands, effective {CONSTANTS_EFFECTIVE_DATE}: 0% up to ₦800,000, then 15%, 18%, 21%, 23%, and 25%
        across the higher bands.
      </p>
      <p>
        On the employer side, NSITF (1% of payroll) is mandatory for every employer. NHIA (10% of basic)
        applies only to businesses with 5 or more staff.
      </p>
      <p style={{ color: "var(--text-tertiary)" }} className="text-xs">
        Tax bands and rates last checked {CONSTANTS_UPDATED_ON} against secondary reporting on the Act —
        verify against FIRS guidance before relying on this for real payroll decisions.
      </p>

      <div className="not-prose mt-8 space-y-5 border-t pt-6" style={{ borderColor: "var(--border-primary)" }}>
        <h3 className="heading-sm" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h3>
        {[
          {
            q: "Is NHF included automatically?",
            a: "No — since 1 January 2026, NHF is voluntary for private-sector employees, so it's off by default here. Turn it on if the employee opts in.",
          },
          {
            q: "What changed under the Nigeria Tax Act 2025?",
            a: "The old Consolidated Relief Allowance is gone, replaced by a ₦800,000 zero-rate band and targeted deductions like rent relief (20% of annual rent, capped at ₦500,000). The remaining bands run 15% through 25% as income rises.",
          },
          {
            q: "Does NSITF or NHIA come out of the employee's pay?",
            a: "No — both are employer-paid on top of gross salary, not deducted from the employee.",
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
      title="Employer Cost Calculator"
      description="See what a hire actually costs — PAYE, pension, NSITF, NHIA — under the Nigeria Tax Act 2025."
      updatedOn={CONSTANTS_UPDATED_ON}
      inputPanel={inputPanel}
      resultPanel={resultPanel}
      explainer={explainer}
      fieldGuideSlug="website-costs"
    />
  );
}

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between" style={{ color: strong ? "var(--text-primary)" : "var(--text-secondary)" }}>
      <span className={strong ? "font-semibold" : ""}>{label}</span>
      <span className={strong ? "font-bold" : ""} style={accent ? { color: "#7c6cf6" } : undefined}>
        {value}
      </span>
    </div>
  );
}
