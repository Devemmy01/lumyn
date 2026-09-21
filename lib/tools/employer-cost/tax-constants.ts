/**
 * Every rate, band, and threshold this calculator uses — one file, so
 * updating any of them when the law changes is a single edit here, not a
 * hunt through the calculation logic.
 *
 * Sourced from secondary reporting (payroll/HR platforms, tax advisory
 * coverage) on the Nigeria Tax Act 2025, not the gazetted Act text directly
 * — verify against FIRS guidance or the Act itself before relying on this
 * for real payroll. Last checked 21 September 2026.
 */
export const CONSTANTS_UPDATED_ON = "21 September 2026";
export const CONSTANTS_EFFECTIVE_DATE = "1 January 2026";

/** Nigeria Tax Act 2025 personal income tax bands, effective 1 Jan 2026.
 * Replaces the old 7%-24% PITA bands and abolishes the Consolidated Relief
 * Allowance in favour of this zero-rate band plus targeted deductions
 * (rent relief) below. Progressive/marginal — each rate applies only to the
 * slice of income within that band. */
export const PAYE_BANDS: Array<{ upTo: number | null; rate: number }> = [
  { upTo: 800_000, rate: 0 },
  { upTo: 3_000_000, rate: 0.15 },
  { upTo: 12_000_000, rate: 0.18 },
  { upTo: 25_000_000, rate: 0.21 },
  { upTo: 50_000_000, rate: 0.23 },
  { upTo: null, rate: 0.25 },
];

/** 20% of documented annual rent paid, deducted from taxable income before
 * PAYE bands are applied — capped at this amount regardless of rent paid. */
export const RENT_RELIEF_RATE = 0.2;
export const RENT_RELIEF_CAP = 500_000;

/** Pension Reform Act 2014 — unchanged by the Tax Act 2025. Base is basic +
 * housing + transport ("monthly emoluments" per PRA s.4(3)), not gross. */
export const EMPLOYEE_PENSION_RATE = 0.08;
export const EMPLOYER_PENSION_RATE = 0.1;

/** National Housing Fund Act, as amended: 2.5% of BASIC SALARY ONLY (not
 * gross, not basic+housing+transport) — a common calculation error is
 * applying this to gross pay instead. As of 1 Jan 2026, contribution is
 * voluntary for private-sector employees (mandatory only for federal
 * public service) — default this off and let the employer opt in. */
export const NHF_RATE = 0.025;

/** Employees' Compensation Act 2010 — employer-paid, 1% of total payroll
 * (gross), mandatory for every employer. Not deducted from employee pay. */
export const NSITF_RATE = 0.01;

/** National Health Insurance Authority Act 2022 — mandatory for employers
 * with 5+ staff. Employer contributes 10% of basic salary; this calculator
 * only models the employer side, matching the brief this was built from. */
export const NHIA_EMPLOYER_RATE = 0.1;
export const NHIA_MIN_STAFF_COUNT = 5;
