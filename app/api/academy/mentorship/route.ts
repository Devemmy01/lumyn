import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Guided mentorship is not currently available." },
    { status: 410 }
  );
}
