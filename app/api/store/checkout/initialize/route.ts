import { NextRequest, NextResponse } from "next/server";
import { isPaystackConfigured } from "@/lib/paystack";
import { startCheckout, InvalidProductError } from "@/lib/store/payments";
import { isMongoConnectionError, MongoConnectionUnavailableError } from "@/lib/mongodb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getValidOrigin(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}

function getCheckoutBaseUrl(request: NextRequest) {
  const requestOrigin =
    getValidOrigin(request.headers.get("origin")) ??
    getValidOrigin(request.headers.get("referer")) ??
    getValidOrigin(request.nextUrl.origin);
  const configuredOrigin = getValidOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (process.env.NODE_ENV !== "production") {
    return requestOrigin ?? configuredOrigin ?? request.nextUrl.origin;
  }
  return configuredOrigin ?? requestOrigin ?? request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { error: "Payments are temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }

    const body = (await request.json().catch(() => null)) as
      | { email?: string; productSlug?: string }
      | null;
    const email = body?.email?.trim().toLowerCase();
    const productSlug = body?.productSlug;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!productSlug) {
      return NextResponse.json({ error: "A product is required." }, { status: 400 });
    }

    const callbackUrl = new URL("/guides/success", getCheckoutBaseUrl(request)).toString();

    const { reference, authorizationUrl } = await startCheckout({ email, productSlug, callbackUrl });

    return NextResponse.json({ success: true, reference, authorizationUrl });
  } catch (error) {
    console.error("[store checkout initialize]", error);
    if (error instanceof InvalidProductError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof MongoConnectionUnavailableError || isMongoConnectionError(error)) {
      return NextResponse.json(
        { error: "The store is temporarily unavailable. Please try again shortly." },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 },
    );
  }
}
