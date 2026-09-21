import test from "node:test";
import assert from "node:assert/strict";
import { calculatePaye, calculateEmployerCost } from "@/lib/tools/employer-cost/calculations";

test("PAYE: income entirely within the zero-rate band is untaxed", () => {
  assert.equal(calculatePaye(800_000), 0);
  assert.equal(calculatePaye(500_000), 0);
  assert.equal(calculatePaye(0), 0);
});

test("PAYE: income just above the zero-rate band is taxed only on the excess", () => {
  // 800k at 0% + 200k at 15% = 30,000
  assert.equal(calculatePaye(1_000_000), 30_000);
});

test("PAYE: at a band boundary, the boundary amount stays in the lower band", () => {
  // 800k at 0% + 2,200,000 at 15% = 330,000
  assert.equal(calculatePaye(3_000_000), 330_000);
});

test("PAYE: spans multiple bands correctly", () => {
  // 800k@0 + 2.2m@15% + 9m@18% = 0 + 330,000 + 1,620,000
  assert.equal(calculatePaye(12_000_000), 1_950_000);
});

test("PAYE: top band applies above 50m", () => {
  const expected = 330_000 + 1_620_000 + 13_000_000 * 0.21 + 25_000_000 * 0.23 + 50_000_000 * 0.25;
  assert.equal(calculatePaye(100_000_000), expected);
});

test("employer cost: NHF is off by default unless opted in, and applies to basic only", () => {
  const withoutNhf = calculateEmployerCost({
    grossAnnual: 6_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 0,
    nhfOptIn: false,
    nhiaApplies: false,
  });
  assert.equal(withoutNhf.nhfAmount, 0);

  const withNhf = calculateEmployerCost({
    grossAnnual: 6_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 0,
    nhfOptIn: true,
    nhiaApplies: false,
  });
  // basic = 3,000,000 * 2.5% = 75,000
  assert.equal(withNhf.nhfAmount, 75_000);
});

test("employer cost: rent relief is capped at 500,000 regardless of rent paid", () => {
  const result = calculateEmployerCost({
    grossAnnual: 10_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 10_000_000, // 20% of this would be 2,000,000, well over the cap
    nhfOptIn: false,
    nhiaApplies: false,
  });
  assert.equal(result.rentReliefAmount, 500_000);
});

test("employer cost: pension is 8%/10% of basic+housing+transport, not gross alone vs net", () => {
  const result = calculateEmployerCost({
    grossAnnual: 12_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 0,
    nhfOptIn: false,
    nhiaApplies: false,
  });
  assert.equal(result.employeePension, 12_000_000 * 0.08);
  assert.equal(result.employerPension, 12_000_000 * 0.1);
});

test("employer cost: NHIA employer share only applies when nhiaApplies is true, and is 10% of basic", () => {
  const result = calculateEmployerCost({
    grossAnnual: 6_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 0,
    nhfOptIn: false,
    nhiaApplies: true,
  });
  assert.equal(result.nhiaEmployer, 3_000_000 * 0.1);
});

test("employer cost: total annual cost is gross plus employer-side contributions only", () => {
  const result = calculateEmployerCost({
    grossAnnual: 6_000_000,
    basicPercent: 50,
    housingPercent: 30,
    transportPercent: 20,
    annualRent: 0,
    nhfOptIn: false,
    nhiaApplies: true,
  });
  const expected = 6_000_000 + result.employerPension + result.nsitf + result.nhiaEmployer;
  assert.equal(result.totalAnnualCost, expected);
});
