import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { isPaystackConfigured, listNigerianBanks } from "@/lib/paystack";

export async function GET(request: NextRequest) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json({ error: "Bank lookup is temporarily unavailable." }, { status: 503 });
    }
    await getVerifiedAcademyStudent(request);
    const banks = await listNigerianBanks();

    // Paystack's bank list can include multiple entries sharing the same
    // settlement code (e.g. legacy/duplicate listings) — dedupe by code so
    // the dropdown doesn't show repeats or break on a non-unique React key.
    const seen = new Set<string>();
    const uniqueBanks = banks
      .map(({ name, code }) => ({ name, code }))
      .filter((bank) => {
        if (!bank.code || seen.has(bank.code)) return false;
        seen.add(bank.code);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, banks: uniqueBanks });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/banks]", error);
    return NextResponse.json({ error: "Could not load the bank list." }, { status: 500 });
  }
}
