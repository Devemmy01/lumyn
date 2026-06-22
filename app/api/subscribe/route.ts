import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { lumynEmailLayout, sendLumynEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const existing = await Subscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: true, message: "You're already subscribed." },
        { status: 200 }
      );
    }

    await Subscriber.create({ email: normalizedEmail });

    sendLumynEmail({
      to: normalizedEmail,
      subject: "Welcome to Lumyn",
      html: lumynEmailLayout({
        title: "Welcome to Lumyn.",
        intro:
          "You are now subscribed to essays, product updates, Academy notes, and intentional software thinking from Lumyn.",
        body:
          "<p>Expect useful notes on software engineering, product building, MindFuel, and the Lumyn Academy ecosystem.</p>",
        ctaLabel: "Read the Journal",
        ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/journal`,
      }),
      text:
        "Welcome to Lumyn. You are subscribed to essays, product updates, Academy notes, and intentional software thinking.",
    }).catch((error) => {
      console.error("[resend/subscribe]", error);
    });

    return NextResponse.json(
      { success: true, message: "Successfully subscribed. Welcome to Lumyn." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/subscribe]", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
