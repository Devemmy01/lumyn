import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

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

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: true, message: "You're already subscribed." },
        { status: 200 }
      );
    }

    await Subscriber.create({ email: email.toLowerCase() });

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
