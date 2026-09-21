import { NextRequest, NextResponse } from "next/server";
import { AcademyDatabaseUnavailableError, getVerifiedAcademyStudent } from "@/lib/academy-access";
import { isPaystackConfigured, resolveBankAccount } from "@/lib/paystack";

export async function GET(request: NextRequest) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json({ error: "Account lookup is temporarily unavailable." }, { status: 503 });
    }
    await getVerifiedAcademyStudent(request);

    const accountNumber = request.nextUrl.searchParams.get("accountNumber")?.trim();
    const bankCode = request.nextUrl.searchParams.get("bankCode")?.trim();
    if (!accountNumber || !bankCode) {
      return NextResponse.json({ error: "An account number and bank are required." }, { status: 400 });
    }

    const account = await resolveBankAccount({ accountNumber, bankCode });
    return NextResponse.json({ success: true, accountName: account.account_name });
  } catch (error) {
    if (error instanceof AcademyDatabaseUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error("[GET /api/marketplace/creator/resolve-account]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not verify this account." },
      { status: 400 },
    );
  }
}
