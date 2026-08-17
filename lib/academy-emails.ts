import { lumynEmailLayout, sendLumynEmail } from "@/lib/resend";

type AcademyEmailEvent =
  | "welcome"
  | "assignment_reminder"
  | "quiz_completion"
  | "certificate_issued"
  | "subscription_activated"
  | "subscription_renewal_reminder"
  | "subscription_cancelled"
  | "admin_notification";

const copy: Record<AcademyEmailEvent, { subject: string; title: string; intro: string }> = {
  welcome: {
    subject: "Welcome to Lumyn Academy",
    title: "Welcome to Lumyn Academy",
    intro: "Your student account is ready. You can now continue into your academy dashboard.",
  },
  assignment_reminder: {
    subject: "Lumyn Academy assignment reminder",
    title: "You have an assignment waiting",
    intro: "A practical assignment is ready for review inside your learning path.",
  },
  quiz_completion: {
    subject: "Lumyn Academy quiz completed",
    title: "Quiz progress recorded",
    intro: "Your quiz completion has been saved to your learning dashboard.",
  },
  certificate_issued: {
    subject: "Your Lumyn Academy certificate is ready",
    title: "Certificate issued",
    intro: "Your course completion has been approved and your certificate is ready.",
  },
  subscription_activated: {
    subject: "Your Lumyn Academy AI tutor is unlocked",
    title: "Subscription active",
    intro: "Your monthly subscription is active. Astra, your AI tutor, is ready whenever you need help.",
  },
  subscription_renewal_reminder: {
    subject: "Your Lumyn Academy subscription renews soon",
    title: "Renewal coming up",
    intro: "Your AI tutor subscription renews in a few days. Renew to keep Astra unlocked without interruption.",
  },
  subscription_cancelled: {
    subject: "Your Lumyn Academy subscription was cancelled",
    title: "Subscription cancelled",
    intro: "Your AI tutor subscription will not renew. You can keep learning for free anytime, and resubscribe when you want Astra back.",
  },
  admin_notification: {
    subject: "New Lumyn Academy activity",
    title: "Academy admin notification",
    intro: "There is new activity inside Lumyn Academy that needs admin review.",
  },
};

export async function sendAcademyEmail({
  event,
  to,
  details,
  ctaHref,
}: {
  event: AcademyEmailEvent;
  to: string | string[];
  details?: string;
  ctaHref?: string;
}) {
  const item = copy[event];

  return sendLumynEmail({
    to,
    subject: item.subject,
    html: lumynEmailLayout({
      title: item.title,
      intro: item.intro,
      body: details ? `<p>${details}</p>` : "<p>Open your dashboard to continue.</p>",
      ctaLabel: "Open Academy",
      ctaHref: ctaHref ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/academy/dashboard`,
    }),
    text: `${item.intro}\n\n${details ?? "Open your dashboard to continue."}`,
  });
}

export async function notifyAcademyAdmin(details: string) {
  const adminEmail = process.env.LUMYN_ADMIN_EMAIL;

  if (!adminEmail) {
    return { skipped: true, reason: "LUMYN_ADMIN_EMAIL is not configured" };
  }

  return sendAcademyEmail({
    event: "admin_notification",
    to: adminEmail,
    details,
    ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/admin/academy`,
  });
}
