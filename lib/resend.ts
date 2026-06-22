type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Lumyn <hello@lumynhq.studio>";

export async function sendLumynEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { skipped: true, reason: "RESEND_API_KEY is not configured" };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${body}`);
  }

  return response.json();
}

export function lumynEmailLayout({
  title,
  intro,
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const cta =
    ctaLabel && ctaHref
      ? `<a href="${ctaHref}" style="display:inline-block;margin-top:28px;border-radius:999px;background:#7c6cf6;color:#ffffff;padding:14px 22px;text-decoration:none;font-weight:700;">${ctaLabel}</a>`
      : "";

  return `
    <style>
      @media only screen and (max-width: 600px) {
        .lumyn-email-shell { padding: 0px !important; }
        .lumyn-email-card { padding: 20px !important; border-radius: 18px !important; }
        .lumyn-email-title { font-size: 28px !important; }
      }
    </style>
    <div class="lumyn-email-shell" style="margin:0;padding:4px;font-family:Inter,Arial,sans-serif;color:#ffffff;">
      <div class="lumyn-email-card" style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:28px;background:linear-gradient(135deg,#09090b,#15101f);padding:28px;">
        <p style="margin:0 0 28px;color:#b5a7ff;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">Lumyn</p>
        <h1 class="lumyn-email-title" style="margin:0 0 18px;font-size:34px;line-height:1.05;letter-spacing:0;color:#ffffff;">${title}</h1>
        <p style="margin:0 0 22px;color:#d8d5e2;font-size:17px;line-height:1.7;">${intro}</p>
        <div style="color:#aaa4b8;font-size:15px;line-height:1.75;">${body}</div>
        ${cta}
        <p style="margin:34px 0 0;color:#6f6a7d;font-size:12px;line-height:1.6;">Thoughtful software. Intentional impact.</p>
      </div>
    </div>
  `;
}
