import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { notifyAcademyAdmin, sendAcademyEmail } from "@/lib/academy-emails";
import MentorshipApplication from "@/models/MentorshipApplication";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      level?: string;
      goal?: string;
      availability?: string;
      message?: string;
    };

    const { name, email, level, goal, availability, message } = body;

    if (!name || !email || !level || !goal || !availability) {
      return NextResponse.json(
        { success: false, error: "name, email, level, goal, and availability are required." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const application = await MentorshipApplication.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      level: level.trim(),
      goal: goal.trim(),
      availability: availability.trim(),
      message: message?.trim(),
      status: "received",
    });

    sendAcademyEmail({
      event: "mentorship_application_received",
      to: email.toLowerCase().trim(),
      details: "Your application is now in review for the Guided Mentorship plan.",
      ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/academy`,
    }).catch((error) => console.error("[academy/mentorship applicant email]", error));

    notifyAcademyAdmin(
      `${escapeHtml(name.trim())} applied for Guided Mentorship. Goal: ${escapeHtml(goal.trim())}`
    ).catch((error) => console.error("[academy/mentorship admin email]", error));

    return NextResponse.json(
      { success: true, applicationId: application._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/academy/mentorship]", error);
    return NextResponse.json(
      { success: false, error: "Could not submit mentorship application." },
      { status: 500 }
    );
  }
}
