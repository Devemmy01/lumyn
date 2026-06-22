import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InboundEmail from "@/models/InboundEmail";

type ReceivedEmailEvent = {
  type: "email.received";
  created_at: string;
  data: {
    email_id: string;
    created_at: string;
    from: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    message_id?: string;
    subject?: string;
    attachments?: Array<{
      id: string;
      filename: string;
      content_type: string;
      content_disposition?: string;
      content_id?: string;
    }>;
  };
};

function verifyResendSignature(request: NextRequest, body: string) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signatureHeader = request.headers.get("svix-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const timestampSeconds = Number(timestamp);
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) {
    return false;
  }

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${body}`)
    .digest();

  return signatureHeader.split(" ").some((item) => {
    const [, encoded] = item.split(",");
    if (!encoded) return false;
    const received = Buffer.from(encoded, "base64");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

async function getReceivedEmail(emailId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) return null;
  return response.json() as Promise<{
    text?: string;
    html?: string;
    headers?: Record<string, string>;
  }>;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifyResendSignature(request, rawBody)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let event: ReceivedEmailEvent | { type?: string };
  try {
    event = JSON.parse(rawBody) as ReceivedEmailEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ received: true });
  }

  const receivedEvent = event as ReceivedEmailEvent;
  const { data } = receivedEvent;
  const content = await getReceivedEmail(data.email_id);

  await connectDB();
  await InboundEmail.findOneAndUpdate(
    { emailId: data.email_id },
    {
      $set: {
        from: data.from,
        to: data.to ?? [],
        cc: data.cc ?? [],
        bcc: data.bcc ?? [],
        subject: data.subject || "(no subject)",
        messageId: data.message_id,
        text: content?.text,
        html: content?.html,
        headers: content?.headers,
        attachments: (data.attachments ?? []).map((attachment) => ({
          id: attachment.id,
          filename: attachment.filename,
          contentType: attachment.content_type,
          contentDisposition: attachment.content_disposition,
          contentId: attachment.content_id,
        })),
        receivedAt: new Date(data.created_at || receivedEvent.created_at),
      },
      $setOnInsert: { emailId: data.email_id },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ received: true, emailId: data.email_id });
}
