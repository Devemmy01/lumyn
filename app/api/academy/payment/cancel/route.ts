import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Lumyn Academy now uses point top-ups instead of renewable subscriptions." },
    { status: 410 }
  );
}
