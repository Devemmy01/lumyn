import {
  PAYE_BANDS,
  RENT_RELIEF_RATE,
  RENT_RELIEF_CAP,
  EMPLOYEE_PENSION_RATE,
  EMPLOYER_PENSION_RATE,
  NHF_RATE,
  NSITF_RATE,
  NHIA_EMPLOYER_RATE,
} from "@/lib/tools/employer-cost/tax-constants";

export interface EmployerCostInput {
  grossAnnual: number;
  basicPercent: number;
  housingPercent: number;
  transportPercent: number;
  annualRent: number;
  nhfOptIn: boolean;
  nhiaApplies: boolean;
}

export interface EmployerCostResult {
  basic: number;
  housing: number;
  transport: number;
  rentReliefAmount: number;
  taxableIncome: number;
  paye: number;
  employeePension: number;
  nhfAmount: number;
  netPay: number;
  employerPension: number;
  nsitf: number;
  nhiaEmployer: number;
  totalAnnualCost: number;
}

/** Progressive/marginal bands — each rate applies only to the slice of
 * income that falls within that band, not the whole amount. */
export function calculatePaye(taxableIncome: number): number {
  let remaining = taxableIncome;
  let lowerBound = 0;
  let tax = 0;

  for (const band of PAYE_BANDS) {
    const bandCeiling = band.upTo ?? Infinity;
    const bandWidth = bandCeiling - lowerBound;
    const taxedInBand = Math.min(remaining, bandWidth);
    if (taxedInBand <= 0) break;

    tax += taxedInBand * band.rate;
    remaining -= taxedInBand;
    lowerBound = bandCeiling;
  }

  return tax;
}

export function calculateEmployerCost(input: EmployerCostInput): EmployerCostResult {
  const basic = input.grossAnnual * (input.basicPercent / 100);
  const housing = input.grossAnnual * (input.housingPercent / 100);
  const transport = input.grossAnnual * (input.transportPercent / 100);
  const pensionableBase = basic + housing + transport;

  const employeePension = pensionableBase * EMPLOYEE_PENSION_RATE;
  const employerPension = pensionableBase * EMPLOYER_PENSION_RATE;
  const nhfAmount = input.nhfOptIn ? basic * NHF_RATE : 0;
  const rentReliefAmount = Math.min(input.annualRent * RENT_RELIEF_RATE, RENT_RELIEF_CAP);

  const taxableIncome = Math.max(0, input.grossAnnual - employeePension - nhfAmount - rentReliefAmount);
  const paye = calculatePaye(taxableIncome);
  const netPay = input.grossAnnual - employeePension - nhfAmount - paye;

  const nsitf = input.grossAnnual * NSITF_RATE;
  const nhiaEmployer = input.nhiaApplies ? basic * NHIA_EMPLOYER_RATE : 0;
  const totalAnnualCost = input.grossAnnual + employerPension + nsitf + nhiaEmployer;

  return {
    basic,
    housing,
    transport,
    rentReliefAmount,
    taxableIncome,
    paye,
    employeePension,
    nhfAmount,
    netPay,
    employerPension,
    nsitf,
    nhiaEmployer,
    totalAnnualCost,
  };
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}
