import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { lumynEmailLayout, sendLumynEmail } from "@/lib/resend";

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
    await connectDB();

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "name, email, and message are required" },
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

    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
    });

    const adminEmail = process.env.LUMYN_ADMIN_EMAIL;
    if (adminEmail) {
      sendLumynEmail({
        to: adminEmail,
        subject: `New Lumyn inquiry from ${name.trim()}`,
        replyTo: email.toLowerCase().trim(),
        html: lumynEmailLayout({
          title: "New Lumyn inquiry",
          intro: `${escapeHtml(name.trim())} sent a message through the Lumyn website.`,
          body: `
            <p><strong style="color:#ffffff;">Email:</strong> ${escapeHtml(email.toLowerCase().trim())}</p>
            <p><strong style="color:#ffffff;">Message:</strong></p>
            <p>${escapeHtml(message.trim())}</p>
          `,
          ctaLabel: "Open Admin",
          ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/admin/inquiries`,
        }),
        text: `${name.trim()} <${email.toLowerCase().trim()}>: ${message.trim()}`,
      }).catch((error) => {
        console.error("[resend/contact]", error);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll be in touch soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
